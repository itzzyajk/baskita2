'use client';

import React from 'react';
import { useBusStore } from '@/store/busState';
import { UserRole } from '@/types';
import { Bus, UserCheck, ShieldCheck, UserPlus, Gamepad2, CreditCard, Sparkles } from 'lucide-react';

interface RoleSwitcherProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const { role, studentLoungeMode, actions } = useBusStore();

  const handleRoleChange = (targetRole: UserRole, tabId: string) => {
    actions.setRole(targetRole);
    onSelectTab(tabId);
  };

  return (
    <header className="w-full bg-paper-sheet border-b-2 border-origami-slate px-3 sm:px-5 py-2.5 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Origami Emblem */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-origami-yellow rounded-sm border-2 border-origami-slate flex items-center justify-center shadow-paper transform -rotate-2 hover:rotate-0 transition-transform">
              <svg viewBox="0 0 48 48" width="26" height="26">
                <polygon points="6,12 42,12 36,36 12,36" fill="#F4D06F" stroke="#264653" strokeWidth="2.5" />
                <polygon points="12,18 36,18 34,26 14,26" fill="#A8DADC" stroke="#264653" strokeWidth="2" />
                <circle cx="16" cy="36" r="4.5" fill="#264653" stroke="#FFFFFF" strokeWidth="1" />
                <circle cx="32" cy="36" r="4.5" fill="#264653" stroke="#FFFFFF" strokeWidth="1" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tight text-xl text-origami-slate leading-none">
                  BasKita
                </span>
                <span className="bg-origami-terracotta text-white text-[11px] font-black px-2 py-0.5 rounded-xs uppercase tracking-wider border border-origami-slate shadow-xs">
                  TTDI JAYA
                </span>
              </div>
              <p className="text-xs text-slate-700 font-bold leading-tight mt-0.5">
                Origami Fleet Transit Platform • Seksyen U2 Shah Alam
              </p>
            </div>
          </div>

          {/* Quick Active Mode Badge on Mobile */}
          <div className="md:hidden">
            <span className="text-[11px] font-black uppercase px-2 py-1 rounded bg-origami-yellow text-origami-slate border border-origami-slate shadow-xs">
              {currentTab === 'tracker'
                ? 'Ibu Bapa'
                : currentTab === 'lounge'
                ? 'Arked Murid'
                : currentTab === 'driver'
                ? 'Pemandu'
                : currentTab === 'billing'
                ? 'FPX / Bil'
                : currentTab === 'admin'
                ? 'Pengendali'
                : 'Daftar'}
            </span>
          </div>
        </div>

        {/* Tactical Role Switcher Tabs (Scrollable Ribbon on Mobile) */}
        <nav
          aria-label="Navigasi Peranan"
          className="w-full md:w-auto overflow-x-auto pb-1 md:pb-0"
        >
          <div className="flex items-center bg-white p-1.5 rounded-md border-2 border-origami-slate shadow-paper gap-1.5 min-w-max">
            {/* Tab 1: Parent Tracker */}
            <button
              onClick={() => handleRoleChange('parent', 'tracker')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xs text-xs sm:text-sm font-black transition-all ${
                currentTab === 'tracker'
                  ? 'bg-origami-yellow text-slate-900 border-2 border-origami-slate shadow-paper'
                  : 'text-slate-800 hover:text-origami-slate hover:bg-paper-sheet'
              }`}
            >
              <UserCheck className="w-4 h-4 text-slate-900" />
              <span>Ibu Bapa</span>
            </button>

            {/* Tab 2: Student Lounge & Transit Arcade */}
            <button
              onClick={() => handleRoleChange('student', 'lounge')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xs text-xs sm:text-sm font-black transition-all ${
                currentTab === 'lounge'
                  ? 'bg-amber-100 text-slate-900 border-2 border-amber-600 shadow-paper'
                  : 'text-slate-800 hover:text-origami-slate hover:bg-paper-sheet'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-amber-700" />
              <span className="flex items-center gap-1.5">
                <span>Arked Murid</span>
                <span className="text-[10px] bg-origami-yellow text-slate-900 border border-slate-700 px-1.5 py-0.2 rounded font-black">
                  {studentLoungeMode === 'junior' ? 'Kip' : 'Rex'}
                </span>
              </span>
            </button>

            {/* Tab 3: Driver Cockpit */}
            <button
              onClick={() => handleRoleChange('driver', 'driver')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xs text-xs sm:text-sm font-black transition-all ${
                currentTab === 'driver'
                  ? 'bg-origami-terracotta text-white border-2 border-origami-slate shadow-paper'
                  : 'text-slate-800 hover:text-origami-slate hover:bg-paper-sheet'
              }`}
            >
              <Bus className="w-4 h-4" />
              <span>Pemandu</span>
            </button>

            {/* Tab 4: Subscriptions & Billing Hub */}
            <button
              onClick={() => handleRoleChange('billing', 'billing')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xs text-xs sm:text-sm font-black transition-all ${
                currentTab === 'billing'
                  ? 'bg-origami-teal text-white border-2 border-origami-slate shadow-paper'
                  : 'text-slate-800 hover:text-origami-slate hover:bg-paper-sheet'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Yuran & FPX</span>
            </button>

            {/* Tab 5: Fleet Admin HQ */}
            <button
              onClick={() => handleRoleChange('admin', 'admin')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xs text-xs sm:text-sm font-black transition-all ${
                currentTab === 'admin'
                  ? 'bg-origami-slate text-white border-2 border-origami-slate shadow-paper'
                  : 'text-slate-800 hover:text-origami-slate hover:bg-paper-sheet'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Pengendali</span>
            </button>

            {/* Tab 6: Register New Student */}
            <button
              onClick={() => onSelectTab('register')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xs text-xs sm:text-sm font-black transition-all ${
                currentTab === 'register'
                  ? 'bg-slate-900 text-white border-2 border-origami-slate shadow-paper'
                  : 'text-slate-800 hover:text-origami-slate hover:bg-paper-sheet'
              }`}
            >
              <UserPlus className="w-4 h-4 text-origami-yellow" />
              <span>Daftar Anak</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};
