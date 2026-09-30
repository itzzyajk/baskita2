'use client';

import React, { useState } from 'react';
import { RouteData, BusStop } from '@/types';
import { ChevronUp, ChevronDown, CheckCircle2, Clock, MapPin, School, Sparkles } from 'lucide-react';

interface BottomSheetDrawerProps {
  route: RouteData;
  activeStopIndex: number;
  onSelectStop?: (stop: BusStop) => void;
  studentStopId?: string;
  studentSchoolId?: string;
}

export const BottomSheetDrawer: React.FC<BottomSheetDrawerProps> = ({
  route,
  activeStopIndex,
  onSelectStop,
  studentStopId,
  studentSchoolId,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);

  const completedStops = route.stops.filter((s, idx) => idx < activeStopIndex);
  const upcomingStops = route.stops.filter((s, idx) => idx >= activeStopIndex);
  const currentStop = route.stops[activeStopIndex] || route.stops[0];

  return (
    <div className="w-full bg-white border-t-2 border-origami-slate shadow-paper-xl rounded-t-xl transition-all duration-300">
      {/* Top Handle / Origami Fold Tab */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer py-2.5 px-4 flex flex-col items-center justify-center hover:bg-paper-sheet transition-colors rounded-t-xl border-b-2 border-paper-creaseDark"
      >
        <div className="w-12 h-1.5 bg-origami-slate/40 rounded-full mb-1.5"></div>
        <div className="w-full flex items-center justify-between text-xs sm:text-sm font-black text-slate-900">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-origami-yellow border border-origami-slate animate-ping"></span>
            <span>
              Hentian Semasa: <strong className="text-origami-terracotta bg-amber-50 px-2 py-0.5 rounded border border-origami-terracotta">{currentStop?.name || 'Saujana Depot'}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-800 hover:text-origami-slate bg-paper-sheet px-2.5 py-1 rounded border border-paper-creaseDark">
            <span>{isExpanded ? 'Lipat Jadual' : 'Buka Garis Masa'}</span>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 max-h-72 overflow-y-auto space-y-3 bg-paper-bg/60">
          {/* Folded Completed Stops Accordion */}
          {completedStops.length > 0 && (
            <div className="border-2 border-origami-slate rounded-md bg-white overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => setShowCompleted(!showCompleted)}
                className="w-full px-3.5 py-2.5 bg-paper-sheet flex items-center justify-between text-xs font-black text-slate-800 hover:bg-paper-crease transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>{completedStops.length} Hentian Telah Selesai (Dilipat)</span>
                </div>
                <span className="text-xs text-origami-teal font-black underline">
                  {showCompleted ? 'Tutup Senarai' : 'Lihat Rekod'}
                </span>
              </button>

              {showCompleted && (
                <div className="p-3 space-y-2 border-t-2 border-paper-creaseDark bg-paper-sheet/40">
                  {completedStops.map((stop) => (
                    <div
                      key={stop.id}
                      onClick={() => onSelectStop && onSelectStop(stop)}
                      className="flex items-center justify-between text-xs font-semibold text-slate-700 py-1.5 px-2.5 rounded bg-white border border-paper-crease hover:border-slate-400 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                          ✓
                        </span>
                        <span className="line-through">{stop.name}</span>
                      </div>
                      <span className="text-xs text-slate-600 font-mono font-bold">{stop.scheduledTime}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upcoming Stops Timeline */}
          <div className="space-y-2.5">
            <div className="text-xs font-black uppercase tracking-wider text-slate-800 px-1">
              Garis Masa Perjalanan Semasa (Saujana Express)
            </div>

            {upcomingStops.map((stop, index) => {
              const isFirstUpcoming = index === 0;
              const isChildPickup = stop.id === studentStopId;
              const isChildSchool = stop.schoolId === studentSchoolId;

              return (
                <div
                  key={stop.id}
                  onClick={() => onSelectStop && onSelectStop(stop)}
                  className={`p-3 rounded-md border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                    isFirstUpcoming
                      ? 'border-origami-terracotta bg-white shadow-paper ring-1 ring-origami-terracotta'
                      : isChildPickup
                      ? 'border-origami-yellow bg-amber-50 shadow-paper ring-1 ring-origami-yellow'
                      : isChildSchool
                      ? 'border-origami-teal bg-teal-50 shadow-paper ring-1 ring-origami-teal'
                      : 'border-origami-slate bg-white hover:bg-paper-sheet'
                  }`}
                >
                  {/* Sequence Number / Pulse */}
                  <div className="mt-0.5">
                    {isFirstUpcoming ? (
                      <div className="w-7 h-7 rounded-full bg-origami-terracotta text-white flex items-center justify-center font-black text-xs shadow-xs animate-pulse border border-white">
                        {stop.sequence}
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-paper-sheet border-2 border-origami-slate text-origami-slate flex items-center justify-center font-black text-xs">
                        {stop.sequence}
                      </div>
                    )}
                  </div>

                  {/* Stop Information */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <h4 className="font-black text-xs sm:text-sm text-slate-900 truncate">
                        {stop.name}
                      </h4>
                      <span className="font-mono text-xs font-black text-slate-900 bg-paper-sheet px-2 py-0.5 rounded border border-origami-slate">
                        {stop.scheduledTime}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 font-medium mt-1 truncate flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{stop.landmark}</span>
                    </div>

                    {/* Special Badges for Child Stop */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {isFirstUpcoming && (
                        <span className="bg-origami-terracotta text-white text-[10px] font-black px-2 py-0.5 rounded-xs uppercase tracking-wide border border-origami-slate shadow-xs">
                          Sedang Dituju
                        </span>
                      )}
                      {isChildPickup && (
                        <span className="bg-origami-yellow text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-xs border-2 border-origami-slate uppercase shadow-xs">
                          📍 Lokasi Ambil Anak Anda
                        </span>
                      )}
                      {isChildSchool && (
                        <span className="bg-origami-teal text-white text-[10px] font-black px-2 py-0.5 rounded-xs uppercase border border-origami-slate shadow-xs">
                          🏫 Destinasi Sekolah Anak
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
