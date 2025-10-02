import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (email: string, password: string) => Promise<void>;
  onLogin?: (email: string, password: string) => Promise<void>;
  onLogout?: () => Promise<void>;
  secureFetch?: (route: string, params?: any) => Promise<any | Array<any>>;
}

const TOKEN_KEY = "api_token";
export const API_URL = "http://10.0.0.43:4000";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        setAuthState({
          token,
          authenticated: true,
        });
      }
    };
    loadToken();
  }, []);

  const register = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.token) {
      setAuthState({
        token: data.token,
        authenticated: true,
      });

      await SecureStore.setItemAsync(TOKEN_KEY, data.token.toString());

      return data;
    } else {
      alert(data.message);
    }

    return data;
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.token) {
      setAuthState({
        token: data.token,
        authenticated: true,
      });

      await SecureStore.setItemAsync(TOKEN_KEY, data.token.toString());

      return data;
    } else {
      alert(data.message);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setAuthState({
      token: null,
      authenticated: false,
    });
  };

  const secureFetch = async (route: string, params?: any) => {
    if (!params) params = {};
    params.headers = {
      ...params.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${authState?.token}`, // Use token from authState
    };
    const res = await fetch(API_URL + route, params);
    if (res.status === 401) await logout();
    const data = await res.json();
    return data;
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
    secureFetch: secureFetch,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
