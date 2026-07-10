# SIRAJ HACKATHON EXECUTION CHECKLIST
## 48-Hour Build Plan for AI Financial Copilot

---

## PRE-HACKATHON (Before Day 1)

### Team Setup & Division
- [ ] Assign roles:
  - **Tech Lead** (Backend/API)
  - **Frontend Lead** (UI/React)
  - **AI/ML Engineer** (LLM integration, prompts)
  - **Product/Design Lead** (UX, flows, demo)
  - **Devops** (Deployment, API keys, database setup)

- [ ] Set up repositories:
  - [ ] GitHub repo with `.env.example`
  - [ ] Folder structure created
  - [ ] `.gitignore` configured
  - [ ] README stub with setup instructions

- [ ] Infrastructure prepared:
  - [ ] Anthropic API key ready
  - [ ] Firebase/Supabase DB configured
  - [ ] Figma design file created (shared link)
  - [ ] Slack/Discord channel for team
  - [ ] GitHub project board created

- [ ] Data prepared:
  - [ ] Sample financial data (JSON) created
  - [ ] Transaction samples with varied categories
  - [ ] Multiple user personas with data
  - [ ] Seasonal spending patterns defined

- [ ] Design system in Figma:
  - [ ] Color palette (Alinma Premium colors)
  - [ ] Typography scale
  - [ ] Component library started
  - [ ] Icon set imported

---

## DAY 1: FOUNDATION (8 hours)

### Morning Session (Hours 1-4)

#### **Backend/API (Tech Lead + 1 Engineer)**
- [ ] **Hour 1-1.5:** Project setup
  - [ ] FastAPI or Express.js initialized
  - [ ] Database schema designed
  - [ ] `.env` files configured
  - [ ] CORS, authentication middleware stubbed

- [ ] **Hour 1.5-3:** Core API endpoints
  - [ ] `GET /api/user/{id}/transactions` (with filters)
  - [ ] `GET /api/user/{id}/balance`
  - [ ] `GET /api/user/{id}/categories` (spending by category)
  - [ ] `GET /api/user/{id}/subscriptions` (recurring charges)
  - [ ] `POST /api/user/{id}/transactions` (add transaction)
  - [ ] `GET /api/user/{id}/health-score` (calculated, cached)

- [ ] **Hour 3-4:** Database seeding
  - [ ] Sample user created
  - [ ] 100+ transactions inserted
  - [ ] Categories predefined
  - [ ] Subscriptions identified

**Deliverable:** Working API with sample data, testable via Postman/Insomnia

---

#### **Frontend Setup (Frontend Lead + 1 Designer)**
- [ ] **Hour 1-2:** React project structure
  - [ ] Create React App / Vite setup
  - [ ] Folder structure: `/pages`, `/components`, `/hooks`, `/utils`
  - [ ] Tailwind CSS configured
  - [ ] Environment variables set

- [ ] **Hour 2-3:** Core layout & navigation
  - [ ] Main layout component (header, sidebar, main content)
  - [ ] Navigation routes created (Dashboard, Analysis, Coach, Alerts, Settings)
  - [ ] Responsive grid/flex system tested
  - [ ] Mobile view tested

- [ ] **Hour 3-4:** API client setup
  - [ ] Fetch wrapper function created
  - [ ] Error handling standardized
  - [ ] Loading states managed
  - [ ] `.env` configured for API endpoint

**Deliverable:** Clickable UI shell with working navigation (no data yet)

---

#### **AI/ML Engineer**
- [ ] **Hour 1-2:** Anthropic API integration
  - [ ] API key configured
  - [ ] Basic API call tested (simple completion)
  - [ ] Error handling prepared

- [ ] **Hour 2-4:** AI System Prompt v1 drafted
  - [ ] Financial domain context added
  - [ ] Saudi market context included
  - [ ] Islamic finance principles embedded
  - [ ] Example outputs prepared
  - [ ] Token limits calculated
  - [ ] Safety guardrails defined

**Deliverable:** Tested API integration + initial system prompt draft

