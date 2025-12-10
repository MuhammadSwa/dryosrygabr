## Implementation Details

### Multi-Playlist Tracking

Videos can belong to multiple playlists. The sync maintains a map:

```typescript
videoPlaylistsMap: Map<string, Array<{
  playlistId: string
  playlistName: string
  category: string
}>>
```

This map is then inverted during static file generation to build:

```typescript
playlistToVideosMap: Map<string, Set<string>>  // playlistId → videoIds
```

### Sync Modes

**Full Sync** (triggered when playlist count changes):
- Fetches all playlists
- Fetches all videos from all playlists
- Builds complete multi-playlist map
- Regenerates all static files

**Incremental Sync** (default):
- Fetches recent videos (last 100)
- Compares with last sync date
- Only fetches new video details
- Merges with existing data

**Regeneration Mode** (no API key):
- Uses existing data
- Regenerates static files only

### Static File Structure

```
public/data/
├── index.json                    # Site metadata, playlist list
├── _sync.json                    # Sync state (timestamps, counts)
├── videos/
│   ├── date/page-N.json         # Sorted by date
│   ├── oldest/page-N.json       # Sorted by oldest
│   └── views/page-N.json        # Sorted by views
├── categories/
│   └── {category}/
│       └── {sort}/page-N.json
├── playlists/
│   └── {playlistId}/
│       └── {sort}/page-N.json   # Generated using multi-playlist map
├── video/
│   └── {videoId}.json           # Individual video with nav
└── search/
    ├── manifest.json
    ├── chunk-N.json             # Global search index
    ├── category/{category}.json
    └── playlist/{playlistId}.json
```

### Category Inference

Categories are inferred from playlist titles using keyword matching:

```typescript
CATEGORY_KEYWORDS = {
  "تصوف": ["تصوف", "صوفي", "الحضرة", ...],
  "فقه": ["فقه", "الفقه", "شافعي", ...],
  "تفسير": ["تفسير", "القرآن", "سورة", ...],
  // ... etc
}
```

Fallback: `"متنوع"` (miscellaneous)

### Pagination

- Page size: 24 videos per page
- Calculated for: all videos, each category, each playlist
- Multiple sort orders: date, oldest, views

## Current Limitations & Issues

### 2. **No Playlist Membership Persistence**

**Problem**: The multi-playlist map (`videoPlaylistsMap`) is rebuilt from scratch on every full sync. No persistent storage of this critical relationship data.

**Impact**: Cannot do efficient incremental updates to playlist pages.

**Solution**: Store video-to-playlists mapping in a dedicated file (e.g., `_playlist_memberships.json`)

### 3. **Last-One-Wins for Video Metadata**

**Problem**: Videos in multiple playlists don't have a "primary" playlist assigned anymore. The `video/{id}.json` files don't store any playlist info.

**Impact**: Video detail pages may not show correct playlist context.

**Solution**: Store all playlist memberships in video JSON files, or pick primary based on category priority.

### 4. **Search Index Doesn't Include All Playlist Memberships**

**Problem**: Search entries only include one playlist reference per video.

**Impact**: Searching within a specific playlist might miss videos that belong to it.

**Solution**: Either include all playlists in search index or generate separate search indexes per playlist.


### 6. **No Error Recovery**

**Problem**: If sync fails mid-way, no partial state is saved.

**Impact**: Next sync starts from scratch, wasting API quota.

**Solution**: 
- Save progress checkpoints
- Implement resume capability
- Better error handling with retries

### 7. **Video Navigation Uses Primary Playlist Only**

**Problem**: The `nav` object in video JSON (prev/next) is calculated per playlist, but doesn't handle multi-playlist scenarios.

**Impact**: Navigation might not work correctly when viewing videos from different playlist contexts.

**Solution**: Generate playlist-specific nav data, or make nav context-aware on the client side.

## Suggested Improvements

### High Priority

1. **Fix Incremental Sync for Multi-Playlist Support**
   - Store and load `videoPlaylistsMap` state
   - Update playlist pages correctly during incremental syncs

2. **Add Playlist Membership Persistence**
   ```typescript
   // _playlist_memberships.json
   {
     "videoId": ["playlistId1", "playlistId2"],
     ...
   }
   ```

3. **Improve Error Handling**
   - Retry failed API calls with exponential backoff
   - Continue on partial failures
   - Log warnings for inaccessible videos/playlists

### Medium Priority

4. **API Quota Tracking**
   - Count API calls per sync
   - Display estimated quota usage
   - Warn when approaching limits

5. **Progress Indicators**
   - Show progress bars for long operations
   - Display ETA for full syncs
   - Better formatted console output

6. **Validation & Testing**
   - Validate generated JSON files
   - Add unit tests for key functions
   - Test multi-playlist edge cases

### Low Priority

7. **Optimization**
   - Cache unchanged video details (use ETags)
   - Parallelize API requests (with rate limiting)
   - Compress large JSON files

8. **Enhanced Features**
   - Support for live streams
   - Video transcripts (if available)
   - Thumbnail optimization
   - Multi-channel support

9. **CLI Improvements**
   ```bash
   pnpm sync --full           # Force full sync
   pnpm sync --dry-run        # Preview changes
   pnpm sync --playlist <id>  # Sync specific playlist
   pnpm sync --stats          # Show sync statistics
   ```

## Best Practices for Running Sync

1. **Initial Setup**: Run full sync to populate all data
   ```bash
   rm public/data/_sync.json
   pnpm sync
   ```

2. **Regular Updates**: Run incremental sync daily
   ```bash
   pnpm sync
   ```

3. **After Major Changes**: Force full sync
   - When playlists are reorganized
   - After significant video additions/removals
   - If incremental sync shows inconsistencies

4. **Monitor API Quota**: Check Google Cloud Console regularly
   - YouTube Data API v3 has 10,000 units/day default quota
   - `playlistItems.list` = 1 unit per request
   - `videos.list` = 1 unit per request
   - Full sync of 84 playlists ≈ 250-300 units

