import React, { createContext, useContext, useState, useEffect } from "react";

type BuildEntry = {
  timestamp: string;
  component: string;
  level: number;
  branch: string;
  tag?: string;
  status: "Completed" | "Failed" | "Pending";
  duration: string; // e.g., "5.23s"
};

type BuildHistoryContextType = {
  history: BuildEntry[];
  addBuildHistory: (entry: BuildEntry) => void;
};

const BuildHistoryContext = createContext<BuildHistoryContextType | undefined>(undefined);

export const BuildHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<BuildEntry[]>(() => {
    const stored = localStorage.getItem("buildHistory");
    return stored ? JSON.parse(stored) : [];
  });

  const addBuildHistory = (entry: BuildEntry) => {
    setHistory((prev) => {
      const updated = [...prev, entry];
      localStorage.setItem("buildHistory", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    // Sync to localStorage on initial render
    localStorage.setItem("buildHistory", JSON.stringify(history));
  }, []);

  return (
    <BuildHistoryContext.Provider value={{ history, addBuildHistory }}>
      {children}
    </BuildHistoryContext.Provider>
  );
};

export const useBuildHistory = () => {
  const context = useContext(BuildHistoryContext);
  if (!context) {
    throw new Error("useBuildHistory must be used within a BuildHistoryProvider");
  }
  return context;
};
