# SIRAJ MVP BUILD PLAN
## Detailed Task List & File Structure (48 Hours)

---

## REPOSITORY STRUCTURE

```
siraj-hackathon/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AIInsight.jsx
│   │   │   ├── CoachChat.jsx
│   │   │   ├── HealthScore.jsx
│   │   │   ├── TransactionList.jsx
│   │   │   ├── AlertsPanel.jsx
│   │   │   └── Navigation.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Coach.jsx
│   │   │   ├── Alerts.jsx
│   │   │   ├── Transactions.jsx
│   │   │   └── Settings.jsx
│   │   ├── hooks/
│   │   │   ├── useApi.js
│   │   │   └── useFinancialData.js
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── formatters.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── transactions.py
│   │   │   ├── analysis.py
│   │   │   └── coach.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── financial_analyzer.py
│   │   │   ├── ai_service.py
│   │   │   └── cache.py
│   │   └── db/
│   │       ├── __init__.py
│   │       ├── database.py
│   │       └── seed.py
│   ├── .env.example
│   ├── requirements.txt
│   ├── seed_data.json
│   ├── system_prompts.json
│   └── README.md
│
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── AI_PROMPTS.md
│   └── SETUP.md
│
├── .gitignore
└── README.md
```

---

## HOUR-BY-HOUR TASK BREAKDOWN

### DAY 1 - HOURS 1-4: FOUNDATION

#### HOUR 1 - Setup (All Team Members)

**Frontend (Frontend Lead)**
```bash
# Create React project
npx create-react-app siraj-frontend
cd siraj-frontend

# Install dependencies
npm install axios react-router-dom lucide-react tailwindcss
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Tasks:**
- [ ] Create `/src/pages`, `/src/components`, `/src/hooks`, `/src/utils` folders
- [ ] Create `.env.example`: `REACT_APP_API_URL=http://localhost:8000`
- [ ] Set up Tailwind config with Alinma colors

**File to create: `src/tailwind.config.js`**
```js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#003B5C",
        secondary: "#00966C",
        accent: "#19A7A8",
        success: "#16A34A",
        warning: "#F59E0B",
        danger: "#DC2626",
      },
      spacing: {
        "2": "0.5rem",
        "4": "1rem",
        "8": "2rem",
      },
      borderRadius: {
        "md": "8px",
        "lg": "16px",
      }
    },
  },
  plugins: [],
};
```

**Backend (Tech Lead)**
```bash
# Create project
mkdir siraj-backend && cd siraj-backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Create FastAPI project
pip install fastapi uvicorn sqlalchemy python-dotenv anthropic

# Create file structure
mkdir app && mkdir app/routes && mkdir app/services && mkdir app/db && mkdir app/models
```

**Tasks:**
- [ ] Create `requirements.txt`
- [ ] Create `.env.example`
- [ ] Create `app/main.py` (FastAPI app initialization)
- [ ] Create `app/db/database.py` (SQLite setup)

**AI/ML Engineer**
- [ ] Set up Claude API key in `.env`
- [ ] Test API connection with simple curl
- [ ] Create `/system_prompts.json` file (will be filled in Hour 3)

---

#### HOUR 2 - Backend Core (Tech Lead + 1 Backend Engineer)

**File: `app/main.py`**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import init_db
from app.routes import transactions, analysis, coach

app = FastAPI(title="Siraj API")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://siraj-frontend.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
init_db()

# Routes
app.include_router(transactions.router, prefix="/api/transactions")
app.include_router(analysis.router, prefix="/api/analysis")
app.include_router(coach.router, prefix="/api/coach")

@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**File: `app/db/database.py`**
```python
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import sqlite3
from datetime import datetime

DATABASE_URL = "sqlite:///./siraj.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    balance = Column(Float, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    amount = Column(Float)
    category = Column(String)
    description = Column(String)
    date = Column(DateTime, default=datetime.utcnow)
    is_recurring = Column(Boolean, default=False)

class Subscription(Base):
    __tablename__ = "subscriptions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    name = Column(String)
    amount = Column(Float)
    frequency = Column(String)  # monthly, yearly
    last_charge = Column(DateTime)
    next_charge = Column(DateTime)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

**File: `app/routes/transactions.py`**
```python
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db, Transaction, User
from datetime import datetime, timedelta
from pydantic import BaseModel

