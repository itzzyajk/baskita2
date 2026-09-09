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
    <div className="min-h-screen flex flex-col bg-paper-bg">
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

      {/* Origami Papercraft Footer */}
      <footer className="w-full bg-paper-sheet border-t-2 border-paper-creaseDark mt-auto py-5 px-4 text-xs text-gray-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-xs bg-origami-yellow border border-origami-slate flex items-center justify-center font-bold text-origami-slate text-[10px]">
              BK
            </div>
            <div>
              <span className="font-bold text-origami-slate">BasKita TTDI Jaya</span>
              <span className="text-gray-400 mx-1.5">•</span>
              <span>Seksyen U2, Shah Alam, Selangor</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-origami-terracotta" />
              Depot: Jalan Saujana Indah U2
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-origami-teal" />
              Hotline: +60 3-7845 2210
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              APAD & SPAD Berlesen
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
