import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const memoryProvider = createContext([[], (prev) => prev]);

export function MemoryProvider({ children }) {
  const memoryState = useState([]);
  return (
    <memoryProvider.Provider value={memoryState}>
      {children}
    </memoryProvider.Provider>
  );
}
