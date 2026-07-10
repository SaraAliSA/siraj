# Siraj – AI Financial Copilot 💰

> **Intelligent financial advisor powered by AI for the Saudi market**
> 
> Built in 48 hours for a hackathon | AI-first banking copilot (not a budgeting app)

---

## 🚀 Live Demo

**Visit the live project tracker:**
```
https://YOUR-USERNAME.github.io/siraj-hackathon/siraj-hackathon.html
```

**Tabs included:**
- 📋 **Deploy Setup** – GitHub Pages deployment guide
- 📊 **Project Profile** – Overview, vision, team, timeline
- ✅ **Task Management** – 30 tasks, assignments, priority tracking
- 📈 **Progress Dashboard** – Charts, KPIs, milestones

---

## 📖 About Siraj

**Siraj** (سراج - "Light on the Path") is an AI-powered financial advisor built specifically for the Saudi market.

### The Problem
- Users lack personalized financial insights
- Existing tools don't understand Islamic finance
- No warm, culturally-aware financial guidance
- Data without actionable advice

### Our Solution
- **AI Coach**: Warm, Arabic-fluent financial advisor powered by Claude
- **Health Score**: Real-time financial health (0-100)
- **Smart Insights**: Transaction analysis with actionable recommendations
- **Islamic Compliance**: Respects Zakat, Riba, and Saudi spending norms
- **Real Data**: Connects to actual bank transactions

---

## 🎯 Key Features

### Dashboard
- 📊 Health Score (0-100)
- 💡 AI Insights
- 🎯 Spending patterns
- ⚠️ Smart alerts

### AI Coach
- 💬 Natural conversation
- 🕌 Islamic finance guidance
- 🇸🇦 Arabic language
- 👥 Personalized advice

### Transaction Analysis
- 📜 Transaction history
- 🏷️ Smart categorization
- 📊 Monthly breakdown
- 💰 Savings tracking

### Alerts
- 📈 Subscription warnings
- 🎯 Budget alerts
- 💡 Opportunity notifications

---

## 👥 Team

| Role | Owns |
|------|------|
| **Tech Lead** | Database, API, business logic |
| **Frontend Lead** | React, components, styling |
| **AI/ML Engineer** | System prompt, LLM integration |
| **Product/Design Lead** | UX, flows, demo, pitch |
| **DevOps** | Deployment, integration, testing |

---

## 🛠️ Technology Stack

```
Frontend:  React + Tailwind CSS (Vercel)
Backend:   FastAPI + SQLAlchemy (Render)
AI:        Anthropic Claude API
Database:  SQLite
```

---

## 📅 Timeline: 48-Hour Hackathon

```
Phase 1: Foundation (Hours 1-8)
├─ Database setup + API routes
├─ React layout + integration
├─ AI system prompt v1
└─ Infrastructure setup

Phase 2: Integration (Hours 9-13)
├─ Health score calculation
├─ AI coach endpoint
└─ Full end-to-end testing

Phase 3: Polish & Deploy (Hours 14-18)
├─ Mobile responsiveness
├─ Live deployment
├─ Demo practice
└─ Submission
```

---

## 🚀 Quick Start

### Option 1: View Live (No Setup)
1. Click the link: `https://YOUR-USERNAME.github.io/siraj-hackathon/siraj-hackathon.html`
2. Choose a tab at the top
3. Done! 🎉

### Option 2: Download & Run Locally
```bash
# Clone this repo
git clone https://github.com/YOUR-USERNAME/siraj-hackathon.git
cd siraj-hackathon

# Open in browser
open siraj-hackathon.html
# or
start siraj-hackathon.html
```

### Option 3: Deploy Your Own GitHub Pages
```bash
# 1. Create your own repo
# 2. Upload siraj-hackathon.html
# 3. Go to Settings → Pages
# 4. Enable GitHub Pages
# 5. Get your live URL
```

---

## 📊 Tabs Explained

### 1️⃣ Deploy Setup
- Step-by-step GitHub Pages deployment
- Copy-paste GitHub commands
- Troubleshooting guide
- Share your live link

### 2️⃣ Project Profile
- Project overview
- Vision & mission
- Key objectives
- Team members
- Technology stack
- Timeline & milestones

### 3️⃣ Task Management
- 30 pre-loaded tasks
- Assign to team members
- Track by priority/status
- Real-time summary
- Filters: All / Unassigned / In Progress / High Priority

### 4️⃣ Progress Dashboard
- 📊 4 interactive charts
  - Task completion (doughnut)
  - Phase distribution (bar)
  - Progress over time (line)
  - Team workload (radar)
- 🎯 4 KPI cards
- 📍 4 milestone trackers
- 📈 Phase breakdown

---

## 🌐 Sharing with Your Team

### Live Link (Instant Access)
```
https://YOUR-USERNAME.github.io/siraj-hackathon/siraj-hackathon.html
```

Send via:
- ✅ Slack / Discord
- ✅ Email
- ✅ Google Drive
- ✅ GitHub Issues
- ✅ Hackathon submission form

### Features for Team
- 📱 Works on phone, tablet, desktop
- 🔄 Real-time task updates
- 📊 Live progress dashboard
- ⚡ No installation needed
- 🌐 Works offline (sort of)

---

## 🔄 Updating During Hackathon

### Via GitHub Web
1. Open `siraj-hackathon.html` in your repo
2. Click the pencil icon (Edit)
3. Make changes
4. Click "Commit changes"
5. Live page updates (30 sec delay) ✨

### Via Git CLI
```bash
# Make your changes
git add siraj-hackathon.html
git commit -m "Update: Task assignments"
git push origin main

# Live page auto-updates!
```

### Via Auto-Deploy (GitHub Actions)
Create `.github/workflows/deploy.yml`:
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
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v2
```

---

## 📝 License

This project is built for the Siraj Hackathon.

---

## 🙋 Need Help?

### GitHub Pages Docs
- [Getting Started](https://docs.github.com/en/pages/getting-started-with-github-pages)
- [Troubleshooting](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-common-issues-with-github-pages)

### Common Issues

**404 Not Found?**
- Wait 2-3 minutes after enabling Pages
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Check URL includes `.html` filename

**Changes not showing?**
- Hard refresh browser
- Clear cache
- Try incognito/private mode

**File not found?**
- Verify file exists in main branch
- Check Settings → Pages is enabled
- Try raw file URL: `raw.githubusercontent.com/USERNAME/REPO/main/siraj-hackathon.html`

---

## 📊 Success Metrics

- ✅ 48-hour MVP built
- ✅ Live deployment working
- ✅ Team collaboration enabled
- ✅ Real-time tracking
- ✅ Easy sharing

---

## 🎯 Hackathon Checklist

- [ ] Repository created
- [ ] HTML file uploaded
- [ ] GitHub Pages enabled
- [ ] Live URL working
- [ ] Shared with team
- [ ] Tasks assigned
- [ ] Progress dashboard updated
- [ ] Ready for submission
- [ ] Demo practiced
- [ ] Backup video recorded

---

## 🚀 Next Steps

1. **Deploy** – Enable GitHub Pages
2. **Share** – Send live link to team
3. **Update** – Mark tasks as progress
4. **Dashboard** – Monitor KPIs
5. **Demo** – Practice pitch with live page
6. **Submit** – Share with judges

---

## سراج - نور على الطريق ✨

**Siraj – Light on the Path**

*Empowering Saudis to achieve financial freedom through intelligent, culturally-aware AI guidance.*

---

**Built with ❤️ for the Siraj Hackathon**
