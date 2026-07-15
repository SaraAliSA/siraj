# توثيق خدمات الفرونت اند والربط مع الخادم (Frontend Services & API Connections)

يوضح هذا الملف تفاصيل ربط وتكامل مكونات الواجهة الأمامية (React + Vite) مع خادم الخدمات الخلفية (FastAPI) في تطبيق **سراج**.

---

## 🔑 1. خدمة المصادقة والهوية (Authentication Service)
*   **الملف البرمجي**: [AuthContext.jsx](file:///d:/amd/siraj/frontend/src/context/AuthContext.jsx)
*   **العميل المستخدم**: `apiClient` في [client.js](file:///d:/amd/siraj/frontend/src/api/client.js)

| الوظيفة (Action) | طريقة الطلب (Method) | مسار الخدمة (API Endpoint) | البيانات المرسلة (Payload) | البيانات المستلمة (Response) |
| :--- | :--- | :--- | :--- | :--- |
| تسجيل مستخدم جديد | `POST` | `/api/v1/auth/register` | `email`, `full_name`, `password`, `currency` | بيانات المستخدم الجديد |
| تسجيل الدخول والتحقق | `POST` | `/api/v1/auth/login` | `email`, `password` | `access_token` (JWT), `user` |
| الملف الشخصي الحالي | `GET` | `/api/v1/auth/me` | *ترويسة المصادقة* | تفاصيل المستخدم الحالي |

---

## 📊 2. خدمة لوحة التحكم (Dashboard Service)
*   **الملف البرمجي**: [DashboardPage.jsx](file:///d:/amd/siraj/frontend/src/pages/DashboardPage.jsx)

| الوظيفة (Action) | طريقة الطلب (Method) | مسار الخدمة (API Endpoint) | البيانات المستعلم عنها / المستلمة |
| :--- | :--- | :--- | :--- |
| الملخص المالي العام | `GET` | `/api/v1/dashboard/overview` | `total_income`, `total_expense`, `total_savings`, `savings_rate` |
| توزيع المصاريف للفئات | `GET` | `/api/v1/dashboard/category-breakdown` | مصفوفة الفئات والمبالغ ونسبها المئوية |
| مؤشر الصحة المالي | `GET` | `/api/v1/dashboard/health-score` | الدرجة الرقمية (0-100)، والتقدير اللفظي، والتوصيات |
| نصيحة الذكاء الاصطناعي اليومية | `GET` | `/api/v1/dashboard/daily-tip` | نصيحة مالية يومية مخصصة ومصاغة بالعامية السعودية |

---

## 💸 3. خدمة المعاملات المالية (Transactions Service)
*   **الملف البرمجي**: [TransactionsPage.jsx](file:///d:/amd/siraj/frontend/src/pages/TransactionsPage.jsx)

| الوظيفة (Action) | طريقة الطلب (Method) | مسار الخدمة (API Endpoint) | المدخلات / المعلمات المرسلة (Params) |
| :--- | :--- | :--- | :--- |
| عرض وتصفية المعاملات | `GET` | `/api/v1/transactions/` | معلمات البحث: `start_date`, `end_date`, `category`, `type` |
| إضافة معاملة جديدة | `POST` | `/api/v1/transactions/` | جسم الطلب: `amount`, `category`, `type`, `description`, `transaction_date` |
| حذف معاملة مالية | `DELETE` | `/api/v1/transactions/{id}` | معرف المعاملة (UUID) الممرر في الرابط |

---

## 📈 4. خدمة الميزانيات (Budgets Service)
*   **ملف الدمج**: [DashboardPage.jsx](file:///d:/amd/siraj/frontend/src/pages/DashboardPage.jsx) & [AlertsPage.jsx](file:///d:/amd/siraj/frontend/src/pages/AlertsPage.jsx)

| الوظيفة (Action) | طريقة الطلب (Method) | مسار الخدمة (API Endpoint) | نوع البيانات المتداولة |
| :--- | :--- | :--- | :--- |
| عرض حدود الفئات | `GET` | `/api/v1/budgets/` | قائمة الميزانيات المحددة لكل فئة ومقدار الحد المالي |
| ضبط حد ميزانية جديد | `POST` | `/api/v1/budgets/` | إرسال: `category`, `limit_amount`, `period` (شهري) |
| مقارنة الميزانية بالإنفاق الفعلي | `GET` | `/api/v1/budgets/analysis` | المقارنة بين الميزانية المقررة والمبالغ المستهلكة فعلياً |

---

## 🏦 5. خدمة الحلول التمويلية (Financing Service)
*   **الملف البرمجي**: [FinancingPage.jsx](file:///d:/amd/siraj/frontend/src/pages/FinancingPage.jsx)

| الوظيفة (Action) | طريقة الطلب (Method) | مسار الخدمة (API Endpoint) | التفاصيل والبيانات المتداولة |
| :--- | :--- | :--- | :--- |
| استعراض منتجات التمويل الإسلامي | `GET` | `/api/v1/financing/products` | جلب المنتجات المتاحة ونسب المرابحة السنوية وفترات السداد |
| تقديم طلب تمويل جديد | `POST` | `/api/v1/financing/requests` | إرسال: `product_type`, `amount`, `term_months`, `notes` |
| سجل طلبات التمويل | `GET` | `/api/v1/financing/requests` | استرجاع الطلبات السابقة للمستخدم وحالة دراستها الحالية |

---

## 💰 6. خدمة الفرص الاستثمارية (Investment Service)
*   **الملف البرمجي**: [InvestmentPage.jsx](file:///d:/amd/siraj/frontend/src/pages/InvestmentPage.jsx)

| الوظيفة (Action) | طريقة الطلب (Method) | مسار الخدمة (API Endpoint) | التفاصيل والبيانات المتداولة |
| :--- | :--- | :--- | :--- |
| استعراض الفرص النشطة | `GET` | `/api/v1/investment/opportunities` | قائمة الصكوك والصناديق العقارية والاستثمارية المتاحة |
| الاكتتاب والاشتراك في فرصة | `POST` | `/api/v1/investment/requests` | إرسال: `product_name`, `product_type`, `amount`, `risk_level`, `expected_return` |
| المحفظة الاستثمارية النشطة | `GET` | `/api/v1/investment/requests` | قائمة بالاستثمارات القائمة للمستخدم ومبالغها الحالية |
| توصيات سراج الاستثمارية الذكية | `GET` | `/api/v1/investment/recommendations` | جلب توصيات منسقة بالذكاء الاصطناعي (`rec.opportunity` و `rec.rationale`) |

---

## 🎯 7. خطط الادخار والأهداف الموسمية (Savings & Goals Service)
*   **الملف البرمجي**: [SavingsPage.jsx](file:///d:/amd/siraj/frontend/src/pages/SavingsPage.jsx) & [GoalsPage.jsx](file:///d:/amd/siraj/frontend/src/pages/GoalsPage.jsx)

| الوظيفة (Action) | طريقة الطلب (Method) | مسار الخدمة (API Endpoint) | التفاصيل والبيانات المتداولة |
| :--- | :--- | :--- | :--- |
| عرض خطط الادخار الحالية | `GET` | `/api/v1/savings/plans` | قائمة أهداف الادخار ونسبة تحقيق التقدم الحالية |
| إنشاء حصالة ادخارية جديدة | `POST` | `/api/v1/savings/plans` | إرسال: `goal_name`, `target_amount`, `current_amount`, `target_date`, `monthly_contribution` |
| جلب قوالب الأهداف الموسمية | `GET` | `/api/v1/goals/templates` | قوالب الحج والعمرة والزواج مع عوائد المقترحات (`tpl.title`, `tpl.default_target_amount`) |
| توليد خطة ذكية بالذكاء الاصطناعي | `POST` | `/api/v1/goals/{id}/plan` | طلب خطة توجيهية للهدف لتوفير مبالغ إضافية من الميزانية |

---

## 🔔 8. خدمة التنبيهات وإعدادات الأمان (Smart Alerts Service)
*   **الملف البرمجي**: [AlertContext.jsx](file:///d:/amd/siraj/frontend/src/context/AlertContext.jsx) & [AlertsPage.jsx](file:///d:/amd/siraj/frontend/src/pages/AlertsPage.jsx)

| الوظيفة (Action) | طريقة الطلب (Method) | مسار الخدمة (API Endpoint) | آلية العمل والبيانات المتداولة |
| :--- | :--- | :--- | :--- |
| جلب التنبيهات والتحذيرات | `GET` | `/api/v1/alerts/` | قائمة التنبيهات المالية وسجل تخطي الميزانية |
| وضع علامة "مقروء" على التنبيه | `PUT` | `/api/v1/alerts/{id}/read` | تحديث حالة التنبيه بالمعرف الخاص به لإزالته من النشطة |
| عدد الإشعارات النشطة | `GET` | `/api/v1/alerts/unread-count` | تكرار الاستعلام بصفة دورية (Polling كل 30 ثانية) لتحديث شارات الشريط العلوي |

---

## 💬 9. خدمة محادثة مساعد سراج الذكي (AI Chatbot Service)
*   **الملف البرمجي**: [SirajAIPage.jsx](file:///d:/amd/siraj/frontend/src/pages/SirajAIPage.jsx)

| الوظيفة (Action) | طريقة الطلب (Method) | مسار الخدمة (API Endpoint) | آلية العمل والبيانات المتداولة |
| :--- | :--- | :--- | :--- |
| إنشاء جلسة محادثة جديدة | `POST` | `/api/v1/chat/sessions` | بدء جلسة جديدة وحفظ المعرف وتمرير عنوان الجلسة المقترح |
| عرض الجلسات الاستشارية السابقة | `GET` | `/api/v1/chat/sessions` | تحميل الأرشيف الزمني للمحادثات السابقة التي أجراها المستخدم |
| بث الردود بشكل حي وتفاعلي (SSE) | `POST` | `/api/v1/chat/sessions/{id}/messages` | إرسال رسالة العميل واستلام البث المباشر كلمة بكلمة (`ReadableStreamReader`) |
