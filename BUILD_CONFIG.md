# Build and Deployment Configuration

## Framework Preset

**Type**: Static Site (No Framework)

This is a pure static website built with:
- HTML5
- CSS3 (with CSS Variables)
- Vanilla JavaScript

No build framework required (React, Vue, Angular, etc.). Files are served as-is.

## Build Settings

### Build Command
```bash
npm run build
```
This runs `build.js` which validates that all required files are present.

### Output Directory
```
. (current directory)
```
All files are in the root directory. No build output folder needed.

### Build Process
1. Validates all required files exist
2. Checks file structure
3. No compilation or bundling required
4. Files are ready to serve directly

## Environment Variables

### Configuration Options

#### 1. `config.js` (Runtime Configuration)
Stores application settings that are used in JavaScript:
- Calculator defaults
- Validation ranges
- UI settings
- Feature flags

**Usage**: Loaded directly in browser via `<script src="config.js"></script>`

#### 2. `_env.example` (Environment Variables Template)
Template for environment variables (if needed in future):
- API URLs
- Analytics IDs
- Feature flags
- Build settings

**Note**: For static sites, environment variables are typically not used at runtime. They can be injected at build time if using a build tool.

### Setting Environment Variables

#### Vercel
1. Go to Project Settings → Environment Variables
2. Add variables for:
   - Production
   - Preview
   - Development

#### Netlify
1. Go to Site Settings → Build & Deploy → Environment
2. Add environment variables

#### GitHub Pages
- Environment variables not directly supported
- Use `config.js` for runtime configuration
- Or inject at build time if using GitHub Actions

## Deployment Platforms

### 1. GitHub Pages
- **Framework Preset**: Static Site
- **Build Command**: `npm run build` (optional)
- **Output Directory**: `.` (root)
- **Branch**: `main` (deployed via GitHub Actions)
- **Configuration**: `.github/workflows/deploy.yml`

### 2. Vercel
- **Framework Preset**: Other (Static Site)
- **Build Command**: (empty or `npm run build`)
- **Output Directory**: `.`
- **Configuration**: `vercel.json`
- **Deploy**: `vercel --prod`

### 3. Netlify
- **Framework Preset**: Static Site
- **Build Command**: `npm run build` (optional)
- **Publish Directory**: `.`
- **Configuration**: `netlify.toml`
- **Deploy**: `netlify deploy --prod`

## Build Scripts

### Available Scripts
```bash
# Development
npm start          # Start local server
npm run dev        # Start dev server on port 3000

# Build
npm run build      # Validate files

# Deployment
npm run deploy:vercel    # Deploy to Vercel
npm run deploy:netlify   # Deploy to Netlify
npm run deploy:github    # Build and push to GitHub
```

## File Structure

```
.
├── index.html          # Entry point
├── about.html          # About page
├── team.html           # Team page
├── style.css           # Styles
├── script.js           # JavaScript
├── config.js           # Configuration
├── package.json        # Dependencies & scripts
├── build.js            # Build script
├── vercel.json         # Vercel config
├── netlify.toml        # Netlify config
├── .github/
│   └── workflows/
│       ├── deploy.yml  # GitHub Pages deployment
│       └── ci.yml      # CI validation
└── README.md           # Documentation
```

## CI/CD Pipeline

### GitHub Actions

#### 1. CI Workflow (`.github/workflows/ci.yml`)
- Validates all required files exist
- Checks HTML structure
- Validates CSS and JavaScript
- Runs on push and pull requests

#### 2. Deploy Workflow (`.github/workflows/deploy.yml`)
- Deploys to GitHub Pages
- Runs on push to `main` branch
- Automated deployment

## Customization

### Adding Environment Variables

1. **Runtime Config** (Recommended for static sites):
   - Edit `config.js`
   - Access via `window.config` in JavaScript

2. **Build-time Config**:
   - Create `.env` file (not committed)
   - Use build script to inject into HTML/JS
   - Example: Replace `{{API_URL}}` with `process.env.API_URL`

### Modifying Build Process

Edit `build.js` to:
- Minify CSS/JS
- Optimize images
- Generate service worker
- Inject environment variables
- Generate sitemap

### Adding Build Tools

If you want to add a build step:

```bash
# Install build tools
npm install --save-dev uglify-js clean-css html-minifier

# Update build.js to minify files
# Update package.json build script
```

## Troubleshooting

### Build Fails
- Check all required files exist
- Verify file paths are correct
- Check for syntax errors in HTML/CSS/JS

### Environment Variables Not Working
- Static sites don't use env vars at runtime
- Use `config.js` instead
- Or inject at build time in `build.js`

### Deployment Issues
- Verify build command is correct
- Check output directory settings
- Ensure all files are committed
- Check platform-specific logs

## Support

For issues, see:
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [README.md](README.md) - Project documentation
- GitHub Issues - Report problems