router = APIRouter()

class TransactionSchema(BaseModel):
    user_id: int
    amount: float
    category: str
    description: str
    date: datetime = datetime.utcnow()

@router.get("/{user_id}")
def get_transactions(
    user_id: int,
    days: int = Query(30, ge=1, le=365),
    category: str = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Transaction).filter(Transaction.user_id == user_id)
    
    if category:
        query = query.filter(Transaction.category == category)
    
    start_date = datetime.utcnow() - timedelta(days=days)
    query = query.filter(Transaction.date >= start_date)
    
    transactions = query.order_by(Transaction.date.desc()).all()
    return {
        "transactions": transactions,
        "count": len(transactions),
        "date_range": days
    }

@router.get("/{user_id}/summary")
def get_transaction_summary(
    user_id: int,
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db)
):
    start_date = datetime.utcnow() - timedelta(days=days)
    
    transactions = db.query(Transaction).filter(
        Transaction.user_id == user_id,
        Transaction.date >= start_date
    ).all()
    
    # Group by category
    by_category = {}
    total_spent = 0
    total_income = 0
    
    for txn in transactions:
        if txn.amount < 0:
            total_spent += abs(txn.amount)
            category = txn.category or "Other"
            by_category[category] = by_category.get(category, 0) + abs(txn.amount)
        else:
            total_income += txn.amount
    
    return {
        "total_income": total_income,
        "total_spent": total_spent,
        "net_savings": total_income - total_spent,
        "by_category": by_category,
        "transaction_count": len(transactions),
        "days": days
    }

@router.post("/{user_id}")
def add_transaction(
    user_id: int,
    transaction: TransactionSchema,
    db: Session = Depends(get_db)
):
    db_transaction = Transaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction
```

**Tasks:**
- [ ] Create routes file stubs: `/app/routes/analysis.py`, `/app/routes/coach.py`
- [ ] Stub them with empty routers (will fill in Hour 3)
- [ ] Create `seed_data.json` with sample transactions

**File: `seed_data.json` (sample)**
```json
{
  "user": {
    "id": 1,
    "name": "أحمد السعيدي",
    "email": "ahmed@example.com",
    "balance": 15000
  },
  "transactions": [
    {"user_id": 1, "amount": -450, "category": "Restaurants", "description": "Starbucks", "date": "2024-01-15"},
    {"user_id": 1, "amount": -1200, "category": "Groceries", "description": "Carrefour", "date": "2024-01-14"},
    {"user_id": 1, "amount": 5000, "category": "Income", "description": "Salary", "date": "2024-01-10"},
    {"user_id": 1, "amount": -99, "category": "Subscriptions", "description": "Netflix", "date": "2024-01-05"}
  ]
}
```

---

#### HOUR 3 - Database Seeding & Frontend Setup (Both Teams)

**Backend: `app/db/seed.py`**
```python
import json
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, User, Transaction, init_db
from datetime import datetime

def seed_data():
    init_db()
    db = SessionLocal()
    
    # Load seed data
    with open('seed_data.json') as f:
        data = json.load(f)
    
    # Check if user exists
    existing = db.query(User).filter(User.id == 1).first()
    if existing:
        return
    
    # Create user
    user = User(**data['user'])
    db.add(user)
    db.commit()
    
    # Add transactions
    for txn in data['transactions']:
        txn['date'] = datetime.fromisoformat(txn['date'])
        transaction = Transaction(**txn)
        db.add(transaction)
    
    db.commit()
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_data()
```

**Run:**
```bash
python -m app.db.seed
```

**Frontend: `src/utils/api.js`**
```javascript
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
};

export const transactionsApi = {
  getTransactions: (userId, days = 30) => 
    apiCall(`/transactions/${userId}?days=${days}`),
  getSummary: (userId, days = 30) => 
    apiCall(`/transactions/${userId}/summary?days=${days}`),
};

