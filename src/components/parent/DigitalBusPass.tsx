'use client';

import React from 'react';
import { Student } from '@/types';
import { OrigamiAvatarIcon } from '@/components/common/OrigamiIcons';
import { Bus, MapPin, School, PhoneCall, QrCode, ShieldCheck, Clock, Sparkles } from 'lucide-react';

interface DigitalBusPassProps {
  student: Student;
  onOpenMessageModal: () => void;
}

export const DigitalBusPass: React.FC<DigitalBusPassProps> = ({
  student,
  onOpenMessageModal,
}) => {
  return (
    <div className="origami-card origami-folded-corner p-4 sm:p-5 rounded-lg border-2 border-origami-slate bg-white shadow-paper-lg transition-all">
      {/* Pass Header Tape */}
      <div className="flex items-center justify-between border-b-2 border-dashed border-slate-300 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="bg-origami-yellow border-2 border-origami-slate text-slate-900 text-xs font-black uppercase px-2.5 py-0.5 rounded-xs shadow-xs">
            Pas Digital Bas
          </span>
          <span className="text-xs font-mono text-slate-700 font-black tracking-wider">
            {student.qrCode.slice(0, 18)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-black text-origami-teal bg-teal-50 px-2 py-0.5 rounded border border-origami-teal">
          <ShieldCheck className="w-4 h-4 text-origami-teal" />
          <span>SAH: SESI 2026</span>
        </div>
      </div>

      {/* Main Student Card Grid */}
      <div className="flex items-start gap-4">
        {/* Origami Animal Badge */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded bg-paper-sheet border-2 border-origami-slate flex items-center justify-center shadow-paper p-1.5">
            <OrigamiAvatarIcon avatar={student.avatar} size={54} />
          </div>
          <span className="text-[10px] font-black text-slate-800 uppercase mt-1.5 bg-paper-sheet px-1.5 py-0.5 rounded border border-slate-300">
            Maskot {student.avatar}
          </span>
        </div>

        {/* Student Information Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-1">
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 leading-tight truncate">
                {student.name}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-origami-terracotta mt-0.5">
                {student.grade} • Sesi {student.session === 'morning' ? 'Pagi (07:00 AM)' : 'Petang (01:00 PM)'}
              </p>
            </div>
            
            {/* Live Status Pill */}
            <span
              className={`text-xs font-black px-2.5 py-1 rounded-full border-2 shadow-xs uppercase tracking-wide ${
                student.status === 'boarded'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-600'
                  : student.status === 'absent'
                  ? 'bg-red-100 text-red-900 border-red-600'
                  : student.status === 'arrived'
                  ? 'bg-blue-100 text-blue-900 border-blue-600'
                  : 'bg-amber-100 text-amber-900 border-amber-600'
              }`}
            >
              {student.status === 'boarded'
                ? '✓ Dalam Bas'
                : student.status === 'absent'
                ? '✕ Tidak Hadir'
                : student.status === 'arrived'
                ? '★ Telah Sampai'
                : '⏳ Menunggu'}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-900 bg-paper-sheet p-2.5 rounded border-2 border-paper-creaseDark">
            <div className="flex items-center gap-2 truncate">
              <School className="w-4 h-4 text-origami-terracotta shrink-0" />
              <span className="truncate font-bold">{student.schoolName}</span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <Bus className="w-4 h-4 text-origami-teal shrink-0" />
              <span className="font-black text-slate-900">Bas 01 (TTDI Jaya Express)</span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-4 h-4 text-origami-slate shrink-0" />
              <span className="truncate font-medium">{student.pickupStopName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="font-medium">Waktu Ambil: <strong className="font-bold text-slate-900">{student.pickupTime}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Tear-off Perforated Crease Line */}
      <div className="origami-perforated my-4"></div>

      {/* Footer with QR Code & Quick Action */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* Simulated Paper QR Code */}
          <div className="w-12 h-12 bg-white border-2 border-origami-slate p-1 rounded-sm flex items-center justify-center shadow-xs">
            <QrCode className="w-10 h-10 text-origami-slate" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 leading-tight">Imbasan Pemandu</div>
            <div className="text-[11px] text-slate-700 font-mono font-bold">BASKITA-NFC-OK</div>
          </div>
        </div>

        <button
          onClick={onOpenMessageModal}
          className="origami-btn origami-btn-primary px-3.5 py-2 rounded text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-paper"
        >
          <span>✈️ Pesan ke Pemandu</span>
        </button>
      </div>
    </div>
  );
};
