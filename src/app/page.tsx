'use client';

import React, { useState, useEffect } from 'react';
import { useBusStore } from '@/store/busState';
import { RoleSwitcher } from '@/components/common/RoleSwitcher';
import { ParentTracker } from '@/components/parent/ParentTracker';
import { StudentLounge } from '@/components/student/StudentLounge';
import { DriverCockpit } from '@/components/driver/DriverCockpit';
import { BillingHub } from '@/components/billing/BillingHub';
import { RegistrationWizard } from '@/components/registration/RegistrationWizard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Bus, MapPin, Phone, ShieldCheck, Heart } from 'lucide-react';

export default function Home() {
  const { role, actions } = useBusStore();
  const [currentTab, setCurrentTab] = useState<string>('tracker');

  // Synchronize active tab with store role
  useEffect(() => {
    if (currentTab === 'register') return;
    if (role === 'parent' && currentTab !== 'tracker') setCurrentTab('tracker');
    if (role === 'student' && currentTab !== 'lounge') setCurrentTab('lounge');
    if (role === 'driver' && currentTab !== 'driver') setCurrentTab('driver');
    if (role === 'billing' && currentTab !== 'billing') setCurrentTab('billing');
    if (role === 'admin' && currentTab !== 'admin') setCurrentTab('admin');
  }, [role, currentTab]);

  // Telematics Simulation Interval Loop
  useEffect(() => {
    let lastTime = performance.now();
    const interval = setInterval(() => {
      const now = performance.now();
      const deltaTime = now - lastTime;
      lastTime = now;
      actions.tickTelematics(deltaTime);
    }, 150);

    return () => clearInterval(interval);
  }, [actions]);

  return (
    <div className="min-h-screen flex flex-col bg-paper-bg text-slate-900">
      {/* Top Tactical Role Switcher */}
      <RoleSwitcher
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-10">
        {currentTab === 'tracker' && <ParentTracker />}
        {currentTab === 'lounge' && <StudentLounge />}
        {currentTab === 'driver' && <DriverCockpit />}
        {currentTab === 'billing' && <BillingHub />}
        {currentTab === 'admin' && <AdminDashboard />}
        {currentTab === 'register' && (
          <RegistrationWizard onFinish={() => setCurrentTab('tracker')} />
        )}
      </main>

      {/* Origami Papercraft Footer - High Contrast */}
      <footer className="w-full bg-paper-sheet border-t-2 border-origami-slate mt-auto py-5 px-4 text-xs sm:text-sm text-slate-800 font-bold">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-sm bg-origami-yellow border-2 border-origami-slate flex items-center justify-center font-black text-slate-900 text-xs shadow-xs">
              BK
            </div>
            <div>
              <span className="font-black text-slate-900">BasKita TTDI Jaya</span>
              <span className="text-slate-400 mx-2">•</span>
              <span className="text-slate-700">Seksyen U2, Shah Alam, Selangor</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 text-xs text-slate-800">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-origami-terracotta" />
              <span>Depot: Jalan Saujana Indah U2</span>
            </span>
            <span className="text-slate-400">|</span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-origami-teal" />
              <span>Hotline: +60 3-7845 2210</span>
            </span>
            <span className="text-slate-400">|</span>
            <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded border border-emerald-600 font-black">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>APAD & SPAD Berlesen</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
