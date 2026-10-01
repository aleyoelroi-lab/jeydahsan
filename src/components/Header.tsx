import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  FileText,
  KeyRound,
  LogOut,
  Mail,
  Moon,
  PenTool,
  RefreshCw,
  Shield,
  Sun,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import { User } from '../types/truewriters';

interface HeaderProps {
  currentUser: User;
  theme: 'light' | 'night';
  onToggleTheme: () => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenAuth: () => void;
  onToggleRole: () => void;
  onLogOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  theme,
  onToggleTheme,
  activeTab,
  onNavigate,
  onOpenAuth,
  onToggleRole,
  onLogOut,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b transition-colors duration-200 backdrop-blur-md bg-opacity-95"
      style={{
        backgroundColor: theme === 'light' ? 'rgba(253, 251, 244, 0.95)' : 'rgba(18, 20, 15, 0.95)',
        borderColor: theme === 'light' ? '#E4E0D4' : '#2C3128',
      }}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Tagline */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('browse')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center font-serif font-bold text-sm tracking-tight text-white shadow-xs transition-transform group-hover:scale-105"
              style={{ backgroundColor: '#6E8B5E' }}
            >
              JS
            </span>
            <div>
              <span
                className="text-2xl font-serif font-bold tracking-tight block leading-none"
                style={{ color: theme === 'light' ? '#1C1C1A' : '#E8E6DE' }}
              >
                Jeydahsan
              </span>
              <span
                className="text-[10px] font-mono uppercase tracking-wider block font-semibold"
                style={{ color: '#6E8B5E' }}
              >
                100% Free · No Paywalls · No Ads
              </span>
            </div>
          </button>
        </div>

        {/* Primary Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold">
          {[
            { id: 'browse', label: 'Discover Books' },
            { id: 'library', label: 'My Library' },
            { id: 'write', label: 'Write & Publish' },
            { id: 'forum', label: 'Community Forum' },
            { id: 'contact-inbox', label: 'Buyer Requests' },
            { id: 'admin', label: 'AD' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`py-1.5 transition-colors cursor-pointer relative whitespace-nowrap ${
                activeTab === item.id ? 'font-bold' : 'opacity-75 hover:opacity-100'
              } ${item.id === 'admin' ? 'font-mono text-xs px-2 py-0.5 rounded opacity-60 hover:opacity-100 border border-transparent hover:border-current' : ''}`}
              style={{
                color:
                  activeTab === item.id
                    ? '#6E8B5E'
                    : theme === 'light'
                    ? '#1C1C1A'
                    : '#E8E6DE',
              }}
            >
              {item.label}
              {activeTab === item.id && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: '#6E8B5E' }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Right Actions: Theme Toggle, User Pen Name */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle light or night theme"
            className="p-2 rounded-xl border transition-colors cursor-pointer"
            style={{
              borderColor: theme === 'light' ? '#E4E0D4' : '#2C3128',
              color: theme === 'light' ? '#1C1C1A' : '#E8E6DE',
              backgroundColor: theme === 'light' ? '#FFFFFF' : '#1B1E17',
            }}
            title={theme === 'light' ? 'Switch to Night Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-300" />}
          </button>

          {/* User Account */}
          <div className="flex items-center gap-2">
            {currentUser.isGuest ? (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs cursor-pointer hover:opacity-90"
                style={{
                  borderColor: '#6E8B5E',
                  backgroundColor: '#6E8B5E',
                  color: '#FFFFFF',
                }}
                title="Create account or sign in"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            ) : (
              <>
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer hover:border-[#6E8B5E]"
                  style={{
                    borderColor: theme === 'light' ? '#E4E0D4' : '#2C3128',
                    backgroundColor: theme === 'light' ? '#FFFFFF' : '#1B1E17',
                    color: theme === 'light' ? '#1C1C1A' : '#E8E6DE',
                  }}
                  title="Account settings & preferences"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="truncate max-w-[120px]">{currentUser.penName}</span>
                  {currentUser.emailVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </button>
                {onLogOut && (
                  <button
                    onClick={onLogOut}
                    className="p-1.5 rounded-xl border text-xs transition-colors cursor-pointer opacity-70 hover:opacity-100 hover:text-rose-500"
                    style={{
                      borderColor: theme === 'light' ? '#E4E0D4' : '#2C3128',
                      backgroundColor: theme === 'light' ? '#FFFFFF' : '#1B1E17',
                      color: theme === 'light' ? '#1C1C1A' : '#E8E6DE',
                    }}
                    title="Log Out of this session"
                    aria-label="Log Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
