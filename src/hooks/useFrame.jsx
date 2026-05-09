import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const frameProvider = createContext([null, (prev) => prev]);

export function FrameProvider({ children }) {
  const memoryState = useState(null);
  return (
    <frameProvider.Provider value={memoryState}>
      {children}
    </frameProvider.Provider>
  );
}
