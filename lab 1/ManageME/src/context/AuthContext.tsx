import React, { createContext, useContext, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(true); // Assume true, let server redirect if not

  const logout = () => {
    // Remove cookie by calling a logout endpoint or setting cookie to expired
    fetch("/api/logout", { method: "POST" }).then(() => {
      setAuthenticated(false);
      window.location.href = "/login";
    });
  };

  const value = {
    isAuthenticated,
    setAuthenticated,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};