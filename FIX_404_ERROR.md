# Fix GitHub Pages 404 Error

## Quick Fix Steps

### Option 1: Enable GitHub Pages via Settings (Easiest)

1. **Go to your repository on GitHub**:
   https://github.com/SUMITKC1/Support-System-design-In-Coal-Mine-Galleries-and-Junctions

2. **Click on "Settings"** (top right of repository)

3. **Click on "Pages"** (left sidebar, under "Code and automation")

4. **Under "Build and deployment"**:
   - **Source**: Select `GitHub Actions` (NOT "Deploy from a branch")
   - If "GitHub Actions" option is not available, select:
     - **Source**: `Deploy from a branch`
     - **Branch**: `main`
     - **Folder**: `/ (root)`

5. **Click "Save"**

6. **Wait 2-3 minutes** for GitHub to build and deploy

7. **Refresh your site**: 
   https://SUMITKC1.github.io/Support-System-design-In-Coal-Mine-Galleries-and-Junctions/

### Option 2: Manually Trigger Workflow

1. **Go to "Actions" tab** in your repository

2. **Click on "Deploy to GitHub Pages"** workflow

3. **Click "Run workflow"** button (right side)

4. **Select branch**: `main`

5. **Click "Run workflow"**

6. **Wait for workflow to complete** (green checkmark)

7. **Check your site** after workflow completes

### Option 3: Use Branch-Based Deployment (Fallback)

If GitHub Actions doesn't work:

1. Go to **Settings → Pages**

2. Under **Source**, select:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (or `gh-pages` if you create it)
   - **Folder**: `/ (root)`

3. Click **Save**

4. Wait 2-3 minutes

## Verify Deployment

### Check Workflow Status

1. Go to **Actions** tab
2. Look for "Deploy to GitHub Pages" workflow
3. Check if it shows:
   - ✅ Green checkmark = Success
   - ❌ Red X = Failed (check logs)
   - 🟡 Yellow circle = Running (wait)

### Check Pages Settings

1. Go to **Settings → Pages**
2. You should see:
   - **Source**: GitHub Actions (or Deploy from a branch)
   - **Custom domain**: (if not set, that's OK)
   - **URL**: Your site URL should be shown

## Common Issues and Solutions

### Issue 1: "GitHub Actions" option not available

**Solution**: Use "Deploy from a branch" instead:
- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`

### Issue 2: Workflow fails

**Check**:
1. Go to Actions tab
2. Click on failed workflow
3. Check error messages
4. Common issues:
   - Missing files
   - Permissions issue
   - Workflow syntax error

### Issue 3: Site still shows 404 after enabling

**Solutions**:
1. Wait 5-10 minutes (first deployment takes time)
2. Clear browser cache
3. Try incognito/private mode
4. Check if URL is correct (case-sensitive)
5. Verify workflow completed successfully

### Issue 4: Repository is private

**Solution**: 
- GitHub Pages is free for public repositories
- For private repos, you need GitHub Pro/Team
- Or make repository public (Settings → Danger Zone → Change visibility)

## Verify Files Are Present

Make sure these files exist in your repository:
- ✅ `index.html`
- ✅ `about.html`
- ✅ `team.html`
- ✅ `style.css`
- ✅ `script.js`
- ✅ `.github/workflows/deploy.yml`

## Manual Deployment (If All Else Fails)

1. **Create `gh-pages` branch**:
   ```bash
   git checkout -b gh-pages
   git push origin gh-pages
   ```

2. **Go to Settings → Pages**:
   - Source: `Deploy from a branch`
   - Branch: `gh-pages`
   - Folder: `/ (root)`

3. **Save and wait**

## Still Having Issues?

1. **Check repository visibility**: Must be public (or you have GitHub Pro)
2. **Check workflow permissions**: Settings → Actions → General → Workflow permissions
3. **Verify branch name**: Should be `main` (not `master`)
4. **Check file paths**: All files should be in root directory
5. **Review workflow logs**: Actions tab → Click workflow → Check logs

## Expected URL Format

Your site should be available at:
```
https://SUMITKC1.github.io/Support-System-design-In-Coal-Mine-Galleries-and-Junctions/
```

**Note**: The repository name is case-sensitive in the URL!

## Quick Checklist

- [ ] Repository is public (or you have GitHub Pro)
- [ ] GitHub Pages is enabled in Settings
- [ ] Source is set to "GitHub Actions" or "Deploy from a branch"
- [ ] Workflow file exists (`.github/workflows/deploy.yml`)
- [ ] All files are committed and pushed
- [ ] Workflow has run and completed successfully
- [ ] Waited 5-10 minutes after first deployment
- [ ] URL is correct (case-sensitive)

## Contact GitHub Support

If nothing works:
1. Go to GitHub Support: https://support.github.com
2. Explain the issue
3. Provide repository URL
4. Share workflow logs if available

