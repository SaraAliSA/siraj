import React, { createContext, useState } from 'react';

export const AlertsContext = createContext(null);

const alertTypes = {
  budget: { label: 'تجاوز الميزانية', color: '#dc2626' },
  spike: { label: 'ارتفاع مفاجئ بالإنفاق', color: '#d97706' },
  bill: { label: 'فاتورة مستحقة', color: '#2563eb' },
  goal: { label: 'إنجاز هدف', color: '#16a34a' },
};

const initialAlerts = [
  { id: 1, type: 'budget', title: 'تجاوزت ميزانية الترفيه', desc: 'صرفت 1,200 ر.س من أصل 900 ر.س المخصصة هذا الشهر', time: 'قبل ساعتين', unread: true },
  { id: 2, type: 'spike', title: 'ارتفاع بمصروفات التسوق', desc: 'زاد إنفاقك بفئة التسوق 45% مقارنة بالشهر الماضي', time: 'اليوم', unread: true },
  { id: 3, type: 'bill', title: 'فاتورة الكهرباء مستحقة', desc: 'باقي 3 أيام على موعد سداد فاتورة الكهرباء', time: 'أمس', unread: false },
  { id: 4, type: 'goal', title: 'اقتربت من هدف الادخار', desc: 'وصلت لـ 90% من هدف "رحلة العمرة"', time: 'قبل يومين', unread: false },
];

export const AlertsProvider = ({ children }) => {
  const [alerts, setAlerts] = useState(initialAlerts);

  const markAsRead = (id) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, unread: false } : a)));
  };

  const addAlert = (alert) => {
    setAlerts((prev) => [{ id: Date.now(), unread: true, time: 'الآن', ...alert }, ...prev]);
  };

  const unreadCount = alerts.filter((a) => a.unread).length;

  return (
    <AlertsContext.Provider value={{ alerts, alertTypes, markAsRead, addAlert, unreadCount }}>
      {children}
    </AlertsContext.Provider>
  );
};