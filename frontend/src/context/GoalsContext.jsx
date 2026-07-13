import React, { createContext, useState } from 'react';

export const GoalsContext = createContext(null);

const initialGoals = [
  { id: 1, name: 'عمرة رمضان', target: 6000, saved: 2400, emoji: '🌙' },
  { id: 2, name: 'مصاريف المدارس', target: 4000, saved: 3600, emoji: '🎒' },
];

export const GoalsProvider = ({ children }) => {
  const [goals, setGoals] = useState(initialGoals);

  const addGoal = (goal) => {
    setGoals((prev) => [{ id: Date.now(), saved: 0, ...goal }, ...prev]);
  };

  return (
    <GoalsContext.Provider value={{ goals, addGoal }}>
      {children}
    </GoalsContext.Provider>
  );
};