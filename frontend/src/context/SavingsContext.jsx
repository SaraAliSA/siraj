import React, { createContext, useState } from 'react';

export const SavingsContext = createContext(null);

const initialPlans = [
  { id: 1, name: 'رحلة العمرة', target: 20000, saved: 13600, monthly: 1200, months: 6, nextDate: '1 أغسطس' },
  { id: 2, name: 'سيارة جديدة', target: 40000, saved: 12500, monthly: 2200, months: 18, nextDate: '5 أغسطس' },
  { id: 3, name: 'صندوق الطوارئ', target: 15000, saved: 15000, monthly: 500, months: 0, nextDate: null },
];

export const SavingsProvider = ({ children }) => {
  const [plans, setPlans] = useState(initialPlans);

  const addPlan = (name, monthlyAmount) => {
    const newPlan = {
      id: Date.now(),
      name,
      target: Number(monthlyAmount) * 12,
      saved: 0,
      monthly: Number(monthlyAmount),
      months: 12,
      nextDate: 'الشهر القادم',
    };
    setPlans((prev) => [newPlan, ...prev]);
    return newPlan;
  };

  return (
    <SavingsContext.Provider value={{ plans, setPlans, addPlan }}>
      {children}
    </SavingsContext.Provider>
  );
};