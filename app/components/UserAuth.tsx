'use client';

import Link from 'next/link';
import { User, Settings, LogOut } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { User as UserType } from '../types';


export default function UserAuth() {
  const [user, setUser] = useState<UserType | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const menuElement = document.getElementById('user-menu');

      if (isMenuOpen && menuElement && !menuElement.contains(target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    try {
      // Call backend logout endpoint
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL_API}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch {
      // Continue with local cleanup even if API call fails
    }

    // Clear all auth-related items
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Also clear any other potential auth items
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (
        key.toLowerCase().includes('token') ||
        key.toLowerCase().includes('user') ||
        key.toLowerCase().includes('auth')
      ) {
        localStorage.removeItem(key);
      }
    });

    setUser(null);

    // Force a hard redirect to clear any cached state
    window.location.replace('/');
  };

  return (
    <div className="flex items-center space-x-2">
      {user ? (
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 text-gray-300 hover:text-orange-400 transition-colors"
            >
              <User className="h-5 w-5" />
              <span className="hidden md:block">{user.name}</span>
            </button>

            {isMenuOpen && (
              <div
                id="user-menu"
                className="absolute right-0 mt-2 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50"
              >
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-600">
                    <p className="text-sm font-medium text-white">
                      {user.name}
                    </p>
                    {user.email && (
                      <p className="text-xs text-gray-400">{user.email}</p>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-600 hover:text-orange-400 transition-colors"
                    type="button"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-600 hover:text-orange-400 transition-colors"
                    type="button"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLogout(e);
                    }}
                    className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-600 hover:text-orange-400 transition-colors"
                    type="button"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <Link
            href="/login"
            className="text-gray-300 hover:text-orange-400 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Sign Up
          </Link>
        </>
      )}
    </div>
  );
}