---

### Afternoon Session (Hours 5-8)

#### **Backend (continued)**
- [ ] **Hour 5-6:** Data processing functions
  - [ ] `categorizeTransaction()` - Auto-categorize by description
  - [ ] `calculateHealthScore()` - Financial health metric
  - [ ] `detectSubscriptions()` - Identify recurring charges
  - [ ] `analyzeSpendingTrends()` - Category trends (7, 30, 90 days)

- [ ] **Hour 6-7:** Caching layer
  - [ ] Redis/in-memory cache setup (health score, trends)
  - [ ] Cache invalidation on transaction add
  - [ ] TTL configured (5-15 minutes)

- [ ] **Hour 7-8:** API response optimization
  - [ ] Pagination added to transactions endpoint
  - [ ] Date filtering implemented
  - [ ] Response times tested (target: <200ms)

**Deliverable:** All backend endpoints fully functional with sample data

---

#### **Frontend (continued)**
- [ ] **Hour 5-6:** Dashboard page structure
  - [ ] Health score card component built
  - [ ] Balance display component
  - [ ] Quick stats cards (income, spending, savings)
  - [ ] Placeholder sections for AI insights

- [ ] **Hour 6-7:** Transactions page
  - [ ] Transaction list table/cards created
  - [ ] Filter by category (UI only, no logic yet)
  - [ ] Sort by date (UI only)
  - [ ] Transaction detail modal started

- [ ] **Hour 7-8:** Data fetching integration
  - [ ] useEffect hooks to call API
  - [ ] Loading spinners added
  - [ ] Error states designed
  - [ ] Sample data displays correctly

**Deliverable:** Dashboard and transaction pages show real data from API

---

#### **AI/ML Engineer (continued)**
- [ ] **Hour 5-6:** Financial analysis prompts
  - [ ] Spending analysis prompt template created
  - [ ] Health score explanation prompt
  - [ ] Risk detection prompt draft
  - [ ] Recommendation generation prompt

- [ ] **Hour 6-8:** Test AI integration
  - [ ] Call API with sample financial data
  - [ ] Test spending explanation output
  - [ ] Validate output format (JSON expected)
  - [ ] Iterate on prompt for clarity

**Deliverable:** Working LLM calls that generate financial insights

---

#### **Product/Design Lead**
- [ ] **Hour 5-8:** Demo planning
  - [ ] Identify 5-6 key user flows for demo
  - [ ] Prepare sample scenarios
  - [ ] Create demo data story (persona + transactions)
  - [ ] Script talking points for judges

**End of Day 1:** Basic product working. All pages display data. AI generates insights but not integrated into UI yet.

---

## DAY 2: AI INTEGRATION (8 hours)

### Morning Session (Hours 9-12)

#### **Frontend (Frontend Lead)**
- [ ] **Hour 9-10:** AI Insights component
  - [ ] Create `<AIInsight>` component
  - [ ] Fetch financial summary from backend
  - [ ] Call LLM via API with financial context
  - [ ] Display formatted AI response

- [ ] **Hour 10-11:** AI Coach feature (MVP)
  - [ ] `<CoachChat>` component (simple input + output)
  - [ ] Send user question to LLM
  - [ ] Display AI response
  - [ ] Add quick question buttons ("Can I afford...?", "What to reduce?")

- [ ] **Hour 11-12:** Financial Health Score explanation
  - [ ] Display score number
  - [ ] Fetch AI explanation (why it changed)
  - [ ] Show recommended improvements
  - [ ] Add color coding (good/warning/risk)

**Deliverable:** AI responses display on Dashboard, Coach page, Health Score

---

#### **Backend (continued)**
- [ ] **Hour 9-10:** AI context builder
  - [ ] Function to format user data for LLM context
  - [ ] Calculate key metrics (spending rate, savings rate, financial score)
  - [ ] Build transaction summary for last 30/90 days
  - [ ] Create persona-aware context

