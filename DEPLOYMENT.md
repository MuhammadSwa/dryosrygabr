## Cache-Busting Strategy - How It Works

1. **Sync Script Updates Timestamp**
   ```typescript
   // scripts/sync.ts
   const newState: SyncState = {
     lastSync: new Date().toISOString(),  // e.g., "2025-12-06T15:30:00Z"
     videoCount: allVideos.length,
     // ...
   }
   writeJson("public/data/_sync.json", newState)
   ```

2. **App Fetches Version on Load**
   ```typescript
   // src/lib/staticData.ts
   async function getDataVersion(): Promise<string> {
     // Always fetch _sync.json fresh (bypasses cache)
     const url = `${basePath}/data/_sync.json?_=${Date.now()}`
     const res = await fetch(url)
     const data = await res.json()
     
     // Convert lastSync to timestamp
     return new Date(data.lastSync).getTime().toString()
   }
   ```

3. **All JSON Requests Use Version**
   ```typescript
   // Append version to all data requests
   const version = await getDataVersion()
   fetch(`/data/index.json?v=${version}`)
   fetch(`/data/videos/date/page-1.json?v=${version}`)
   ```

#### Example Timeline

```
10:00 AM - Sync #1
├── _sync.json: { lastSync: "2025-12-06T10:00:00Z" }
├── Version: 1733486400000
└── Browser fetches: index.json?v=1733486400000

1:00 PM - Sync #2 (new videos found!)
├── _sync.json: { lastSync: "2025-12-06T13:00:00Z" }
├── Version: 1733497200000  ← Changed!
└── Browser fetches: index.json?v=1733497200000  ← Fresh data!

4:00 PM - Sync #3 (no changes)
├── _sync.json: { lastSync: "2025-12-06T16:00:00Z" }
├── Version: 1733508000000  ← Still changes
└── Browser re-validates and gets 304 Not Modified if no actual changes
```
---

## Workflows

### 1. Sync YouTube Data (`sync-youtube.yml`)
```yaml
┌─────────────────────────────────────────────────────────┐
│ 1. Checkout main branch                                 │
│ 2. Setup Node.js + pnpm                                 │
│ 3. Install dependencies                                 │
│ 4. Run sync script (YOUTUBE_API_KEY from secrets)      │
│ 5. Check if data changed                                │
│    ├─ No changes → Stop ✓                               │
│    └─ Changes detected → Continue                       │
│ 6. Build static site (pnpm build)                       │
│ 7. Add .nojekyll to disable Jekyll                      │
│ 8. Deploy to gh-pages branch                            │
│    ├─ force_orphan: true (clean history)                │
│    └─ enable_jekyll: false                              │
└─────────────────────────────────────────────────────────┘
```

**Important Notes:**
- Does NOT commit to `main` branch (keeps it clean!)
- Only deploys if data actually changed
- Uses incremental sync when possible (faster)
- Full sync if playlists changed or first run

### 2. Build and Deploy (`deploy.yml`)
**Process:**
```yaml
┌─────────────────────────────────────────────────────────┐
│ 1. Checkout main branch                                 │
│ 2. Setup Node.js + pnpm                                 │
│ 3. Install dependencies                                 │
│ 4. Build static site (SKIP_SYNC=true)                   │
│ 5. Prepare for deployment                               │
│    ├─ Add .nojekyll                                     │
│    ├─ Create /study/index.html (SPA fallback)           │
│    ├─ Create /dashboard/index.html (SPA fallback)       │
│    └─ Create 404.html                                   │
│ 6. Deploy to gh-pages branch                            │
└─────────────────────────────────────────────────────────┘
```
## Development Workflow

### Day-to-Day Development

```bash
# 1. Work on features locally
git checkout -b feature/new-component
# ... make changes ...
git add .
git commit -m "feat: add new component"

# 2. Test locally
pnpm dev

# 3. Build locally to verify
pnpm build

# 4. Push to main
git checkout main
git merge feature/new-component
git push origin main

# 5. GitHub Actions automatically:
#    - Builds your app
#    - Deploys to gh-pages
#    - Site updates in ~2-5 minutes

# 6. NO NEED TO PULL!
#    Your main branch never has auto-commits
```

### Testing Sync Locally

```bash
# Set API key
export YOUTUBE_API_KEY="your-key-here"

# Run sync
pnpm sync

# Check generated files
ls -la public/data/
cat public/data/_sync.json

# Test in development
pnpm dev
```

### Manual Sync Trigger

Sometimes you want to sync immediately instead of waiting 3 hours:

```bash
# Option 1: Via GitHub UI
# Go to: Actions → "Sync YouTube Data" → "Run workflow"

# Option 2: Via GitHub CLI
gh workflow run sync-youtube.yml

# Option 3: Push sync script change
git commit --allow-empty -m "chore: trigger sync"
git push
```

