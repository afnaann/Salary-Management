'use client'
import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";

const MainContext = createContext();

export const ContextProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAuthTokens = localStorage.getItem("authTokens");
      if (storedAuthTokens) {
        setAuthTokens(JSON.parse(storedAuthTokens));
        setUser(jwtDecode(JSON.parse(storedAuthTokens).access));
      }
    }
  }, []);

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authTokens");
    }
    setAuthTokens(null);
    setUser(null);
  };

  return (
    <MainContext.Provider
      value={{ logout, authTokens, user, setUser, setAuthTokens }}
    >
      {children}
    </MainContext.Provider>
  );
};

export default MainContext;
