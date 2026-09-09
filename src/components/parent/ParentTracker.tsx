'use client';

import React, { useState } from 'react';
import { useBusStore } from '@/store/busState';
import { OrigamiMap } from '@/components/map/OrigamiMap';
import { DigitalBusPass } from './DigitalBusPass';
import { BottomSheetDrawer } from './BottomSheetDrawer';
import { PaperAirplaneModal } from '@/components/common/PaperAirplaneModal';
import { OrigamiAvatarIcon, OrigamiPaperPlane } from '@/components/common/OrigamiIcons';
import { Clock, ShieldAlert, Phone, Send, Info, BellRing } from 'lucide-react';

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
      {/* Top Banner: Child Switcher & Dynamic ETA Status Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border-2 border-paper-creaseDark shadow-paper">
        {/* Multi-child switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:inline">
            Pilih Anak:
          </span>
          <div className="flex items-center gap-1.5">
            {myKids.map((kid) => {
              const isActive = kid.id === currentStudent.id;
              return (
                <button
                  key={kid.id}
                  onClick={() => actions.setActiveStudent(kid.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border-2 transition-all ${
                    isActive
                      ? 'bg-origami-yellow border-origami-slate text-origami-slate shadow-paper font-black'
                      : 'bg-paper-sheet border-paper-creaseDark text-gray-700 font-semibold hover:border-gray-400'
                  }`}
                >
                  <OrigamiAvatarIcon avatar={kid.avatar} size={22} />
                  <span className="text-xs">{kid.name.split(' ')[1] || kid.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Status Pill */}
        <div className="flex items-center gap-2">
          <div className="bg-amber-50 border-2 border-origami-yellow text-origami-slate px-3 py-1.5 rounded shadow-xs flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-origami-yellow animate-ping"></span>
            <div className="text-xs font-bold">
              ETA: <span className="text-origami-terracotta">{activeBus.nextStopETA}</span>
            </div>
            <div className="text-[11px] text-gray-500 font-medium hidden md:inline">
              • 2 Hentian Lagi ke Saujana
            </div>
          </div>

          <button
            onClick={() => setMessageModalOpen(true)}
            className="origami-btn origami-btn-primary px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 shadow-paper"
            title="Kirim Pesanan Segera"
          >
            <OrigamiPaperPlane size={16} />
            <span className="hidden sm:inline">Pesan Pemandu</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Map & Digital Pass */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Live Origami Map & Bottom Timeline (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-0 rounded-lg overflow-hidden border-2 border-origami-slate shadow-paper-lg bg-white">
          {/* Map Container */}
          <div className="h-[420px] sm:h-[460px] w-full relative">
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
          <div className="origami-memo-yellow p-4 rounded-md border-2 shadow-paper space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black uppercase tracking-wider text-origami-slate flex items-center gap-1.5">
                <span>🚌 Maklumat Pemandu Bertugas</span>
              </div>
              <span className="text-[10px] bg-white border border-origami-yellow px-1.5 py-0.5 rounded font-bold text-gray-700">
                Laluan Saujana
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-800">
              <div>
                <div className="font-bold text-sm text-origami-slate">{activeBus.driverName}</div>
                <div className="text-gray-600 text-[11px]">No. Pendaftaran Bas: <strong>{activeBus.plateNumber}</strong></div>
              </div>

              <a
                href={`tel:${activeBus.driverPhone}`}
                className="origami-btn bg-white px-2.5 py-1.5 rounded text-xs font-bold text-origami-slate flex items-center gap-1 hover:bg-paper-sheet"
              >
                <Phone className="w-3.5 h-3.5 text-origami-teal" />
                <span>Hubungi</span>
              </a>
            </div>

            <p className="text-[11px] text-gray-600 leading-relaxed border-t border-amber-200 pt-2">
              Sekiranya anak terlambat atau memerlukan bantuan di hentian, sila tekan butang <strong>&quot;Pesan Pemandu&quot;</strong> di atas untuk amaran segera ke kokpit.
            </p>
          </div>

          {/* Live Notification Feed / Manifest Sync Log */}
          <div className="bg-white p-3.5 rounded-md border-2 border-paper-creaseDark shadow-paper space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-origami-slate flex items-center gap-1.5">
                <BellRing className="w-3.5 h-3.5 text-origami-terracotta" />
                <span>Log Notis Terkini</span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">Kemaskini Langsung</span>
            </div>

            <div className="space-y-2 text-xs">
              {recentUpdates.length === 0 ? (
                <div className="text-gray-500 text-[11px] italic py-2 text-center bg-paper-sheet rounded">
                  Tiada amaran baru pagi ini. Semua perjalanan lancar mengikut jadual.
                </div>
              ) : (
                recentUpdates.slice(0, 3).map((upd) => (
                  <div
                    key={upd.id}
                    className="p-2 bg-paper-sheet rounded border border-paper-crease text-[11px] text-gray-700 flex items-start gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-origami-terracotta mt-1 shrink-0"></span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-origami-slate truncate">
                        {upd.studentName}
                      </div>
                      <div className="text-gray-600 truncate">{upd.note}</div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono shrink-0">
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
