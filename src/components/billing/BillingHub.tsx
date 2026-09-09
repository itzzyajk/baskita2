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
      <div className="bg-white rounded-lg border-2 border-origami-slate p-4 shadow-paper-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-origami-teal text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-xs">
              Enjin Langganan Bulanan
            </span>
            <span className="text-xs text-gray-500 font-mono">Kitaran: 1hb Setiap Bulan</span>
          </div>
          <h2 className="font-black text-lg sm:text-xl text-origami-slate mt-1">
            Hab Langganan, Yuran & Pembayaran FPX
          </h2>
          <p className="text-xs text-gray-600">
            Penjanaan invois automatik, rekonsiliasi FPX (Billplz / ToyyibPay) & resit lipatan kertas origami
          </p>
        </div>

        {/* Cron Simulation Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => actions.runMonthlyInvoicingCron()}
            className="origami-btn origami-btn-primary px-4 py-2.5 rounded text-xs font-black flex items-center gap-2 shadow-paper"
            title="Simulasi auto-cron 1hb setiap bulan"
          >
            <Calendar className="w-4 h-4" />
            <span>Jana Invois 1hb (Run Cron)</span>
          </button>
        </div>
      </div>

      {/* Subscription Tier Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="origami-card origami-folded-corner p-4 rounded-lg border-2 border-paper-creaseDark bg-white shadow-paper">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-1">
            <span>PAKEJ SEHALA</span>
            <span className="bg-paper-sheet px-1.5 py-0.5 rounded text-[10px]">Single-Leg</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-origami-slate">RM 90</span>
            <span className="text-xs text-gray-500">/ bulan</span>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Penghantaran waktu pagi SAHAJA atau pengambilan pulang SAHAJA.
          </p>
        </div>

        <div className="origami-card origami-folded-corner p-4 rounded-lg border-2 border-origami-yellow bg-amber-50/40 shadow-paper">
          <div className="flex items-center justify-between text-xs font-bold text-origami-terracotta mb-1">
            <span>PAKEJ DUA HALA</span>
            <span className="bg-origami-yellow text-origami-slate font-black px-1.5 py-0.5 rounded text-[10px]">
              POPULAR
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-origami-slate">RM 160</span>
            <span className="text-xs text-gray-500">/ bulan</span>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Perjalanan lengkap pergi sekolah (pagi) dan hantar pulang ke rumah (petang).
          </p>
        </div>

        <div className="origami-card origami-folded-corner p-4 rounded-lg border-2 border-origami-teal bg-teal-50/40 shadow-paper">
          <div className="flex items-center justify-between text-xs font-bold text-origami-teal mb-1">
            <span>PAKEJ ADIK-BERADIK</span>
            <span className="bg-origami-teal text-white font-black px-1.5 py-0.5 rounded text-[10px]">
              JIMAT RM 40
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-origami-slate">RM 280</span>
            <span className="text-xs text-gray-500">/ 2 orang</span>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Kadar diskaun khas keluarga untuk 2 orang anak bagi laluan Saujana & Jelutong.
          </p>
        </div>
      </div>

      {/* Revenue Status Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-lg border-2 border-paper-creaseDark shadow-paper">
        <div>
          <div className="text-[10px] uppercase font-bold text-gray-500">Jumlah Invois</div>
          <div className="text-xl font-black text-origami-slate">{invoices.length}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-emerald-600">Kutipan Selesai</div>
          <div className="text-xl font-black text-emerald-700">RM {totalRevenue}.00</div>
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-amber-600">Menunggu Bayaran</div>
          <div className="text-xl font-black text-amber-700">RM {pendingRevenue}.00</div>
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-origami-teal">Transaksi FPX</div>
          <div className="text-xl font-black text-origami-teal">{transactions.length} rekod</div>
        </div>
      </div>

      {/* Invoices Table & Search Controls */}
      <div className="bg-white rounded-lg border-2 border-paper-creaseDark p-4 shadow-paper-lg space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-paper-creaseDark pb-3">
          <div>
            <h3 className="font-black text-base text-origami-slate">Lejar Invois & Status Pembayaran</h3>
            <p className="text-xs text-gray-500">
              Urus pembayaran FPX terus atau kirim peringatan WhatsApp kepada waris
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Cari murid, invois, telefon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-8 pr-3 py-1.5 rounded border border-paper-creaseDark bg-paper-bg focus:outline-hidden w-48 sm:w-56"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-paper-sheet p-1 rounded border border-paper-crease text-xs">
              {(['all', 'unpaid', 'paid'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-xs font-bold capitalize transition-all ${
                    filterStatus === st
                      ? 'bg-origami-slate text-white shadow-xs'
                      : 'text-gray-600 hover:text-origami-slate'
                  }`}
                >
                  {st === 'all' ? 'Semua' : st === 'unpaid' ? 'Belum Bayar' : 'Telah Bayar'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Invoices List */}
        <div className="overflow-x-auto border border-paper-creaseDark rounded">
          <table className="w-full text-left text-xs">
            <thead className="bg-paper-sheet border-b border-paper-creaseDark text-gray-600 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-2.5">No. Invois</th>
                <th className="p-2.5">Murid</th>
                <th className="p-2.5">Pakej</th>
                <th className="p-2.5">Jumlah</th>
                <th className="p-2.5">Tarikh Akhir</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-crease">
              {filteredInvoices.map((inv) => {
                const isPaid = inv.status === 'paid';

                return (
                  <tr key={inv.id} className="hover:bg-paper-sheet/40 transition-colors">
                    <td className="p-2.5 font-mono font-bold text-origami-slate">
                      {inv.invoiceNo}
                    </td>
                    <td className="p-2.5">
                      <div className="font-bold text-origami-slate">{inv.studentName}</div>
                      <div className="text-[10px] text-gray-500">{inv.guardianPhone}</div>
                    </td>
                    <td className="p-2.5">
                      <span className="capitalize font-medium text-gray-700">
                        {inv.tier === 'single_leg'
                          ? 'Sehala'
                          : inv.tier === 'return_trip'
                          ? 'Dua Hala'
                          : 'Adik-Beradik'}
                      </span>
                    </td>
                    <td className="p-2.5 font-bold text-origami-terracotta text-sm">
                      RM {inv.amount}.00
                    </td>
                    <td className="p-2.5 font-mono text-gray-600">
                      {inv.dueDate}
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        {isPaid ? 'Lunas' : 'Belum Bayar'}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isPaid ? (
                          <>
                            {/* Pay FPX */}
                            <button
                              onClick={() => handleOpenFpx(inv)}
                              className="origami-btn px-2.5 py-1.5 bg-origami-yellow text-origami-slate font-black text-xs rounded shadow-xs"
                              title="Bayar melalui FPX"
                            >
                              Bayar FPX
                            </button>

                            {/* WhatsApp Reminder */}
                            <button
                              onClick={() => setWhatsappModalInvoice(inv)}
                              className="origami-btn px-2 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded shadow-xs"
                              title="Kirim Peringatan WhatsApp"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            {/* View Origami Receipt */}
                            <button
                              onClick={() => setReceiptModalInvoice(inv)}
                              className="origami-btn px-2.5 py-1.5 bg-paper-sheet hover:bg-paper-crease text-origami-slate font-bold text-xs rounded border border-gray-400 flex items-center gap-1 shadow-xs"
                              title="Lihat Resit Rasmi Origami"
                            >
                              <FileText className="w-3.5 h-3.5 text-origami-teal" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-origami-slate/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-lg border-2 border-origami-slate shadow-paper-xl overflow-hidden animate-unfold">
            {/* Header */}
            <div className="bg-paper-sheet border-b border-paper-creaseDark px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-origami-yellow border border-origami-slate rounded flex items-center justify-center font-bold text-xs">
                  FPX
                </div>
                <div>
                  <h3 className="font-bold text-sm text-origami-slate">Gerbang Pembayaran FPX</h3>
                  <p className="text-[10px] text-gray-500">Billplz / ToyyibPay Secure Checkout</p>
                </div>
              </div>
              <button
                onClick={() => setFpxModalInvoice(null)}
                className="text-gray-400 hover:text-origami-slate p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3.5">
              {fpxSuccess ? (
                <div className="py-6 text-center space-y-2 animate-fadeIn">
                  <div className="w-14 h-14 bg-emerald-100 border-2 border-emerald-500 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-2xl shadow-paper">
                    ✓
                  </div>
                  <h4 className="font-black text-base text-origami-slate">Pembayaran Berjaya Disahkan!</h4>
                  <p className="text-xs text-gray-600">
                    Status invois <strong>{fpxModalInvoice.invoiceNo}</strong> telah bertukar kepada LUNAS. Resit rasmi telah dijana.
                  </p>
                </div>
              ) : (
                <>
                  {/* Order summary */}
                  <div className="bg-paper-sheet/60 p-3 rounded border border-paper-crease space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Murid:</span>
                      <strong className="text-origami-slate">{fpxModalInvoice.studentName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">No. Invois:</span>
                      <span className="font-mono">{fpxModalInvoice.invoiceNo}</span>
                    </div>
                    <div className="flex justify-between border-t border-paper-crease pt-1 text-sm">
                      <span className="font-bold text-origami-slate">Jumlah Perlu Dibayar:</span>
                      <span className="font-black text-origami-terracotta">RM {fpxModalInvoice.amount}.00</span>
                    </div>
                  </div>

                  {/* Bank Selector */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Pilih Bank Perbankan Internet (FPX B2C):
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {FPX_BANKS.map((b) => {
                        const isSelected = selectedBank === b.id;
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setSelectedBank(b.id)}
                            className={`p-2 rounded border text-left text-xs font-bold flex items-center gap-2 transition-all ${
                              isSelected
                                ? 'border-origami-slate bg-origami-yellow/30 ring-2 ring-origami-slate shadow-xs'
                                : 'border-paper-creaseDark bg-white hover:bg-paper-sheet'
                            }`}
                          >
                            <span>{b.logo}</span>
                            <span className="truncate">{b.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit button */}
                  <div className="pt-2 border-t border-paper-creaseDark flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setFpxModalInvoice(null)}
                      className="px-3 py-2 text-xs font-bold text-gray-600"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleExecuteFpx}
                      disabled={fpxProcessing}
                      className="origami-btn origami-btn-primary px-5 py-2.5 rounded text-xs font-black flex items-center gap-1.5 shadow-paper"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-origami-slate/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-lg border-2 border-origami-slate shadow-paper-xl overflow-hidden animate-unfold">
            <div className="bg-emerald-700 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">💬</span>
                <div>
                  <h3 className="font-bold text-sm">Peringatan WhatsApp Business API</h3>
                  <p className="text-[10px] text-emerald-100">Kirim terus ke {whatsappModalInvoice.guardianPhone}</p>
                </div>
              </div>
              <button
                onClick={() => setWhatsappModalInvoice(null)}
                className="text-white hover:opacity-80 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <label className="block text-xs font-bold text-gray-700">Pratonton Mesej WhatsApp:</label>
              <div className="bg-emerald-50/50 p-3 rounded border border-emerald-200 text-xs text-gray-800 font-sans whitespace-pre-line leading-relaxed">
                {generateWhatsAppMessage(whatsappModalInvoice)}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-paper-creaseDark">
                <button
                  type="button"
                  onClick={() => setWhatsappModalInvoice(null)}
                  className="px-3 py-2 text-xs font-bold text-gray-600"
                >
                  Tutup
                </button>
                <a
                  href={`https://wa.me/${whatsappModalInvoice.guardianPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    generateWhatsAppMessage(whatsappModalInvoice)
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="origami-btn bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-800 px-4 py-2 rounded text-xs font-black flex items-center gap-1.5 shadow-paper"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka di WhatsApp Web</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ORIGAMI PDF TACTILE RECEIPT PREVIEW & PRINT */}
      {receiptModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-origami-slate/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-lg border-2 border-origami-slate shadow-paper-xl overflow-hidden animate-unfold my-6">
            {/* Modal Controls Bar */}
            <div className="bg-paper-sheet border-b border-paper-creaseDark px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs font-bold text-origami-slate">Pratonton Resit Rasmi BasKita</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintReceipt}
                  className="origami-btn px-3 py-1 bg-white hover:bg-paper-sheet text-origami-slate text-xs font-bold rounded flex items-center gap-1 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-origami-teal" />
                  <span>Cetak / PDF</span>
                </button>
                <button
                  onClick={() => setReceiptModalInvoice(null)}
                  className="text-gray-400 hover:text-origami-slate p-1 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Origami Papercraft Receipt Body */}
            <div className="p-6 bg-paper-bg space-y-4 text-origami-slate font-sans relative">
              {/* Origami 45° Crease Watermark */}
              <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-5">
                <svg viewBox="0 0 100 100" width="128" height="128">
                  <polygon points="0,0 100,0 100,100" fill="#264653" />
                </svg>
              </div>

              {/* Receipt Header */}
              <div className="flex items-start justify-between border-b-2 border-dashed border-paper-creaseDark pb-4">
                <div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 bg-origami-yellow border border-origami-slate flex items-center justify-center font-bold text-xs">
                      BK
                    </div>
                    <h2 className="font-black text-base text-origami-slate">BASKITA TTDI JAYA</h2>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    No. 12, Jalan Saujana Indah U2, TTDI Jaya, 40150 Shah Alam
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono">
                    Lesen Pengendali APAD / SPAD: B-7741-2026
                  </p>
                </div>

                <div className="text-right">
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    RESIT RASMI LUNAS
                  </span>
                  <div className="text-xs font-mono font-bold mt-1">
                    {receiptModalInvoice.fpxTransactionId || 'FPX-MY-2026-PAID'}
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono">{receiptModalInvoice.paidAt}</div>
                </div>
              </div>

              {/* Payer Details */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded border border-paper-crease">
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Dibayar Oleh:</span>
                  <strong className="text-origami-slate">{receiptModalInvoice.guardianName}</strong>
                  <div className="text-[10px] text-gray-500 font-mono">{receiptModalInvoice.guardianPhone}</div>
                </div>

                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Untuk Murid:</span>
                  <strong className="text-origami-slate">{receiptModalInvoice.studentName}</strong>
                  <div className="text-[10px] text-gray-500">Laluan Saujana (Bas 01)</div>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="border border-paper-creaseDark rounded overflow-hidden bg-white text-xs">
                <table className="w-full text-left">
                  <thead className="bg-paper-sheet border-b border-paper-creaseDark text-gray-600 font-bold text-[10px] uppercase">
                    <tr>
                      <th className="p-2">Keterangan</th>
                      <th className="p-2 text-center">Bulan</th>
                      <th className="p-2 text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2">
                        Langganan Bas Sekolah ({receiptModalInvoice.tier.replace('_', ' ').toUpperCase()})
                      </td>
                      <td className="p-2 text-center font-mono">{receiptModalInvoice.period}</td>
                      <td className="p-2 text-right font-bold text-origami-slate">
                        RM {receiptModalInvoice.amount}.00
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="border-t border-paper-creaseDark bg-paper-sheet/40 font-bold">
                    <tr>
                      <td colSpan={2} className="p-2 text-right">Jumlah Bersih:</td>
                      <td className="p-2 text-right text-origami-terracotta text-sm font-black">
                        RM {receiptModalInvoice.amount}.00
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Footer APAD Stamp */}
              <div className="pt-2 border-t border-dashed border-paper-creaseDark flex items-center justify-between text-[10px] text-gray-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Resit berkomputer sah tanpa tandatangan fizikal.</span>
                </div>
                <div className="font-mono">FPX Bank: {receiptModalInvoice.bankName || 'FPX Online'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
