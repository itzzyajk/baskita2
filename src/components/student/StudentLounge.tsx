'use client';

import React, { useState, useEffect } from 'react';
import { useBusStore } from '@/store/busState';
import { MiniGameId, StudentLoungeMode } from '@/types';
import { KipTheKancil, RexTheHelang, CompanionDialog } from '@/components/companions/OrigamiCompanions';
import { PaperBusRunner } from './games/PaperBusRunner';
import { RouteFoldPuzzle } from './games/RouteFoldPuzzle';
import { TransitDrift } from './games/TransitDrift';
import { TransitTrivia } from './games/TransitTrivia';
import { sounds } from '@/components/common/SoundEffects';
import {
  Gamepad2,
  Clock,
  Navigation,
  ShieldCheck,
  Zap,
  Sparkles,
  AlertTriangle,
  Volume2,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

export const StudentLounge: React.FC = () => {
  const {
    students,
    activeStudentId,
    buses,
    routes,
    studentLoungeMode,
    activeMiniGame,
    actions,
  } = useBusStore();

  const currentStudent = students.find((s) => s.id === activeStudentId) || students[0];
  const activeBus = buses.find((b) => b.id === 'bus-01') || buses[0];
  const activeRoute = routes.find((r) => r.id === 'route-tj-01') || routes[0];

  // Derive minutes from activeBus.nextStopETA (e.g. "4 minit", "Sedang menghampiri")
  const etaText = activeBus.nextStopETA;
  const etaMinutes = etaText.includes('menghampiri')
    ? 1
    : parseInt(etaText.replace(/[^0-9]/g, ''), 10) || 5;

  const isArrivingSoon = etaMinutes <= 2;
  const is3to4Min = etaMinutes >= 3 && etaMinutes <= 4;
  const is5to10Min = etaMinutes >= 5;

  // Sound horn when bus reaches <= 2 mins
  useEffect(() => {
    if (isArrivingSoon && activeMiniGame) {
      sounds.playBusHorn();
      sounds.speakAnnouncement('Perhatian murid: Bas sekolah sedang tiba! Sila bergerak ke kaki lima sekarang.');
    }
  }, [isArrivingSoon, activeMiniGame]);

  const handleSelectMode = (mode: StudentLoungeMode) => {
    actions.setStudentLoungeMode(mode);
    sounds.playPaperFold();
  };

  const isJunior = studentLoungeMode === 'junior';

  return (
    <div
      className={`min-h-[600px] w-full max-w-5xl mx-auto px-2 sm:px-4 py-3 space-y-4 transition-colors duration-300 ${
        isJunior ? 'bg-paper-bg' : 'bg-slate-950 text-white'
      }`}
    >
      {/* PERSISTENT STICKY IN-GAME ETA HUD TICKET */}
      <div
        className={`sticky top-14 z-30 p-3.5 sm:p-4 rounded-lg border-2 shadow-paper-lg flex flex-wrap items-center justify-between gap-3 transition-all ${
          isArrivingSoon
            ? 'bg-origami-terracotta text-white border-2 border-white animate-pulse'
            : is3to4Min
            ? 'bg-amber-100 border-2 border-amber-600 text-slate-900'
            : isJunior
            ? 'bg-white border-2 border-origami-slate text-slate-900'
            : 'bg-slate-900 border-2 border-origami-teal text-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-md flex items-center justify-center font-bold text-xl shadow-paper ${
              isArrivingSoon
                ? 'bg-white text-origami-terracotta'
                : 'bg-origami-yellow text-slate-900 border-2 border-origami-slate'
            }`}
          >
            🚌
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xs sm:text-base uppercase tracking-wider">
                Status Bas 01 ({activeBus.plateNumber})
              </span>
              <span
                className={`text-xs font-black px-2 py-0.5 rounded uppercase border ${
                  isArrivingSoon
                    ? 'bg-white text-origami-terracotta border-white'
                    : 'bg-origami-teal text-white border-slate-900'
                }`}
              >
                {activeBus.speedKmH} KM/J
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold opacity-95 mt-0.5">
              Menuju ke hentian: <strong className="font-black">{currentStudent.pickupStopName.split('(')[0]}</strong>
            </p>
          </div>
        </div>

        {/* ETA Memo / Banner Progression Flow */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs uppercase font-black tracking-wide opacity-90">Anggaran Tiba (ETA)</div>
            <div className="text-base sm:text-lg font-black font-mono">
              {isArrivingSoon ? 'SEDANG TIBA (≤ 2 Min)' : activeBus.nextStopETA}
            </div>
          </div>

          {/* Interruption Memo Sticker */}
          <div
            className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-black shadow-paper border-2 flex items-center gap-2 ${
              isArrivingSoon
                ? 'bg-white text-origami-terracotta border-white animate-bounce'
                : is3to4Min
                ? 'bg-amber-200 border-amber-600 text-amber-950'
                : 'bg-emerald-100 border-emerald-600 text-emerald-950'
            }`}
          >
            {isArrivingSoon ? (
              <>
                <AlertTriangle className="w-5 h-5 text-origami-terracotta" />
                <span>KE KAKI LIMA SEKARANG!</span>
              </>
            ) : is3to4Min ? (
              <>
                <span>🎒</span>
                <span>3 hentian lagi! Kemas beg sekolah.</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Jadual lancar. Teruskan bermain.</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* FULL-SCREEN SAFE ARRIVAL INTERRUPT BANNER (≤ 2 mins) */}
      {isArrivingSoon && (
        <div className="bg-origami-terracotta text-white p-6 rounded-lg border-2 border-white shadow-paper-xl text-center space-y-3.5 animate-fadeIn">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-3xl shadow-paper animate-bounce">
            🚏
          </div>
          <h2 className="font-black text-2xl tracking-tight">
            Bas Kita Sudah Sampai! Sila Bersiap di Kaki Lima.
          </h2>
          <p className="text-sm max-w-lg mx-auto text-white font-bold leading-relaxed">
            Permainan dijeda secara automatik untuk keselamatan anda. Pastikan beg zip ditutup dan pas digital sedia untuk diimbas oleh Pak Cik Roslan.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => sounds.playBusHorn()}
              className="origami-btn bg-white text-origami-terracotta border-2 border-white px-5 py-2.5 rounded text-xs sm:text-sm font-black flex items-center gap-2 shadow-paper"
            >
              <Volume2 className="w-5 h-5" />
              <span>Bunyikan Hon Bas</span>
            </button>
            <button
              onClick={() => actions.setActiveMiniGame(null)}
              className="origami-btn bg-slate-900 text-white border-2 border-white px-5 py-2.5 rounded text-xs sm:text-sm font-black shadow-paper"
            >
              Tutup Permainan
            </button>
          </div>
        </div>
      )}

      {/* MODE TOGGLE & COMPANION HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-paper-creaseDark pb-3">
        {/* Age Adaptive Selector Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">
            Mod Zon Menunggu:
          </span>
          <div className="flex bg-white p-1 rounded-md border-2 border-origami-slate shadow-paper gap-1.5">
            <button
              onClick={() => handleSelectMode('junior')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs sm:text-sm font-black transition-all ${
                isJunior
                  ? 'bg-origami-yellow text-slate-900 border-2 border-origami-slate shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <KipTheKancil size={22} mood="happy" />
              <span>Junior (Kip 7-12)</span>
            </button>

            <button
              onClick={() => handleSelectMode('senior')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs sm:text-sm font-black transition-all ${
                !isJunior
                  ? 'bg-origami-teal text-white border-2 border-origami-slate shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <RexTheHelang size={22} mood="alert" />
              <span>Senior (Rex 13-17)</span>
            </button>
          </div>
        </div>

        {/* Back to Games button if in game */}
        {activeMiniGame && (
          <button
            onClick={() => actions.setActiveMiniGame(null)}
            className="origami-btn px-4 py-2 bg-paper-sheet hover:bg-paper-crease text-slate-900 text-xs sm:text-sm font-black rounded flex items-center gap-2 shadow-paper"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Pilih Permainan Lain</span>
          </button>
        )}
      </div>

      {/* COMPANION INTERACTIVE BANNER */}
      {!activeMiniGame && (
        <CompanionDialog
          guide={isJunior ? 'kip' : 'rex'}
          title={
            isJunior
              ? 'Selamat Pagi, Sahabat Cilik! Kip di sini sedia temankan kamu.'
              : 'Selamat Pagi. Rex pantau laluan Seksyen U2 dan telematik bas kamu.'
          }
          message={
            isJunior
              ? 'Bas 01 sedang membelok di Jalan Ilham. Main permainan lipatan kertas sambil menunggu, tapi ingat tengok amaran ketibaan!'
              : 'Kelajuan van konsisten 38 km/j. Sesuai untuk 1 pusingan time-trial drift atau ujian trivia transit sebelum bas tiba di lobi.'
          }
          actionText={isJunior ? '🌟 Peraturan Keselamatan Kip' : '⚡ Statistik Laluan Rex'}
          onAction={() => sounds.playChime('arrival')}
        />
      )}

      {/* ACTIVE MINI-GAME VIEWPORT */}
      {activeMiniGame === 'paper_bus_runner' && (
        <div className="py-2">
          <PaperBusRunner isBusArriving={isArrivingSoon} />
        </div>
      )}

      {activeMiniGame === 'route_fold_puzzle' && (
        <div className="py-2">
          <RouteFoldPuzzle isBusArriving={isArrivingSoon} />
        </div>
      )}

      {activeMiniGame === 'transit_drift' && (
        <div className="py-2">
          <TransitDrift isBusArriving={isArrivingSoon} />
        </div>
      )}

      {activeMiniGame === 'transit_trivia' && (
        <div className="py-2">
          <TransitTrivia isBusArriving={isArrivingSoon} />
        </div>
      )}

      {/* GAME SELECTION LAUNCHER (When no game is active) */}
      {!activeMiniGame && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3
              className={`font-black text-sm sm:text-base uppercase tracking-wider flex items-center gap-2 ${
                isJunior ? 'text-slate-900' : 'text-teal-300'
              }`}
            >
              <Gamepad2 className="w-5 h-5 text-origami-yellow" />
              <span>
                {isJunior
                  ? 'Arked Cilik Kip the Kancil (Ages 7–12)'
                  : 'Cabaran Kelajuan Rex the Helang (Ages 13–17)'}
              </span>
            </h3>
            <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded border border-slate-300">
              Pilih permainan 2D santai
            </span>
          </div>

          {/* Junior Games Lineup */}
          {isJunior && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Game 1: Paper Bus Runner */}
              <div
                onClick={() => actions.setActiveMiniGame('paper_bus_runner')}
                className="origami-card origami-folded-corner p-5 rounded-lg border-2 border-origami-slate bg-white shadow-paper hover:shadow-paper-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="bg-origami-yellow text-slate-900 text-xs font-black px-2.5 py-0.5 rounded border-2 border-origami-slate shadow-xs">
                      3-LANE RUNNER
                    </span>
                    <span className="text-xs font-mono font-black text-origami-terracotta">⭐ 180 Rekod</span>
                  </div>

                  <h4 className="font-black text-lg text-slate-900">Paper Bus Runner</h4>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium mt-1.5 leading-relaxed">
                    Kawal van origami kuning di 3 lorong. Elak kon halangan dan awan hujan, kutip bintang lipatan emas!
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-paper-creaseDark flex items-center justify-between text-xs sm:text-sm font-black text-origami-terracotta">
                  <span>Main Sekarang</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>

              {/* Game 2: Route Fold Puzzle */}
              <div
                onClick={() => actions.setActiveMiniGame('route_fold_puzzle')}
                className="origami-card origami-folded-corner p-5 rounded-lg border-2 border-origami-slate bg-white shadow-paper hover:shadow-paper-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="bg-origami-teal text-white text-xs font-black px-2.5 py-0.5 rounded border-2 border-origami-slate shadow-xs">
                      FOLD MEMORY
                    </span>
                    <span className="text-xs font-mono font-black text-slate-900">6 Haiwan Malaysia</span>
                  </div>

                  <h4 className="font-black text-lg text-slate-900">Route Fold Puzzle</h4>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium mt-1.5 leading-relaxed">
                    Uji ketajaman ingatan dengan membuka lipatan kertas haiwan terlindung: Kancil, Harimau, Kenyalang & Gajah.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-paper-creaseDark flex items-center justify-between text-xs sm:text-sm font-black text-origami-teal">
                  <span>Buka Lipatan</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          )}

          {/* Senior Games Lineup */}
          {!isJunior && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Game 3: Transit Drift */}
              <div
                onClick={() => actions.setActiveMiniGame('transit_drift')}
                className="p-5 rounded-lg border-2 border-origami-teal bg-slate-900 shadow-paper hover:shadow-paper-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="bg-origami-terracotta text-white text-xs font-black px-2.5 py-0.5 rounded border border-white">
                      TIME-TRIAL DRIFT
                    </span>
                    <span className="text-xs font-mono font-black text-origami-yellow">3 Litar Pusingan</span>
                  </div>

                  <h4 className="font-black text-lg text-white">Transit Drift: Neon Crease</h4>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1.5 leading-relaxed font-medium">
                    Litar Bulatan Seksyen 13 berdekatan Stadium Shah Alam. Asah teknik drift selekoh tajam dan cipta rekod masa terpantas.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-slate-800 flex items-center justify-between text-xs sm:text-sm font-black text-teal-300">
                  <span>Mula Perlumbaan</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>

              {/* Game 4: Shah Alam Transit Trivia */}
              <div
                onClick={() => actions.setActiveMiniGame('transit_trivia')}
                className="p-5 rounded-lg border-2 border-origami-teal bg-slate-900 shadow-paper hover:shadow-paper-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="bg-origami-yellow text-slate-900 text-xs font-black px-2.5 py-0.5 rounded border border-origami-slate">
                      15s QUICK QUIZ
                    </span>
                    <span className="text-xs font-mono font-black text-teal-300">5 Soalan Shah Alam</span>
                  </div>

                  <h4 className="font-black text-lg text-white">Shah Alam Transit Trivia</h4>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1.5 leading-relaxed font-medium">
                    Ujian kepantasan minda 15 saat. Kuasai selok-belok laluan TTDI Jaya, lebuhraya utama, dan SOP keselamatan.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-slate-800 flex items-center justify-between text-xs sm:text-sm font-black text-origami-yellow">
                  <span>Mulakan Ujian</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          )}

          {/* Junior Road Safety Cards */}
          {isJunior && (
            <div className="origami-memo-yellow p-4 sm:p-5 rounded-lg border-2 border-origami-slate shadow-paper text-xs sm:text-sm space-y-2.5">
              <div className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-origami-teal" />
                <span>3 Peraturan Emas Beratur Bas dari Kip:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-900">
                <div className="bg-white p-3 rounded-md border-2 border-amber-300 shadow-xs">
                  <strong className="block text-slate-900 mb-0.5">1. Jarak 2 Langkah:</strong> Berdiri sekurang-kurangnya 2 langkah ke belakang dari tepi jalan raya.
                </div>
                <div className="bg-white p-3 rounded-md border-2 border-amber-300 shadow-xs">
                  <strong className="block text-slate-900 mb-0.5">2. Tunggu Bas Berhenti:</strong> Jangan meluru masuk sebelum pintu bas dibuka sepenuhnya.
                </div>
                <div className="bg-white p-3 rounded-md border-2 border-amber-300 shadow-xs">
                  <strong className="block text-slate-900 mb-0.5">3. Tali Pinggang Keledar:</strong> Pasang tali pinggang keledar sebaik duduk di tempat anda.
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