- [ ] **Hour 10-11:** Recommendation engine
  - [ ] Endpoint: `POST /api/user/{id}/analyze` (financial analysis)
  - [ ] Endpoint: `POST /api/user/{id}/coach` (coach interaction)
  - [ ] Validate input (prevent abuse)
  - [ ] Cache responses (same query = cached response)

- [ ] **Hour 11-12:** Alerts logic
  - [ ] `GET /api/user/{id}/alerts` endpoint
  - [ ] Smart alert generation (budget overrun, unusual spending)
  - [ ] Calculate alert severity
  - [ ] Filter alerts by recency

**Deliverable:** All API endpoints for AI features ready

---

#### **AI/ML Engineer (continued)**
- [ ] **Hour 9-11:** Production system prompts finalized
  - [ ] Financial Health Score explanation prompt (refined)
  - [ ] Spending Analysis prompt (with transaction data)
  - [ ] Risk Detection prompt
  - [ ] Coach conversation prompt
  - [ ] All prompts tested with real data

- [ ] **Hour 11-12:** Prompt safety & validation
  - [ ] Add guardrails (no loans/investment advice)
  - [ ] Add context length management
  - [ ] Test edge cases (empty data, outliers)
  - [ ] Add output validation (JSON parsing)

**Deliverable:** Production-ready system prompts, tested & working

---

### Afternoon Session (Hours 13-16)

#### **Frontend (continued)**
- [ ] **Hour 13-14:** Smart Alerts display
  - [ ] Alerts page/section created
  - [ ] Alert cards with severity color
  - [ ] Explanations from AI display
  - [ ] Dismiss/action buttons

- [ ] **Hour 14-15:** Seasonal planner stub
  - [ ] Static page showing Ramadan prep
  - [ ] Sample savings recommendations
  - [ ] Budget allocation visual
  - [ ] Note: Full AI logic skipped (low priority for MVP)

- [ ] **Hour 15-16:** Polish & bug fixes
  - [ ] Test all pages on mobile
  - [ ] Fix broken links/404s
  - [ ] Ensure consistent spacing & alignment
  - [ ] Check color contrast for accessibility
  - [ ] Test all data loading states

**Deliverable:** All core features working on desktop & mobile

---

#### **Backend (continued)**
- [ ] **Hour 13-14:** Error handling & validation
  - [ ] All endpoints validate input
  - [ ] Errors return meaningful messages
  - [ ] Log errors for debugging
  - [ ] Handle missing user gracefully

- [ ] **Hour 14-15:** Performance optimization
  - [ ] Database query optimization (indexes)
  - [ ] API response times < 200ms (non-AI endpoints)
  - [ ] AI endpoints < 2 seconds (including LLM latency)
  - [ ] Load test with 10 concurrent users

- [ ] **Hour 15-16:** Deployment readiness
  - [ ] Environment variables finalized
  - [ ] API documentation in README
  - [ ] Deployment script created (Vercel/Heroku/Railway)
  - [ ] Database backup strategy

**Deliverable:** Production-ready backend, deployable in 5 minutes

---

#### **Product/Design Lead (continued)**
- [ ] **Hour 13-15:** Demo preparation
  - [ ] Create demo video script (2 minutes max)
  - [ ] Practice demo flow
  - [ ] Prepare backup scenarios if live demo fails
  - [ ] Design slides for pitch (problem → solution → key features → AI magic)

- [ ] **Hour 15-16:** Presentation deck
  - [ ] 5 slides max:
    - [ ] Title + team
    - [ ] Problem statement
    - [ ] Solution overview
    - [ ] Key AI features
    - [ ] Business model / next steps

**Deliverable:** Demo script, slides, pitch talking points ready

---

#### **Entire Team (Last 30 min of Day 2)**
- [ ] **Hour 16 (final 30 min):** Integration & final test
  - [ ] Deploy to live URL (Vercel/Netlify for frontend, Render/Railway for backend)
  - [ ] Full end-to-end test (login → view data → get AI insights)
  - [ ] Check mobile responsiveness
  - [ ] Record demo video (backup)
  - [ ] Fix any critical bugs

