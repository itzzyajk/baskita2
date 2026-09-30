'use client';

import React, { useState } from 'react';
import { useBusStore } from '@/store/busState';
import { Invoice, SubscriptionTier } from '@/types';
import { sounds } from '@/components/common/SoundEffects';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Send,
  FileText,
  Printer,
  X,
  Sparkles,
  Calendar,
  Building,
  ShieldCheck,
  Search,
  ExternalLink,
  DollarSign,
  Check,
} from 'lucide-react';

const FPX_BANKS = [
  { id: 'mb2u', name: 'Maybank2u', logo: '🟡', popular: true },
  { id: 'cimb', name: 'CIMB Clicks', logo: '🔴', popular: true },
  { id: 'bimb', name: 'Bank Islam', logo: '🟢', popular: true },
  { id: 'pbb', name: 'Public Bank', logo: '🔴', popular: true },
  { id: 'rhb', name: 'RHB Now', logo: '🔵', popular: false },
  { id: 'hlb', name: 'Hong Leong Connect', logo: '🔵', popular: false },
  { id: 'ambank', name: 'AmBank', logo: '🔴', popular: false },
];

export const BillingHub: React.FC = () => {
  const { invoices, transactions, actions } = useBusStore();

  const [filterStatus, setFilterStatus] = useState<'all' | 'unpaid' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [fpxModalInvoice, setFpxModalInvoice] = useState<Invoice | null>(null);
  const [selectedBank, setSelectedBank] = useState<string>('mb2u');
  const [fpxProcessing, setFpxProcessing] = useState(false);
  const [fpxSuccess, setFpxSuccess] = useState(false);

  const [receiptModalInvoice, setReceiptModalInvoice] = useState<Invoice | null>(null);
  const [whatsappModalInvoice, setWhatsappModalInvoice] = useState<Invoice | null>(null);

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
    const matchesSearch =
      inv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.guardianPhone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  // Calculate stats
  const totalRevenue = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);
  const pendingRevenue = invoices
    .filter((i) => i.status === 'unpaid')
    .reduce((sum, i) => sum + i.amount, 0);

  // FPX Payment flow
  const handleOpenFpx = (inv: Invoice) => {
    setFpxModalInvoice(inv);
    setSelectedBank('mb2u');
    setFpxProcessing(false);
    setFpxSuccess(false);
    sounds.playPaperFold();
  };

  const handleExecuteFpx = () => {
    if (!fpxModalInvoice) return;
    setFpxProcessing(true);

    const bankObj = FPX_BANKS.find((b) => b.id === selectedBank) || FPX_BANKS[0];

    setTimeout(() => {
      actions.payInvoice(fpxModalInvoice.id, bankObj.name);
      setFpxProcessing(false);
      setFpxSuccess(true);

      setTimeout(() => {
        setFpxSuccess(false);
        setFpxModalInvoice(null);
      }, 1500);
    }, 1200);
  };

  // WhatsApp Message Generator
  const generateWhatsAppMessage = (inv: Invoice) => {
    const text = `*Peringatan Yuran Bas Sekolah BasKita TTDI Jaya*\n\nAssalamualaikum & Salam Sejahtera ${inv.guardianName},\n\nInvois bulanan bagi *${inv.studentName}* telah dijana untuk sesi *${inv.period}*.\n\n` +
      `No. Invois: *${inv.invoiceNo}*\n` +
      `Jumlah: *RM ${inv.amount}.00*\n` +
      `Tarikh Akhir Bayaran: *${inv.dueDate}*\n` +
      `Pakej: *${inv.tier === 'single_leg' ? 'Perjalanan Sehala' : inv.tier === 'return_trip' ? 'Dua Hala' : 'Pakej Adik-Beradik'}*\n\n` +
      `Sila buat bayaran selamat dalam talian FPX melalui portal rasmi:\n` +
      `https://baskita.my/pay/${inv.id}\n\n` +
      `Sebarang pertanyaan sila hubungi Hotline BasKita: +60 3-7845 2210.\nTerima kasih atas sokongan anda.`;
    return text;
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 space-y-5 select-none">
      {/* Top Banner & Monthly Cron Trigger */}
      <div className="bg-white rounded-lg border-2 border-origami-slate p-4 sm:p-5 shadow-paper-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-origami-teal text-white text-xs font-black uppercase px-2.5 py-0.5 rounded shadow-xs border border-origami-slate">
              Enjin Langganan Bulanan
            </span>
            <span className="text-xs text-slate-700 font-mono font-bold">Kitaran: 1hb Setiap Bulan</span>
          </div>
          <h2 className="font-black text-xl sm:text-2xl text-slate-900 mt-1.5">
            Hab Langganan, Yuran & Pembayaran FPX
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-0.5">
            Penjanaan invois automatik, rekonsiliasi FPX (Billplz / ToyyibPay) & resit lipatan kertas origami
          </p>
        </div>

        {/* Cron Simulation Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => actions.runMonthlyInvoicingCron()}
            className="origami-btn origami-btn-primary px-4 sm:px-5 py-2.5 rounded text-xs sm:text-sm font-black flex items-center gap-2 shadow-paper"
            title="Simulasi auto-cron 1hb setiap bulan"
          >
            <Calendar className="w-4 h-4 text-slate-900" />
            <span>Jana Invois 1hb (Run Cron)</span>
          </button>
        </div>
      </div>

      {/* Subscription Tier Pricing Cards - Folded Paper Passes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tier 1: Single-Leg */}
        <div className="origami-card origami-folded-corner p-5 rounded-lg border-2 border-origami-slate bg-white shadow-paper hover:shadow-paper-lg transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-black text-slate-700 mb-2">
              <span className="bg-paper-sheet border border-slate-300 px-2 py-0.5 rounded">PAKEJ SEHALA</span>
              <span className="font-mono text-slate-600">Single-Leg</span>
            </div>
            <div className="flex items-baseline gap-1.5 my-2">
              <span className="text-3xl font-black text-slate-900 font-mono">RM 90</span>
              <span className="text-xs text-slate-700 font-bold">/ bulan</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 font-medium mt-1 leading-relaxed">
              Perjalanan waktu pagi SAHAJA (pergi sekolah) atau waktu petang SAHAJA (hantar pulang).
            </p>
            <div className="mt-3 space-y-1.5 text-xs text-slate-800 font-semibold border-t-2 border-paper-creaseDark pt-3">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1 sesi perjalanan tetap setiap hari</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pas digital dan imbasan kehadiran</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tier 2: Return-Trip (Popular) */}
        <div className="origami-card origami-folded-corner p-5 rounded-lg border-2 border-origami-slate bg-amber-50/70 shadow-paper hover:shadow-paper-lg transition-all ring-2 ring-origami-yellow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-black text-origami-terracotta mb-2">
              <span className="bg-origami-yellow text-slate-900 border border-origami-slate px-2 py-0.5 rounded shadow-xs">
                PAKEJ DUA HALA
              </span>
              <span className="bg-origami-terracotta text-white font-black px-2 py-0.5 rounded text-[11px] shadow-xs">
                PILIHAN UTAMA
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 my-2">
              <span className="text-3xl font-black text-slate-900 font-mono">RM 160</span>
              <span className="text-xs text-slate-700 font-bold">/ bulan</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-900 font-bold mt-1 leading-relaxed">
              Perjalanan lengkap pergi sekolah (pagi) dan hantar pulang terus ke pintu rumah (petang).
            </p>
            <div className="mt-3 space-y-1.5 text-xs text-slate-900 font-bold border-t-2 border-amber-300 pt-3">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>2 sesi perjalanan lengkap setiap hari</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Akses amaran kapal terbang & SMS pemandu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tier 3: Sibling Bundle */}
        <div className="origami-card origami-folded-corner p-5 rounded-lg border-2 border-origami-slate bg-teal-50/70 shadow-paper hover:shadow-paper-lg transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-black text-origami-teal mb-2">
              <span className="bg-origami-teal text-white border border-origami-slate px-2 py-0.5 rounded shadow-xs">
                PAKEJ ADIK-BERADIK
              </span>
              <span className="bg-emerald-600 text-white font-black px-2 py-0.5 rounded text-[11px] shadow-xs">
                JIMAT RM 40
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 my-2">
              <span className="text-3xl font-black text-slate-900 font-mono">RM 280</span>
              <span className="text-xs text-slate-700 font-bold">/ 2 orang</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 font-medium mt-1 leading-relaxed">
              Kadar diskaun khas keluarga untuk 2 orang anak bagi laluan Saujana & Jelutong.
            </p>
            <div className="mt-3 space-y-1.5 text-xs text-slate-800 font-semibold border-t-2 border-teal-300 pt-3">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>RM 140 seorang anak (penjimatan keluarga)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Invois tunggal memudahkan penyelarasan FPX</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Status Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-lg border-2 border-origami-slate shadow-paper">
        <div className="p-2 bg-paper-sheet rounded border border-paper-creaseDark">
          <div className="text-xs uppercase font-black text-slate-700">Jumlah Invois</div>
          <div className="text-2xl font-black text-slate-900 font-mono">{invoices.length}</div>
        </div>
        <div className="p-2 bg-emerald-50 rounded border-2 border-emerald-400">
          <div className="text-xs uppercase font-black text-emerald-900">Kutipan Selesai</div>
          <div className="text-2xl font-black text-emerald-800 font-mono">RM {totalRevenue}.00</div>
        </div>
        <div className="p-2 bg-amber-50 rounded border-2 border-amber-400">
          <div className="text-xs uppercase font-black text-amber-900">Menunggu Bayaran</div>
          <div className="text-2xl font-black text-amber-800 font-mono">RM {pendingRevenue}.00</div>
        </div>
        <div className="p-2 bg-teal-50 rounded border-2 border-teal-400">
          <div className="text-xs uppercase font-black text-teal-900">Transaksi FPX</div>
          <div className="text-2xl font-black text-teal-800 font-mono">{transactions.length} rekod</div>
        </div>
      </div>

      {/* Invoices Table & Search Controls */}
      <div className="bg-white rounded-lg border-2 border-origami-slate p-4 sm:p-5 shadow-paper-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-paper-creaseDark pb-3.5">
          <div>
            <h3 className="font-black text-lg text-slate-900">Lejar Invois & Status Pembayaran</h3>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              Urus pembayaran FPX terus atau kirim peringatan WhatsApp kepada waris
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari murid, invois, telefon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs sm:text-sm pl-9 pr-3 py-1.5 rounded border-2 border-origami-slate bg-paper-bg font-medium text-slate-900 focus:outline-hidden w-48 sm:w-60"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-paper-sheet p-1 rounded-md border-2 border-origami-slate text-xs font-black">
              {(['all', 'unpaid', 'paid'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded font-black capitalize transition-all ${
                    filterStatus === st
                      ? 'bg-origami-slate text-white shadow-paper'
                      : 'text-slate-800 hover:text-origami-slate'
                  }`}
                >
                  {st === 'all' ? 'Semua' : st === 'unpaid' ? 'Belum Bayar' : 'Telah Bayar'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Invoices List */}
        <div className="overflow-x-auto border-2 border-origami-slate rounded-md">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-paper-sheet border-b-2 border-origami-slate text-slate-900 uppercase font-black text-xs">
              <tr>
                <th className="p-3">No. Invois</th>
                <th className="p-3">Murid</th>
                <th className="p-3">Pakej</th>
                <th className="p-3">Jumlah</th>
                <th className="p-3">Tarikh Akhir</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-paper-creaseDark">
              {filteredInvoices.map((inv) => {
                const isPaid = inv.status === 'paid';

                return (
                  <tr key={inv.id} className="hover:bg-paper-sheet transition-colors">
                    <td className="p-3 font-mono font-black text-slate-900">
                      {inv.invoiceNo}
                    </td>
                    <td className="p-3">
                      <div className="font-black text-slate-900">{inv.studentName}</div>
                      <div className="text-xs text-slate-600 font-mono font-bold">{inv.guardianPhone}</div>
                    </td>
                    <td className="p-3">
                      <span className="capitalize font-bold text-slate-800 bg-paper-sheet px-2 py-0.5 rounded border border-slate-300">
                        {inv.tier === 'single_leg'
                          ? 'Sehala'
                          : inv.tier === 'return_trip'
                          ? 'Dua Hala'
                          : 'Adik-Beradik'}
                      </span>
                    </td>
                    <td className="p-3 font-black text-origami-terracotta text-sm sm:text-base font-mono">
                      RM {inv.amount}.00
                    </td>
                    <td className="p-3 font-mono text-slate-700 font-bold">
                      {inv.dueDate}
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-full uppercase border-2 shadow-xs ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-600'
                            : 'bg-amber-100 text-amber-950 border-amber-600'
                        }`}
                      >
                        {isPaid ? '✓ Lunas' : '⏳ Belum Bayar'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!isPaid ? (
                          <>
                            {/* Pay FPX */}
                            <button
                              onClick={() => handleOpenFpx(inv)}
                              className="origami-btn px-3 py-1.5 bg-origami-yellow text-slate-900 font-black text-xs sm:text-sm rounded shadow-paper"
                              title="Bayar melalui FPX"
                            >
                              Bayar FPX
                            </button>

                            {/* WhatsApp Reminder */}
                            <button
                              onClick={() => setWhatsappModalInvoice(inv)}
                              className="origami-btn px-2.5 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded shadow-paper"
                              title="Kirim Peringatan WhatsApp"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            {/* View Origami Receipt */}
                            <button
                              onClick={() => setReceiptModalInvoice(inv)}
                              className="origami-btn px-3 py-1.5 bg-paper-sheet hover:bg-paper-crease text-slate-900 font-black text-xs sm:text-sm rounded border-2 border-origami-slate flex items-center gap-1.5 shadow-paper"
                              title="Lihat Resit Rasmi Origami"
                            >
                              <FileText className="w-4 h-4 text-origami-teal" />
                              <span>Resit</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: FPX PAYMENT GATEWAY (Billplz / ToyyibPay Simulation) */}
      {fpxModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-lg border-2 border-origami-slate shadow-paper-xl overflow-hidden animate-unfold">
            {/* Header */}
            <div className="bg-paper-sheet border-b-2 border-origami-slate px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-origami-yellow border-2 border-origami-slate rounded flex items-center justify-center font-black text-xs shadow-xs">
                  FPX
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">Gerbang Pembayaran FPX</h3>
                  <p className="text-xs text-slate-700 font-medium">Billplz / ToyyibPay Secure Checkout</p>
                </div>
              </div>
              <button
                onClick={() => setFpxModalInvoice(null)}
                className="text-slate-500 hover:text-slate-900 p-1.5 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {fpxSuccess ? (
                <div className="py-6 text-center space-y-3 animate-fadeIn">
                  <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-600 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-3xl shadow-paper animate-bounce">
                    ✓
                  </div>
                  <h4 className="font-black text-xl text-slate-900">Pembayaran Berjaya Disahkan!</h4>
                  <p className="text-sm text-slate-800 font-medium max-w-xs mx-auto">
                    Status invois <strong>{fpxModalInvoice.invoiceNo}</strong> telah bertukar kepada LUNAS. Resit rasmi telah dijana.
                  </p>
                </div>
              ) : (
                <>
                  {/* Order summary */}
                  <div className="bg-paper-sheet p-3.5 rounded border-2 border-paper-creaseDark space-y-1.5 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-700 font-medium">Murid:</span>
                      <strong className="text-slate-900">{fpxModalInvoice.studentName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-700 font-medium">No. Invois:</span>
                      <span className="font-mono font-bold text-slate-900">{fpxModalInvoice.invoiceNo}</span>
                    </div>
                    <div className="flex justify-between border-t-2 border-paper-creaseDark pt-2 text-sm sm:text-base">
                      <span className="font-black text-slate-900">Jumlah Perlu Dibayar:</span>
                      <span className="font-black text-origami-terracotta font-mono">RM {fpxModalInvoice.amount}.00</span>
                    </div>
                  </div>

                  {/* Bank Selector */}
                  <div>
                    <label className="block text-xs sm:text-sm font-black text-slate-800 mb-2">
                      Pilih Bank Perbankan Internet (FPX B2C):
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {FPX_BANKS.map((b) => {
                        const isSelected = selectedBank === b.id;
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setSelectedBank(b.id)}
                            className={`p-2.5 rounded border-2 text-left text-xs sm:text-sm font-black flex items-center gap-2.5 transition-all ${
                              isSelected
                                ? 'border-origami-slate bg-origami-yellow/30 ring-2 ring-origami-slate shadow-paper'
                                : 'border-slate-300 bg-white hover:bg-paper-sheet'
                            }`}
                          >
                            <span className="text-base">{b.logo}</span>
                            <span className="truncate">{b.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit button */}
                  <div className="pt-3 border-t-2 border-paper-creaseDark flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setFpxModalInvoice(null)}
                      className="px-4 py-2 text-xs sm:text-sm font-black text-slate-700 hover:text-slate-900"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleExecuteFpx}
                      disabled={fpxProcessing}
                      className="origami-btn origami-btn-primary px-6 py-2.5 rounded text-xs sm:text-sm font-black flex items-center gap-2 shadow-paper"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{fpxProcessing ? 'Mengesahkan FPX...' : `Bayar RM ${fpxModalInvoice.amount}.00`}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: WHATSAPP REMINDER PREVIEW MODAL */}
      {whatsappModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-lg border-2 border-origami-slate shadow-paper-xl overflow-hidden animate-unfold">
            <div className="bg-emerald-700 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">💬</span>
                <div>
                  <h3 className="font-black text-base">Peringatan WhatsApp Business API</h3>
                  <p className="text-xs text-emerald-100 font-mono">Kirim terus ke {whatsappModalInvoice.guardianPhone}</p>
                </div>
              </div>
              <button
                onClick={() => setWhatsappModalInvoice(null)}
                className="text-white hover:opacity-80 p-1.5 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5">
              <label className="block text-xs sm:text-sm font-black text-slate-800">Pratonton Mesej WhatsApp:</label>
              <div className="bg-emerald-50/70 p-4 rounded border-2 border-emerald-300 text-xs sm:text-sm text-slate-900 font-sans whitespace-pre-line leading-relaxed shadow-xs">
                {generateWhatsAppMessage(whatsappModalInvoice)}
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t-2 border-paper-creaseDark">
                <button
                  type="button"
                  onClick={() => setWhatsappModalInvoice(null)}
                  className="px-4 py-2 text-xs sm:text-sm font-black text-slate-700 hover:text-slate-900"
                >
                  Tutup
                </button>
                <a
                  href={`https://wa.me/${whatsappModalInvoice.guardianPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    generateWhatsAppMessage(whatsappModalInvoice)
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="origami-btn bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-emerald-900 px-5 py-2.5 rounded text-xs sm:text-sm font-black flex items-center gap-2 shadow-paper"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Buka di WhatsApp Web</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ORIGAMI PDF TACTILE RECEIPT PREVIEW & PRINT */}
      {receiptModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-lg border-2 border-origami-slate shadow-paper-xl overflow-hidden animate-unfold my-6">
            {/* Modal Controls Bar */}
            <div className="bg-paper-sheet border-b-2 border-origami-slate px-5 py-3 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-black text-slate-900">Pratonton Resit Rasmi BasKita TTDI Jaya</span>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handlePrintReceipt}
                  className="origami-btn px-4 py-1.5 bg-white hover:bg-paper-sheet text-slate-900 text-xs sm:text-sm font-black rounded border-2 border-origami-slate flex items-center gap-2 shadow-paper"
                >
                  <Printer className="w-4 h-4 text-origami-teal" />
                  <span>Cetak / PDF</span>
                </button>
                <button
                  onClick={() => setReceiptModalInvoice(null)}
                  className="text-slate-500 hover:text-slate-900 p-1.5 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Origami Papercraft Receipt Body */}
            <div className="p-6 sm:p-8 bg-paper-bg space-y-5 text-slate-900 font-sans relative">
              {/* Receipt Header */}
              <div className="flex items-start justify-between border-b-2 border-dashed border-slate-400 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-origami-yellow border-2 border-origami-slate flex items-center justify-center font-black text-xs shadow-xs">
                      BK
                    </div>
                    <h2 className="font-black text-lg text-slate-900">BASKITA TTDI JAYA</h2>
                  </div>
                  <p className="text-xs text-slate-700 font-bold mt-1">
                    No. 12, Jalan Saujana Indah U2, TTDI Jaya, 40150 Shah Alam
                  </p>
                  <p className="text-xs text-slate-600 font-mono font-bold">
                    Lesen Pengendali APAD / SPAD: B-7741-2026
                  </p>
                </div>

                <div className="text-right">
                  <span className="bg-emerald-100 text-emerald-950 border-2 border-emerald-600 text-xs font-black px-2.5 py-1 rounded uppercase shadow-xs">
                    RESIT RASMI LUNAS
                  </span>
                  <div className="text-xs font-mono font-black mt-2 text-slate-900">
                    {receiptModalInvoice.fpxTransactionId || 'FPX-MY-2026-PAID'}
                  </div>
                  <div className="text-xs text-slate-600 font-mono font-bold">{receiptModalInvoice.paidAt}</div>
                </div>
              </div>

              {/* Payer Details */}
              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm bg-white p-3.5 rounded border-2 border-paper-creaseDark">
                <div>
                  <span className="text-slate-600 text-xs uppercase font-black block">Dibayar Oleh:</span>
                  <strong className="text-slate-900 font-black">{receiptModalInvoice.guardianName}</strong>
                  <div className="text-xs text-slate-700 font-mono font-bold mt-0.5">{receiptModalInvoice.guardianPhone}</div>
                </div>

                <div>
                  <span className="text-slate-600 text-xs uppercase font-black block">Untuk Murid:</span>
                  <strong className="text-slate-900 font-black">{receiptModalInvoice.studentName}</strong>
                  <div className="text-xs text-slate-700 font-bold mt-0.5">Laluan Saujana (Bas 01)</div>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="border-2 border-origami-slate rounded overflow-hidden bg-white text-xs sm:text-sm">
                <table className="w-full text-left">
                  <thead className="bg-paper-sheet border-b-2 border-origami-slate text-slate-900 font-black text-xs uppercase">
                    <tr>
                      <th className="p-3">Keterangan</th>
                      <th className="p-3 text-center">Bulan</th>
                      <th className="p-3 text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 font-medium">
                        Langganan Bas Sekolah ({receiptModalInvoice.tier.replace('_', ' ').toUpperCase()})
                      </td>
                      <td className="p-3 text-center font-mono font-bold">{receiptModalInvoice.period}</td>
                      <td className="p-3 text-right font-black text-slate-900 font-mono">
                        RM {receiptModalInvoice.amount}.00
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="border-t-2 border-origami-slate bg-paper-sheet font-black">
                    <tr>
                      <td colSpan={2} className="p-3 text-right">Jumlah Bersih:</td>
                      <td className="p-3 text-right text-origami-terracotta text-base sm:text-lg font-black font-mono">
                        RM {receiptModalInvoice.amount}.00
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Footer APAD Stamp */}
              <div className="pt-3 border-t-2 border-dashed border-slate-400 flex items-center justify-between text-xs text-slate-700 font-bold">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <span>Resit berkomputer sah tanpa tandatangan fizikal.</span>
                </div>
                <div className="font-mono text-slate-900">FPX Bank: {receiptModalInvoice.bankName || 'FPX Online'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