### Monitoring Sync Status

```bash
# Check last sync time
curl https://muhammadswa.github.io/Dr-Yosry-Gabr-WebApp/data/_sync.json| jq .lastSync

# Check video count
curl https://<username>.github.io/<repo>/data/_sync.json | jq .videoCount

# View recent workflow runs
gh run list --workflow=sync-youtube.yml --limit 5

# View specific run logs
gh run view <run-id> --log
```

---

## Advanced Configuration

### Adjusting Sync Frequency

Edit `.github/workflows/sync-youtube.yml`:

```yaml
on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours instead of 3
    # - cron: '0 0 * * *'   # Daily at midnight UTC
    # - cron: '0 */1 * * *' # Every hour (use with caution!)
```

**Cron syntax:**
```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
* * * * *
```

**Examples:**
- `0 */3 * * *` - Every 3 hours
- `0 0,12 * * *` - Twice daily (midnight & noon UTC)
- `0 0 * * 0` - Weekly on Sunday midnight

### Customizing Cache Behavior

In `src/lib/staticData.ts`:

```typescript
// Adjust cache size
const MAX_CACHE_SIZE = 100  // Increase for more caching

// Add selective cache bypass
async function fetchJson<T>(path: string, bypassCache = false): Promise<T> {
  if (!bypassCache && cache.has(path)) return cache.get(path) as T
  // ... rest of function
}
```

### Optimizing Build Time

1. **Skip dependencies that haven't changed:**
   ```yaml
   - name: Setup Node.js
     uses: actions/setup-node@v4
     with:
       cache: 'pnpm'  # Cache node_modules
   ```

2. **Parallel builds (if you add multiple sites):**
   ```yaml
   strategy:
     matrix:
       site: [main, blog, docs]
   ```

3. **Conditional deployment:**
   ```yaml
   - name: Check if rebuild needed
     id: check
     run: |
       if git diff --quiet HEAD~1 src/; then
         echo "skip=true" >> $GITHUB_OUTPUT
       fi
   ```

---

## File Structure Reference

```
project/
├── .github/workflows/
│   ├── sync-youtube.yml      # Data sync workflow
│   └── deploy.yml            # Code deployment workflow
│
├── public/
│   └── data/                 # Generated by sync script
│       ├── _sync.json        # Sync metadata + cache version
│       ├── index.json        # Site index
│       ├── videos/           # Paginated videos
│       │   ├── date/         # Sorted by date
│       │   ├── oldest/       # Sorted by oldest
│       │   └── views/        # Sorted by views
│       ├── categories/       # By category
│       │   ├── تفسير/
│       │   ├── حديث/
│       │   └── ...
│       ├── playlists/        # By playlist
│       │   └── <playlist-id>/
│       ├── video/            # Individual video details
│       │   └── <video-id>.json
│       └── search/           # Search indices
│           ├── manifest.json
│           ├── chunk-1.json
│           └── ...
│
├── scripts/
│   └── sync.ts              # YouTube sync script
│
├── src/
│   └── lib/
│       └── staticData.ts    # Data fetching + cache-busting
│
└── dist/client/             # Built site (deployed to gh-pages)
    ├── index.html
    ├── assets/
    ├── data/                # Copied from public/data/
    └── .nojekyll            # Disables Jekyll
```

---

## Key Concepts Summary

### 1. Separation of Concerns
- **`main` branch**: Your source code
- **`gh-pages` branch**: Deployed site
- **Never mix**: main stays clean, gh-pages is auto-managed

### 2. Cache-Busting Independence
- Data version comes from `_sync.json`
- Updates on every sync
- Works without app rebuild
- Single source of truth

### 3. Efficient Syncing
- Incremental updates when possible
- Only fetches new videos
- Skips deployment if no changes
- Respects YouTube API quotas

### 4. Browser Cache Strategy
- `_sync.json`: Always fetched fresh (100 bytes)
- Other JSON: Cached until version changes
- Static assets: Long-term caching (has content hashes)
- HTML: Short caching (SPA entry point)

### 5. Workflow Coordination
- Sync workflow: Data updates → Deploy
- Deploy workflow: Code updates → Deploy
- No conflicts: Both write to gh-pages safely
- Idempotent: Safe to run multiple times

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)
- [Cache-Busting Strategies](https://css-tricks.com/strategies-for-cache-busting-css/)

---

## Support

If you encounter issues:

1. Check [Troubleshooting](#troubleshooting) section
2. Review workflow logs in Actions tab
3. Verify all secrets are set correctly
4. Check GitHub Pages configuration
5. Review browser DevTools Network tab

**Common Commands:**
```bash
# View workflow runs
gh run list

# View specific run
gh run view <run-id>

# Trigger workflow
gh workflow run sync-youtube.yml

# Check secrets
gh secret list
```