**End of Day 2:** Fully functional MVP ready for judging

---

## SUBMISSION & DEMO (Hours 17-18)

- [ ] [ ] Submit to hackathon platform (code + video + description)
- [ ] [ ] Final demo practice (3 minutes max)
- [ ] [ ] Team huddle: Sync on talking points
- [ ] [ ] Demo delivery:
  - [ ] Login / sample user
  - [ ] Dashboard overview (show AI insights)
  - [ ] Ask AI Coach a question
  - [ ] Show smart alert
  - [ ] Explain AI system architecture (30 seconds)

---

## CRITICAL PATH DEPENDENCIES

**Can't start until:**
- Frontend can't display data → Backend must have sample data
- Coach can't chat → AI system prompt must be ready
- Deployment can't happen → All env variables must be configured

**Parallel tracks:**
- Backend API + Frontend can develop in parallel
- AI prompts can be written while backend API is built

---

## WHAT TO CUT IF RUNNING OUT OF TIME

**Priority 1 (MUST HAVE):**
- [ ] Dashboard with real data
- [ ] Health score with AI explanation
- [ ] AI Coach (simple Q&A)
- [ ] Working API endpoints

**Priority 2 (NICE TO HAVE):**
- [ ] Smart alerts
- [ ] Subscriptions detection
- [ ] Seasonal planner
- [ ] Complex visualizations

**Priority 3 (SKIP IF TIME CRITICAL):**
- [ ] Authentication (use demo user ID)
- [ ] Multi-user support
- [ ] Transaction editing
- [ ] Budget goals
- [ ] Dark mode

---

## RISK MITIGATION

| Risk | Mitigation |
|------|-----------|
| **LLM API rate limiting** | Implement request queuing, cache responses, use smaller models if needed |
| **Database is slow** | Pre-compute metrics, use caching, optimize queries |
| **Frontend breaks on mobile** | Test on iPhone 12 + Android emulator daily, use responsive design patterns |
| **Live demo fails** | Record video backup, have slides with screenshots, be ready to show code |
| **API key exposed** | Use `.env` files, never commit secrets, regenerate key after hackathon |
| **Can't deploy in time** | Deploy to Vercel/Netlify (instant), not custom server |

---

## TEAM COMMUNICATION CADENCE

- **Kick-off (Start of Day 1):** 10 min standup - Goals for the day
- **Mid-day sync (Hour 8):** 10 min - Report progress, unblock blockers
- **Pre-submission (Hour 16):** 15 min - Final integration test
- **Demo prep (Hour 17):** 20 min - Practice, finalize talking points

---

## SUBMISSION CHECKLIST (FINAL)

- [ ] Code pushed to GitHub
- [ ] README with setup instructions
- [ ] `.env.example` with all required variables
- [ ] Live demo URL deployed and tested
- [ ] Demo video recorded (2-3 minutes)
- [ ] Pitch description written (200 words max)
- [ ] All team member names in submission
- [ ] License file (MIT or Apache 2.0)
- [ ] Screenshots in /docs folder
- [ ] Links to frontend + backend repos

---

## SUCCESS METRICS FOR JUDGES

Judges will evaluate:

1. **AI Quality** (40%)
   - Does the AI provide real financial insights?
   - Are explanations accurate and useful?
   - Does it feel intelligent, not robotic?

2. **Product Fit** (30%)
   - Solves a real problem?
   - Would users actually use it?
   - Is it aligned with the hackathon theme?

3. **Technical Execution** (20%)
   - Code quality
   - API design
   - Database design
   - Deployment working

4. **Demo & Presentation** (10%)
   - Clear communication
   - Live demo works
   - Team energy

**Focus on #1 and #2 to win.**

---

## POST-HACKATHON (If You Win/Place)

- [ ] Document architecture decisions
- [ ] Add authentication (Firebase Auth)
- [ ] Add multi-user support
- [ ] Connect to real banking APIs
- [ ] Improve data privacy/security
- [ ] Scale infrastructure
- [ ] Build mobile app
