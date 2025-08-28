# 🚀 Sokoban Web Game Deployment Guide

This guide provides multiple options to deploy your Sokoban web game online so others can access it through a link.

## 📋 Prerequisites

- The game files in this directory (`index.html`, `sokoban.js`)
- A GitHub account (for most deployment options)
- Git installed on your computer

## 🎯 Quick Start Options

### Option 1: GitHub Pages (FREE & EASIEST)

**Best for: Beginners, free hosting**

1. **Create a GitHub repository:**
   ```bash
   cd /path/to/webgame
   git init
   git add .
   git commit -m "Initial commit: Sokoban web game"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/sokoban-game.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Source", select **Deploy from a branch**
   - Choose **main** branch and **/ (root)** folder
   - Click **Save**

3. **Access your game:**
   - Your game will be available at: `https://YOUR_USERNAME.github.io/sokoban-game`
   - It may take a few minutes to deploy

**Pros:** Free, easy, automatic updates when you push changes
**Cons:** Limited to static sites, public repositories only (unless you have Pro)

---

### Option 2: Netlify (FREE, ADVANCED)

**Best for: Easy deployment with custom domains**

1. **Prepare your files:**
   ```bash
   # Make sure you're in the webgame directory
   cd /path/to/webgame
   ```

2. **Deploy via Drag & Drop:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login
   - Drag the entire `webgame` folder to the deploy area
   - Get instant URL like: `https://amazing-name-123456.netlify.app`

3. **Or deploy via Git (Recommended):**
   - Push your code to GitHub (see Option 1, step 1)
   - In Netlify, click "New site from Git"
   - Connect your GitHub repository
   - Build settings: Leave empty (it's a static site)
   - Deploy!

4. **Custom domain (Optional):**
   - In Netlify dashboard → Domain settings
   - Add your custom domain

**Pros:** Free SSL, custom domains, easy rollbacks, form handling
**Cons:** None for basic use

---

### Option 3: Vercel (FREE, FAST)

**Best for: Instant deployment with great performance**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd /path/to/webgame
   vercel
   ```
   - Follow the prompts
   - Get instant URL like: `https://sokoban-game-xyz.vercel.app`

3. **Or deploy via website:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Import your repository
   - Auto-deploy!

**Pros:** Extremely fast CDN, auto-deploys from Git, free SSL
**Cons:** None for basic use

---

### Option 4: Surge.sh (SIMPLE & FAST)

**Best for: Quick one-time deployments**

1. **Install Surge:**
   ```bash
   npm install -g surge
   ```

2. **Deploy:**
   ```bash
   cd /path/to/webgame
   surge
   ```
   - Choose a domain name (e.g., `my-sokoban-game.surge.sh`)
   - Game is live immediately!

**Pros:** Super simple, custom subdomains
**Cons:** No automatic Git integration

---

### Option 5: Firebase Hosting (GOOGLE)

**Best for: Integration with other Google services**

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Setup:**
   ```bash
   cd /path/to/webgame
   firebase login
   firebase init hosting
   ```
   - Select "Use an existing project" or create new
   - Set public directory to `.` (current directory)
   - Configure as single-page app: No
   - Don't overwrite index.html

3. **Deploy:**
   ```bash
   firebase deploy
   ```

**Pros:** Google's infrastructure, analytics integration
**Cons:** Slightly more complex setup

---

## 📱 Mobile-Friendly Deployment Tips

Add this meta tag to your `index.html` (already included):
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

## 🔒 Security Headers

Your deployment configs (`netlify.toml`, `vercel.json`) already include security headers for:
- Content Security Policy
- XSS Protection
- Frame Options

## 🎨 Custom Domain Setup

For most platforms:
1. Buy a domain from a registrar (GoDaddy, Namecheap, etc.)
2. In your hosting platform's settings, add the custom domain
3. Update your domain's DNS settings with the provided nameservers

## 📊 Analytics (Optional)

Add Google Analytics to track visitors:
1. Create Google Analytics account
2. Add tracking code to `index.html` before `</head>`

## 🔄 Automatic Updates

**GitHub Pages/Netlify/Vercel with Git:**
- Any push to your repository automatically updates the live site
- No manual re-deployment needed

**Manual platforms (Surge):**
- Re-run the deploy command when you make changes

## 💡 Recommended Workflow

1. **Start with GitHub Pages** (free, simple)
2. **Upgrade to Netlify** when you need custom domains
3. **Use Vercel** if you want the fastest performance

## 🆘 Troubleshooting

**Game doesn't load:**
- Check browser console for errors
- Ensure all files are uploaded
- Verify file paths are correct

**Levels don't work:**
- This version has embedded levels, so it should work on any static host
- If using the file-based version, ensure the `levels/` folder is uploaded

**Mobile issues:**
- Test on actual devices
- Check responsive design
- Verify touch events work

## 🌐 Example URLs

Once deployed, your game will be accessible at URLs like:
- `https://yourusername.github.io/sokoban-game`
- `https://sokoban-game.netlify.app`
- `https://sokoban-game.vercel.app`
- `https://my-sokoban.surge.sh`

## 📞 Need Help?

- GitHub Pages: [GitHub Pages Documentation](https://pages.github.com/)
- Netlify: [Netlify Documentation](https://docs.netlify.com/)
- Vercel: [Vercel Documentation](https://vercel.com/docs)

---

**🎮 Ready to share your Sokoban game with the world!**
