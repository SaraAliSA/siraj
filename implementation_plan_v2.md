# Siraj (سراج) — Gap Analysis & Implementation Plan

> **Objective**: Identify all gaps between the [original implementation plan](file:///c:/Users/saraa/Desktop/Siraj/implementation_plan.md) and the actual codebase, then provide a prioritized, actionable plan to close every gap.

---

## Executive Summary

The codebase has a solid foundation with all 10 backend routers, models, schemas, and seed data functional. The frontend has all 11 pages, design system, RTL layout, dark/light mode, and API integration working. However, **the most critical feature — the AI agent (Gemini integration)** — is entirely missing. Several backend services are missing or incomplete, and the frontend has structural deviations from the plan.

### Completion Status Overview

| Area | Planned | Implemented | Status |
|------|---------|-------------|--------|
| Database Layer | SQLAlchemy + SQLite | ✅ Complete | ✅ Done |
| ORM Models (10) | All 10 models | ✅ All 10 present | ✅ Done |
| Pydantic Schemas (10) | All 10 schemas | ✅ All 10 present | ✅ Done |
| Auth System | JWT register/login/me | ✅ Complete | ✅ Done |
| Core Routers (10) | 10 routers | ✅ All 10 present | ✅ Done |
| Dashboard Endpoints | 6 endpoints | ✅ All 6 implemented | ✅ Done |
| Seed Data | 1 user, 120+ txns, etc. | ✅ Rich seed data | ✅ Done |
| **AI Module** (`backend/app/ai/`) | **4 files** | ❌ **Entirely missing** | 🔴 Critical |
| `services/financial_service.py` | Planned | ❌ Missing (inlined in dashboard) | 🟡 Medium |
| `services/health_score.py` | Planned as standalone | ❌ Missing (inlined in dashboard) | 🟡 Medium |
| `services/alert_engine.py` | Planned as proactive engine | ❌ Missing entirely | 🟡 Medium |
| `services/ai_agent.py` | Planned | ❌ Missing | 🔴 Critical |
| `google-genai` dependency | Required | ❌ Not in requirements.txt | 🔴 Critical |
| Frontend Pages (11) | 11 pages | ✅ All 11 present | ✅ Done |
| Frontend Components | 30+ components | ⚠️ Partial (2 dirs: Dashboard, Layout) | 🟡 Medium |
| `useDashboard.js` hook | Planned | ❌ Missing (logic inline in DashboardPage) | 🟢 Low |
| Frontend `Sidebar.jsx` | Desktop RTL sidebar | ❌ Replaced by `BottomNav.jsx` (mobile-first) | ✅ Alternative |
| `common/` components | Button, Modal, Card, LoadingSpinner | ❌ Missing (inline implementations) | 🟢 Low |

---

## 🔴 Priority 1 — CRITICAL: AI Agent Integration (Gemini)

The entire `backend/app/ai/` directory is missing. The chat router ([chat.py](file:///c:/Users/saraa/Desktop/Siraj/backend/app/routers/chat.py)) currently uses **hardcoded rule-based mock responses** with simple keyword matching instead of the planned Gemini-powered agentic loop.

### What's Missing

#### [NEW] `backend/app/ai/__init__.py`
- Empty init file for the AI package

#### [NEW] `backend/app/ai/system_prompt.py`
- **Layer 1 — Identity**: Arabic personality, Saudi dialect, Islamic finance awareness
- **Layer 2 — Capabilities**: What Siraj can/cannot do, guardrails
- **Layer 3 — Dynamic Context**: Template for injected per-request financial data
- Must return the assembled prompt as a string function

#### [NEW] `backend/app/ai/tools.py`
- Define all **15 function tools** as Gemini-compatible function declarations:

| # | Tool Name | What It Does |
|---|-----------|-------------|
| 1 | `get_transactions` | Query transactions by date/category/type |
| 2 | `get_financial_summary` | Return income/expense/savings/rate |
| 3 | `get_category_breakdown` | Spending by category with percentages |
| 4 | `get_budget_analysis` | Budget vs actual per category |
| 5 | `get_recurring_charges` | Detect recurring bills/subscriptions |
| 6 | `add_transaction` | Insert a new transaction record |
| 7 | `set_budget` | Create or update a budget for a category |
| 8 | `create_savings_plan` | Create a new savings goal |
| 9 | `create_spending_alert` | Create a custom spending alert |
| 10 | `simulate_scenario` | What-if financial scenario simulation |
| 11 | `submit_financing_request` | Submit a financing application |
| 12 | `get_financing_status` | Check status of financing requests |
| 13 | `get_investment_recommendations` | Get personalized investment advice |
| 14 | `submit_investment_request` | Submit an investment request |
| 15 | `create_financial_goal` | Create a financial goal (Hajj, Umrah, etc.) |

- Each tool needs:
  - A Gemini-compatible function declaration (name, description in Arabic, parameters with types)
  - An async executor function that runs the actual DB query/mutation

#### [NEW] `backend/app/ai/context_builder.py`
- `build_context(user_id, db)` function that aggregates:
  - User profile
  - Financial summary (income, expenses, savings, savings rate)
  - Category breakdown
  - Budget status (budget vs actual)
  - Active savings goals
  - Pending financing requests
  - Active investments
  - Financial goals with progress
  - Active/unresolved alerts
  - Health score (0-100 + grade)
  - Current date and upcoming seasonal events (e.g., "Ramadan in X days")
- Returns a structured dict that's serialized into Layer 3 of the system prompt

#### [NEW] `backend/app/ai/agent_loop.py`
- Multi-turn agentic conversation loop:
  1. Build context → inject into system prompt
  2. Send user message + tool definitions to Gemini
  3. If Gemini returns a tool call → execute tool → feed result back
  4. Repeat until Gemini returns a final text response
  5. Stream the final response via SSE
- Must handle:
  - Multi-tool chaining (Gemini may call 2-3 tools in sequence)
  - Error handling for tool execution failures
  - Token-by-token SSE streaming of the final Arabic response
  - Chat history management (load previous messages from DB)

#### [MODIFY] `backend/app/routers/chat.py`
- Replace the current mock keyword-matching logic (lines 104-131) with a call to the agentic loop
- The `send_message_stream` endpoint must:
  1. Load chat history from the database
  2. Call `agent_loop.run(user_message, chat_history, user_id, db)`
  3. Stream the response as SSE events
  4. Save the final assistant message and any tool calls to the database

#### [MODIFY] `backend/requirements.txt`
- Add: `google-genai>=1.0.0` (the official Google GenAI Python SDK)

#### [MODIFY] `backend/.env.example`
- Already has `GEMINI_API_KEY` placeholder — this is correct

### Dependencies
- A valid `GEMINI_API_KEY` must be set in `.env` for live AI to work
- The SDK uses `google.genai` (not `google.generativeai`) for the latest version

---

## 🟡 Priority 2 — Backend Service Layer Gaps

### 2A. [NEW] `backend/app/services/health_score.py`

**Current state**: Health score logic is inlined in [dashboard.py](file:///c:/Users/saraa/Desktop/Siraj/backend/app/routers/dashboard.py#L133-L247) (lines 133-247). The plan calls for a standalone service with the full 6-factor weighted scoring algorithm.

**Gap**: The current implementation uses only 3 factors (Savings Rate 30%, Budget Adherence 40%, Emergency Fund 30%) instead of the planned 6 factors:

| Factor | Planned Weight | Current Status |
|--------|---------------|----------------|
| Savings Rate | 30% | ✅ Implemented (30 pts) |
| Budget Adherence | 25% | ⚠️ Implemented but weighted at 40% |
| Spending Consistency | 15% | ❌ Missing |
| Subscription Efficiency | 10% | ❌ Missing |
| Emergency Fund | 10% | ⚠️ Implemented but weighted at 30% |
| Debt-to-Income | 10% | ❌ Missing |

**Action**:
1. Extract health score logic into a standalone `services/health_score.py`
2. Implement all 6 factors with correct weights
3. Update [dashboard.py](file:///c:/Users/saraa/Desktop/Siraj/backend/app/routers/dashboard.py) to call the service instead of inline logic
4. The service function must accept `user_id` and `db` session and return `{score, grade, insights, factor_breakdown}`

---

### 2B. [NEW] `backend/app/services/financial_service.py`

**Current state**: Financial aggregation logic is scattered across [dashboard.py](file:///c:/Users/saraa/Desktop/Siraj/backend/app/routers/dashboard.py) endpoints. No centralized reusable service.

**Action**:
1. Create `services/financial_service.py` with shared functions:
   - `get_financial_summary(user_id, db)` → income, expenses, savings, savings_rate
   - `get_category_breakdown(user_id, db)` → expense breakdown by category
   - `get_budget_vs_actual(user_id, db)` → budget adherence per category
   - `get_recurring_charges(user_id, db)` → detect recurring subscription-like transactions
2. Refactor `dashboard.py` to use these shared functions
3. The AI tools module will also depend on these functions

---

### 2C. [NEW] `backend/app/services/alert_engine.py`

**Current state**: No proactive alert engine exists. Alerts are only created through the seed data or manual API calls. The plan calls for automatic alert generation.

**Action**:
1. Create `services/alert_engine.py` with:
   - `check_budget_breach(user_id, transaction, db)` — called after every new transaction, creates an alert if spending exceeds budget threshold (80%, 90%, 100%)
   - `generate_daily_tip(user_id, db)` — AI-generated tip based on user's financial state (currently uses hardcoded random tips in dashboard.py)
   - `check_goal_milestones(user_id, db)` — check if any savings/financial goals hit a milestone (25%, 50%, 75%, 100%) and create alerts
2. Hook `check_budget_breach` into the transaction creation endpoint ([transactions.py](file:///c:/Users/saraa/Desktop/Siraj/backend/app/routers/transactions.py#L47-L64) `create_transaction`)
3. Optionally hook milestone checks into savings plan updates

---

## 🟡 Priority 3 — Frontend Component Decomposition

### 3A. Missing Component Directories

The plan calls for 8 component subdirectories. Only 2 exist (`Dashboard/`, `Layout/`). The remaining 6 have their logic embedded directly in the page files:

| Planned Directory | Status | Current Location |
|-------------------|--------|-----------------|
| `components/Chat/` | ❌ Missing | Logic is inline in [SirajAIPage.jsx](file:///c:/Users/saraa/Desktop/Siraj/frontend/src/pages/SirajAIPage.jsx) |
| `components/Financing/` | ❌ Missing | Logic is inline in [FinancingPage.jsx](file:///c:/Users/saraa/Desktop/Siraj/frontend/src/pages/FinancingPage.jsx) |
| `components/Investment/` | ❌ Missing | Logic is inline in [InvestmentPage.jsx](file:///c:/Users/saraa/Desktop/Siraj/frontend/src/pages/InvestmentPage.jsx) |
| `components/Savings/` | ❌ Missing | Logic is inline in [SavingsPage.jsx](file:///c:/Users/saraa/Desktop/Siraj/frontend/src/pages/SavingsPage.jsx) |
| `components/Goals/` | ❌ Missing | Logic is inline in [GoalsPage.jsx](file:///c:/Users/saraa/Desktop/Siraj/frontend/src/pages/GoalsPage.jsx) |
| `components/Alerts/` | ❌ Missing | Logic is inline in [AlertsPage.jsx](file:///c:/Users/saraa/Desktop/Siraj/frontend/src/pages/AlertsPage.jsx) |
| `components/common/` | ❌ Missing | No shared Button, Modal, Card, LoadingSpinner |

**Action** (if time permits — these are **non-blocking** for the demo):

Extract into components:
- `Chat/ChatPanel.jsx`, `Chat/MessageBubble.jsx`, `Chat/QuickActions.jsx`, `Chat/ToolIndicator.jsx`
- `Financing/FinancingList.jsx`, `Financing/FinancingRequestForm.jsx`, `Financing/ApplicationStatus.jsx`
- `Investment/OpportunityCard.jsx`, `Investment/InvestmentList.jsx`, `Investment/RecommendationCard.jsx`
- `Savings/SavingsPlanCard.jsx`, `Savings/CreatePlanModal.jsx`, `Savings/GoalProgress.jsx`
- `Goals/GoalCard.jsx`, `Goals/CreateGoalModal.jsx`, `Goals/SeasonalPlanner.jsx`
- `Alerts/AlertBanner.jsx`, `Alerts/AlertList.jsx`, `Alerts/AlertSettingsModal.jsx`
- `common/Button.jsx`, `common/Modal.jsx`, `common/Card.jsx`, `common/LoadingSpinner.jsx`

> [!NOTE]
> The current inline approach **works correctly** for the hackathon. Component extraction is a code quality improvement, not a functional gap. **Skip this if time is tight.**

---

### 3B. Missing `Sidebar.jsx` (Desktop Layout)

**Current state**: The plan called for a desktop RTL sidebar (`components/Layout/Sidebar.jsx`). The actual implementation uses a **mobile-first bottom navigation** ([BottomNav.jsx](file:///c:/Users/saraa/Desktop/Siraj/frontend/src/components/Layout/BottomNav.jsx)) with a "More" drawer pattern.

**Assessment**: This is a **deliberate design choice**, not a gap. The mobile-first approach is arguably better for a hackathon demo. The bottom nav with drawer is functionally equivalent.

> [!TIP]
> **No action required** — the BottomNav is a valid alternative. If you want both mobile and desktop layouts, add a responsive `Sidebar.jsx` that shows on screens > 768px.

---

### 3C. Missing `useDashboard.js` Hook

**Current state**: Dashboard data fetching logic is inline in [DashboardPage.jsx](file:///c:/Users/saraa/Desktop/Siraj/frontend/src/pages/DashboardPage.jsx#L59-L83) (lines 59-83).

**Action**: Extract into `hooks/useDashboard.js` for reusability. Low priority.

---

## 🟡 Priority 4 — AI-Powered Endpoints

### 4A. [MODIFY] `routers/investment.py` — `/recommendations`

**Current state**: The [recommendations endpoint](file:///c:/Users/saraa/Desktop/Siraj/backend/app/routers/investment.py#L98-L119) returns hardcoded static recommendations. The plan calls for AI-powered personalized recommendations.

**Action**: After the AI module is built, replace the static recommendations with a call to Gemini that analyzes the user's financial profile and generates personalized investment advice.

### 4B. [MODIFY] `routers/goals.py` — `/{id}/plan`

**Current state**: The [AI plan generation endpoint](file:///c:/Users/saraa/Desktop/Siraj/backend/app/routers/goals.py#L168-L218) uses rule-based mock logic to generate financial plans. The plan calls for AI-generated plans.

**Action**: After the AI module is built, replace the mock plan generation with a Gemini call that creates a comprehensive, personalized financial plan based on the user's profile and goal details.

### 4C. [MODIFY] `routers/dashboard.py` — `/daily-tip`

**Current state**: The [daily tip endpoint](file:///c:/Users/saraa/Desktop/Siraj/backend/app/routers/dashboard.py#L249-L254) returns a random tip from a hardcoded list.

**Action**: After the AI module is built, generate a personalized tip using Gemini based on the user's current financial state. Keep the hardcoded list as a fallback when the API key is missing.

---

## 🟢 Priority 5 — Minor Gaps & Polish

### 5A. Frontend: Chat Tool Execution Indicators

**Current state**: The [SirajAIPage.jsx](file:///c:/Users/saraa/Desktop/Siraj/frontend/src/pages/SirajAIPage.jsx) has basic tool status indicators (`toolStatus` state), but it only works for the local "piggy bank" creation flow. It doesn't show real-time tool execution from the backend AI agent.

**Action**: When the backend AI agent is implemented, update the SSE stream parsing to detect tool execution events (e.g., `{"tool": "get_transactions", "status": "running"}`) and show them in the UI with the `ToolIndicator` pattern.

### 5B. Chat History Loading

**Current state**: Chat messages are loaded from the backend, but the welcome message is always injected client-side. Previous messages from the backend don't include tool_call/tool_result roles.

**Action**: Ensure tool metadata is properly stored and rendered when loading chat history.

### 5C. Celebration Animation for Goal Achievement

**Current state**: The plan mentions a "Goal achievement celebration animation" for the Savings page. This is not implemented.

**Action**: Add a confetti or celebration animation when `current_amount >= target_amount` on a savings plan.

### 5D. `backend/.env` File

**Current state**: Only `.env.example` exists. The actual `.env` file is needed with a real `GEMINI_API_KEY`.

**Action**: Create a `.env` file from `.env.example` and add a valid Gemini API key.

---

## Proposed Execution Order

### Phase 1: Backend AI Foundation (~3-4 hours)
| # | Task | Files | Priority |
|---|------|-------|----------|
| 1 | Add `google-genai` to requirements.txt | [requirements.txt](file:///c:/Users/saraa/Desktop/Siraj/backend/requirements.txt) | 🔴 |
| 2 | Create `backend/app/ai/__init__.py` | New | 🔴 |
| 3 | Create system prompt (3 layers, Arabic) | `ai/system_prompt.py` | 🔴 |
| 4 | Create tool definitions (15 tools) | `ai/tools.py` | 🔴 |
| 5 | Create context builder (RAG injection) | `ai/context_builder.py` | 🔴 |
| 6 | Extract financial_service.py | `services/financial_service.py` | 🟡 |
| 7 | Extract health_score.py (6 factors) | `services/health_score.py` | 🟡 |
| 8 | Create agentic loop with SSE streaming | `ai/agent_loop.py` | 🔴 |
| 9 | Replace mock chat router with real AI | [chat.py](file:///c:/Users/saraa/Desktop/Siraj/backend/app/routers/chat.py) | 🔴 |

### Phase 2: Proactive Engine (~1 hour)
| # | Task | Files | Priority |
|---|------|-------|----------|
| 1 | Create alert_engine.py | `services/alert_engine.py` | 🟡 |
| 2 | Hook budget breach check into transactions | [transactions.py](file:///c:/Users/saraa/Desktop/Siraj/backend/app/routers/transactions.py) | 🟡 |
| 3 | Hook goal milestone checks into savings | [savings.py](file:///c:/Users/saraa/Desktop/Siraj/backend/app/routers/savings.py) | 🟡 |

### Phase 3: AI-Powered Endpoints (~1 hour)
| # | Task | Files | Priority |
|---|------|-------|----------|
| 1 | AI investment recommendations | [investment.py](file:///c:/Users/saraa/Desktop/Siraj/backend/app/routers/investment.py) | 🟡 |
| 2 | AI goal plan generation | [goals.py](file:///c:/Users/saraa/Desktop/Siraj/backend/app/routers/goals.py) | 🟡 |
| 3 | AI daily tip generation | [dashboard.py](file:///c:/Users/saraa/Desktop/Siraj/backend/app/routers/dashboard.py) | 🟡 |

### Phase 4: Frontend Enhancement (~1-2 hours)
| # | Task | Files | Priority |
|---|------|-------|----------|
| 1 | Update SirajAIPage for real AI tool indicators | [SirajAIPage.jsx](file:///c:/Users/saraa/Desktop/Siraj/frontend/src/pages/SirajAIPage.jsx) | 🟡 |
| 2 | Add celebration animation for goal achievement | SavingsPage / GoalsPage | 🟢 |
| 3 | Extract useDashboard hook | `hooks/useDashboard.js` | 🟢 |
| 4 | Extract components (if time permits) | `components/` subdirs | 🟢 |

---

## Open Questions

> [!IMPORTANT]
> **GEMINI_API_KEY**: Do you have a valid Google Gemini API key? This blocks all of Phase 1. Without it, the AI chat will remain mock-based.

> [!IMPORTANT]
> **Gemini Model Selection**: The plan specifies `gemini-2.0-flash`. Should we use this model, or would you prefer `gemini-2.5-flash` (newer, better reasoning)?

> [!IMPORTANT]
> **Component extraction scope**: Given hackathon time constraints, should we skip Priority 3 (component decomposition) entirely and focus only on Priorities 1 & 2 (AI + services)?

---

## Verification Plan

### After Phase 1 (AI Integration)
```bash
# Test the backend starts without errors
cd backend && python -m uvicorn backend.app.main:app --reload

# Test AI chat endpoint
curl -X POST http://localhost:8000/api/v1/chat/sessions/{session_id}/messages \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"content": "وين راحت فلوسي؟"}'
```

### After Phase 2 (Proactive Engine)
- Create a transaction that exceeds a budget → verify an alert is auto-created
- Update a savings plan to hit 50% → verify a milestone alert is auto-created

### After Phase 3 (AI Endpoints)
- Call `/api/v1/investment/recommendations` → verify personalized AI response
- Call `/api/v1/goals/{id}/plan` → verify AI-generated plan with Arabic content
- Call `/api/v1/dashboard/daily-tip` → verify personalized tip (not random)

### Full Demo Flow
1. Login as sara@siraj.sa / password123
2. Dashboard → verify KPIs, charts, health score, daily tip all load from backend
3. Open Siraj AI → ask "وين راحت فلوسي؟" → watch multi-tool analysis with live tool indicators
4. Ask "أبي أقدم على تمويل شخصي" → watch financing request flow
5. Ask "أبي أخطط لرمضان" → watch goal creation + AI plan
6. Check Alerts page → verify proactive budget breach alerts
7. Toggle dark/light mode → verify all components adapt