export const analysisApi = {
  getHealthScore: (userId) => apiCall(`/analysis/${userId}/health-score`),
  getInsights: (userId) => apiCall(`/analysis/${userId}/insights`),
};

export const coachApi = {
  ask: (userId, question) => 
    apiCall(`/coach/ask`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId, question }),
    }),
};
```

**Frontend: `src/App.jsx`**
```jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Coach from './pages/Coach';
import Alerts from './pages/Alerts';
import Transactions from './pages/Transactions';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coach" element={<Coach />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
```

**Frontend: `src/components/Layout.jsx`**
```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, MessageCircle, AlertCircle, List, Settings } from 'lucide-react';

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <nav className="w-64 bg-primary text-white p-8 flex flex-col">
        <h1 className="text-2xl font-bold mb-8">سراج</h1>
        
        <div className="space-y-4 flex-1">
          <NavLink icon={<Home />} label="Dashboard" to="/" />
          <NavLink icon={<MessageCircle />} label="Coach" to="/coach" />
          <NavLink icon={<AlertCircle />} label="Alerts" to="/alerts" />
          <NavLink icon={<List />} label="Transactions" to="/transactions" />
        </div>
        
        <NavLink icon={<Settings />} label="Settings" to="/settings" />
      </nav>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({ icon, label, to }) {
  return (
    <Link to={to} className="flex items-center space-x-3 p-4 rounded-lg hover:bg-opacity-80 hover:bg-secondary transition">
      {icon}
      <span>{label}</span>
    </Link>
  );
}
```

**Tasks:**
- [ ] `npm start` - Verify frontend runs on localhost:3000
- [ ] `python app/main.py` - Verify backend runs on localhost:8000
- [ ] Test `/health` endpoint in Postman

---

#### HOUR 4 - API Core & Health Score Calculation (Backend Team)

**File: `app/services/financial_analyzer.py`**
```python
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.db.database import Transaction

class FinancialAnalyzer:
    def __init__(self, db: Session, user_id: int):
        self.db = db
        self.user_id = user_id
    
    def calculate_health_score(self, days: int = 90) -> dict:
        """Calculate financial health score (0-100)"""
        start_date = datetime.utcnow() - timedelta(days=days)
        
        transactions = self.db.query(Transaction).filter(
            Transaction.user_id == self.user_id,
            Transaction.date >= start_date
        ).all()
        
        if not transactions:
            return {"score": 50, "reason": "Not enough data"}
        
        # Calculate metrics
        total_income = sum(t.amount for t in transactions if t.amount > 0)
        total_spent = sum(abs(t.amount) for t in transactions if t.amount < 0)
        
        savings_rate = (total_income - total_spent) / total_income if total_income > 0 else 0
        
        # Detect recurring (subscriptions)
        recurring_count = sum(1 for t in transactions if t.is_recurring)
        
        # Calculate score (simplified)
        score = 50
        
        # Positive factors
        if savings_rate > 0.2:
            score += 20  # Good savings rate
        if savings_rate > 0.15:
            score += 10
        
        # Negative factors
        if recurring_count > 5:
            score -= 10  # Too many subscriptions
        
        score = max(0, min(100, score))
        
        return {
            "score": score,
            "savings_rate": round(savings_rate * 100, 1),
            "total_income": total_income,
            "total_spent": total_spent,
            "recurring_charges": recurring_count,
            "days_analyzed": days
        }

def get_financial_analyzer(db: Session, user_id: int):
    return FinancialAnalyzer(db, user_id)
```

**File: `app/routes/analysis.py`**
```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.financial_analyzer import FinancialAnalyzer

router = APIRouter()

@router.get("/{user_id}/health-score")
def get_health_score(user_id: int, days: int = 90, db: Session = Depends(get_db)):
    analyzer = FinancialAnalyzer(db, user_id)
    return analyzer.calculate_health_score(days)

