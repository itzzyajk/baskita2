'use client';

import React, { useState } from 'react';
import { useBusStore } from '@/store/busState';
import { OrigamiMap } from '@/components/map/OrigamiMap';
import { OrigamiAvatarIcon } from '@/components/common/OrigamiIcons';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Users,
  MapPin,
  Calendar,
  Send,
  Search,
  Filter,
  AlertTriangle,
  FileText,
  Clock,
  Compass,
  CheckCircle2,
  Radio,
  CreditCard,
  Layers,
  Code,
  ArrowUpDown,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    buses,
    routes,
    students,
    schools,
    circulars,
    invoices,
    transactions,
    isSimulating,
    simulationSpeed,
    actions,
  } = useBusStore();

  const [adminTab, setAdminTab] = useState<'fleet' | 'routes' | 'students' | 'billing' | 'broadcast'>('fleet');
  const [studentSearch, setStudentSearch] = useState('');
  const [filterSession, setFilterSession] = useState<'all' | 'morning' | 'afternoon'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Broadcast Form State
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newCategory, setNewCategory] = useState<'urgent' | 'reminder' | 'weather' | 'holiday'>('weather');
  const [newColor, setNewColor] = useState<'yellow' | 'teal' | 'terracotta' | 'slate'>('yellow');

  // Route GeoJSON modal preview toggle
  const [showGeoJson, setShowGeoJson] = useState(false);

  const activeRoute = routes.find((r) => r.id === 'route-tj-01') || routes[0];

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    actions.postCircular({
      title: newTitle.trim(),
      message: newMessage.trim(),
      category: newCategory,
      author: 'Pengurusan Operasi BasKita',
      stickyColor: newColor,
    });

    setNewTitle('');
    setNewMessage('');
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.grade.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.schoolName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.guardianPhone.includes(studentSearch);
    const matchesSession = filterSession === 'all' || s.session === filterSession;
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchesSearch && matchesSession && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 space-y-4 select-none">
      {/* Top Fleet Status & Telematics Control Strip */}
      <div className="bg-white rounded-lg border-2 border-origami-slate p-3.5 shadow-paper-lg flex flex-wrap items-center justify-between gap-3">
        {/* Left Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-origami-teal text-white flex items-center justify-center font-bold text-sm shadow-xs">
            HQ
          </div>
          <div>
            <h2 className="font-black text-sm sm:text-base text-origami-slate leading-tight">
              Pusat Kawalan Operasi Armada BasKita (Shah Alam 20 km)
            </h2>
            <p className="text-[11px] text-gray-500">
              Pemantauan radar GPS, urutan hentian GeoJSON & direktori langganan murid
            </p>
          </div>
        </div>

        {/* Telematics Simulator Bar */}
        <div className="flex items-center gap-2 bg-paper-sheet p-1.5 rounded border border-paper-creaseDark">
          <div className="text-[11px] font-bold text-gray-600 hidden sm:inline px-1">
            Simulator Telematik:
          </div>

          <button
            onClick={() => actions.setSimulation(!isSimulating)}
            className={`origami-btn px-3 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-xs ${
              isSimulating
                ? 'bg-origami-terracotta text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isSimulating ? 'Jeda' : 'Jalankan'}</span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 border-l border-paper-creaseDark pl-2">
            {[1, 2, 5].map((speed) => (
              <button
                key={speed}
                onClick={() => actions.setSimulationSpeed(speed)}
                className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                  simulationSpeed === speed
                    ? 'bg-origami-yellow text-origami-slate border border-origami-slate'
                    : 'text-gray-600 hover:bg-white'
                }`}
              >
                {speed === 1 ? '40km/j' : `${speed}x`}
              </button>
            ))}
          </div>

          <button
            onClick={() => actions.resetRoute()}
            className="origami-btn px-2 py-1 bg-white hover:bg-paper-sheet text-gray-700 text-xs font-bold rounded border border-gray-400 shadow-xs ml-1"
            title="Ulang Semula ke Depot Saujana"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Admin Module Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-paper-creaseDark pb-2">
        <button
          onClick={() => setAdminTab('fleet')}
          className={`px-3.5 py-1.5 rounded-sm text-xs font-bold transition-all ${
            adminTab === 'fleet'
              ? 'bg-origami-slate text-white shadow-paper'
              : 'bg-white text-gray-600 hover:text-origami-slate border border-paper-creaseDark'
          }`}
        >
          🗺️ Radar Armada (Fleet Radar)
        </button>

        <button
          onClick={() => setAdminTab('students')}
          className={`px-3.5 py-1.5 rounded-sm text-xs font-bold transition-all ${
            adminTab === 'students'
              ? 'bg-origami-slate text-white shadow-paper'
              : 'bg-white text-gray-600 hover:text-origami-slate border border-paper-creaseDark'
          }`}
        >
          👥 Direktori Murid ({students.length})
        </button>

        <button
          onClick={() => setAdminTab('routes')}
          className={`px-3.5 py-1.5 rounded-sm text-xs font-bold transition-all ${
            adminTab === 'routes'
              ? 'bg-origami-slate text-white shadow-paper'
              : 'bg-white text-gray-600 hover:text-origami-slate border border-paper-creaseDark'
          }`}
        >
          📍 Penjadual Laluan & Takwim
        </button>

        <button
          onClick={() => setAdminTab('billing')}
          className={`px-3.5 py-1.5 rounded-sm text-xs font-bold transition-all ${
            adminTab === 'billing'
              ? 'bg-origami-slate text-white shadow-paper'
              : 'bg-white text-gray-600 hover:text-origami-slate border border-paper-creaseDark'
          }`}
        >
          💳 Audit Transaksi ({transactions.length})
        </button>

        <button
          onClick={() => setAdminTab('broadcast')}
          className={`px-3.5 py-1.5 rounded-sm text-xs font-bold transition-all ${
            adminTab === 'broadcast'
              ? 'bg-origami-slate text-white shadow-paper'
              : 'bg-white text-gray-600 hover:text-origami-slate border border-paper-creaseDark'
          }`}
        >
          📢 Papan Pekeliling ({circulars.length})
        </button>
      </div>

      {/* TAB 1: FLEET COMMAND MAP & HIGH-LEVEL RADAR */}
      {adminTab === 'fleet' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 rounded-lg overflow-hidden border-2 border-origami-slate shadow-paper-lg bg-white">
            <div className="h-[480px] w-full relative">
              <OrigamiMap mode="admin" />
            </div>
          </div>

          {/* Fleet Radar & Telematics Widgets */}
          <div className="lg:col-span-4 space-y-3">
            {/* Origami Radar Tracker */}
            <div className="bg-white p-3.5 rounded-lg border-2 border-origami-slate shadow-paper space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-origami-slate flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-origami-terracotta animate-pulse" />
                  <span>Radar Armada 20 km Shah Alam</span>
                </h3>
                <span className="text-[10px] font-mono bg-origami-yellow text-origami-slate font-bold px-1.5 py-0.5 rounded border border-origami-slate">
                  GPS LIVE
                </span>
              </div>

              <div className="space-y-2">
                {buses.map((bus) => (
                  <div
                    key={bus.id}
                    className="p-2.5 rounded bg-paper-sheet border border-paper-creaseDark text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-origami-slate">{bus.name}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          bus.status === 'in_transit'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : bus.status === 'boarding'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {bus.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-600">
                      Pemandu: <strong>{bus.driverName}</strong>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                      <span>Plat: {bus.plateNumber}</span>
                      <span>Laju: {bus.speedKmH} km/j</span>
                      <span>Muatan: {bus.enrolledCount}/{bus.capacity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coverage Milestones */}
            <div className="bg-white p-3.5 rounded-lg border-2 border-paper-creaseDark shadow-paper text-xs space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-origami-slate">
                Sekolah Dalam Kawasan Liputan
              </h3>
              <div className="space-y-1.5">
                {schools.map((school) => (
                  <div key={school.id} className="p-2 rounded bg-paper-sheet/60 border border-paper-crease flex items-center justify-between">
                    <div>
                      <div className="font-bold text-origami-slate">{school.name}</div>
                      <div className="text-[10px] text-gray-500">{school.code} • Sesi Pagi: {school.morningStart}</div>
                    </div>
                    <span className="text-[10px] font-mono text-origami-teal font-bold">Aktif</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT DIRECTORY */}
      {adminTab === 'students' && (
        <div className="bg-white rounded-lg border-2 border-paper-creaseDark p-4 shadow-paper-lg space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-black text-base text-origami-slate">Direktori Murid & Pakej Langganan</h3>
              <p className="text-xs text-gray-500">
                Pangkalan data kehadiran murid berintegrasi secara langsung bersama pemandu
              </p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama, kelas, telefon..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="text-xs pl-8 pr-3 py-1.5 rounded border border-paper-creaseDark bg-paper-bg focus:outline-hidden w-48 sm:w-60"
                />
              </div>

              <select
                value={filterSession}
                onChange={(e) => setFilterSession(e.target.value as any)}
                className="text-xs py-1.5 px-2.5 rounded border border-paper-creaseDark bg-paper-bg focus:outline-hidden"
              >
                <option value="all">Semua Sesi</option>
                <option value="morning">Sesi Pagi</option>
                <option value="afternoon">Sesi Petang</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs py-1.5 px-2.5 rounded border border-paper-creaseDark bg-paper-bg focus:outline-hidden"
              >
                <option value="all">Semua Status</option>
                <option value="boarded">Dalam Bas</option>
                <option value="waiting">Menunggu</option>
                <option value="absent">Tidak Hadir</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-paper-creaseDark rounded">
            <table className="w-full text-left text-xs">
              <thead className="bg-paper-sheet border-b border-paper-creaseDark text-gray-600 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-2.5">Murid</th>
                  <th className="p-2.5">Kelas & Sekolah</th>
                  <th className="p-2.5">Pakej Langganan</th>
                  <th className="p-2.5">Lokasi Ambil</th>
                  <th className="p-2.5">Waris / Penjaga</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Yuran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-crease">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-paper-sheet/40 transition-colors">
                    <td className="p-2.5 flex items-center gap-2">
                      <OrigamiAvatarIcon avatar={st.avatar} size={28} />
                      <div>
                        <div className="font-bold text-origami-slate">{st.name}</div>
                        <div className="text-[10px] font-mono text-gray-500">{st.qrCode}</div>
                      </div>
                    </td>
                    <td className="p-2.5">
                      <div className="font-medium text-origami-slate">{st.grade}</div>
                      <div className="text-[11px] text-gray-500">{st.schoolName}</div>
                    </td>
                    <td className="p-2.5">
                      <span className="bg-paper-sheet px-2 py-0.5 rounded border border-paper-crease font-medium capitalize text-[11px]">
                        {st.subscriptionTier.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <div className="text-origami-slate max-w-xs truncate">{st.pickupStopName}</div>
                      <div className="text-[10px] font-mono text-gray-500">{st.pickupTime}</div>
                    </td>
                    <td className="p-2.5">
                      <div className="font-medium text-origami-slate">{st.guardianName}</div>
                      <div className="text-[10px] font-mono text-gray-500">{st.guardianPhone}</div>
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                          st.status === 'boarded'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : st.status === 'absent'
                            ? 'bg-red-100 text-red-800 border-red-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        {st.status === 'boarded' ? 'Naik Bas' : st.status === 'absent' ? 'Cuti' : 'Menunggu'}
                      </span>
                    </td>
                    <td className="p-2.5 font-bold text-origami-terracotta">
                      RM {st.monthlyFee}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ROUTE & SCHEDULE PLANNER WITH GEOJSON PREVIEW */}
      {adminTab === 'routes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 bg-white rounded-lg border-2 border-paper-creaseDark p-4 shadow-paper-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-origami-slate">
                  Urutan Hentian & Masa Operasi Laluan Saujana
                </h3>
                <p className="text-xs text-gray-500">
                  Laluan 14.8 km merangkumi Seksyen U2, Persiaran Monfort, Bukit Jelutong & Seksyen 13
                </p>
              </div>

              <button
                onClick={() => setShowGeoJson(!showGeoJson)}
                className="origami-btn px-2.5 py-1.5 bg-paper-sheet hover:bg-paper-crease text-origami-slate text-xs font-bold rounded flex items-center gap-1"
              >
                <Code className="w-3.5 h-3.5 text-origami-teal" />
                <span>{showGeoJson ? 'Tutup GeoJSON' : 'GeoJSON Builder'}</span>
              </button>
            </div>

            {showGeoJson && (
              <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-[10px] rounded border border-slate-700 max-h-48 overflow-y-auto">
                <pre>{JSON.stringify({
                  type: 'FeatureCollection',
                  features: [
                    {
                      type: 'Feature',
                      properties: { name: activeRoute.name, code: activeRoute.code },
                      geometry: {
                        type: 'LineString',
                        coordinates: activeRoute.waypoints,
                      },
                    },
                  ],
                }, null, 2)}</pre>
              </div>
            )}

            <div className="space-y-2">
              {activeRoute.stops.map((stop, idx) => (
                <div
                  key={stop.id}
                  className="p-2.5 rounded border border-paper-creaseDark bg-paper-sheet/50 flex items-center justify-between text-xs hover:bg-white transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-origami-slate text-white text-[10px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-origami-slate">{stop.name}</div>
                      <div className="text-[11px] text-gray-500">{stop.landmark}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-origami-terracotta bg-white px-2 py-0.5 rounded border border-paper-crease">
                      {stop.scheduledTime}
                    </span>
                    <span className="text-[10px] bg-paper-sheet px-1.5 py-0.5 rounded text-gray-600 border">
                      {stop.type.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-lg border-2 border-paper-creaseDark p-4 shadow-paper-lg space-y-3">
            <h3 className="font-black text-sm text-origami-slate flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-origami-teal" />
              <span>Penyelarasan Takwim Penggal Persekolahan 2026</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-paper-sheet rounded border border-paper-crease">
                <div className="font-bold text-origami-slate">Penggal 1 Persekolahan (Kumpulan B)</div>
                <div className="text-[11px] text-gray-600 mt-0.5">Selangor, Kuala Lumpur & Putrajaya</div>
                <div className="text-[10px] font-mono text-origami-teal font-bold mt-1">10 Mac 2026 - 22 Mei 2026</div>
              </div>

              <div className="p-2.5 bg-paper-sheet rounded border border-paper-crease">
                <div className="font-bold text-origami-slate">Cuti Pertengahan Penggal 1</div>
                <div className="text-[11px] text-gray-600 mt-0.5">Tiada operasi bas berjadual</div>
                <div className="text-[10px] font-mono text-origami-terracotta font-bold mt-1">23 Mei 2026 - 31 Mei 2026</div>
              </div>

              <div className="p-2.5 bg-paper-sheet rounded border border-paper-crease">
                <div className="font-bold text-origami-slate">SOP Cuaca Banjir Kilat Seksyen 13</div>
                <div className="text-[11px] text-gray-600 mt-0.5">
                  Sekiranya paras air Persiaran Sukan meningkat melebihi 0.3m, laluan dialihkan serta-merta ke Lebuhraya Persekutuan.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BILLING & PAYMENT AUDIT TRAIL */}
      {adminTab === 'billing' && (
        <div className="bg-white rounded-lg border-2 border-paper-creaseDark p-4 shadow-paper-lg space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-origami-slate">Jejak Audit Pembayaran FPX & Resit</h3>
              <p className="text-xs text-gray-500">
                Rekod masa nyata transaksi pembayaran yuran bas sekolah yang telah disahkan
              </p>
            </div>
            <button
              onClick={() => actions.setRole('billing')}
              className="origami-btn origami-btn-primary px-3 py-1.5 rounded text-xs font-bold shadow-xs"
            >
              Buka Hab Langganan Penuh
            </button>
          </div>

          <div className="overflow-x-auto border border-paper-creaseDark rounded">
            <table className="w-full text-left text-xs">
              <thead className="bg-paper-sheet border-b border-paper-creaseDark text-gray-600 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-2.5">No. Resit</th>
                  <th className="p-2.5">Rujukan FPX</th>
                  <th className="p-2.5">Murid</th>
                  <th className="p-2.5">Bank</th>
                  <th className="p-2.5">Jumlah</th>
                  <th className="p-2.5">Masa Bayaran</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-crease">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-paper-sheet/40 transition-colors">
                    <td className="p-2.5 font-mono font-bold text-origami-slate">{tx.receiptNumber}</td>
                    <td className="p-2.5 font-mono text-gray-600">{tx.fpxRef}</td>
                    <td className="p-2.5 font-bold text-origami-slate">{tx.studentName}</td>
                    <td className="p-2.5 font-medium">{tx.bankName}</td>
                    <td className="p-2.5 font-bold text-emerald-700">RM {tx.amount}.00</td>
                    <td className="p-2.5 font-mono text-[11px] text-gray-500">{tx.timestamp}</td>
                    <td className="p-2.5">
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase">
                        SAH / LUNAS
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: BROADCAST CIRCULAR BOARD */}
      {adminTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Post New Notice Form */}
          <div className="lg:col-span-5 bg-white rounded-lg border-2 border-origami-slate p-4 shadow-paper-lg space-y-3">
            <h3 className="font-black text-sm text-origami-slate flex items-center gap-1.5">
              <Send className="w-4 h-4 text-origami-yellowDark" />
              <span>Keluarkan Pekeliling Baharu (Push Broadcast)</span>
            </h3>

            <form onSubmit={handlePostNotice} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tajuk Pekeliling:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="cth. Amaran Hujan Lebat di Persiaran Monfort"
                  className="w-full text-xs p-2 bg-paper-bg border border-paper-creaseDark rounded font-medium focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Kategori:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full text-xs p-2 bg-paper-bg border border-paper-creaseDark rounded focus:outline-hidden"
                >
                  <option value="weather">Cuaca & Kelajuan Bas</option>
                  <option value="reminder">Peringatan Yuran Bulanan</option>
                  <option value="urgent">Kecemasan / Lencongan</option>
                  <option value="holiday">Cuti Sekolah & Peristiwa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Warna Nota Kertas:</label>
                <div className="flex gap-2">
                  {(['yellow', 'teal', 'terracotta', 'slate'] as const).map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setNewColor(col)}
                      className={`px-3 py-1 text-xs rounded font-bold capitalize border ${
                        newColor === col ? 'ring-2 ring-origami-slate shadow-paper' : 'opacity-70'
                      } ${
                        col === 'yellow'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : col === 'teal'
                          ? 'bg-teal-100 text-teal-900 border-teal-300'
                          : col === 'terracotta'
                          ? 'bg-red-100 text-red-900 border-red-300'
                          : 'bg-slate-100 text-slate-900 border-slate-300'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Kandungan Pesanan:</label>
                <textarea
                  rows={3}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Kandungan notis rasmi untuk semua ibu bapa dan pemandu..."
                  className="w-full text-xs p-2 bg-paper-bg border border-paper-creaseDark rounded focus:outline-hidden resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="origami-btn origami-btn-primary w-full py-2 rounded text-xs font-black shadow-paper"
              >
                Papar Pekeliling ke Semua Papan
              </button>
            </form>
          </div>

          {/* Sticky Notes Board */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-origami-slate">
              Papan Memo Origami Kertas
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {circulars.map((circ) => {
                const memoClass =
                  circ.stickyColor === 'teal'
                    ? 'origami-memo-teal'
                    : circ.stickyColor === 'terracotta'
                    ? 'origami-memo-terracotta'
                    : circ.stickyColor === 'slate'
                    ? 'bg-slate-50 border-slate-400 text-slate-800'
                    : 'origami-memo-yellow';

                return (
                  <div
                    key={circ.id}
                    className={`p-3.5 rounded-md border-2 shadow-paper space-y-2 flex flex-col justify-between ${memoClass}`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium mb-1">
                        <span className="font-bold uppercase tracking-wider">{circ.category}</span>
                        <span>{circ.date}</span>
                      </div>
                      <h4 className="font-black text-xs text-origami-slate leading-tight">
                        {circ.title}
                      </h4>
                      <p className="text-[11px] text-gray-700 mt-1.5 leading-relaxed">
                        {circ.message}
                      </p>
                    </div>

                    <div className="text-[10px] font-bold text-gray-500 border-t border-black/10 pt-1.5">
                      Daripada: {circ.author}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
