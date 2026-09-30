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
  ShieldCheck,
  AlertTriangle,
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
      {/* Cockpit HUD Header - In-Vehicle Tablet Dock Theme */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-lg border-2 border-origami-slate shadow-paper-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-md bg-origami-yellow border-2 border-white flex items-center justify-center shadow-paper transform -rotate-1">
              <span className="font-black text-slate-900 text-2xl font-mono">01</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-lg sm:text-xl text-white tracking-tight">
                  Kokpit Pemandu: {activeBus.name}
                </h2>
                <span className="bg-emerald-500 text-slate-950 text-xs font-black px-2 py-0.5 rounded border border-white">
                  APAD AKTIF
                </span>
              </div>
              <p className="text-xs sm:text-sm text-paper-crease font-mono font-bold mt-0.5">
                Plat: {activeBus.plateNumber} • Pemandu: {activeBus.driverName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Audio Voice Test Button */}
            <button
              onClick={handleTestAudio}
              className={`origami-btn px-3.5 py-2.5 rounded text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-xs ${
                speechTested
                  ? 'bg-emerald-600 text-white border-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-400'
              }`}
              title="Uji Pembesar Suara"
            >
              <Volume2 className="w-4 h-4 text-origami-yellow" />
              <span>Uji Suara</span>
            </button>

            {/* Master One-Tap Route Execution Button (≥ 64px touch target) */}
            <button
              onClick={handleToggleRoute}
              className={`origami-btn min-h-[58px] sm:min-h-[64px] px-5 sm:px-6 py-3 rounded font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-paper active:scale-95 transition-transform ${
                routeActive
                  ? 'bg-origami-terracotta text-white border-2 border-white'
                  : 'bg-origami-yellow text-slate-900 border-2 border-slate-900'
              }`}
            >
              {routeActive ? (
                <>
                  <Square className="w-5 h-5 fill-white" />
                  <span>Henti Trip GPS</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-slate-900" />
                  <span>Mula Laluan (GPS)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Headcount Dashboard Gauges - High Contrast */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t-2 border-slate-700">
          <div className="bg-slate-800/90 border-2 border-slate-600 p-2.5 rounded text-center shadow-xs">
            <div className="text-xs uppercase font-black text-slate-300">Jumlah Murid</div>
            <div className="text-2xl font-black text-white font-mono">{totalStudents}</div>
          </div>
          <div className="bg-emerald-950/80 border-2 border-emerald-500 p-2.5 rounded text-center shadow-xs">
            <div className="text-xs uppercase font-black text-emerald-300">Naik Bas</div>
            <div className="text-2xl font-black text-emerald-400 font-mono">{boardedCount}</div>
          </div>
          <div className="bg-amber-950/80 border-2 border-amber-500 p-2.5 rounded text-center shadow-xs">
            <div className="text-xs uppercase font-black text-amber-300">Menunggu</div>
            <div className="text-2xl font-black text-amber-400 font-mono">{waitingCount}</div>
          </div>
          <div className="bg-red-950/80 border-2 border-red-500 p-2.5 rounded text-center shadow-xs">
            <div className="text-xs uppercase font-black text-red-300">Cuti / MC</div>
            <div className="text-2xl font-black text-red-400 font-mono">{absentCount}</div>
          </div>
        </div>
      </div>

      {/* Next Stop High-Contrast HUD Card with Large Touch Targets (≥ 64px) */}
      {currentStop && (
        <div className="origami-card origami-folded-corner p-4 sm:p-6 rounded-lg border-2 border-origami-slate bg-white shadow-paper-lg">
          <div className="flex items-center justify-between border-b-2 border-slate-300 pb-3 mb-3.5">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-origami-terracotta">
              <Navigation className="w-5 h-5 text-origami-terracotta animate-pulse" />
              <span>Hentian Semasa / Seterusnya (#{currentStop.sequence})</span>
            </div>

            <div className="flex items-center gap-2">
              {currentStop.waitBufferSeconds ? (
                <span className="text-xs sm:text-sm font-mono font-black bg-amber-100 text-amber-950 border-2 border-amber-500 px-2.5 py-0.5 rounded shadow-xs">
                  +{(currentStop.waitBufferSeconds / 60).toFixed(0)} min Buffer
                </span>
              ) : null}
              <span className="text-xs sm:text-sm font-mono font-black bg-origami-yellow px-3 py-1 rounded text-slate-900 border-2 border-origami-slate shadow-xs">
                {currentStop.scheduledTime}
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-xl sm:text-2xl text-slate-900 leading-snug">
                {currentStop.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-bold flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-slate-600 shrink-0" />
                <span>{currentStop.landmark}</span>
              </p>
            </div>

            {/* Stop Action Single-Tap Buttons (Operable in portrait dock orientation with min-h-[64px]) */}
            <div className="grid grid-cols-3 gap-2.5 shrink-0">
              {/* Skip Stop */}
              <button
                onClick={() => handleStopSkip(currentStop)}
                className="origami-btn min-h-[64px] min-w-[76px] px-3 py-2 bg-paper-sheet hover:bg-slate-200 text-slate-800 font-black text-xs sm:text-sm rounded border-2 border-slate-500 flex flex-col items-center justify-center gap-1 shadow-paper"
                title="Langkau Hentian Ini"
              >
                <XCircle className="w-5 h-5 text-slate-700" />
                <span>Langkau</span>
              </button>

              {/* +1 Min Wait Buffer */}
              <button
                onClick={() => handleAddStopBuffer(currentStop)}
                className="origami-btn min-h-[64px] min-w-[76px] px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs sm:text-sm rounded border-2 border-amber-600 flex flex-col items-center justify-center gap-1 shadow-paper"
                title="Tambah 1 Minit Waktu Menunggu"
              >
                <PlusCircle className="w-5 h-5 text-amber-800" />
                <span>+1 Minit</span>
              </button>

              {/* Selesai / Boarded */}
              <button
                onClick={() => handleStopComplete(currentStop)}
                className="origami-btn origami-btn-primary min-h-[64px] min-w-[96px] px-4 py-2 text-xs sm:text-sm font-black rounded flex flex-col items-center justify-center gap-1 shadow-paper"
                title="Selesai Hentian Ini"
              >
                <CheckCircle2 className="w-6 h-6 text-slate-900" />
                <span>Selesai</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sequential Manifest Checklist */}
      <div className="bg-white rounded-lg border-2 border-origami-slate p-4 sm:p-5 shadow-paper-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-paper-creaseDark pb-3">
          <div>
            <h3 className="font-black text-base text-slate-900">
              Manifest Murid Mengikut Urutan Laluan Saujana
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 font-bold mt-0.5">
              Kemas kini kehadiran murid dengan butang sentuh pantas minimum 64px
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 bg-paper-sheet p-1 rounded-md border-2 border-origami-slate text-xs font-black">
            {(['all', 'waiting', 'boarded', 'absent'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-xs font-black capitalize transition-all ${
                  activeFilter === filter
                    ? 'bg-origami-slate text-white shadow-paper'
                    : 'text-slate-800 hover:text-origami-slate'
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
                className={`p-3.5 sm:p-4 rounded-lg border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isAbsent
                    ? 'border-red-400 bg-red-50/70 shadow-xs'
                    : isBoarded
                    ? 'border-emerald-400 bg-emerald-50/70 shadow-xs'
                    : 'border-origami-slate bg-white shadow-paper'
                }`}
              >
                {/* Left: Avatar & Info */}
                <div className="flex items-start gap-3.5">
                  <div className="w-14 h-14 rounded bg-paper-sheet border-2 border-origami-slate flex items-center justify-center p-1 shrink-0 shadow-xs">
                    <OrigamiAvatarIcon avatar={student.avatar} size={42} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-black text-base text-slate-900 truncate">
                        {student.name}
                      </h4>
                      <span className="text-xs font-mono text-slate-700 font-black">
                        ({student.initials})
                      </span>
                    </div>

                    {/* Special Authorization / Delay Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      {student.afternoonFlag === 'grandma' && (
                        <span className="bg-teal-100 text-teal-950 text-xs font-black px-2 py-0.5 rounded border border-teal-500">
                          👵 Nenek Ambil Petang
                        </span>
                      )}

                      {student.afternoonFlag === 'self_pickup' && (
                        <span className="bg-purple-100 text-purple-950 text-xs font-black px-2 py-0.5 rounded border border-purple-500">
                          🚶 Pulang Sendiri Petang
                        </span>
                      )}
                    </div>

                    <div className="text-xs sm:text-sm text-slate-800 font-bold mt-1">
                      {student.grade} • {student.schoolName}
                    </div>

                    <div className="text-xs text-slate-700 font-medium flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{student.pickupStopName}</span>
                    </div>

                    {/* Normal Status Notes if no active buffer */}
                    {student.statusNotes && (!student.bufferSeconds || student.bufferSeconds === 0) && (
                      <div className="text-xs font-bold text-slate-700 mt-1.5 bg-slate-100 p-1.5 rounded border border-slate-300">
                        Nota: {student.statusNotes}
                      </div>
                    )}

                    {/* Prominent Amber Alert Banner for Active Parent Dispatch Delay Buffer */}
                    {student.bufferSeconds && student.bufferSeconds > 0 ? (
                      <div className="mt-2.5 p-2 bg-amber-100 border-2 border-amber-500 rounded-md flex items-center justify-between gap-2 shadow-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <Clock className="w-4 h-4 text-amber-900 shrink-0 animate-pulse" />
                          <div className="text-xs sm:text-sm font-black text-amber-950 truncate">
                            ⏱️ Buffer: +{student.bufferSeconds}s (Pesan Ibu Bapa: {student.statusNotes || 'Lewat'})
                          </div>
                        </div>
                        <button
                          onClick={() => actions.dismissStudentBuffer(student.id)}
                          className="origami-btn shrink-0 bg-amber-200 hover:bg-amber-300 text-amber-950 border border-amber-600 px-2.5 py-1 rounded text-xs font-black shadow-xs active:scale-95"
                          title="Selesaikan atau padam nota buffer ini"
                        >
                          Padam ✕
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Right: Driver Action Toggles with Large Tactile Touch Targets (≥ 64px) */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 self-end sm:self-center">
                  {isWaiting ? (
                    <>
                      {/* [Naik Bas] min-h-[64px], Teal/Green Accent */}
                      <button
                        onClick={() => handleStudentAction(student.id, 'boarded')}
                        className="origami-btn min-h-[64px] min-w-[80px] sm:min-w-[92px] px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm border-2 border-emerald-800 flex flex-col items-center justify-center gap-1 shadow-paper active:scale-95 transition-all"
                        title="Tanda telah menaiki bas"
                      >
                        <CheckCircle2 className="w-5 h-5 text-white" />
                        <span>Naik Bas</span>
                      </button>

                      {/* [Cuti] min-h-[64px], Terracotta/Red Accent */}
                      <button
                        onClick={() => handleStudentAction(student.id, 'absent')}
                        className="origami-btn min-h-[64px] min-w-[76px] sm:min-w-[84px] px-3 py-2 rounded bg-origami-terracotta hover:bg-red-700 text-white font-black text-xs sm:text-sm border-2 border-red-900 flex flex-col items-center justify-center gap-1 shadow-paper active:scale-95 transition-all"
                        title="Tanda tidak hadir / cuti hari ini"
                      >
                        <XCircle className="w-5 h-5 text-white" />
                        <span>Cuti (Skip)</span>
                      </button>

                      {/* [+1 Minit] min-h-[64px], Canary Yellow Accent */}
                      <button
                        onClick={() => actions.addStudentWaitBuffer(student.id, 60)}
                        className="origami-btn min-h-[64px] min-w-[68px] sm:min-w-[74px] px-2.5 py-2 rounded bg-origami-yellow hover:bg-amber-300 text-slate-900 font-black text-xs sm:text-sm border-2 border-slate-900 flex flex-col items-center justify-center gap-1 shadow-paper active:scale-95 transition-all"
                        title="Tambah 1 minit buffer waktu menunggu untuk murid ini"
                      >
                        <PlusCircle className="w-5 h-5 text-slate-900" />
                        <span>+1 Min</span>
                      </button>
                    </>
                  ) : isBoarded ? (
                    <div className="flex items-center gap-2">
                      <div className="min-h-[64px] px-4 py-2 bg-emerald-100 border-2 border-emerald-600 rounded flex flex-col items-center justify-center text-emerald-950 font-black text-xs sm:text-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                        <span>Sudah Naik</span>
                      </div>
                      <button
                        onClick={() => handleStudentAction(student.id, 'waiting')}
                        className="origami-btn min-h-[64px] px-2.5 py-2 bg-paper-sheet hover:bg-slate-200 text-slate-800 text-xs font-black rounded border-2 border-slate-400"
                        title="Ubah kembali ke status Menunggu"
                      >
                        Ubah
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="min-h-[64px] px-4 py-2 bg-red-100 border-2 border-red-500 rounded flex flex-col items-center justify-center text-red-950 font-black text-xs sm:text-sm">
                        <XCircle className="w-5 h-5 text-red-700" />
                        <span>Cuti / MC</span>
                      </div>
                      <button
                        onClick={() => handleStudentAction(student.id, 'waiting')}
                        className="origami-btn min-h-[64px] px-2.5 py-2 bg-paper-sheet hover:bg-slate-200 text-slate-800 text-xs font-black rounded border-2 border-slate-400"
                        title="Ubah kembali ke status Menunggu"
                      >
                        Ubah
                      </button>
                    </div>
                  )}

                  {/* Guardian Phone Call */}
                  <a
                    href={`tel:${student.guardianPhone}`}
                    className="origami-btn min-h-[64px] min-w-[60px] px-2.5 py-2 rounded bg-paper-sheet hover:bg-paper-crease text-slate-900 border-2 border-slate-500 flex flex-col items-center justify-center gap-1 shadow-paper active:scale-95"
                    title={`Hubungi Waris: ${student.guardianPhone}`}
                  >
                    <PhoneCall className="w-5 h-5 text-origami-teal" />
                    <span className="text-[11px] font-black">Waris</span>
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