@router.get("/{user_id}/insights")
def get_insights(user_id: int, db: Session = Depends(get_db)):
    analyzer = FinancialAnalyzer(db, user_id)
    metrics = analyzer.calculate_health_score()
    
    return {
        "health_score": metrics,
        "message": f"Your financial health score is {metrics['score']}/100. You're saving {metrics['savings_rate']}% of your income."
    }
```

**Tasks:**
- [ ] Test endpoints: `curl http://localhost:8000/api/analysis/1/health-score`
- [ ] Verify response format
- [ ] Document API structure

---

### DAY 1 - HOURS 5-8: FRONTEND BUILD

#### HOUR 5-6 - Dashboard Component (Frontend Lead)

**File: `src/pages/Home.jsx`**
```jsx
import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import AIInsight from '../components/AIInsight';
import { transactionsApi, analysisApi } from '../utils/api';

export default function Home() {
  const userId = 1;  // Hardcoded for MVP
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summary, health] = await Promise.all([
          transactionsApi.getSummary(userId, 30),
          analysisApi.getHealthScore(userId, 30),
        ]);
        
        setData({
          summary,
          health,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId]);
  
  if (loading) return <div className="text-center p-8">جاري التحميل...</div>;
  if (error) return <div className="text-red-600 p-8">خطأ: {error}</div>;
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-8 md:grid-cols-1">
        {/* Health Score Card */}
        <div className="bg-white rounded-lg p-8 shadow-sm border-l-4 border-accent">
          <h3 className="text-gray-600 text-sm mb-2">درجة الصحة المالية</h3>
          <div className="flex items-end space-x-4">
            <span className="text-5xl font-bold text-primary">{data.health.score}</span>
            <span className="text-gray-500 mb-2">/100</span>
          </div>
          <p className="text-green-600 text-sm mt-4">
            معدل الادخار: {data.health.savings_rate}%
          </p>
        </div>
        
        {/* Income Card */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-gray-600 text-sm mb-2">الدخل</h3>
          <p className="text-3xl font-bold text-secondary">{data.summary.total_income.toLocaleString()}</p>
          <p className="text-gray-500 text-xs mt-2">آخر 30 يوم</p>
        </div>
        
        {/* Spending Card */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-gray-600 text-sm mb-2">المصروفات</h3>
          <p className="text-3xl font-bold text-danger">{data.summary.total_spent.toLocaleString()}</p>
          <p className="text-gray-500 text-xs mt-2">آخر 30 يوم</p>
        </div>
      </div>
      
      {/* AI Insight */}
      <AIInsight userId={userId} data={data} />
      
      {/* Spending by Category */}
      <div className="bg-white rounded-lg p-8 shadow-sm">
        <h3 className="text-lg font-bold mb-6">المصروفات حسب الفئة</h3>
        <div className="space-y-3">
          {Object.entries(data.summary.by_category).map(([category, amount]) => (
            <div key={category} className="flex justify-between items-center">
              <span className="text-gray-700">{category}</span>
              <div className="flex items-center space-x-4">
                <div className="w-48 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full"
                    style={{
                      width: `${(amount / data.summary.total_spent) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-gray-600 w-24 text-right">
                  {amount.toLocaleString()} ر.س
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**File: `src/components/AIInsight.jsx`** (Placeholder for Hour 9)
```jsx
import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';

export default function AIInsight({ userId, data }) {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Will integrate AI in Hour 9
    setTimeout(() => {
      setInsight("معدل ادخارك جيد! استمر في الادخار.");
      setLoading(false);
    }, 1000);
  }, [userId]);
  
  if (loading) return null;
  
  return (
    <div className="bg-gradient-to-r from-accent to-secondary rounded-lg p-8 text-white">
      <div className="flex space-x-4">
        <Lightbulb className="flex-shrink-0 w-8 h-8" />
        <div>
          <h4 className="font-bold mb-2">رؤى ذكية من سراج</h4>
          <p>{insight}</p>
        </div>
      </div>
    </div>
  );
}
```

**Tasks:**
- [ ] `npm start` and verify Dashboard loads with data
- [ ] Check responsive design on mobile
- [ ] Verify API calls work

---

#### HOUR 7-8 - Additional Pages (Frontend Team)

**File: `src/pages/Transactions.jsx`**
```jsx
import React, { useState, useEffect } from 'react';
import { transactionsApi } from '../utils/api';

export default function Transactions() {
  const userId = 1;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    transactionsApi.getTransactions(userId, 90).then(data => {
      setTransactions(data.transactions);
      setLoading(false);
    });
  }, [userId]);
  
  if (loading) return <div>جاري التحميل...</div>;
  
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-8 border-b">
        <h2 className="text-2xl font-bold">المعاملات</h2>
      </div>
      
      <div className="divide-y">
        {transactions.map(txn => (
          <div key={txn.id} className="p-8 flex justify-between items-center hover:bg-gray-50">
            <div>
              <p className="font-bold">{txn.description}</p>
              <p className="text-gray-500 text-sm">{txn.category}</p>
              <p className="text-gray-400 text-xs">
                {new Date(txn.date).toLocaleDateString('ar-SA')}
              </p>
            </div>
            <p className={txn.amount > 0 ? 'text-green-600 font-bold' : 'text-danger font-bold'}>
              {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**File: `src/pages/Coach.jsx`** (Will be filled with AI in Hour 10)
```jsx
import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function Coach() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: 'مرحباً! أنا سراج، مساعدك المالي الذكي. كيف يمكنني مساعدتك اليوم؟'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { id: Date.now(), role: 'user', text: input }]);
    setInput('');
    setLoading(true);
    
    // Will integrate AI here in Hour 10
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        text: 'هذا سؤال جيد! دعني أحلل بياناتك المالية...'
      }]);
      setLoading(false);
    }, 1500);
  };
  
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-md rounded-lg p-4 ${
              msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      
      {/* Input */}
      <div className="p-8 border-t">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="اسأل سراج..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-accent text-white rounded-lg px-6 py-2 hover:opacity-80 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

**File: `src/pages/Alerts.jsx`**
```jsx
import React from 'react';
import { AlertCircle, TrendingUp, AlertTriangle } from 'lucide-react';

export default function Alerts() {
  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'مصروفات المطاعم ارتفعت',
      message: 'ارتفاع بنسبة 23% عن الشهر الماضي',
      icon: TrendingUp,
    },
    {
      id: 2,
      type: 'info',
      title: 'اشتراكات متشابهة',
      message: 'لديك عدة اشتراكات في نفس الفئة',
      icon: AlertTriangle,
    },
  ];
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-8">التنبيهات الذكية</h2>
      
      {alerts.map(alert => {
        const Icon = alert.icon;
        return (
          <div key={alert.id} className={`bg-white rounded-lg p-6 border-l-4 border-${
            alert.type === 'warning' ? 'warning' : 'info'
          } shadow-sm`}>
            <div className="flex space-x-4">
              <Icon className={`w-6 h-6 ${
                alert.type === 'warning' ? 'text-warning' : 'text-accent'
              }`} />
              <div className="flex-1">
                <h4 className="font-bold">{alert.title}</h4>
                <p className="text-gray-600 text-sm mt-1">{alert.message}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

---

### DAY 2 - HOURS 9-12: AI INTEGRATION

#### HOUR 9-10 - AI System Prompt & Coach (AI/ML Engineer)

**[See next file: `siraj_ai_system_prompt.md`]**

The AI engineer will use this time to:
- [ ] Refine system prompt with financial context
- [ ] Create `coach` endpoint in backend
- [ ] Test LLM responses with sample queries
- [ ] Integrate responses into frontend CoachChat component

---

#### HOUR 11-12 - Frontend AI Integration (Frontend Lead)

**Update `src/components/AIInsight.jsx` with real AI calls:**
```jsx
import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';
import { analysisApi } from '../utils/api';

export default function AIInsight({ userId, data }) {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    analysisApi.getInsights(userId).then(response => {
      setInsight(response.message);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [userId]);
  
  if (loading) return null;
  
  return (
    <div className="bg-gradient-to-r from-accent to-secondary rounded-lg p-8 text-white">
      <div className="flex space-x-4">
        <Lightbulb className="flex-shrink-0 w-8 h-8" />
        <div>
          <h4 className="font-bold mb-2">رؤى ذكية من سراج</h4>
          <p>{insight || 'جاري التحليل...'}</p>
        </div>
      </div>
    </div>
  );
}
```

**Update `src/pages/Coach.jsx` with real AI calls:**
```jsx
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { coachApi } from '../utils/api';

export default function Coach() {
  const userId = 1;
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: 'مرحباً! أنا سراج، مساعدك المالي الذكي. كيف يمكنني مساعدتك اليوم؟'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);
    
    try {
      const response = await coachApi.ask(userId, userMessage);
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        text: response.answer
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        text: 'عذراً، حدث خطأ في المعالجة. حاول مجدداً.'
      }]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-white rounded-lg shadow-sm">
      <div className="flex-1 overflow-y-auto p-8 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-md rounded-lg p-4 ${
              msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-center text-gray-500">سراج يكتب...</div>}
      </div>
      
      <div className="p-8 border-t">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="اسأل سراج..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-accent text-white rounded-lg px-6 py-2 hover:opacity-80 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

### DAY 2 - HOURS 13-16: POLISH & DEPLOYMENT

#### HOUR 13-14 - Bug Fixes & Optimization (All)
- [ ] Mobile responsiveness testing
- [ ] API error handling
- [ ] Loading states
- [ ] Edge cases

#### HOUR 15-16 - Deployment

**Frontend (Vercel):**
```bash
npm install -g vercel
vercel --prod
```

**Backend (Render.com or Railway):**
```bash
# Create requirements.txt
pip freeze > requirements.txt

# Create runtime.txt
echo "python-3.11.7" > runtime.txt

# Deploy via Git push
```

---

## CRITICAL FILES TO CREATE

| File | Purpose | By Hour |
|------|---------|---------|
| `app/main.py` | FastAPI entry point | 1 |
| `app/db/database.py` | Database models | 1 |
| `app/routes/transactions.py` | Transaction endpoints | 2 |
| `app/services/financial_analyzer.py` | Analysis logic | 4 |
| `app/db/seed.py` | Database seeding | 3 |
| `src/App.jsx` | React app | 3 |
| `src/pages/Home.jsx` | Dashboard | 5 |
| `src/pages/Coach.jsx` | Chat interface | 6 |
| `src/pages/Transactions.jsx` | Transaction list | 7 |
| `src/pages/Alerts.jsx` | Alerts display | 8 |
| `app/routes/coach.py` | AI coach endpoints | 10 |
| `app/routes/analysis.py` | Analysis endpoints | 4 |

---

## GIT COMMIT TIMELINE

```
Hour 1:  "Initial project setup - frontend & backend"
Hour 2:  "Database models and seeding"
Hour 3:  "Frontend layout and navigation"
Hour 4:  "Health score calculation"
Hour 5:  "Dashboard page"
Hour 6:  "Transaction and coach pages"
Hour 8:  "Alerts and settings"
Hour 10: "AI coach integration"
Hour 12: "Bug fixes and optimization"
Hour 14: "Frontend deployment to Vercel"
Hour 15: "Backend deployment to Render"
Hour 16: "Final integration test"
```

---

## COMMAND QUICK REFERENCE

**Frontend:**
```bash
cd siraj-frontend
npm install
npm start  # Port 3000
```

**Backend:**
```bash
cd siraj-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m app.db.seed
python app/main.py  # Port 8000
```

**Test API:**
```bash
# Get health score
curl http://localhost:8000/api/analysis/1/health-score

# Get transactions
curl http://localhost:8000/api/transactions/1

# Ask coach
curl -X POST http://localhost:8000/api/coach/ask \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "question": "هل يمكنني شراء سيارة؟"}'
```

---

This plan is designed for a **48-hour hackathon**. Adjust timing based on your actual event duration.
