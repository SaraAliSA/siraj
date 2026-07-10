# Siraj Hackathon Execution Plan

## Objective

Build a stable working prototype of **Siraj**, an Arabic RTL AI financial advisor that helps users understand their financial situation, ask questions about spending, receive recommendations, and safely confirm financial actions.

The goal is not to build every possible feature. The goal is to deliver a clear, working demo that shows the highest-impact product story:

**Understand money -> Ask Siraj -> Get insight -> Confirm safe action**

---

## Team Roles

| Member | Role | Main Responsibility |
|---|---|---|
| Member 1 | Frontend Lead | Dashboard UI, RTL layout, charts |
| Member 2 | AI / Chat Lead | Siraj AI assistant, intent detection, responses |
| Member 3 | Backend Lead | APIs, mock database, transaction logic |
| Member 4 | UX / Product Lead | User flows, UI polish, presentation, demo story |
| Member 5 | QA / Integration Lead | Testing, bug fixing, Git coordination, demo data |

---

## Feature Priority

### Must Have

Required for the final demo.

- Arabic RTL dashboard
- Financial KPI cards
- Transaction list
- Expense categories
- Basic charts
- Siraj AI chat
- Simple intent detection
- Mock API and mock data
- Transfer confirmation flow

### Should Have

Important if time allows.

- Financial health score
- Savings recommendation
- Reports page
- Light/dark mode
- Better UI polish

### Nice to Have

Only build these if everything else is complete and stable.

- Seasonal spending prediction
- Unused subscription detection
- Real authentication
- Real banking integration
- Advanced analytics

---

## Project Milestones

| Phase | Goal | Deliverable |
|---|---|---|
| Phase 1 | Setup and planning | Git repo, project structure, task board, mock data |
| Phase 2 | Core prototype | Dashboard, API, transactions, charts |
| Phase 3 | AI flow | Chat assistant, intent detection, recommendations |
| Phase 4 | Integration | Frontend connected to backend and mock AI |
| Phase 5 | Polish and demo | Stable demo, fixed bugs, final presentation |

---

## Task Breakdown

| Task | Owner | Priority | Effort | Objective | Deliverable | Depends On |
|---|---|---|---|---|---|---|
| Create project repo and branches | Member 5 | Must Have | Small | Set up clean teamwork process | Git repo and branch rules | None |
| Create mock financial data | Member 3 | Must Have | Small | Prepare sample accounts, transactions, and categories | JSON file or mock database | None |
| Build app layout RTL | Member 1 | Must Have | Medium | Create Arabic right-to-left base layout | Sidebar, header, page shell | None |
| Build dashboard KPI cards | Member 1 | Must Have | Medium | Show income, expenses, savings, and savings rate | Dashboard cards | Mock data |
| Build charts | Member 1 | Must Have | Medium | Visualize top expenses and category distribution | Bar chart and donut chart | Mock data |
| Build transaction API | Member 3 | Must Have | Medium | Return transactions and summary data | API endpoints | Mock data |
| Build transaction list UI | Member 1 | Must Have | Medium | Show recent transactions clearly | Transaction table or list | API |
| Build Siraj AI chat UI | Member 2 | Must Have | Medium | Let user type questions to Siraj | Chat page | App layout |
| Build simple intent detection | Member 2 | Must Have | Medium | Detect transfer, spending question, and savings request | Intent logic | Mock phrases |
| Build AI response templates | Member 2 | Must Have | Medium | Return simple useful responses | Arabic response examples | Intent logic |
| Build transfer confirmation flow | Members 2 + 3 | Must Have | Large | Prevent transfer without confirmation | Confirmation screen and mock transfer | API and intent detection |
| Add financial health score | Member 3 | Should Have | Medium | Calculate simple score from spending and savings | Score value or API field | Mock data |
| Add savings recommendation | Member 2 | Should Have | Medium | Suggest a simple savings plan | Recommendation card or chat message | AI response templates |
| Reports page | Member 1 | Should Have | Medium | Add simple monthly report screen | Reports UI | Charts and data |
| UI polish | Member 4 | Should Have | Medium | Make app look professional and consistent | Improved spacing, colors, copy | Core UI |
| Presentation slides | Member 4 | Must Have | Medium | Prepare final pitch | Slide deck | Product story |
| Demo script | Members 4 + 5 | Must Have | Small | Make final demo smooth | Step-by-step demo script | Working prototype |
| Testing and bug fixing | Member 5 | Must Have | Large | Make prototype stable | Bug list and fixes | Integration |
| Practice final demo | All | Must Have | Medium | Avoid surprises during judging | Rehearsed demo | Stable prototype |

---

## Recommended Implementation Order

### Critical Path

These tasks must happen in this order:

1. Mock data
2. Backend summary and transactions API
3. Dashboard UI connected to data
4. AI chat UI
5. Intent detection
6. Transfer confirmation flow
7. Integration testing
8. Demo practice

If any critical path task is delayed, the final demo is at risk.

### Work That Can Happen in Parallel

| Workstream | Owner |
|---|---|
| UI layout and dashboard | Member 1 |
| Backend mock API | Member 3 |
| AI chat logic | Member 2 |
| Presentation and user flow | Member 4 |
| Git setup, testing checklist, integration support | Member 5 |

---

## Daily Hackathon Schedule

## Day 1: Foundation

### Goals

- Set up the project.
- Confirm the MVP scope.
- Build the base layout.
- Prepare mock data.
- Start backend and AI chat work.

### Tasks

