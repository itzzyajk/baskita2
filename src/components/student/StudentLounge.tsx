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
      {/* PERSISTENT STICKY IN-GAME ETA HUD */}
      <div
        className={`sticky top-14 z-30 p-3 rounded-lg border-2 shadow-paper-lg flex flex-wrap items-center justify-between gap-3 transition-all ${
          isArrivingSoon
            ? 'bg-origami-terracotta text-white border-white animate-pulse'
            : is3to4Min
            ? 'bg-amber-100 border-origami-yellow text-origami-slate'
            : isJunior
            ? 'bg-white border-paper-creaseDark text-origami-slate'
            : 'bg-slate-900 border-origami-teal text-white'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-sm flex items-center justify-center font-bold text-sm shadow-xs ${
              isArrivingSoon
                ? 'bg-white text-origami-terracotta'
                : 'bg-origami-yellow text-origami-slate border border-origami-slate'
            }`}
          >
            🚌
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xs sm:text-sm uppercase tracking-wider">
                Status Bas 01: {activeBus.plateNumber}
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                  isArrivingSoon
                    ? 'bg-white text-origami-terracotta'
                    : 'bg-origami-teal text-white'
                }`}
              >
                {activeBus.speedKmH} km/j
              </span>
            </div>
            <p className="text-[11px] opacity-90">
              Menuju ke hentian: <strong>{currentStudent.pickupStopName.split('(')[0]}</strong>
            </p>
          </div>
        </div>

        {/* ETA Memo / Banner Progression Flow */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold opacity-80">Anggaran Tiba (ETA)</div>
            <div className="text-base font-black font-mono">
              {isArrivingSoon ? 'SEDANG TIBA (≤ 2 Min)' : activeBus.nextStopETA}
            </div>
          </div>

          {/* Interruption Memo Sticker */}
          <div
            className={`px-3 py-1.5 rounded text-xs font-bold shadow-xs border flex items-center gap-1.5 ${
              isArrivingSoon
                ? 'bg-white text-origami-terracotta border-white animate-bounce'
                : is3to4Min
                ? 'bg-amber-200 border-amber-400 text-amber-900'
                : 'bg-emerald-100 border-emerald-300 text-emerald-800'
            }`}
          >
            {isArrivingSoon ? (
              <>
                <AlertTriangle className="w-4 h-4 text-origami-terracotta" />
                <span>KE KAKI LIMA SEKARANG!</span>
              </>
            ) : is3to4Min ? (
              <>
                <span>🎒</span>
                <span>3 hentian lagi! Kemas beg sekolah.</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Jadual lancar. Teruskan bermain.</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* FULL-SCREEN SAFE ARRIVAL INTERRUPT BANNER (≤ 2 mins) */}
      {isArrivingSoon && (
        <div className="bg-origami-terracotta text-white p-5 rounded-lg border-2 border-white shadow-paper-xl text-center space-y-3 animate-fadeIn">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto text-2xl shadow-paper animate-bounce">
            🚏
          </div>
          <h2 className="font-black text-xl tracking-tight">
            Bas Kita Sudah Sampai! Sila Bersiap di Kaki Lima.
          </h2>
          <p className="text-xs max-w-md mx-auto text-paper-bg leading-relaxed">
            Permainan dijeda secara automatik untuk keselamatan anda. Pastikan beg zip ditutup dan pas digital sedia untuk diimbas oleh Pak Cik Roslan.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => sounds.playBusHorn()}
              className="origami-btn bg-white text-origami-terracotta border-white px-4 py-2 rounded text-xs font-black flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4" />
              <span>Bunyikan Hon Bas</span>
            </button>
            <button
              onClick={() => actions.setActiveMiniGame(null)}
              className="origami-btn bg-origami-slate text-white border-white px-4 py-2 rounded text-xs font-black"
            >
              Tutup Permainan
            </button>
          </div>
        </div>
      )}

      {/* MODE TOGGLE & COMPANION HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-paper-creaseDark pb-3">
        {/* Age Adaptive Selector Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider opacity-70">
            Mod Zon Menunggu:
          </span>
          <div className="flex bg-white/10 p-1 rounded border border-paper-creaseDark shadow-paper gap-1">
            <button
              onClick={() => handleSelectMode('junior')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-black transition-all ${
                isJunior
                  ? 'bg-origami-yellow text-origami-slate border border-origami-slate shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <KipTheKancil size={20} mood="happy" />
              <span>Junior (Kip 7-12)</span>
            </button>

            <button
              onClick={() => handleSelectMode('senior')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-black transition-all ${
                !isJunior
                  ? 'bg-origami-teal text-white border border-white shadow-xs'
                  : 'text-gray-600 hover:text-origami-slate'
              }`}
            >
              <RexTheHelang size={20} mood="alert" />
              <span>Senior (Rex 13-17)</span>
            </button>
          </div>
        </div>

        {/* Back to Games button if in game */}
        {activeMiniGame && (
          <button
            onClick={() => actions.setActiveMiniGame(null)}
            className="origami-btn px-3 py-1.5 bg-paper-sheet hover:bg-paper-crease text-origami-slate text-xs font-bold rounded flex items-center gap-1 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
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
              className={`font-black text-sm uppercase tracking-wider flex items-center gap-2 ${
                isJunior ? 'text-origami-slate' : 'text-teal-300'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>
                {isJunior
                  ? 'Arked Cilik Kip the Kancil (Ages 7–12)'
                  : 'Cabaran Kelajuan Rex the Helang (Ages 13–17)'}
              </span>
            </h3>
            <span className="text-[11px] opacity-70">Pilih permainan 2D santai</span>
          </div>

          {/* Junior Games Lineup */}
          {isJunior && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Game 1: Paper Bus Runner */}
              <div
                onClick={() => actions.setActiveMiniGame('paper_bus_runner')}
                className="origami-card origami-folded-corner p-4 rounded-lg border-2 border-origami-slate bg-white shadow-paper hover:shadow-paper-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-origami-yellow text-origami-slate text-[10px] font-black px-2 py-0.5 rounded border border-origami-slate">
                      3-LANE RUNNER
                    </span>
                    <span className="text-xs font-mono font-bold text-origami-terracotta">⭐ 180 Rekod</span>
                  </div>

                  <h4 className="font-black text-base text-origami-slate">Paper Bus Runner</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Kawal van origami kuning di 3 lorong. Elak kon halangan dan awan hujan, kutip bintang lipatan emas!
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-paper-creaseDark flex items-center justify-between text-xs font-bold text-origami-terracotta">
                  <span>Main Sekarang</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Game 2: Route Fold Puzzle */}
              <div
                onClick={() => actions.setActiveMiniGame('route_fold_puzzle')}
                className="origami-card origami-folded-corner p-4 rounded-lg border-2 border-origami-slate bg-white shadow-paper hover:shadow-paper-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-origami-teal text-white text-[10px] font-black px-2 py-0.5 rounded border border-origami-slate">
                      FOLD MEMORY
                    </span>
                    <span className="text-xs font-mono font-bold text-origami-slate">6 Haiwan Malaysia</span>
                  </div>

                  <h4 className="font-black text-base text-origami-slate">Route Fold Puzzle</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Uji ketajaman ingatan dengan membuka lipatan kertas haiwan terlindung: Kancil, Harimau, Kenyalang & Gajah.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-paper-creaseDark flex items-center justify-between text-xs font-bold text-origami-teal">
                  <span>Buka Lipatan</span>
                  <ChevronRight className="w-4 h-4" />
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
                className="p-4 rounded-lg border-2 border-origami-teal bg-slate-900 shadow-paper hover:shadow-paper-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-origami-terracotta text-white text-[10px] font-black px-2 py-0.5 rounded border border-white">
                      TIME-TRIAL DRIFT
                    </span>
                    <span className="text-xs font-mono font-bold text-origami-yellow">3 Litar Pusingan</span>
                  </div>

                  <h4 className="font-black text-base text-white">Transit Drift: Neon Crease</h4>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    Litar Bulatan Seksyen 13 berdekatan Stadium Shah Alam. Asah teknik drift selekoh tajam dan cipta rekod masa terpantas.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-teal-300">
                  <span>Mula Perlumbaan</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Game 4: Shah Alam Transit Trivia */}
              <div
                onClick={() => actions.setActiveMiniGame('transit_trivia')}
                className="p-4 rounded-lg border-2 border-origami-teal bg-slate-900 shadow-paper hover:shadow-paper-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-origami-yellow text-origami-slate text-[10px] font-black px-2 py-0.5 rounded border border-origami-slate">
                      15s QUICK QUIZ
                    </span>
                    <span className="text-xs font-mono font-bold text-teal-300">5 Soalan Shah Alam</span>
                  </div>

                  <h4 className="font-black text-base text-white">Shah Alam Transit Trivia</h4>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    Ujian kepantasan minda 15 saat. Kuasai selok-belok laluan TTDI Jaya, lebuhraya utama, dan SOP keselamatan.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-origami-yellow">
                  <span>Mulakan Ujian</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          {/* Junior Road Safety Cards */}
          {isJunior && (
            <div className="bg-amber-50 border border-origami-yellow p-3.5 rounded-lg text-xs space-y-2">
              <div className="font-black text-origami-slate flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-origami-teal" />
                <span>3 Peraturan Emas Beratur Bas dari Kip:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-gray-700">
                <div className="bg-white p-2 rounded border border-amber-200">
                  <strong>1. Jarak 2 Langkah:</strong> Berdiri sekurang-kurangnya 2 langkah ke belakang dari tepi jalan raya.
                </div>
                <div className="bg-white p-2 rounded border border-amber-200">
                  <strong>2. Tunggu Bas Berhenti:</strong> Jangan meluru masuk sebelum pintu bas dibuka sepenuhnya.
                </div>
                <div className="bg-white p-2 rounded border border-amber-200">
                  <strong>3. Tali Pinggang Keledar:</strong> Pasang tali pinggang keledar sebaik duduk di tempat anda.
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
