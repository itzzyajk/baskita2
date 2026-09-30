'use client';

import React, { useState } from 'react';
import { useBusStore } from '@/store/busState';
import { Student } from '@/types';
import { OrigamiPaperPlane } from './OrigamiIcons';
import { X, Send, AlertTriangle, Clock, Users, UserCheck } from 'lucide-react';

interface PaperAirplaneModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
}

export const PaperAirplaneModal: React.FC<PaperAirplaneModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const { actions } = useBusStore();
  const [selectedAction, setSelectedAction] = useState<
    'absent' | 'late' | 'grandma' | 'self_pickup' | 'custom'
  >('absent');
  const [customNote, setCustomNote] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const quickChips = [
    {
      action: 'absent' as const,
      label: 'Tidak Hadir Hari Ini (Absent Today)',
      sublabel: 'Langkau hentian & kemaskini ETA secara automatik',
      icon: <AlertTriangle className="w-5 h-5 text-origami-terracotta" />,
      color: 'border-origami-terracotta bg-red-50',
      defaultText: 'Makluman awal: Anak tidak hadir ke sekolah hari ini.',
    },
    {
      action: 'late' as const,
      label: 'Lewat 2 Minit (Running 2 Mins Late)',
      sublabel: 'Tambah buffer 120 saat pada kokpit pemandu',
      icon: <Clock className="w-5 h-5 text-amber-700" />,
      color: 'border-origami-yellow bg-amber-50',
      defaultText: 'Mohon tunggu 2 minit, anak sedang bergerak ke hentian bas.',
    },
    {
      action: 'grandma' as const,
      label: 'Nenek / Penjaga Ambil (Grandma Picking Up)',
      sublabel: 'Kunci kebenaran pelepasan waris petang',
      icon: <Users className="w-5 h-5 text-origami-teal" />,
      color: 'border-origami-teal bg-teal-50',
      defaultText: 'Petang ini anak diambil oleh nenek/ahli keluarga sah di sekolah.',
    },
    {
      action: 'self_pickup' as const,
      label: 'Pulang Sendiri Hari Ini (Self-Pickup Today)',
      sublabel: 'Bypass giliran penghantaran bas petang',
      icon: <UserCheck className="w-5 h-5 text-origami-slate" />,
      color: 'border-origami-slate bg-slate-50',
      defaultText: 'Petang ini anak berjalan pulang / dijemput sendiri, tidak naik bas.',
    },
  ];

  const handleSend = () => {
    setIsSending(true);
    const chip = quickChips.find((c) => c.action === selectedAction);
    const finalNote = customNote.trim() || chip?.defaultText || 'Pesanan dari ibu bapa';

    setTimeout(() => {
      actions.sendParentQuickMessage(student.id, selectedAction, finalNote);
      setIsSending(false);
      setSentSuccess(true);

      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1200);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      {/* Origami Paper Fold Modal Sheet */}
      <div className="relative w-full max-w-lg bg-white rounded-lg border-2 border-origami-slate shadow-paper-xl overflow-hidden animate-unfold">
        {/* Top Fold Ribbon */}
        <div className="bg-paper-sheet border-b-2 border-origami-slate px-4 sm:px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-origami-yellow border-2 border-origami-slate rounded-xs shadow-paper transform rotate-6">
              <OrigamiPaperPlane size={22} />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">Pesanan Kapal Terbang Kertas</h3>
              <p className="text-xs text-slate-700 font-bold">
                Panggilan pantas ke pemandu untuk: <strong className="text-slate-900">{student.name}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 p-1.5 rounded-sm hover:bg-paper-crease transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {sentSuccess ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-2.5">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center border-2 border-origami-teal animate-bounce shadow-paper">
                <OrigamiPaperPlane size={36} />
              </div>
              <h4 className="font-black text-xl text-slate-900">Pesanan Telah Terbang! ✈️</h4>
              <p className="text-sm text-slate-800 font-bold max-w-xs leading-relaxed">
                Manifest kokpit pemandu telah dikemaskini secara automatik berserta amaran suara.
              </p>
            </div>
          ) : (
            <>
              <div className="text-xs font-black uppercase tracking-wider text-slate-800">
                Pilih Status Pantas (One-Tap Dispatch):
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {quickChips.map((chip) => {
                  const isSelected = selectedAction === chip.action;
                  return (
                    <button
                      key={chip.action}
                      type="button"
                      onClick={() => {
                        setSelectedAction(chip.action);
                        setCustomNote(chip.defaultText);
                      }}
                      className={`text-left p-3 rounded-md border-2 transition-all flex items-start gap-3 ${
                        chip.color
                      } ${
                        isSelected
                          ? 'border-origami-slate ring-2 ring-origami-slate shadow-paper translate-x-1'
                          : 'border-slate-300 opacity-90 hover:opacity-100 hover:border-slate-500'
                      }`}
                    >
                      <div className="mt-0.5">{chip.icon}</div>
                      <div className="flex-1">
                        <div className="font-black text-xs sm:text-sm text-slate-900">{chip.label}</div>
                        <div className="text-xs text-slate-700 font-medium mt-0.5">{chip.sublabel}</div>
                      </div>
                      {isSelected && (
                        <span className="text-[11px] font-black bg-origami-slate text-white px-2 py-0.5 rounded-xs border border-origami-slate">
                          Dipilih
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Editable note preview */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1.5">
                  Nota Pesanan Tambahan ke Pemandu:
                </label>
                <textarea
                  rows={2}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Taip sebarang pesanan tambahan..."
                  className="w-full text-xs sm:text-sm p-3 bg-paper-bg border-2 border-paper-creaseDark rounded font-medium text-slate-900 focus:outline-hidden focus:border-origami-slate resize-none font-sans"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-paper-creaseDark">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-black text-slate-700 hover:text-slate-900"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isSending}
                  className="origami-btn origami-btn-primary px-5 py-2.5 rounded text-xs sm:text-sm font-black flex items-center gap-2 shadow-paper"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSending ? 'Melipat & Menghantar...' : 'Hantar Pesanan Segera'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
