# 🚀 GitHub Deployment Guide – Siraj Hackathon Landing Page

## Quick Start (5 Minutes)

### Option 1: Direct GitHub Pages Deploy (Easiest)

```bash
# 1. Create a new GitHub repo called "siraj-hackathon"
# Go to: https://github.com/new

# 2. Clone the repo
git clone https://github.com/YOUR-USERNAME/siraj-hackathon.git
cd siraj-hackathon

# 3. Add the HTML file
# Download siraj-hackathon.html and place it in the repo root

# 4. Commit and push
git add siraj-hackathon.html
git commit -m "Initial commit: Add Siraj hackathon landing page"
git push origin main

# 5. Enable GitHub Pages
# Go to: https://github.com/YOUR-USERNAME/siraj-hackathon/settings/pages
# Select: Source = main branch, folder = / (root)
# Save

# 6. Your live URL is:
# https://YOUR-USERNAME.github.io/siraj-hackathon/siraj-hackathon.html
```

---

## Setup Instructions

### Prerequisites
- GitHub account (free at https://github.com)
- Git installed (if using command line)
- The `siraj-hackathon.html` file

---

## Step-by-Step Guide

### Step 1: Create GitHub Repository

**Via Web Browser (No coding required):**

1. Go to https://github.com/new
2. Repository name: `siraj-hackathon`
3. Description: "Siraj AI Financial Copilot - 48-hour hackathon project tracker"
4. Visibility: **Public** (so anyone can access the live link)
5. Initialize with README: ✓ Check this
6. Click **Create repository**

---

### Step 2: Upload the HTML File

**Option A: Via GitHub Web Interface (Easiest)**

1. Open your new repo: `https://github.com/YOUR-USERNAME/siraj-hackathon`
2. Click **"Add file"** → **"Upload files"**
3. Drag & drop `siraj-hackathon.html` into the box
4. Click **"Commit changes"**
5. Done! The file is uploaded

**Option B: Via Git Command Line**

```bash
git clone https://github.com/YOUR-USERNAME/siraj-hackathon.git
cd siraj-hackathon
cp /path/to/siraj-hackathon.html .
git add siraj-hackathon.html
git commit -m "Add Siraj landing page"
git push origin main
```

---

### Step 3: Enable GitHub Pages

1. Go to your repo settings:
   `https://github.com/YOUR-USERNAME/siraj-hackathon/settings`

2. Click **"Pages"** in the left sidebar

3. Under "Build and deployment":
   - **Source**: Select `Deploy from a branch`
   - **Branch**: Select `main`
   - **Folder**: Select `/ (root)`

4. Click **"Save"**

5. Wait 1-2 minutes for GitHub to deploy

6. You'll see a green checkmark with your live URL:
   ```
   https://YOUR-USERNAME.github.io/siraj-hackathon/siraj-hackathon.html
   ```

---

### Step 4: (Optional) Create Custom Domain

If you want a custom domain instead of `github.io`:

1. Go to repo **Settings** → **Pages**
2. Under "Custom domain" enter your domain (e.g., `siraj-hackathon.com`)
3. Update your domain's DNS records to point to GitHub
4. Click **Save**

See: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

---

## Your Live URLs

After deployment, you'll have:

### Main Landing Page
```
https://YOUR-USERNAME.github.io/siraj-hackathon/siraj-hackathon.html
```

### Direct File Access (RAW)
```
https://raw.githubusercontent.com/YOUR-USERNAME/siraj-hackathon/main/siraj-hackathon.html
```

### Repository
```
https://github.com/YOUR-USERNAME/siraj-hackathon
```

---

## Sharing with Team

### Share the Live Link
```
https://YOUR-USERNAME.github.io/siraj-hackathon/siraj-hackathon.html
```

Copy and paste this URL:
- In Slack/Discord for instant access
- In email to team members
- In hackathon submission form
- In presentation slides

### Share the Repository
```
https://github.com/YOUR-USERNAME/siraj-hackathon
```

Team can:
- Clone the repo: `git clone https://github.com/YOUR-USERNAME/siraj-hackathon.git`
- Download the HTML: Click **"Code"** → **"Download ZIP"**
- See all versions in commit history
- Suggest improvements via pull requests

---

## Updating the Page (During Hackathon)

### Quick Update via Web
1. Open your repo on GitHub
2. Click on `siraj-hackathon.html`
3. Click the **pencil icon** (Edit)
4. Make changes
5. Click **"Commit changes"**
6. Refresh the live page (might take 30 seconds)

### Update via Git
```bash
cd siraj-hackathon
# Make edits to siraj-hackathon.html
git add siraj-hackathon.html
git commit -m "Update: Task assignments and progress"
git push origin main
# Live page updates automatically
```

---

## GitHub Actions (Auto-Deploy on Push)

Create a `.github/workflows/deploy.yml` file for automatic deployment:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy
        run: |
          mkdir -p deploy
          cp siraj-hackathon.html deploy/index.html
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: 'deploy'
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v2
```

**Benefits:**
- ✅ Automatic deployment on every push
- ✅ Instant live updates
- ✅ No manual GitHub Pages configuration needed
- ✅ Built-in CI/CD

---

## Troubleshooting

### "404 Not Found" on GitHub Pages
- Wait 2-3 minutes after enabling Pages
- Check Settings → Pages: Is it enabled?
- Verify file is named `siraj-hackathon.html`
- Try refreshing with Ctrl+Shift+R (hard refresh)

### Changes not showing
- Hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
- Clear browser cache
- Try in incognito/private mode

### Raw file access not working
- File must be in main branch
- Check URL: `raw.githubusercontent.com/USERNAME/REPO/main/FILE.html`
- File must exist and be readable

---

## Advanced: Embed GitHub Link in HTML

Add this to your HTML page to show GitHub repo link:

```html
<div style="text-align: center; padding: 1rem; border-top: 1px solid #ddd;">
  <p style="color: #666; font-size: 12px;">
    <a href="https://github.com/YOUR-USERNAME/siraj-hackathon" target="_blank">View on GitHub</a> | 
    <a href="https://github.com/YOUR-USERNAME/siraj-hackathon/issues" target="_blank">Report Issue</a>
  </p>
</div>
```

---

## Team Collaboration on GitHub

### Branch Strategy
```bash
# Main branch = stable, live version
# Create feature branches for changes:
git checkout -b feature/task-updates
git add siraj-hackathon.html
git commit -m "Update task assignments"
git push origin feature/task-updates
# Then create Pull Request for review
```

### Review Changes Before Deploy
1. Create a branch
2. Make changes
3. Create a Pull Request
4. Team reviews
5. Merge to main when approved
6. Auto-deploys to GitHub Pages

---

## Live Links

**After setup, share these:**

### For Judges
```
https://YOUR-USERNAME.github.io/siraj-hackathon/siraj-hackathon.html
```

### For Team Members
```
https://github.com/YOUR-USERNAME/siraj-hackathon
```

### For Presentation
```
https://YOUR-USERNAME.github.io/siraj-hackathon/siraj-hackathon.html
```

---

## File Structure on GitHub

```
siraj-hackathon/
├── README.md (optional)
├── siraj-hackathon.html (your main file)
└── .github/
    └── workflows/
        └── deploy.yml (optional, for auto-deploy)
```

---

## Success Checklist

- [ ] GitHub account created
- [ ] Repository "siraj-hackathon" created
- [ ] HTML file uploaded to main branch
- [ ] GitHub Pages enabled in Settings
- [ ] Live URL working
- [ ] Shared with team members
- [ ] Team can access live page
- [ ] Updates working (try editing a task)
- [ ] All three tabs functional on live link
- [ ] Ready for hackathon submission

---

## One-Liner Commands

**Setup everything in 30 seconds:**

```bash
# For Mac/Linux users:
gh repo create siraj-hackathon --public --source=. --remote=origin --push

# Or use GitHub CLI:
gh repo create siraj-hackathon --clone
cd siraj-hackathon
curl -o siraj-hackathon.html https://your-link-to-file.com/siraj-hackathon.html
git add siraj-hackathon.html
git commit -m "Add Siraj landing page"
git push
```

---

## Support

**GitHub Docs:**
- Pages: https://docs.github.com/en/pages
- Deploy: https://docs.github.com/en/pages/getting-started-with-github-pages
- Actions: https://docs.github.com/en/actions

**Questions?**
- Check GitHub Issues: https://github.com/YOUR-USERNAME/siraj-hackathon/issues
- Start a Discussion: https://github.com/YOUR-USERNAME/siraj-hackathon/discussions

---

## Demo Live Links (Examples)

After setup, your links will look like:

```
Profile: https://your-username.github.io/siraj-hackathon/siraj-hackathon.html
Tasks:   https://your-username.github.io/siraj-hackathon/siraj-hackathon.html#tasks
Charts:  https://your-username.github.io/siraj-hackathon/siraj-hackathon.html#dashboard
```

All three tabs are in one HTML file!

---

## Next Steps

1. **Create repo** (5 min)
2. **Upload HTML** (2 min)
3. **Enable Pages** (2 min)
4. **Share link** (1 min)
5. **Start using** immediately!

**Total setup time: ~10 minutes**

Then your entire team has a live, sharable link that updates in real-time.

---

**Happy hacking! سراج - نور على الطريق ✨**
