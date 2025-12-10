# Deployment & Data Sync

This project uses a unified CI/CD pipeline that handles both YouTube data synchronization and GitHub Pages deployment.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     GitHub Actions CI/CD                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │ Data Cache   │────▶│   Build      │────▶│   Deploy     │    │
│  │ (persistent) │     │   (Vite)     │     │   (Pages)    │    │
│  └──────────────┘     └──────────────┘     └──────────────┘    │
│         │                                         │              │
│         ▼                                         ▼              │
│  ┌──────────────┐                        ┌──────────────┐       │
│  │ YouTube API  │                        │ GitHub Pages │       │
│  │ (sync)       │                        │ (artifact)   │       │
│  └──────────────┘                        └──────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Key Features

- **Single Workflow**: One `ci.yml` handles everything
- **Data Persistence**: Uses GitHub Actions cache for incremental syncs
- **Direct Pages Deploy**: Deploys via `actions/deploy-pages` (no gh-pages branch)
- **Incremental Sync**: Only fetches new/changed videos
- **Smart Triggers**: Runs on push, schedule, and manual triggers

## Workflow Triggers

| Trigger | Syncs Data? | Deploys? | When |
|---------|-------------|----------|------|
| Push to `main` | Only if no cache | ✅ | Code changes |
| Schedule | ✅ | ✅ | Every 6 hours |
| Manual | ✅ (optional force) | ✅ (optional skip) | On demand |

## Setup Instructions

### 1. GitHub Repository Settings

1. Go to **Settings** → **Pages**
2. Under "Build and deployment":
   - Source: **GitHub Actions** (not "Deploy from a branch")

### 2. GitHub Secrets

Add these secrets in **Settings** → **Secrets and variables** → **Actions**:

| Secret | Description | Required |
|--------|-------------|----------|
| `YOUTUBE_API_KEY` | YouTube Data API v3 key | Yes |

### 3. Initial Deployment

For the first deployment, run a manual workflow to populate the cache:

```bash
# Via GitHub CLI
gh workflow run ci.yml

# Or via GitHub UI:
# Actions → CI/CD Pipeline → Run workflow
```

## Manual Workflow Options

When triggering manually, you have two options:

| Option | Description |
|--------|-------------|
| **Force sync** | Clears existing data and re-fetches everything from YouTube |
| **Sync only** | Runs sync but skips deployment (useful for testing) |

## Data Flow

### Normal Push (code changes)
```
1. Checkout code
2. Restore data from cache ✓
3. Skip sync (data already cached)
4. Build site
5. Deploy to Pages
```

### Scheduled Run (every 6 hours)
```
1. Checkout code
2. Restore data from cache ✓
3. Run incremental sync (fetch only new videos)
4. Save updated cache
5. Build site
6. Deploy to Pages
```

### First Run (no cache)
```
1. Checkout code
2. No cache found
3. Run full sync (fetch all videos)
4. Save new cache
5. Build site
6. Deploy to Pages
```

## Local Development

### Running Sync Locally

```bash
# Set your API key
export YOUTUBE_API_KEY="your-key-here"

# Run sync
pnpm sync

# Check results
cat public/data/_sync.json
```

### Testing Build

```bash
# Build the site
pnpm build

# Preview the build
pnpm preview
```

## File Structure

```
project/
├── .github/workflows/
│   └── ci.yml                # Unified CI/CD workflow
│
├── public/data/              # Generated data (gitignored)
│   ├── _sync.json            # Sync metadata
│   ├── index.json            # Site index
│   ├── videos/               # Paginated video lists
│   ├── video/                # Individual video details
│   ├── playlists/            # Playlist-specific pages
│   ├── categories/           # Category-specific pages
│   └── search/               # Search indices
│
├── scripts/
│   └── sync.ts               # YouTube sync script
│
└── src/lib/
    └── staticData.ts         # Data fetching utilities
```

## Cache Strategy

### GitHub Actions Cache
- **Key**: `youtube-data-v1-{run_id}`
- **Path**: `public/data/`
- **Restored on**: Every workflow run
- **Updated after**: Successful sync

### Browser Cache Busting
- `_sync.json` is fetched fresh on every page load
- Other JSON files include `?v={timestamp}` parameter
- Timestamp changes when data is updated

## Troubleshooting

### "Cannot build without data" Error

This means no cached data exists. Solutions:
1. Run manual workflow with `Force sync` enabled
2. Ensure `YOUTUBE_API_KEY` secret is set

### Sync Fails

Check:
1. `YOUTUBE_API_KEY` is valid and has quota
2. YouTube Data API v3 is enabled in Google Cloud Console
3. API key restrictions allow the API

### Pages Not Updating

Check:
1. **Settings** → **Pages** is set to "GitHub Actions"
2. Workflow completed successfully
3. Clear browser cache

### View Workflow Logs

```bash
# List recent runs
gh run list --limit 5

# View specific run
gh run view <run-id>

# View logs
gh run view <run-id> --log
```

## Adjusting Sync Schedule

Edit `.github/workflows/ci.yml`:

```yaml
schedule:
  - cron: '0 */6 * * *'  # Every 6 hours (default)
  # - cron: '0 */3 * * *'  # Every 3 hours
  # - cron: '0 0 * * *'    # Daily at midnight UTC
```

## Clearing the Cache

If you need to force a complete re-sync:

1. Go to **Actions** → **Caches** (in sidebar)
2. Delete caches starting with `youtube-data-v1`
3. Run workflow manually

Or use GitHub CLI:
```bash
gh cache delete --all
gh workflow run ci.yml
```
