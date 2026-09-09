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
    <div className="w-full bg-white border-t-2 border-paper-creaseDark shadow-paper-xl rounded-t-xl transition-all duration-300">
      {/* Top Handle / Origami Fold Tab */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer py-2 px-4 flex flex-col items-center justify-center hover:bg-paper-sheet transition-colors rounded-t-xl border-b border-paper-crease"
      >
        <div className="w-12 h-1.5 bg-paper-creaseDark rounded-full mb-1"></div>
        <div className="w-full flex items-center justify-between text-xs font-bold text-origami-slate">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-origami-yellow animate-ping"></span>
            <span>Hentian Seterusnya: <strong className="text-origami-terracotta">{currentStop?.name || 'Menuju Destinasi'}</strong></span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 hover:text-origami-slate">
            <span>{isExpanded ? 'Lipat Jadual' : 'Buka Garis Masa'}</span>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 max-h-72 overflow-y-auto space-y-3 bg-paper-bg/40">
          {/* Folded Completed Stops Accordion */}
          {completedStops.length > 0 && (
            <div className="border border-paper-creaseDark rounded bg-white overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => setShowCompleted(!showCompleted)}
                className="w-full px-3 py-2 bg-paper-sheet/80 flex items-center justify-between text-xs font-bold text-gray-600 hover:bg-paper-sheet transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-origami-teal" />
                  <span>{completedStops.length} Hentian Telah Selesai (Dilipat)</span>
                </div>
                <span className="text-[11px] text-origami-teal font-semibold underline">
                  {showCompleted ? 'Tutup' : 'Lihat'}
                </span>
              </button>

              {showCompleted && (
                <div className="p-2.5 space-y-2 border-t border-paper-crease bg-paper-sheet/30">
                  {completedStops.map((stop) => (
                    <div
                      key={stop.id}
                      onClick={() => onSelectStop && onSelectStop(stop)}
                      className="flex items-center justify-between text-xs text-gray-500 py-1 px-2 rounded hover:bg-white cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 text-[10px] flex items-center justify-center font-bold">
                          ✓
                        </span>
                        <span className="line-through">{stop.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">{stop.scheduledTime}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upcoming Stops Timeline */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 px-1">
              Garis Masa Perjalanan Semasa
            </div>

            {upcomingStops.map((stop, index) => {
              const isFirstUpcoming = index === 0;
              const isChildPickup = stop.id === studentStopId;
              const isChildSchool = stop.schoolId === studentSchoolId;

              return (
                <div
                  key={stop.id}
                  onClick={() => onSelectStop && onSelectStop(stop)}
                  className={`p-3 rounded-md border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    isFirstUpcoming
                      ? 'border-origami-terracotta bg-white shadow-paper'
                      : isChildPickup
                      ? 'border-origami-yellow bg-amber-50/50 shadow-xs'
                      : isChildSchool
                      ? 'border-origami-teal bg-teal-50/50 shadow-xs'
                      : 'border-paper-creaseDark bg-white hover:border-gray-400'
                  }`}
                >
                  {/* Sequence Number / Pulse */}
                  <div className="mt-0.5">
                    {isFirstUpcoming ? (
                      <div className="w-6 h-6 rounded-full bg-origami-terracotta text-white flex items-center justify-center font-bold text-xs shadow-xs animate-pulse">
                        {stop.sequence}
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-paper-sheet border border-origami-slate text-origami-slate flex items-center justify-center font-bold text-xs">
                        {stop.sequence}
                      </div>
                    )}
                  </div>

                  {/* Stop Information */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-xs text-origami-slate truncate">
                        {stop.name}
                      </h4>
                      <span className="font-mono text-xs font-bold text-origami-slate bg-paper-sheet px-1.5 py-0.5 rounded border border-paper-crease">
                        {stop.scheduledTime}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-500 mt-0.5 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                      <span>{stop.landmark}</span>
                    </div>

                    {/* Special Badges for Child Stop */}
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {isFirstUpcoming && (
                        <span className="bg-origami-terracotta text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wide">
                          Sedang Dituju
                        </span>
                      )}
                      {isChildPickup && (
                        <span className="bg-origami-yellow text-origami-slate text-[9px] font-bold px-1.5 py-0.5 rounded-xs border border-origami-slate uppercase">
                          📍 Lokasi Ambil Anak Anda
                        </span>
                      )}
                      {isChildSchool && (
                        <span className="bg-origami-teal text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs uppercase">
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
