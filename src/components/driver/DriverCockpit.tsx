'use client';

import React, { useState } from 'react';
import { useBusStore } from '@/store/busState';
import { Student, BusStop } from '@/types';
import { OrigamiAvatarIcon } from '@/components/common/OrigamiIcons';
import {
  Play,
  Square,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  AlertCircle,
  Volume2,
  Users,
  Navigation,
  School,
  PhoneCall,
  PlusCircle,
  ShieldAlert,
} from 'lucide-react';
import { sounds } from '@/components/common/SoundEffects';

export const DriverCockpit: React.FC = () => {
  const {
    buses,
    routes,
    students,
    isSimulating,
    actions,
  } = useBusStore();

  const activeBus = buses.find((b) => b.id === 'bus-01') || buses[0];
  const activeRoute = routes.find((r) => r.id === 'route-tj-01') || routes[0];

  const [routeActive, setRouteActive] = useState(isSimulating);
  const [activeFilter, setActiveFilter] = useState<'all' | 'waiting' | 'boarded' | 'absent'>('all');
  const [speechTested, setSpeechTested] = useState(false);

  const currentStopIndex = activeBus.currentStopIndex;
  const currentStop = activeRoute.stops[currentStopIndex] || activeRoute.stops[0];
  const nextStop = activeRoute.stops[currentStopIndex + 1];

  // Headcounts
  const totalStudents = students.length;
  const boardedCount = students.filter((s) => s.status === 'boarded').length;
  const absentCount = students.filter((s) => s.status === 'absent').length;
  const waitingCount = students.filter((s) => s.status === 'waiting').length;

  const handleToggleRoute = () => {
    if (routeActive) {
      setRouteActive(false);
      actions.setSimulation(false);
      sounds.playPaperFold();
      sounds.speakAnnouncement('Perjalanan laluan tamat.');
    } else {
      setRouteActive(true);
      actions.setSimulation(true);
      sounds.playBusHorn();
      sounds.speakAnnouncement('Laluan Saujana Jelutong dimulakan. Sistem telematik aktif.');
    }
  };

  const handleTestAudio = () => {
    setSpeechTested(true);
    sounds.playBusHorn();
    sounds.speakAnnouncement('Sistem suara kokpit pemandu berfungsi dengan baik. Amaran automatik diaktifkan.');
  };

  const handleStopComplete = (stop: BusStop) => {
    actions.driverMarkStopAction(stop.id, 'complete');
  };

  const handleStopSkip = (stop: BusStop) => {
    actions.driverMarkStopAction(stop.id, 'skip');
  };

  const handleAddStopBuffer = (stop: BusStop) => {
    actions.addStopWaitBuffer(stop.id, 60);
  };

  const handleStudentAction = (studentId: string, action: 'boarded' | 'absent' | 'waiting') => {
    actions.updateStudentStatus(studentId, action);
  };

  const filteredStudents = students.filter((st) => {
    if (activeFilter === 'all') return true;
    return st.status === activeFilter;
  });

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-3 space-y-4 select-none">
      {/* Cockpit HUD Header */}
      <div className="bg-origami-slate text-white p-4 rounded-lg border-2 border-origami-slate shadow-paper-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-sm bg-origami-yellow border-2 border-white flex items-center justify-center shadow-xs">
              <span className="font-black text-origami-slate text-base">01</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg text-white tracking-tight">
                  Kokpit Pemandu: {activeBus.name}
                </h2>
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  APAD AKTIF
                </span>
              </div>
              <p className="text-xs text-paper-crease font-mono">
                {activeBus.plateNumber} • Pemandu: {activeBus.driverName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Voice Test Button */}
            <button
              onClick={handleTestAudio}
              className={`origami-btn px-3 py-2 rounded text-xs font-bold flex items-center gap-1.5 shadow-xs ${
                speechTested
                  ? 'bg-emerald-600 text-white border-white'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/40'
              }`}
              title="Uji Pembesar Suara"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Uji Suara</span>
            </button>

            {/* Master One-Tap Route Execution Button (≥ 64px touch target) */}
            <button
              onClick={handleToggleRoute}
              className={`origami-btn min-h-[56px] sm:min-h-[64px] px-5 py-3 rounded font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-paper active:scale-95 transition-transform ${
                routeActive
                  ? 'bg-origami-terracotta text-white border-white'
                  : 'bg-origami-yellow text-origami-slate border-origami-slate'
              }`}
            >
              {routeActive ? (
                <>
                  <Square className="w-5 h-5 fill-white" />
                  <span>Henti Trip GPS</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-origami-slate" />
                  <span>Mula Laluan (Start GPS)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Headcount Dashboard Gauges */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-700/80">
          <div className="bg-white/10 p-2 rounded text-center">
            <div className="text-[10px] uppercase font-bold text-gray-300">Jumlah Murid</div>
            <div className="text-xl font-black text-white">{totalStudents}</div>
          </div>
          <div className="bg-emerald-500/20 border border-emerald-500/40 p-2 rounded text-center">
            <div className="text-[10px] uppercase font-bold text-emerald-300">Naik Bas</div>
            <div className="text-xl font-black text-emerald-300">{boardedCount}</div>
          </div>
          <div className="bg-amber-500/20 border border-amber-500/40 p-2 rounded text-center">
            <div className="text-[10px] uppercase font-bold text-amber-300">Menunggu</div>
            <div className="text-xl font-black text-amber-300">{waitingCount}</div>
          </div>
          <div className="bg-red-500/20 border border-red-500/40 p-2 rounded text-center">
            <div className="text-[10px] uppercase font-bold text-red-300">Cuti / MC</div>
            <div className="text-xl font-black text-red-300">{absentCount}</div>
          </div>
        </div>
      </div>

      {/* Next Stop High-Contrast HUD Card with Large Touch Targets (≥ 64px) */}
      {currentStop && (
        <div className="origami-card origami-folded-corner p-4 sm:p-5 rounded-lg border-2 border-origami-slate bg-white shadow-paper-lg">
          <div className="flex items-center justify-between border-b border-paper-creaseDark pb-2.5 mb-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-origami-terracotta">
              <Navigation className="w-4 h-4 text-origami-terracotta animate-pulse" />
              <span>Hentian Semasa / Seterusnya (#{currentStop.sequence})</span>
            </div>

            <div className="flex items-center gap-2">
              {currentStop.waitBufferSeconds ? (
                <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded">
                  +{(currentStop.waitBufferSeconds / 60).toFixed(0)} min Buffer
                </span>
              ) : null}
              <span className="text-xs font-mono font-bold bg-origami-yellow px-2.5 py-1 rounded text-origami-slate border border-origami-slate">
                {currentStop.scheduledTime}
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-lg sm:text-xl text-origami-slate leading-snug">
                {currentStop.name}
              </h3>
              <p className="text-xs text-gray-600 flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                <span>{currentStop.landmark}</span>
              </p>
            </div>

            {/* Stop Action Single-Tap Buttons (Operable in portrait dock orientation with min-h-[64px]) */}
            <div className="grid grid-cols-3 gap-2 shrink-0">
              {/* Skip Stop */}
              <button
                onClick={() => handleStopSkip(currentStop)}
                className="origami-btn min-h-[64px] min-w-[72px] px-3 py-2 bg-paper-sheet hover:bg-gray-200 text-gray-700 font-black text-xs rounded border border-gray-400 flex flex-col items-center justify-center gap-1"
                title="Langkau Hentian Ini"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
                <span>Langkau</span>
              </button>

              {/* +1 Min Wait Buffer */}
              <button
                onClick={() => handleAddStopBuffer(currentStop)}
                className="origami-btn min-h-[64px] min-w-[72px] px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-xs rounded border border-amber-300 flex flex-col items-center justify-center gap-1"
                title="Tambah 1 Minit Waktu Menunggu"
              >
                <PlusCircle className="w-5 h-5 text-amber-700" />
                <span>+1 Minit</span>
              </button>

              {/* Selesai / Boarded */}
              <button
                onClick={() => handleStopComplete(currentStop)}
                className="origami-btn origami-btn-primary min-h-[64px] min-w-[90px] px-4 py-2 text-xs font-black rounded flex flex-col items-center justify-center gap-1 shadow-paper"
                title="Selesai Hentian Ini"
              >
                <CheckCircle2 className="w-5 h-5 text-origami-slate" />
                <span>Selesai</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sequential Manifest Checklist */}
      <div className="bg-white rounded-lg border-2 border-paper-creaseDark p-4 shadow-paper space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-paper-creaseDark pb-3">
          <div>
            <h3 className="font-black text-sm text-origami-slate">
              Manifest Murid Mengikut Urutan Laluan Saujana
            </h3>
            <p className="text-xs text-gray-500">
              Kemas kini kehadiran murid dengan butang sentuh pantas minimum 64px
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1 bg-paper-sheet p-1 rounded border border-paper-crease text-xs">
            {(['all', 'waiting', 'boarded', 'absent'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-xs font-bold capitalize transition-all ${
                  activeFilter === filter
                    ? 'bg-origami-slate text-white shadow-xs'
                    : 'text-gray-600 hover:text-origami-slate'
                }`}
              >
                {filter === 'all'
                  ? 'Semua'
                  : filter === 'waiting'
                  ? 'Menunggu'
                  : filter === 'boarded'
                  ? 'Naik Bas'
                  : 'Cuti / MC'}
              </button>
            ))}
          </div>
        </div>

        {/* Student List */}
        <div className="space-y-3">
          {filteredStudents.map((student) => {
            const isAbsent = student.status === 'absent';
            const isBoarded = student.status === 'boarded';
            const isWaiting = student.status === 'waiting';

            return (
              <div
                key={student.id}
                className={`p-3 sm:p-4 rounded-md border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isAbsent
                    ? 'border-red-300 bg-red-50/40 opacity-80'
                    : isBoarded
                    ? 'border-emerald-300 bg-emerald-50/40'
                    : 'border-paper-creaseDark bg-white shadow-xs'
                }`}
              >
                {/* Left: Avatar & Info */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded bg-paper-sheet border border-origami-slate flex items-center justify-center p-0.5 shrink-0 shadow-xs">
                    <OrigamiAvatarIcon avatar={student.avatar} size={36} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-sm text-origami-slate truncate">
                        {student.name}
                      </h4>
                      <span className="text-[10px] font-mono text-gray-500 font-bold">
                        ({student.initials})
                      </span>

                      {/* Special Authorization / Delay Badges */}
                      {student.bufferSeconds ? (
                        <span className="bg-amber-200 text-amber-900 text-[10px] font-black px-1.5 py-0.5 rounded border border-amber-400">
                          ⏱️ Buffer: +{student.bufferSeconds}s
                        </span>
                      ) : null}

                      {student.afternoonFlag === 'grandma' && (
                        <span className="bg-teal-100 text-teal-900 text-[10px] font-black px-1.5 py-0.5 rounded border border-teal-300">
                          👵 Nenek Ambil Petang
                        </span>
                      )}

                      {student.afternoonFlag === 'self_pickup' && (
                        <span className="bg-purple-100 text-purple-900 text-[10px] font-black px-1.5 py-0.5 rounded border border-purple-300">
                          🚶 Pulang Sendiri Petang
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-gray-600 mt-0.5">
                      {student.grade} • {student.schoolName}
                    </div>

                    <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{student.pickupStopName}</span>
                    </div>

                    {student.statusNotes && (
                      <div className="text-[11px] font-bold text-origami-terracotta mt-1">
                        Nota: {student.statusNotes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Driver Action Toggles with Large Touch Targets (≥ 64px) */}
                <div className="grid grid-cols-3 sm:flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleStudentAction(student.id, 'boarded')}
                    className={`origami-btn min-h-[56px] sm:min-h-[64px] min-w-[70px] sm:min-w-[80px] px-3 py-2 rounded text-xs font-black flex flex-col items-center justify-center gap-1 transition-all ${
                      isBoarded
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-paper'
                        : 'bg-paper-sheet text-gray-700 hover:bg-emerald-100'
                    }`}
                    title="Tanda telah menaiki bas"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Naik Bas</span>
                  </button>

                  <button
                    onClick={() => handleStudentAction(student.id, 'absent')}
                    className={`origami-btn min-h-[56px] sm:min-h-[64px] min-w-[70px] sm:min-w-[80px] px-3 py-2 rounded text-xs font-black flex flex-col items-center justify-center gap-1 transition-all ${
                      isAbsent
                        ? 'bg-red-600 text-white border-red-700 shadow-paper'
                        : 'bg-paper-sheet text-gray-700 hover:bg-red-100'
                    }`}
                    title="Tanda tidak hadir / cuti"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Cuti (Skip)</span>
                  </button>

                  <a
                    href={`tel:${student.guardianPhone}`}
                    className="origami-btn min-h-[56px] sm:min-h-[64px] px-3 py-2 rounded bg-paper-sheet hover:bg-paper-crease text-gray-700 border border-gray-400 flex flex-col items-center justify-center gap-1"
                    title="Hubungi Waris"
                  >
                    <PhoneCall className="w-5 h-5 text-origami-teal" />
                    <span className="text-[10px]">Waris</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
