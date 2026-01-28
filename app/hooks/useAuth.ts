'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email?: string;
  roles?: string[];
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        console.log('useAuth - Initializing auth');
        console.log('useAuth - Stored user:', storedUser);
        console.log('useAuth - Stored token:', !!storedToken);

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          console.log('useAuth - User set:', parsedUser);
        }

        if (storedToken) {
          setToken(storedToken);
          console.log('useAuth - Token set');
        }
      } catch (error) {
        console.error('useAuth - Error initializing auth:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const logout = () => {
    console.log('useAuth - Logging out');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const updateUser = (newUser: User | null) => {
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      console.log('useAuth - User updated:', newUser);
    } else {
      logout();
    }
  };

  const updateToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      setToken(newToken);
      console.log('useAuth - Token updated');
    } else {
      localStorage.removeItem('token');
      setToken(null);
    }
  };

  const validateToken = async (): Promise<boolean> => {
    try {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        return false;
      }

      // Make a simple request to validate the token
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_API}/manga/statistics`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      return response.ok;
    } catch (error) {
      console.error('useAuth - Token validation failed:', error);
      return false;
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      console.log('useAuth - Attempting to refresh token');

      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        console.log('useAuth - No current token to refresh');
        return false;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_API}/refresh`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        updateToken(data.token);
        updateUser(data.user);
        console.log('useAuth - Token refreshed successfully');
        return true;
      } else {
        const errorData = await response.json();
        console.error('useAuth - Refresh failed:', errorData);

        // Check if re-authentication is required
        if (errorData.requiresReauth) {
          console.log('useAuth - Re-authentication required');
          return false;
        }

        return false;
      }
    } catch (error) {
      console.error('useAuth - Failed to refresh token:', error);
      return false;
    }
  };

  const handleSessionExpired = () => {
    console.log('useAuth - Session expired, attempting to handle gracefully');

    // Clear expired auth immediately
    logout();

    // Show user-friendly message and redirect
    const message =
      'Your session has expired. Please log in again to continue.';
    alert(message);

    // Redirect to login
    window.location.href = '/login';
  };

  const isAuthenticated = !!user && !!token;

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    logout,
    updateUser,
    updateToken,
    validateToken,
    refreshToken,
    handleSessionExpired,
  };
}
