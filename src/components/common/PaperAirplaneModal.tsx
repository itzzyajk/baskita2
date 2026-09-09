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
      icon: <AlertTriangle className="w-4 h-4 text-origami-terracotta" />,
      color: 'border-origami-terracotta bg-red-50/50',
      defaultText: 'Makluman awal: Anak tidak hadir ke sekolah hari ini.',
    },
    {
      action: 'late' as const,
      label: 'Lewat 2 Minit (Running 2 Mins Late)',
      sublabel: 'Tambah buffer 120 saat pada kokpit pemandu',
      icon: <Clock className="w-4 h-4 text-origami-yellowDark" />,
      color: 'border-origami-yellow bg-amber-50/50',
      defaultText: 'Mohon tunggu 2 minit, anak sedang bergerak ke hentian bas.',
    },
    {
      action: 'grandma' as const,
      label: 'Nenek / Penjaga Ambil (Grandma Picking Up)',
      sublabel: 'Kunci kebenaran pelepasan waris petang',
      icon: <Users className="w-4 h-4 text-origami-teal" />,
      color: 'border-origami-teal bg-teal-50/50',
      defaultText: 'Petang ini anak diambil oleh nenek/ahli keluarga sah di sekolah.',
    },
    {
      action: 'self_pickup' as const,
      label: 'Pulang Sendiri Hari Ini (Self-Pickup Today)',
      sublabel: 'Bypass giliran penghantaran bas petang',
      icon: <UserCheck className="w-4 h-4 text-origami-slate" />,
      color: 'border-origami-slate bg-gray-50/50',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-origami-slate/50 backdrop-blur-xs animate-fadeIn">
      {/* Origami Paper Fold Modal Sheet */}
      <div className="relative w-full max-w-md bg-white rounded-lg border-2 border-origami-slate shadow-paper-xl overflow-hidden animate-unfold">
        {/* Top Fold Ribbon */}
        <div className="bg-paper-sheet border-b border-paper-creaseDark px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-origami-yellow border border-origami-slate rounded-xs shadow-paper transform rotate-6">
              <OrigamiPaperPlane size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-origami-slate">Pesanan Kapal Terbang Kertas</h3>
              <p className="text-[11px] text-gray-500">
                Panggilan pantas ke pemandu untuk: <strong>{student.name.split(' ')[1] || student.name}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-origami-slate p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3.5">
          {sentSuccess ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-16 h-16 bg-origami-teal/20 rounded-full flex items-center justify-center border-2 border-origami-teal animate-bounce">
                <OrigamiPaperPlane size={32} />
              </div>
              <h4 className="font-black text-lg text-origami-slate">Pesanan Telah Terbang!</h4>
              <p className="text-xs text-gray-600 max-w-xs">
                Manifest kokpit pemandu telah dikemaskini secara automatik berserta pengumuman suara.
              </p>
            </div>
          ) : (
            <>
              <div className="text-xs font-semibold text-gray-700">Pilih Status Pantas (One-Tap Dispatch):</div>

              <div className="grid grid-cols-1 gap-2">
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
                      className={`text-left p-2.5 rounded-sm border-2 transition-all flex items-start gap-2.5 ${
                        chip.color
                      } ${
                        isSelected
                          ? 'ring-2 ring-origami-slate shadow-paper translate-x-1'
                          : 'opacity-85 hover:opacity-100 hover:shadow-xs'
                      }`}
                    >
                      <div className="mt-0.5">{chip.icon}</div>
                      <div className="flex-1">
                        <div className="font-bold text-xs text-origami-slate">{chip.label}</div>
                        <div className="text-[11px] text-gray-600">{chip.sublabel}</div>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-bold bg-origami-slate text-white px-1.5 py-0.5 rounded-xs">
                          Dipilih
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Editable note preview */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nota Pesanan ke Pemandu:
                </label>
                <textarea
                  rows={2}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Taip sebarang pesanan tambahan..."
                  className="w-full text-xs p-2.5 bg-paper-bg border border-paper-creaseDark rounded-sm focus:outline-hidden focus:border-origami-slate resize-none font-sans"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-paper-creaseDark">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-origami-slate"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isSending}
                  className="origami-btn origami-btn-primary px-4 py-2 rounded-sm text-xs font-bold flex items-center gap-1.5 shadow-paper"
                >
                  <Send className="w-3.5 h-3.5" />
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
