'use client';

import React from 'react';
import { Student } from '@/types';
import { OrigamiAvatarIcon } from '@/components/common/OrigamiIcons';
import { Bus, MapPin, School, PhoneCall, QrCode, ShieldCheck, Clock } from 'lucide-react';

interface DigitalBusPassProps {
  student: Student;
  onOpenMessageModal: () => void;
}

export const DigitalBusPass: React.FC<DigitalBusPassProps> = ({
  student,
  onOpenMessageModal,
}) => {
  return (
    <div className="origami-card origami-folded-corner p-4 rounded-md border-2 border-paper-creaseDark bg-white shadow-paper transition-all">
      {/* Pass Header Tape */}
      <div className="flex items-center justify-between border-b-2 border-dashed border-paper-crease pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="bg-origami-yellow border border-origami-slate text-origami-slate text-[10px] font-black uppercase px-2 py-0.5 rounded-xs shadow-xs">
            Pas Digital Bas
          </span>
          <span className="text-[11px] font-mono text-gray-500 font-semibold tracking-wider">
            {student.qrCode.slice(0, 16)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-origami-teal">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Sah: Sesi 2026</span>
        </div>
      </div>

      {/* Main Student Card Grid */}
      <div className="flex items-start gap-3.5">
        {/* Origami Animal Badge */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded bg-paper-sheet border-2 border-origami-slate flex items-center justify-center shadow-paper p-1">
            <OrigamiAvatarIcon avatar={student.avatar} size={50} />
          </div>
          <span className="text-[9px] font-bold text-gray-500 uppercase mt-1">
            Maskot {student.avatar}
          </span>
        </div>

        {/* Student Information Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-black text-base text-origami-slate leading-tight truncate">
                {student.name}
              </h3>
              <p className="text-xs font-semibold text-origami-terracotta mt-0.5">
                {student.grade} • Sesi {student.session === 'morning' ? 'Pagi' : 'Petang'}
              </p>
            </div>
            
            {/* Live Status Pill */}
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-xs uppercase tracking-wide ${
                student.status === 'boarded'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                  : student.status === 'absent'
                  ? 'bg-red-100 text-red-800 border-red-400'
                  : student.status === 'arrived'
                  ? 'bg-blue-100 text-blue-800 border-blue-400'
                  : 'bg-amber-100 text-amber-800 border-amber-400'
              }`}
            >
              {student.status === 'boarded'
                ? 'Dalam Bas'
                : student.status === 'absent'
                ? 'Tidak Hadir'
                : student.status === 'arrived'
                ? 'Telah Sampai'
                : 'Menunggu'}
            </span>
          </div>

          <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700 bg-paper-sheet/60 p-2 rounded border border-paper-crease">
            <div className="flex items-center gap-1.5 truncate">
              <School className="w-3.5 h-3.5 text-origami-terracotta shrink-0" />
              <span className="truncate font-medium">{student.schoolName}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Bus className="w-3.5 h-3.5 text-origami-teal shrink-0" />
              <span className="font-semibold text-origami-slate">Bas 01 (TTDI Jaya Express)</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-origami-slate shrink-0" />
              <span className="truncate">{student.pickupStopName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Ambil: <strong>{student.pickupTime}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Tear-off Crease Line */}
      <div className="origami-crease my-3.5"></div>

      {/* Footer with QR Code & Quick Action */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Simulated Paper QR Code */}
          <div className="w-12 h-12 bg-white border border-origami-slate p-1 rounded-xs flex items-center justify-center shadow-xs">
            <QrCode className="w-10 h-10 text-origami-slate" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-origami-slate leading-tight">Imbasan Pemandu</div>
            <div className="text-[10px] text-gray-500 font-mono">BASKITA-NFC-OK</div>
          </div>
        </div>

        <button
          onClick={onOpenMessageModal}
          className="origami-btn origami-btn-primary px-3 py-2 rounded-xs text-xs font-bold flex items-center gap-1.5 shadow-paper"
        >
          <span>✈️ Pesan ke Pemandu</span>
        </button>
      </div>
    </div>
  );
};
