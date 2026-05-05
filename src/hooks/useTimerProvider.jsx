import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const timerProvider = createContext([0, () => {}]);

export function TimerProvider({ children }) {
  const timerState = useState(60);
  return (
    <timerProvider.Provider value={timerState}>
      {children}
    </timerProvider.Provider>
  );
}
