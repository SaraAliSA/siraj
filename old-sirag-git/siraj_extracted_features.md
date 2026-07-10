# Siraj - Extracted Features

Sources:
- Screenshot: `WhatsApp Image 2026-07-02 at 7.36.00 PM.jpeg`
- Presentation: `siraj_presentation.pdf`

## Features visible in the image

### Dashboard
- Arabic RTL dashboard for the Siraj finance app.
- Main KPI cards:
  - Total income: 12,500 SAR.
  - Total expenses: 8,200 SAR.
  - Total savings: 4,300 SAR.
  - Savings rate: 34%.
- Monthly spending analytics:
  - Top 5 monthly expenses as a horizontal bar chart.
  - Expense distribution by category as a donut chart.
- Category labels visible or implied:
  - Housing.
  - Groceries/shopping.
  - Restaurants/cafes.
  - Transport/fuel.
  - Bills.
  - Other.
  - Health/medicine.
  - Entertainment.
- Siraj insight link: "نصيحة سراج".
- Ask Siraj link: "اسأل سراج".

### Navigation and layout
- Right sidebar navigation.
- App branding: "سراج".
- User/avatar area.
- Main menu items:
  - Dashboard / لوحة التحكم.
  - Transactions / المعاملات.
  - Siraj AI / سراج AI.
  - Reports / التقارير.
  - Settings / الإعدادات.
- Add transaction button / إضافة معاملة.
- Light mode toggle / الوضع الفاتح.
- Dark theme currently active.

## Features extracted from the presentation

### Core product idea
- AI-powered financial advisor.
- Analyzes banking data and turns it into clear, personal financial insights.
- Helps users improve financial health.
- Helps increase savings.
- Supports better financial decision-making.
- Designed for the Saudi market.
- Considers Islamic finance principles.

### Problem and solution
- Problem: customers have bank data but struggle to understand their financial situation.
- Smart financial analysis:
  - Analyze banking data with AI.
  - Convert raw data into recommendations.
- Proactive alerts:
  - Detect financial risks early.
  - Detect spending increases.
  - Detect unused subscriptions.
  - Identify financial opportunities.
- Seasonal financial planning:
  - Predict seasonal expenses.
  - Suggest a budget before high-spending periods.
  - Suggest a savings plan to avoid financial shortfalls.

### Dashboard and analytics
- Show total balance.
- Show current account.
- Show credit card data.
- Analyze income and expenses.
- Interactive charts.
- Real-time card status tracking.
- Real-time transaction tracking.
- Display financial indicators.
- Calculate a financial health score.
- Automatically classify spending.
- Analyze spending patterns.

### AI chat and NLP
- Siraj AI chat assistant.
- Understand messages in Saudi dialect.
- Understand user intent.
- Extract the correct banking or finance intent from casual phrases.
- Example supported phrases:
  - "أبي أحول" - I want to transfer.
  - "وين راحت فلوسي" - Where did my money go?
  - "أبي حصالة" - I want a savings jar.
- Provide accurate answers based on account and transaction data.
- Guide the user automatically to the correct page in the interface.
- Wait for user confirmation before executing financial operations.

### Transactions and transfers
- Interactive instant transfer prototype.
- Confirmation dialog before executing a transfer.
- Automatic balance updates after transfer.
- Transaction logging in the database.
- Backend support for executing transfers through APIs.

### Data sources
- Experimental banking data.
- Bank accounts.
- Financial transactions.
- Payment cards.
- Banking products.

### Data processing
- Data cleaning.
- Automatic transaction categorization.
- Spending pattern analysis.
- Financial health score calculation.
- Personalized recommendation generation.

### Technical components
- Database:
  - Store account balances.
  - Store transaction history.
  - Store card data.
  - Manage transfers securely.
  - Update data immediately after each operation.
- APIs:
  - Connect frontend to banking backend.
  - Execute transfers.
  - Retrieve balances.
  - Return AI results quickly and reliably.
- Dashboard:
  - Present balance, income, spending, charts, card state, and transactions.
- LLM:
  - Understand user messages.
  - Generate finance-related responses.
  - Use accounts and transaction data as context.
- AI Agent:
  - Coordinate conversation steps.
  - Wait for confirmation before money movement.
  - Navigate the user to the suitable page.
- NLP:
  - Understand colloquial Saudi Arabic.
  - Extract intent from informal phrases.
- API integration prototype:
  - Initial FastAPI connection between frontend and backend.
  - API response and error handling tests.

### Testing and validation mentioned
- Dashboard prototype built.
- Dashboard tested on 120 experimental financial transactions.
- Transfer prototype tested on 40 experimental transfers.
- AI chat/NLP tested on 85 Saudi dialect messages.
- Reported intent extraction accuracy: 91%.
- API prototype tested with 27 API requests.

### Challenges
- Different transaction descriptions across banks.
- Accuracy of transaction classification.
- Protecting user data privacy and security.

### Future features
- Turn Siraj into an integrated financial platform.
- Connect with financial institutions and services.
- Provide real-time financial analytics.
- Support long-term financial planning.
- Improve banking system integrations.
- Expand testing with additional experimental data.
- Get guidance from financial sector experts.

## Consolidated product feature backlog

### MVP features
- Arabic RTL web dashboard.
- User financial summary cards.
- Transaction list and transaction creation.
- Expense categorization.
- Income and expense analytics.
- Top expense chart.
- Expense distribution chart.
- Siraj AI assistant page.
- Reports page.
- Settings page.
- Light/dark mode.
- Bank data ingestion using test data.
- AI-generated financial recommendations.
- Financial health score.
- Transfer flow with confirmation.

### AI/advanced features
- Saudi dialect NLP.
- Intent detection for banking commands.
- Personalized savings plans.
- Seasonal expense prediction.
- Proactive financial risk alerts.
- Unused subscription detection.
- Automated navigation based on user intent.
- Real-time financial insights.

### Backend/integration features
- Secure database for accounts, cards, transactions, and transfers.
- API layer between frontend and backend.
- Balance retrieval.
- Transfer execution.
- Transaction history updates.
- AI service endpoint.
- Error handling for API operations.
- Privacy and security controls.
