'use client';

import React from 'react';
import { useBusStore } from '@/store/busState';
import { UserRole } from '@/types';
import { Bus, UserCheck, ShieldCheck, UserPlus, Gamepad2, CreditCard } from 'lucide-react';
import { KipTheKancil, RexTheHelang } from '@/components/companions/OrigamiCompanions';

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
    <header className="w-full bg-paper-sheet border-b border-paper-creaseDark px-3 py-2 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Brand Logo & Origami Emblem */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-origami-yellow rounded-sm border-2 border-origami-slate flex items-center justify-center shadow-paper transform -rotate-2 hover:rotate-0 transition-transform">
            <svg viewBox="0 0 48 48" width="24" height="24">
              <polygon points="6,12 42,12 36,36 12,36" fill="#F4D06F" stroke="#264653" strokeWidth="2" />
              <polygon points="12,18 36,18 34,26 14,26" fill="#A8DADC" stroke="#264653" strokeWidth="1.5" />
              <circle cx="16" cy="36" r="4" fill="#264653" />
              <circle cx="32" cy="36" r="4" fill="#264653" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black tracking-tight text-lg text-origami-slate leading-none">
                BasKita
              </span>
              <span className="bg-origami-terracotta text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider">
                TTDI Jaya
              </span>
            </div>
            <p className="text-[11px] text-gray-600 font-medium leading-tight">
              Platform Origami Bas Sekolah Shah Alam
            </p>
          </div>
        </div>

        {/* Tactical Role Switcher Tabs */}
        <div className="flex flex-wrap items-center bg-white p-1 rounded border border-paper-creaseDark shadow-paper gap-1">
          {/* Tab 1: Parent Tracker */}
          <button
            onClick={() => handleRoleChange('parent', 'tracker')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-bold transition-all ${
              currentTab === 'tracker'
                ? 'bg-origami-yellow text-origami-slate border border-origami-slate shadow-xs'
                : 'text-gray-600 hover:text-origami-slate hover:bg-paper-sheet'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Ibu Bapa</span>
          </button>

          {/* Tab 2: Student Lounge & Transit Arcade */}
          <button
            onClick={() => handleRoleChange('student', 'lounge')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-bold transition-all ${
              currentTab === 'lounge'
                ? 'bg-amber-100 text-origami-slate border border-origami-yellow shadow-xs ring-1 ring-origami-yellow'
                : 'text-gray-600 hover:text-origami-slate hover:bg-paper-sheet'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-amber-600" />
            <span className="flex items-center gap-1">
              <span>Arked Murid</span>
              <span className="text-[9px] bg-origami-yellow text-origami-slate px-1 py-0.2 rounded font-black">
                {studentLoungeMode === 'junior' ? 'Kip' : 'Rex'}
              </span>
            </span>
          </button>

          {/* Tab 3: Driver Cockpit */}
          <button
            onClick={() => handleRoleChange('driver', 'driver')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-bold transition-all ${
              currentTab === 'driver'
                ? 'bg-origami-terracotta text-white border border-origami-slate shadow-xs'
                : 'text-gray-600 hover:text-origami-slate hover:bg-paper-sheet'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Pemandu</span>
          </button>

          {/* Tab 4: Subscriptions & Billing Hub */}
          <button
            onClick={() => handleRoleChange('billing', 'billing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-bold transition-all ${
              currentTab === 'billing'
                ? 'bg-origami-teal text-white border border-origami-slate shadow-xs'
                : 'text-gray-600 hover:text-origami-slate hover:bg-paper-sheet'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Langganan & FPX</span>
          </button>

          {/* Tab 5: Fleet Admin HQ */}
          <button
            onClick={() => handleRoleChange('admin', 'admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-bold transition-all ${
              currentTab === 'admin'
                ? 'bg-origami-slate text-white border border-origami-slate shadow-xs'
                : 'text-gray-600 hover:text-origami-slate hover:bg-paper-sheet'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pengendali</span>
          </button>

          {/* Tab 6: Register New Student */}
          <button
            onClick={() => onSelectTab('register')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xs text-xs font-bold transition-all ${
              currentTab === 'register'
                ? 'bg-gray-800 text-white border border-origami-slate shadow-xs'
                : 'text-gray-600 hover:text-origami-slate hover:bg-paper-sheet'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Daftar Anak</span>
          </button>
        </div>
      </div>
    </header>
  );
};
