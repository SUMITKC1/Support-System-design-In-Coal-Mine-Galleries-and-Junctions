# Deployment Guide

This guide covers deployment options for the Support System Design Calculator.

## Deployment Options

### 1. GitHub Pages (Recommended for Free Hosting)

#### Setup:
1. Go to repository Settings → Pages
2. Select source: GitHub Actions
3. The workflow file (`.github/workflows/deploy.yml`) will automatically deploy on push to `main` branch

#### Manual Setup (if needed):
```bash
# Install GitHub Pages CLI (optional)
npm install -g gh-pages

# Deploy to GitHub Pages
npx gh-pages -d . -b gh-pages
```

**URL Format**: `https://SUMITKC1.github.io/Support-System-design-In-Coal-Mine-Galleries-and-Junctions/`

### 2. Vercel

#### Setup:
1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. For production: `vercel --prod`

#### Or use Vercel Dashboard:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will automatically detect the `vercel.json` configuration
4. Deploy!

**Configuration**: See `vercel.json` for routing and headers

### 3. Netlify

#### Setup:
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run: `netlify deploy`
3. For production: `netlify deploy --prod`

#### Or use Netlify Dashboard:
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your project folder, or
3. Connect your GitHub repository
4. Netlify will use `netlify.toml` for configuration

**Configuration**: See `netlify.toml` for redirects and headers

### 4. Traditional Web Hosting

1. Upload all files to your web server via FTP/SFTP
2. Ensure `index.html` is in the root directory
3. All files should be accessible via HTTP/HTTPS

## Build and Output Settings

### Static Site (No Build Required)
This is a pure static site with no build process needed. All files are served as-is.

### Development Server
```bash
# Install dependencies
npm install

# Start local development server
npm run dev
# or
npm start
```

### File Structure
```
.
├── index.html          # Home page
├── about.html          # About page
├── team.html           # Team page
├── style.css           # Stylesheet
├── script.js           # JavaScript
├── config.js           # Configuration
├── README.md           # Documentation
├── vercel.json         # Vercel configuration
├── netlify.toml        # Netlify configuration
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Pages deployment
```

## Environment Variables

### For Static Sites
Static sites don't typically use environment variables at runtime. However, you can:

1. **Use `config.js`**: Store configuration in `config.js` file
2. **Build-time variables**: If using a build tool, inject variables at build time
3. **Runtime configuration**: Use JavaScript to read from URL parameters or localStorage

### Example Usage
```javascript
// In config.js
const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  // ... other config
};
```

### Setting Environment Variables

#### Vercel:
1. Go to Project Settings → Environment Variables
2. Add variables for Production, Preview, and Development

#### Netlify:
1. Go to Site Settings → Build & Deploy → Environment
2. Add environment variables

#### GitHub Pages:
- Environment variables are not directly supported
- Use `config.js` or inject at build time if using a build process

## Deployment Checklist

- [ ] All files committed to Git
- [ ] Repository pushed to GitHub
- [ ] `README.md` updated
- [ ] Deployment configuration files added
- [ ] Test locally before deploying
- [ ] Check all links work after deployment
- [ ] Test dark mode functionality
- [ ] Verify calculator works correctly
- [ ] Check mobile responsiveness
- [ ] Test on different browsers

## Continuous Deployment

### GitHub Actions (Already Configured)
- Automatically deploys to GitHub Pages on push to `main` branch
- See `.github/workflows/deploy.yml`

### Vercel/Netlify
- Connect GitHub repository for automatic deployments
- Each push to `main` triggers a new deployment

## Custom Domain

### GitHub Pages:
1. Add `CNAME` file with your domain name
2. Configure DNS records as per GitHub instructions

### Vercel/Netlify:
1. Go to Domain Settings
2. Add your custom domain
3. Follow DNS configuration instructions

## Troubleshooting

### 404 Errors:
- Check that all file paths are correct
- Ensure `index.html` is in root directory
- Verify routing configuration in `vercel.json` or `netlify.toml`

### CSS/JS Not Loading:
- Check file paths are relative, not absolute
- Verify cache headers are set correctly
- Clear browser cache

### Dark Mode Not Persisting:
- Check localStorage is enabled in browser
- Verify `script.js` is loading correctly

## Support

For issues or questions, please open an issue on GitHub:
https://github.com/SUMITKC1/Support-System-design-In-Coal-Mine-Galleries-and-Junctions

