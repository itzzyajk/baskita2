'use client';

import React, { useState } from 'react';
import { useBusStore } from '@/store/busState';
import { OrigamiMap } from '@/components/map/OrigamiMap';
import { DigitalBusPass } from './DigitalBusPass';
import { BottomSheetDrawer } from './BottomSheetDrawer';
import { PaperAirplaneModal } from '@/components/common/PaperAirplaneModal';
import { OrigamiAvatarIcon, OrigamiPaperPlane } from '@/components/common/OrigamiIcons';
import { Clock, Phone, Send, Info, BellRing, Navigation, ShieldCheck, MapPin } from 'lucide-react';

export const ParentTracker: React.FC = () => {
  const {
    students,
    buses,
    routes,
    activeStudentId,
    recentUpdates,
    actions,
  } = useBusStore();

  const [messageModalOpen, setMessageModalOpen] = useState(false);

  // Default to Rayyan or active selected child
  const currentStudent = students.find((s) => s.id === activeStudentId) || students[0];
  const activeBus = buses.find((b) => b.id === 'bus-01') || buses[0];
  const activeRoute = routes.find((r) => r.id === 'route-tj-01') || routes[0];

  // Sibling list (Sarah binti Rahim's kids: Rayyan & Sofea)
  const myKids = students.filter(
    (s) => s.guardianPhone === currentStudent.guardianPhone || s.id === 'stu-01' || s.id === 'stu-02'
  );

  return (
    <div className="flex flex-col h-full space-y-4 max-w-7xl mx-auto px-2 sm:px-4 py-3">
      {/* Top Banner: Child Switcher & Dynamic ETA Status Ticket */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-lg border-2 border-origami-slate shadow-paper-lg">
        {/* Multi-child switcher */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-slate-800 uppercase tracking-wider hidden sm:inline">
            Pilih Anak:
          </span>
          <div className="flex items-center gap-2">
            {myKids.map((kid) => {
              const isActive = kid.id === currentStudent.id;
              return (
                <button
                  key={kid.id}
                  onClick={() => actions.setActiveStudent(kid.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-sm border-2 transition-all ${
                    isActive
                      ? 'bg-origami-yellow border-origami-slate text-slate-900 shadow-paper font-black ring-1 ring-origami-slate'
                      : 'bg-paper-sheet border-paper-creaseDark text-slate-800 font-bold hover:border-slate-500'
                  }`}
                >
                  <OrigamiAvatarIcon avatar={kid.avatar} size={24} />
                  <span className="text-xs sm:text-sm font-black">{kid.name.split(' ')[1] || kid.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Status Ticket HUD */}
        <div className="flex items-center gap-2.5">
          <div className="bg-amber-50 border-2 border-origami-slate text-slate-900 px-3.5 py-2 rounded shadow-paper flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-origami-yellow border border-origami-slate animate-ping"></span>
            <div>
              <div className="text-xs sm:text-sm font-black flex items-center gap-1.5">
                <span>ANGGARAN TIBA (ETA):</span>
                <span className="text-origami-terracotta bg-white px-2 py-0.5 rounded border border-origami-slate font-mono font-black text-sm">
                  {activeBus.nextStopETA}
                </span>
              </div>
              <div className="text-[11px] text-slate-700 font-bold hidden md:inline">
                Hentian Seterusnya: <strong>{activeRoute.stops[activeBus.currentStopIndex]?.name || 'Saujana'}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => setMessageModalOpen(true)}
            className="origami-btn origami-btn-primary px-4 py-2.5 rounded text-xs sm:text-sm font-black flex items-center gap-2 shadow-paper"
            title="Kirim Pesanan Segera"
          >
            <OrigamiPaperPlane size={18} />
            <span>Pesan Pemandu</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Map & Digital Pass */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Live Origami Map & Bottom Timeline (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-0 rounded-lg overflow-hidden border-2 border-origami-slate shadow-paper-lg bg-white">
          {/* Map Header Status Ribbon */}
          <div className="bg-paper-sheet border-b-2 border-origami-slate px-4 py-2 flex items-center justify-between text-xs font-black text-slate-900">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-origami-terracotta animate-pulse" />
              <span>Peta Radar GPS Langsung (Radius 20 km Shah Alam)</span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <span className="bg-emerald-100 text-emerald-900 border border-emerald-500 px-2 py-0.5 rounded text-[11px] font-bold">
                {activeBus.speedKmH} KM/J
              </span>
              <span className="bg-origami-yellow text-slate-900 border border-origami-slate px-2 py-0.5 rounded text-[11px] font-black">
                {activeBus.name}
              </span>
            </div>
          </div>

          {/* Map Container */}
          <div className="h-[400px] sm:h-[450px] w-full relative">
            <OrigamiMap mode="parent" />
          </div>

          {/* Bottom Sheet Drawer for Timeline */}
          <BottomSheetDrawer
            route={activeRoute}
            activeStopIndex={activeBus.currentStopIndex}
            studentStopId={currentStudent.pickupStopId}
            studentSchoolId={currentStudent.schoolId}
          />
        </div>

        {/* Right Column: Digital Bus Pass, Emergency Hub & Recent Pings (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Digital Bus Pass */}
          <DigitalBusPass
            student={currentStudent}
            onOpenMessageModal={() => setMessageModalOpen(true)}
          />

          {/* Driver & Bus Info Sticky Note */}
          <div className="origami-memo-yellow p-4 rounded-md border-2 border-origami-slate shadow-paper space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <span>🚌 Maklumat Pemandu Bertugas</span>
              </div>
              <span className="text-[11px] bg-white border-2 border-origami-slate px-2 py-0.5 rounded font-black text-slate-900 shadow-xs">
                Laluan Saujana
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-900 bg-white/70 p-2.5 rounded border border-amber-300">
              <div>
                <div className="font-black text-base text-slate-900">{activeBus.driverName}</div>
                <div className="text-slate-700 text-xs font-semibold mt-0.5">
                  No. Pendaftaran Bas: <strong className="font-mono text-slate-900">{activeBus.plateNumber}</strong>
                </div>
              </div>

              <a
                href={`tel:${activeBus.driverPhone}`}
                className="origami-btn bg-white px-3 py-2 rounded text-xs font-black text-slate-900 flex items-center gap-1.5 shadow-xs hover:bg-paper-sheet"
              >
                <Phone className="w-4 h-4 text-origami-teal" />
                <span>Hubungi</span>
              </a>
            </div>

            <p className="text-xs text-slate-800 font-semibold leading-relaxed border-t border-amber-300 pt-2.5">
              Sekiranya anak terlambat atau memerlukan bantuan di hentian, sila tekan butang <strong>&quot;Pesan Pemandu&quot;</strong> di atas untuk amaran suara segera ke kokpit.
            </p>
          </div>

          {/* Live Notification Feed / Manifest Sync Log */}
          <div className="bg-white p-4 rounded-md border-2 border-origami-slate shadow-paper space-y-2.5">
            <div className="flex items-center justify-between border-b-2 border-paper-creaseDark pb-2">
              <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <BellRing className="w-4 h-4 text-origami-terracotta" />
                <span>Log Notis & Kemas Kini Langsung</span>
              </div>
              <span className="text-[11px] font-black text-slate-700 font-mono bg-paper-sheet px-1.5 py-0.5 rounded border border-paper-creaseDark">
                Kemaskini Auto
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {recentUpdates.length === 0 ? (
                <div className="text-slate-700 font-medium text-xs italic py-3 text-center bg-paper-sheet rounded border border-paper-creaseDark">
                  Tiada amaran baru pagi ini. Semua perjalanan lancar mengikut jadual.
                </div>
              ) : (
                recentUpdates.slice(0, 3).map((upd) => (
                  <div
                    key={upd.id}
                    className="p-2.5 bg-paper-sheet rounded border-2 border-paper-creaseDark text-xs text-slate-900 flex items-start gap-2 shadow-xs"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-origami-terracotta mt-1 shrink-0"></span>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-slate-900 truncate">
                        {upd.studentName}
                      </div>
                      <div className="text-slate-700 font-semibold truncate">{upd.note}</div>
                    </div>
                    <span className="text-[11px] text-slate-600 font-mono font-bold shrink-0">
                      {upd.timestamp}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Direct Messaging Modal */}
      <PaperAirplaneModal
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        student={currentStudent}
      />
    </div>
  );
};