| Area | Tasks |
|---|---|
| Setup | Create repo, branches, install dependencies |
| Product | Confirm Must Have features only |
| Frontend | Build RTL layout, routes, and page shell |
| Backend | Create mock data and basic API structure |
| AI | Start chat UI and sample intent examples |

### End of Day 1 Deliverable

A running app with layout, mock data, and early dashboard/API/chat pieces.

### Integration Checkpoint

- Everyone merges before the end of the day.
- Fix setup issues immediately.
- Do not leave broken code in the main branch.

---

## Day 2: Core Prototype

### Goals

- Complete the dashboard.
- Complete the basic backend.
- Complete the AI flow.
- Build transfer confirmation.
- Start the presentation.

### Tasks

| Area | Tasks |
|---|---|
| Frontend | KPI cards, charts, transaction list |
| Backend | Summary endpoint, transaction endpoint, mock transfer endpoint |
| AI | Intent detection and response templates |
| Product | Demo story and presentation outline |
| QA | Test merged flows and track bugs |

### End of Day 2 Deliverable

A working prototype that can be demoed from:

1. Dashboard
2. AI question
3. Spending explanation
4. Transfer request
5. Transfer confirmation

### Integration Checkpoints

- Midday merge
- Evening merge
- No large unmerged branches overnight

---

## Day 3: Polish and Demo

### Goals

- Fix bugs.
- Polish the UI.
- Prepare clean demo data.
- Finalize slides.
- Practice the final demo.

### Tasks

| Area | Tasks |
|---|---|
| QA | Fix broken UI, API errors, and flow bugs |
| UX/UI | Improve colors, spacing, Arabic labels, and charts |
| Product | Finalize slides and demo script |
| Team | Practice full demo at least 3 times |

### End of Day 3 Deliverable

- Stable prototype
- Final presentation
- Practiced demo
- Backup plan if API/AI fails

---

## Member-by-Member Checklist

## Member 1: Frontend Lead

- [ ] Build RTL app layout
- [ ] Build dashboard cards
- [ ] Build charts
- [ ] Build transaction list
- [ ] Help polish UI

## Member 2: AI / Chat Lead

- [ ] Build Siraj AI chat screen
- [ ] Add intent detection
- [ ] Add Arabic response templates
- [ ] Support transfer and savings flows
- [ ] Help demo AI use cases

## Member 3: Backend Lead

- [ ] Create mock data
- [ ] Build summary API
- [ ] Build transaction API
- [ ] Build mock transfer API
- [ ] Add financial health score if time allows

## Member 4: UX / Product Lead

- [ ] Define demo user journey
- [ ] Review Arabic copy
- [ ] Prepare final slides
- [ ] Polish product story
- [ ] Lead final presentation

## Member 5: QA / Integration Lead

- [ ] Manage Git branches
- [ ] Test merged work
- [ ] Track bugs
- [ ] Prepare demo checklist
- [ ] Support final rehearsal

---

## Risks and Blockers

| Risk | Impact | Mitigation |
|---|---|---|
| Team tries to build too many features | Prototype becomes unstable | Stick to Must Have first |
| AI integration takes too long | Demo breaks | Use simple rule-based or template responses |
| Backend/frontend mismatch | Data does not display | Agree on API response format early |
| Arabic RTL issues | UI looks unprofessional | Test Arabic screens from Day 1 |
| Git conflicts | Wasted time | Small branches, frequent commits, daily merges |
| Demo depends on internet/API | Risky final demo | Prepare mock fallback responses |

---

## Regular Integration Checkpoints

| Time | Action |
|---|---|
| Morning | 10-minute standup: what I did, what I will do, blockers |
| Midday | Merge small finished tasks |
| Evening | Full app run-through |
| Final day | Freeze features, only fix bugs and polish |

---

## Student-Friendly Development Best Practices

- Use feature branches such as `feature/dashboard`, `feature/chat`, and `feature/api`.
- Make small commits with clear messages.
- Do not work on the same file at the same time if possible.
- Keep one person responsible for merging.
- Use mock data first; do not wait for real integrations.
- Build the basic version first, then polish.
- Freeze new features before the final demo.
- Always keep a working version ready.
- Communicate blockers early.
- Use a shared task board such as GitHub Projects, Trello, Notion, or a simple spreadsheet.

---

## Suggested Git Workflow

1. Pull latest changes from `main`.
2. Create a feature branch.
3. Build one small task.
4. Test locally.
5. Commit with a clear message.
6. Push branch.
7. Ask for a quick review.
8. Merge after it works.

Example branch names:

- `feature/rtl-layout`
- `feature/dashboard-cards`
- `feature/mock-api`
- `feature/siraj-chat`
- `feature/transfer-confirmation`
- `fix/chart-spacing`

---

## Final Demo Flow

Use this simple story:

1. Open Siraj dashboard.
2. Show income, expenses, savings, and charts.
3. Ask Siraj: `وين راحت فلوسي؟`
4. Siraj explains spending by category.
5. Ask Siraj: `أبي أحول`
6. Show transfer confirmation.
7. Confirm transfer and show updated transaction or balance.
8. End with roadmap: banking integration, proactive alerts, seasonal planning.

This gives judges a clear product story:

**Siraj helps users understand money, ask AI, and take safe financial action.**

---

## Definition of Done

The project is demo-ready when:

- [ ] The app opens without errors.
- [ ] The dashboard shows realistic financial data.
- [ ] Charts render correctly.
- [ ] The transaction list works.
- [ ] Siraj AI answers at least three demo questions.
- [ ] Transfer confirmation works safely.
- [ ] The team has a final presentation.
- [ ] The final demo has been practiced at least 3 times.
- [ ] There is a backup demo path if something breaks.

