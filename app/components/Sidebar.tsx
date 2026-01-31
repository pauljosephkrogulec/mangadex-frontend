'use client';

import Link from 'next/link';
import {
  BookOpen,
  Clock,
  Users,
  List,
  MessageSquare,
  Heart,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  History,
  TrendingUp,
  Globe,
  Shield,
  HelpCircle,
  Info,
} from 'lucide-react';
import { SidebarProps } from '../types';

export default function Sidebar({
  isOpen = false,
  onClose,
  onToggle,
  isCollapsed = false,
}: SidebarProps) {
  const sidebarContent = (
    <div className="h-full bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-orange-500" />
              <span className="text-lg font-bold">MangaDex</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            {/* Collapse/Expand button for desktop */}
            <button
              onClick={onToggle}
              className="hidden lg:flex p-1 rounded hover:bg-gray-800 transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
            {/* Close button for mobile */}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-gray-800 lg:hidden"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Browse Section */}
        <div>
          <div className="flex items-center space-x-3">
            <BookOpen className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Browse</span>}
          </div>
          {!isCollapsed && (
            <div className="ml-8 mt-2 space-y-1">
              <Link
                href="/search"
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors text-sm"
              >
                <BookOpen className="h-4 w-4" />
                <span>Advanced Search</span>
              </Link>
              <Link
                href="/updates"
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors text-sm"
              >
                <Clock className="h-4 w-4" />
                <span>Updates</span>
              </Link>
              <Link
                href="/random"
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors text-sm"
              >
                <TrendingUp className="h-4 w-4" />
                <span>Random</span>
              </Link>
            </div>
          )}
        </div>

        {/* Community Section */}
        <div>
          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Community</span>}
          </div>
          {!isCollapsed && (
            <div className="ml-8 mt-2 space-y-1">
              <Link
                href="/groups"
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors text-sm"
              >
                <Users className="h-4 w-4" />
                <span>Groups</span>
              </Link>
              <Link
                href="/lists"
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors text-sm"
              >
                <List className="h-4 w-4" />
                <span>Lists</span>
              </Link>
              <Link
                href="/forums"
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors text-sm"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Forums</span>
              </Link>
            </div>
          )}
        </div>

        {/* My Library Section */}
        <div>
          <div className="flex items-center space-x-3">
            <Heart className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>My Library</span>}
          </div>
          {!isCollapsed && (
            <div className="ml-8 mt-2 space-y-1">
              <Link
                href="/library/follows"
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors text-sm"
              >
                <Heart className="h-4 w-4" />
                <span>Follows</span>
              </Link>
              <Link
                href="/library/bookmarks"
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors text-sm"
              >
                <Bookmark className="h-4 w-4" />
                <span>Bookmarks</span>
              </Link>
              <Link
                href="/library/history"
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors text-sm"
              >
                <History className="h-4 w-4" />
                <span>History</span>
              </Link>
            </div>
          )}
        </div>

        {/* Support Section */}
        <div>
          <div className="flex items-center space-x-3">
            <HelpCircle className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Support</span>}
          </div>
          {!isCollapsed && (
            <div className="ml-8 mt-2 space-y-1">
              <Link
                href="/help"
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors text-sm"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Help Center</span>
              </Link>
              <Link
                href="/rules"
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors text-sm"
              >
                <Shield className="h-4 w-4" />
                <span>Rules</span>
              </Link>
              <Link
                href="/api"
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors text-sm"
              >
                <Globe className="h-4 w-4" />
                <span>API</span>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        {!isCollapsed && (
          <div className="text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <Info className="h-3 w-3" />
              <span>Version 1.0.0</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
          lg:translate-x-0 lg:static lg:inset-0
        `}
      >
        {sidebarContent}
      </div>
    </>
  );
}
