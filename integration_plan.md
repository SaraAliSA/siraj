# خطة التكامل والربط المحدثة (Updated Integration & Alignment Plan)

توضح هذه الخطة كيفية ربط وتطابق كافة نقاط النهاية (Endpoints) العشرة المحددة في ملف [api_endpoints.md](file:///d:/amd/siraj/api_endpoints.md) مع ملفات الخدمات والصفحات المعرفة في [service_integration.md](file:///d:/amd/siraj/service_integration.md) للواجهة الأمامية (React + Vite).

---

## 🔒 1. إدارة الهوية والمصادقة (Authentication Module)

*   **نقاط النهاية (Backend API)**:
    *   `POST /api/v1/auth/register` (إنشاء مستخدم)
    *   `POST /api/v1/auth/login` (التحقق وتوليد الرمز)
    *   `GET /api/v1/auth/me` (الملف الشخصي الحالي)
*   **ملف واجهة العميل (React)**: [AuthContext.jsx](file:///d:/amd/siraj/frontend/src/context/AuthContext.jsx) & [LoginPage.jsx](file:///d:/amd/siraj/frontend/src/pages/LoginPage.jsx)
*   **خريطة الحقول المرسلة والمستلمة**:
    *   *تسجيل الدخول*: يرسل `email` و `password` ويستقبل `access_token` و `user` (يحتوي `full_name`, `email`, `currency`).
    *   *التخزين والحماية*: يتم حفظ الرمز باسم `siraj_token` في الـ `localStorage`. ويقوم [client.js](file:///d:/amd/siraj/frontend/src/api/client.js) بحقنه تلقائياً كترويسة `Authorization: Bearer <token>` في كافة الطلبات اللاحقة.

---

## 📊 2. لوحة التحكم والإحصائيات (Dashboard Module)

*   **نقاط النهاية (Backend API)**:
    *   `GET /api/v1/dashboard/overview` (الملخص المالي العام)
    *   `GET /api/v1/dashboard/category-breakdown` (توزيع الفئات)
    *   `GET /api/v1/dashboard/health-score` (مؤشر الصحة المالي)
    *   `GET /api/v1/dashboard/daily-tip` (نصيحة سراج اليومية)
    *   `GET /api/v1/dashboard/alerts/active` (التنبيهات غير المقروءة)
    *   `GET /api/v1/dashboard/goals/summary` (ملخص الأهداف)
*   **ملف واجهة العميل (React)**: [DashboardPage.jsx](file:///d:/amd/siraj/frontend/src/pages/DashboardPage.jsx)
*   **خريطة الحقول المرسلة والمستلمة**:
    *   *ملخص لوحة التحكم*: يستقبل `total_income`, `total_expense`, `total_savings`, `savings_rate` ويتم تمثيلها في كروت الأداء الأربعة (KPI Cards).
    *   *المخططات (Recharts)*: تستقبل مصفوفة `category-breakdown` وتوزعها في الرسم البياني الدائري (PieChart) ورسم الأعمدة (BarChart).
    *   *مؤشر الصحة*: يستقبل `score` و `grade` و `insights` لعرض مقياس الصحة الملون.

---

## 💸 3. المعاملات المالية (Transactions Module)

*   **نقاط النهاية (Backend API)**:
    *   `GET /api/v1/transactions/` (سجل وحركة المعاملات)
    *   `POST /api/v1/transactions/` (إضافة معاملة جديدة)
    *   `DELETE /api/v1/transactions/{id}` (حذف معاملة)
*   **ملف واجهة العميل (React)**: [TransactionsPage.jsx](file:///d:/amd/siraj/frontend/src/pages/TransactionsPage.jsx)
*   **خريطة الحقول المرسلة والمستلمة**:
    *   *البحث والترشيح*: يتم إرسال معلمات تصفية ديناميكية في رابط الطلب (Query Params) مثل `type` (دخل/مصروف)، `category` (فئة الصرف)، و `start_date` / `end_date`.
    *   *الحفظ*: يرسل جسم الطلب (JSON Body) بالمقادير: `amount`, `category`, `type`, `description`, `transaction_date`.

---

## 📈 4. الميزانيات التقديرية (Budgets Module)

*   **نقاط النهاية (Backend API)**:
    *   `GET /api/v1/budgets/` (عرض الميزانيات)
    *   `POST /api/v1/budgets/` (تحديث أو تحديد ميزانية)
    *   `GET /api/v1/budgets/analysis` (المقارنة مع الصرف الفعلي)
*   **ملف واجهة العميل (React)**: متكامل مع لوحة التحكم [DashboardPage.jsx](file:///d:/amd/siraj/frontend/src/pages/DashboardPage.jsx) وصفحة الإشعارات [AlertsPage.jsx](file:///d:/amd/siraj/frontend/src/pages/AlertsPage.jsx).
*   **خريطة الحقول المرسلة والمستلمة**:
    *   *التحليل*: يستعلم النظام عن العلاقة بين الميزانية المقررة للفئة ومقدار الصرف الفعلي هذا الشهر لإطلاق تنبيهات التجاوز تلقائياً.

---

## 🏦 5. الحلول التمويلية الإسلامية (Financing Module)

*   **نقاط النهاية (Backend API)**:
    *   `GET /api/v1/financing/products` (المنتجات المتاحة)
    *   `POST /api/v1/financing/requests` (تقديم طلب تمويل)
    *   `GET /api/v1/financing/requests` (طلبات المستخدم)
    *   `GET /api/v1/financing/requests/{id}` (تفاصيل حالة طلب)
*   **ملف واجهة العميل (React)**: [FinancingPage.jsx](file:///d:/amd/siraj/frontend/src/pages/FinancingPage.jsx)
*   **خريطة الحقول المرسلة والمستلمة**:
    *   *التقديم*: يرسل `product_type` (شخصي، سيارات، عقاري)، و `amount` (المبلغ المطلق)، و `term_months` (مدة السداد بالشهور).
    *   *السجل*: يعرض جدول الطلبات وحالاتها المحدثة تلقائياً من خادم البيانات (`pending`, `approved`, `rejected`).

---

## 💰 6. الفرص الاستثمارية (Investment Module)

*   **نقاط النهاية (Backend API)**:
    *   `GET /api/v1/investment/opportunities` (الفرص المتاحة)
    *   `POST /api/v1/investment/requests` (طلب اشتراك في فرصة)
    *   `GET /api/v1/investment/requests` (الاستثمارات الحالية)
    *   `GET /api/v1/investment/recommendations` (التوصيات المدعومة بالذكاء الاصطناعي)
*   **ملف واجهة العميل (React)**: [InvestmentPage.jsx](file:///d:/amd/siraj/frontend/src/pages/InvestmentPage.jsx)
*   **خريطة الحقول المرسلة والمستلمة**:
    *   *التوصية*: تستقبل الواجهة بيانات التوصية المخصصة من الباك اند والتي تحتوي `product_name`, `product_type`, `expected_return` مع التبرير المالي المكتوب بواسطة الذكاء الاصطناعي في حقل `recommendation_reason`.

---

## 🎯 7. خطط الادخار والمستهدفات (Savings Module)

*   **نقاط النهاية (Backend API)**:
    *   `GET /api/v1/savings/plans` (عرض خطط الادخار)
    *   `POST /api/v1/savings/plans` (إنشاء خطة ادخار)
    *   `PUT /api/v1/savings/plans/{id}` (تحديث مبلغ الادخار)
    *   `GET /api/v1/savings/plans/{id}/progress` (التنبؤ الإحصائي للنمو)
*   **ملف واجهة العميل (React)**: [SavingsPage.jsx](file:///d:/amd/siraj/frontend/src/pages/SavingsPage.jsx)
*   **خريطة الحقول المرسلة والمستلمة**:
    *   *التحديث*: يرسل `current_amount` الجديد لتعديل نسبة اكتمال الهدف.
    *   *التنبؤ بالنمو*: يستقبل تقديرات الوقت المتبقي (`months_to_target`) وحالة الخطة المجدولة (`is_on_track`).

---

## 🕋 8. التخطيط للأهداف الموسمية (Goals Module)

*   **نقاط النهاية (Backend API)**:
    *   `GET /api/v1/goals/` (الأهداف الحالية)
    *   `GET /api/v1/goals/templates` (القوالب الجاهزة للحج والعمرة)
    *   `POST /api/v1/goals/` (إنشاء هدف شخصي/موسمي)
    *   `POST /api/v1/goals/{id}/plan` (توليد الخطة بالذكاء الاصطناعي)
*   **ملف واجهة العميل (React)**: [GoalsPage.jsx](file:///d:/amd/siraj/frontend/src/pages/GoalsPage.jsx)
*   **خريطة الحقول المرسلة والمستلمة**:
    *   *خطوات الخطة الذكية*: يستقبل حقل `plan_details` الذي يحتوي مصفوفة `budget_shifts` (الاستقطاعات المقترحة) و `tips` (إرشادات الاستهلاك الذكي).

---

## 🔔 9. التنبيهات وإعدادات الأمان (Smart Alerts Module)

*   **نقاط النهاية (Backend API)**:
    *   `GET /api/v1/alerts/` (سجل التنبيهات المكتشفة)
    *   `POST /api/v1/alerts/` (وضع حد مالي مخصص للتنبيه)
    *   `PUT /api/v1/alerts/{id}/read` (تحديث التنبيه كمقروء)
    *   `GET /api/v1/alerts/unread-count` (عدد التنبيهات النشطة)
*   **ملف واجهة العميل (React)**: [AlertsPage.jsx](file:///d:/amd/siraj/frontend/src/pages/AlertsPage.jsx) & [AlertContext.jsx](file:///d:/amd/siraj/frontend/src/context/AlertContext.jsx)
*   **خريطة الحقول المرسلة والمستلمة**:
    *   يتم الاستعلام بصفة دورية (Polling كل 30 ثانية) لتحديث شارة التنبيهات الحمراء في الشريط العلوي وقائمة السايدبار.

---

## 💬 10. محادثة سراج الذكية (AI Chatbot Module)

*   **نقاط النهاية (Backend API)**:
    *   `POST /api/v1/chat/sessions` (بدء جلسة حوار)
    *   `GET /api/v1/chat/sessions` (سجل الجلسات السابقة)
    *   `GET /api/v1/chat/sessions/{id}/messages` (تاريخ الرسائل للدردشة)
    *   `POST /api/v1/chat/sessions/{id}/messages` (البث المباشر المعتمد على SSE)
*   **ملف واجهة العميل (React)**: [SirajAIPage.jsx](file:///d:/amd/siraj/frontend/src/pages/SirajAIPage.jsx)
*   **خريطة الحقول المرسلة والمستلمة**:
    *   يتم استهلاك دفق البيانات (SSE chunked stream) وعرض الكلمات ديناميكياً مع تفعيل مؤشر التحليل الذكي للشبكة عند تحرير الأدوات.
