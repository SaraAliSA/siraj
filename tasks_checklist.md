# Implementation Checklist

## BE (Backend)
- [x] **Project Setup & Configuration**
  - [x] Initialize Python environment, `requirements.txt`, `.env` configuration file
  - [x] Set up FastAPI base application with CORS settings
- [x] **Database & ORM Models**
  - [x] Implement database connection engine & session factory (`database.py`)
  - [x] Create SQLAlchemy ORM models for all 10 tables:
    - [x] `User`, `Transaction`, `Budget`, `SavingsGoal`
    - [x] `FinancingRequest`, `InvestmentRequest`, `Alert`, `FinancialGoal`
    - [x] `ChatSession`, `ChatMessage`
- [x] **Pydantic Schemas**
  - [x] Create request and response validation schemas for all models
- [x] **Authentication & Security**
  - [x] Implement user registration and login endpoints (`/auth/register`, `/auth/login`)
  - [x] Set up JWT token validation and password hashing/security services
- [x] **Core Business Services**
  - [x] Develop financial metrics and dashboard services (`/dashboard/overview`, `/dashboard/category-breakdown`)
  - [x] Create financial health score logic (`health_score.py`)
  - [x] Implement smart alert engine check and endpoints (`alert_engine.py`, `/alerts`)
- [x] **Database Seeding**
  - [x] Build seeder script (`seed.py`) with ~120 realistic transaction records for "سارة القرني"

## FR (Frontend/React)
- [x] **Project Init & Configuration**
  - [x] Initialize Vite + React project structure
  - [x] Install styling rules and dependencies (`react-router-dom`, `recharts`, `axios`)
- [x] **Design System & Global Layout**
  - [x] Implement CSS design tokens, premium color palette, and RTL typography (`Cairo` font)
  - [x] Create global page shell layout (`Sidebar`, `TopBar`, and `AppLayout`)
  - [x] Implement Dark/Light mode toggle system
- [x] **Authentication Pages**
  - [x] Build Login screen (`LoginPage.jsx`) with state management
- [x] **Dashboard & Financial Summary**
  - [x] Build dashboard cards with financial metrics (Income, Expenses, Savings, Savings Rate)
  - [x] Integrate expense distribution donut and top expenses bar charts (`recharts`)
  - [x] Create financial health score gauge component
  - [x] Create recent transactions table component
- [x] **Feature Pages & Components**
  - [x] Create Financing page (product catalog, submission form, status timeline)
  - [x] Create Investment page (opportunities cards, AI-driven recommendation badge, request form)
  - [x] Create Savings & Goals page (progress bars, seasonal plans like Hajj/Umrah, customized plan creation)
  - [x] Create Smart Alerts interface (alerts list feed and notification badge)

## Integration
- [x] **API Client & Auth State**
  - [x] Set up Axios HTTP client with JWT interceptor for token inclusion
  - [x] Create React auth context (`AuthContext.jsx`) and protection hooks
- [x] **Backend Services Connectivity**
  - [x] Connect dashboard components to overview, breakdown, and health score API endpoints
  - [x] Bind transactions management page with Backend API CRUD routes
  - [x] Link financing and investment application pages with their database handlers
- [x] **Alerts Synchronization**
  - [x] Set up global notification context (`AlertContext.jsx`) and connect to backend active alerts

## AI
- [ ] **Prompt Engineering & System Prompt**
  - [ ] Formulate multi-layered Arabic (Saudi dialect) system prompt containing personality, capabilities, and dynamic rules
- [ ] **Gemini Tool Suite**
  - [ ] Define the schema for 15 tools matching the 7 feature areas (e.g., `get_transactions`, `simulate_scenario`)
- [ ] **Context Builder (RAG)**
  - [ ] Write logic to build financial snapshots (balances, budgets, goals) to feed into the prompt context
- [ ] **Agent Conversation Loop**
  - [ ] Build the multi-turn execution flow resolving function calls automatically
- [ ] **Streaming Chat Gateway**
  - [ ] Integrate Server-Sent Events (SSE) router on FastAPI for real-time response generation
  - [ ] Hook up frontend chat panel (`ChatPanel.jsx`, `MessageBubble.jsx`) to handle token-by-token streaming

## Demo & Presentation
- [ ] **Data Verification & Dry Run**
  - [ ] Verify database seeding script populates data correctly
  - [ ] Test the exact demo walkthrough sequence (Login -> Dashboard overview -> Submit Financing request -> Ask Siraj in chat)
- [ ] **Interactive Scenarios Testing**
  - [ ] Verify Saudi dialect questions (e.g., "وين راحت فلوسي؟", "أبي أخطط لرمضان") trigger correct tools and return answers
- [ ] **UI Presentation Polish**
  - [ ] Verify responsive behavior on target demo screen resolutions
  - [ ] Double-check RTL layout alignment, dark/light mode contrast, and hover micro-animations
