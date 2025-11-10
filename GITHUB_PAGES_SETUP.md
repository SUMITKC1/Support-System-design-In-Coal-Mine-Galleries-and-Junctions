# GitHub Pages Setup Instructions

## ✅ Automatic Deployment Setup Complete!

Your repository is now configured for automatic deployment to GitHub Pages via GitHub Actions.

## Steps to Enable GitHub Pages

### 1. Enable GitHub Pages in Repository Settings

1. Go to your GitHub repository:
   https://github.com/SUMITKC1/Support-System-design-In-Coal-Mine-Galleries-and-Junctions

2. Click on **Settings** (top menu)

3. Scroll down to **Pages** (in the left sidebar)

4. Under **Source**, select:
   - **Source**: `GitHub Actions` (not "Deploy from a branch")

5. Save the settings

### 2. Verify GitHub Actions

1. Go to the **Actions** tab in your repository
2. You should see the workflow running
3. Wait for it to complete (usually takes 1-2 minutes)
4. Once complete, you'll see a green checkmark

### 3. Access Your Live Site

After the workflow completes, your site will be available at:
```
https://SUMITKC1.github.io/Support-System-design-In-Coal-Mine-Galleries-and-Junctions/
```

### 4. Automatic Deployment

- ✅ Every push to `main` branch will automatically deploy
- ✅ No manual steps needed
- ✅ Deployment happens via GitHub Actions workflow

## Workflow Status

Check your workflow status:
1. Go to **Actions** tab
2. Click on the latest workflow run
3. View the deployment status

## Troubleshooting

### If GitHub Pages is not enabled:
- Make sure you selected "GitHub Actions" as the source
- Wait a few minutes for the first deployment
- Check the Actions tab for any errors

### If deployment fails:
- Check the Actions tab for error messages
- Verify all files are committed and pushed
- Ensure workflow file (`.github/workflows/deploy.yml`) is present

### If site is not accessible:
- Wait 5-10 minutes after first deployment
- Clear browser cache
- Check the repository Settings → Pages for the URL

## Manual Deployment (Alternative)

If you prefer manual deployment:

1. Go to Settings → Pages
2. Select **Source**: `main` branch
3. Select **Folder**: `/ (root)`
4. Click Save

However, GitHub Actions is recommended as it provides better control and automation.

## Next Steps

1. ✅ Enable GitHub Pages (follow steps above)
2. ✅ Wait for first deployment
3. ✅ Share your live site URL
4. ✅ Continue developing - changes auto-deploy!

## Repository URL

**Repository**: https://github.com/SUMITKC1/Support-System-design-In-Coal-Mine-Galleries-and-Junctions

**Live Site** (after setup): https://SUMITKC1.github.io/Support-System-design-In-Coal-Mine-Galleries-and-Junctions/

