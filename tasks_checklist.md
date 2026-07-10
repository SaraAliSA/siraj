# Implementation Checklist

## BE (Backend)
- [ ] **Project Setup & Configuration**
  - [ ] Initialize Python environment, `requirements.txt`, `.env` configuration file
  - [ ] Set up FastAPI base application with CORS settings
- [ ] **Database & ORM Models**
  - [ ] Implement database connection engine & session factory (`database.py`)
  - [ ] Create SQLAlchemy ORM models for all 10 tables:
    - [ ] `User`, `Transaction`, `Budget`, `SavingsGoal`
    - [ ] `FinancingRequest`, `InvestmentRequest`, `Alert`, `FinancialGoal`
    - [ ] `ChatSession`, `ChatMessage`
- [ ] **Pydantic Schemas**
  - [ ] Create request and response validation schemas for all models
- [ ] **Authentication & Security**
  - [ ] Implement user registration and login endpoints (`/auth/register`, `/auth/login`)
  - [ ] Set up JWT token validation and password hashing/security services
- [ ] **Core Business Services**
  - [ ] Develop financial metrics and dashboard services (`/dashboard/overview`, `/dashboard/category-breakdown`)
  - [ ] Create financial health score logic (`health_score.py`)
  - [ ] Implement smart alert engine check and endpoints (`alert_engine.py`, `/alerts`)
- [ ] **Database Seeding**
  - [ ] Build seeder script (`seed.py`) with ~120 realistic transaction records for "سارة القرني"

## FR (Frontend/React)
- [ ] **Project Init & Configuration**
  - [ ] Initialize Vite + React project structure
  - [ ] Install styling rules and dependencies (`react-router-dom`, `recharts`, `axios`)
- [ ] **Design System & Global Layout**
  - [ ] Implement CSS design tokens, premium color palette, and RTL typography (`Cairo` font)
  - [ ] Create global page shell layout (`Sidebar`, `TopBar`, and `AppLayout`)
  - [ ] Implement Dark/Light mode toggle system
- [ ] **Authentication Pages**
  - [ ] Build Login screen (`LoginPage.jsx`) with state management
- [ ] **Dashboard & Financial Summary**
  - [ ] Build dashboard cards with financial metrics (Income, Expenses, Savings, Savings Rate)
  - [ ] Integrate expense distribution donut and top expenses bar charts (`recharts`)
  - [ ] Create financial health score gauge component
  - [ ] Create recent transactions table component
- [ ] **Feature Pages & Components**
  - [ ] Create Financing page (product catalog, submission form, status timeline)
  - [ ] Create Investment page (opportunities cards, AI-driven recommendation badge, request form)
  - [ ] Create Savings & Goals page (progress bars, seasonal plans like Hajj/Umrah, customized plan creation)
  - [ ] Create Smart Alerts interface (alerts list feed and notification badge)

## Integration
- [ ] **API Client & Auth State**
  - [ ] Set up Axios HTTP client with JWT interceptor for token inclusion
  - [ ] Create React auth context (`AuthContext.jsx`) and protection hooks
- [ ] **Backend Services Connectivity**
  - [ ] Connect dashboard components to overview, breakdown, and health score API endpoints
  - [ ] Bind transactions management page with Backend API CRUD routes
  - [ ] Link financing and investment application pages with their database handlers
- [ ] **Alerts Synchronization**
  - [ ] Set up global notification context (`AlertContext.jsx`) and connect to backend active alerts

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
