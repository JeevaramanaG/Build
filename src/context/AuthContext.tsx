import React, { createContext, useContext, useState } from 'react';

export interface User {
  id: string;
  name: string;
  role: 'Developer' | 'Maintainer';
}

export interface AuthContextType {
  currentUser: User;
  isTeamSpace: boolean;
  toggleSpace: () => void;
  switchUser: () => void; // still available internally if needed later
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🧪 Mock users for testing (optional switcher remains)
const mockUsers: User[] = [
  {
    id: 'user123',
    name: 'Jeeva',
    role: 'Maintainer',
  },
  {
    id: 'user456',
    name: 'Ravi',
    role: 'Developer',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]); // Default to Jeeva
  const [isTeamSpace, setIsTeamSpace] = useState(true); // Default view

  // 🔄 Toggle between team and my space
  const toggleSpace = () => setIsTeamSpace((prev) => !prev);

  // 🧪 Optional internal dev tool: switch users (not exposed in UI for now)
  const switchUser = () => {
    setCurrentUser((prevUser) =>
      prevUser.id === mockUsers[0].id ? mockUsers[1] : mockUsers[0]
    );
  };

  return (
    <AuthContext.Provider value={{ currentUser, isTeamSpace, toggleSpace, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
