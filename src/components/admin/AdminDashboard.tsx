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
      <div className="bg-white rounded-lg border-2 border-origami-slate p-4 sm:p-5 shadow-paper-lg flex flex-wrap items-center justify-between gap-4">
        {/* Left Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-origami-teal text-white border-2 border-origami-slate flex items-center justify-center font-black text-base shadow-paper">
            HQ
          </div>
          <div>
            <h2 className="font-black text-base sm:text-lg text-slate-900 leading-tight">
              Pusat Kawalan Operasi Armada BasKita (Shah Alam 20 km)
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-0.5">
              Pemantauan radar GPS, urutan hentian GeoJSON & direktori langganan murid
            </p>
          </div>
        </div>

        {/* Telematics Simulator Bar */}
        <div className="flex items-center gap-2.5 bg-paper-sheet p-2 rounded-md border-2 border-origami-slate shadow-xs">
          <div className="text-xs font-black text-slate-800 hidden sm:inline px-1">
            Simulator Telematik:
          </div>

          <button
            onClick={() => actions.setSimulation(!isSimulating)}
            className={`origami-btn px-3.5 py-1.5 rounded text-xs font-black flex items-center gap-1.5 shadow-paper ${
              isSimulating
                ? 'bg-origami-terracotta text-white border-2 border-origami-slate'
                : 'bg-emerald-600 text-white border-2 border-origami-slate'
            }`}
          >
            {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isSimulating ? 'Jeda' : 'Jalankan'}</span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1.5 border-l-2 border-slate-300 pl-2.5">
            {[1, 2, 5].map((speed) => (
              <button
                key={speed}
                onClick={() => actions.setSimulationSpeed(speed)}
                className={`px-2.5 py-1 text-xs font-black rounded border-2 transition-all ${
                  simulationSpeed === speed
                    ? 'bg-origami-yellow text-slate-900 border-origami-slate shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'
                }`}
              >
                {speed === 1 ? '40km/j' : `${speed}x`}
              </button>
            ))}
          </div>

          <button
            onClick={() => actions.resetRoute()}
            className="origami-btn px-2.5 py-1.5 bg-white hover:bg-paper-sheet text-slate-900 text-xs font-black rounded border-2 border-origami-slate shadow-xs ml-1"
            title="Ulang Semula ke Depot Saujana"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Admin Module Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-paper-creaseDark pb-2.5">
        <button
          onClick={() => setAdminTab('fleet')}
          className={`px-4 py-2 rounded-xs text-xs sm:text-sm font-black transition-all ${
            adminTab === 'fleet'
              ? 'bg-origami-slate text-white border-2 border-origami-slate shadow-paper'
              : 'bg-white text-slate-800 hover:text-slate-950 border-2 border-paper-creaseDark hover:border-slate-400'
          }`}
        >
          🗺️ Radar Armada (Fleet Radar)
        </button>

        <button
          onClick={() => setAdminTab('students')}
          className={`px-4 py-2 rounded-xs text-xs sm:text-sm font-black transition-all ${
            adminTab === 'students'
              ? 'bg-origami-slate text-white border-2 border-origami-slate shadow-paper'
              : 'bg-white text-slate-800 hover:text-slate-950 border-2 border-paper-creaseDark hover:border-slate-400'
          }`}
        >
          👥 Direktori Murid ({students.length})
        </button>

        <button
          onClick={() => setAdminTab('routes')}
          className={`px-4 py-2 rounded-xs text-xs sm:text-sm font-black transition-all ${
            adminTab === 'routes'
              ? 'bg-origami-slate text-white border-2 border-origami-slate shadow-paper'
              : 'bg-white text-slate-800 hover:text-slate-950 border-2 border-paper-creaseDark hover:border-slate-400'
          }`}
        >
          📍 Penjadual Laluan & Takwim
        </button>

        <button
          onClick={() => setAdminTab('billing')}
          className={`px-4 py-2 rounded-xs text-xs sm:text-sm font-black transition-all ${
            adminTab === 'billing'
              ? 'bg-origami-slate text-white border-2 border-origami-slate shadow-paper'
              : 'bg-white text-slate-800 hover:text-slate-950 border-2 border-paper-creaseDark hover:border-slate-400'
          }`}
        >
          💳 Audit Transaksi ({transactions.length})
        </button>

        <button
          onClick={() => setAdminTab('broadcast')}
          className={`px-4 py-2 rounded-xs text-xs sm:text-sm font-black transition-all ${
            adminTab === 'broadcast'
              ? 'bg-origami-slate text-white border-2 border-origami-slate shadow-paper'
              : 'bg-white text-slate-800 hover:text-slate-950 border-2 border-paper-creaseDark hover:border-slate-400'
          }`}
        >
          📢 Papan Pekeliling ({circulars.length})
        </button>
      </div>

      {/* TAB 1: FLEET COMMAND MAP & HIGH-LEVEL RADAR */}
      {adminTab === 'fleet' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 rounded-lg overflow-hidden border-2 border-origami-slate shadow-paper-lg bg-white">
            <div className="h-[500px] w-full relative">
              <OrigamiMap mode="admin" />
            </div>
          </div>

          {/* Fleet Radar & Telematics Widgets */}
          <div className="lg:col-span-4 space-y-3.5">
            {/* Origami Radar Tracker */}
            <div className="bg-white p-4 rounded-lg border-2 border-origami-slate shadow-paper space-y-3">
              <div className="flex items-center justify-between border-b-2 border-paper-creaseDark pb-2">
                <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-origami-terracotta animate-pulse" />
                  <span>Radar Armada 20 km Shah Alam</span>
                </h3>
                <span className="text-xs font-mono bg-origami-yellow text-slate-900 font-black px-2 py-0.5 rounded border border-origami-slate shadow-xs">
                  GPS LIVE
                </span>
              </div>

              <div className="space-y-2.5">
                {buses.map((bus) => (
                  <div
                    key={bus.id}
                    className="p-3 rounded-md bg-paper-sheet border-2 border-paper-creaseDark text-xs sm:text-sm space-y-1.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-base text-slate-900">{bus.name}</span>
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded uppercase border ${
                          bus.status === 'in_transit'
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-600'
                            : bus.status === 'boarding'
                            ? 'bg-amber-100 text-amber-950 border-amber-600'
                            : 'bg-slate-200 text-slate-900 border-slate-400'
                        }`}
                      >
                        {bus.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-slate-800 font-semibold">
                      Pemandu: <strong className="text-slate-950">{bus.driverName}</strong> ({bus.driverPhone})
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-800 font-mono font-bold bg-white p-1.5 rounded border border-slate-300">
                      <span>Plat: {bus.plateNumber}</span>
                      <span>Laju: {bus.speedKmH} km/j</span>
                      <span>Muatan: {bus.enrolledCount}/{bus.capacity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coverage Milestones */}
            <div className="bg-white p-4 rounded-lg border-2 border-paper-creaseDark shadow-paper text-xs sm:text-sm space-y-2.5">
              <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 border-b-2 border-paper-creaseDark pb-1.5">
                Sekolah Dalam Kawasan Liputan
              </h3>
              <div className="space-y-2">
                {schools.map((school) => (
                  <div key={school.id} className="p-2.5 rounded bg-paper-sheet border border-paper-crease flex items-center justify-between">
                    <div>
                      <div className="font-black text-slate-900">{school.name}</div>
                      <div className="text-xs text-slate-700 font-medium">{school.code} • Sesi Pagi: {school.morningStart}</div>
                    </div>
                    <span className="text-xs font-mono text-origami-teal font-black bg-white px-2 py-0.5 rounded border border-origami-teal">
                      Aktif
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT DIRECTORY */}
      {adminTab === 'students' && (
        <div className="bg-white rounded-lg border-2 border-origami-slate p-4 sm:p-5 shadow-paper-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-black text-lg text-slate-900">Direktori Murid & Pakej Langganan</h3>
              <p className="text-xs sm:text-sm text-slate-700 font-semibold">
                Pangkalan data kehadiran murid berintegrasi secara langsung bersama pemandu
              </p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama, kelas, telefon..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="text-xs sm:text-sm pl-9 pr-3 py-1.5 rounded border-2 border-origami-slate bg-paper-bg font-medium text-slate-900 focus:outline-hidden w-48 sm:w-64"
                />
              </div>

              <select
                value={filterSession}
                onChange={(e) => setFilterSession(e.target.value as any)}
                className="text-xs sm:text-sm py-1.5 px-3 rounded border-2 border-origami-slate bg-paper-bg font-black text-slate-900 focus:outline-hidden"
              >
                <option value="all">Semua Sesi</option>
                <option value="morning">Sesi Pagi</option>
                <option value="afternoon">Sesi Petang</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs sm:text-sm py-1.5 px-3 rounded border-2 border-origami-slate bg-paper-bg font-black text-slate-900 focus:outline-hidden"
              >
                <option value="all">Semua Status</option>
                <option value="boarded">Dalam Bas</option>
                <option value="waiting">Menunggu</option>
                <option value="absent">Tidak Hadir</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border-2 border-origami-slate rounded-md">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-paper-sheet border-b-2 border-origami-slate text-slate-900 uppercase font-black text-xs">
                <tr>
                  <th className="p-3">Murid</th>
                  <th className="p-3">Kelas & Sekolah</th>
                  <th className="p-3">Pakej Langganan</th>
                  <th className="p-3">Lokasi Ambil</th>
                  <th className="p-3">Waris / Penjaga</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Yuran</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-paper-creaseDark">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-paper-sheet transition-colors">
                    <td className="p-3 flex items-center gap-2.5">
                      <OrigamiAvatarIcon avatar={st.avatar} size={32} />
                      <div>
                        <div className="font-black text-slate-900">{st.name}</div>
                        <div className="text-[11px] font-mono text-slate-700 font-bold">{st.qrCode}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{st.grade}</div>
                      <div className="text-xs text-slate-700">{st.schoolName}</div>
                    </td>
                    <td className="p-3">
                      <span className="bg-paper-sheet px-2 py-0.5 rounded border border-slate-300 font-bold capitalize text-xs">
                        {st.subscriptionTier.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="text-slate-900 font-medium max-w-xs truncate">{st.pickupStopName}</div>
                      <div className="text-xs font-mono text-slate-700 font-bold">{st.pickupTime}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{st.guardianName}</div>
                      <div className="text-xs font-mono text-slate-700 font-bold">{st.guardianPhone}</div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-full uppercase border-2 shadow-xs ${
                          st.status === 'boarded'
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-600'
                            : st.status === 'absent'
                            ? 'bg-red-100 text-red-950 border-red-600'
                            : 'bg-amber-100 text-amber-950 border-amber-600'
                        }`}
                      >
                        {st.status === 'boarded' ? '✓ Naik Bas' : st.status === 'absent' ? '✕ Cuti' : '⏳ Menunggu'}
                      </span>
                    </td>
                    <td className="p-3 font-black text-origami-terracotta font-mono text-sm sm:text-base">
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
          <div className="lg:col-span-7 bg-white rounded-lg border-2 border-origami-slate p-4 sm:p-5 shadow-paper-lg space-y-3.5">
            <div className="flex items-center justify-between border-b-2 border-paper-creaseDark pb-2.5">
              <div>
                <h3 className="font-black text-base text-slate-900">
                  Urutan Hentian & Masa Operasi Laluan Saujana
                </h3>
                <p className="text-xs text-slate-700 font-medium">
                  Laluan 14.8 km merangkumi Seksyen U2, Persiaran Monfort, Bukit Jelutong & Seksyen 13
                </p>
              </div>

              <button
                onClick={() => setShowGeoJson(!showGeoJson)}
                className="origami-btn px-3 py-1.5 bg-paper-sheet hover:bg-paper-crease text-slate-900 text-xs font-black rounded border-2 border-origami-slate flex items-center gap-1.5 shadow-paper"
              >
                <Code className="w-4 h-4 text-origami-teal" />
                <span>{showGeoJson ? 'Tutup GeoJSON' : 'GeoJSON Builder'}</span>
              </button>
            </div>

            {showGeoJson && (
              <div className="p-3.5 bg-slate-900 text-emerald-400 font-mono text-xs rounded border-2 border-slate-700 max-h-52 overflow-y-auto">
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
                  className="p-3 rounded-md border-2 border-paper-creaseDark bg-paper-sheet/50 flex items-center justify-between text-xs sm:text-sm hover:bg-white transition-colors shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-origami-slate text-white text-xs flex items-center justify-center font-black">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-black text-slate-900">{stop.name}</div>
                      <div className="text-xs text-slate-700">{stop.landmark}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-origami-terracotta bg-white px-2 py-0.5 rounded border border-origami-slate">
                      {stop.scheduledTime}
                    </span>
                    <span className="text-[11px] font-black bg-paper-sheet px-2 py-0.5 rounded text-slate-800 border border-slate-300">
                      {stop.type.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-lg border-2 border-origami-slate p-4 sm:p-5 shadow-paper-lg space-y-3.5">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2 border-b-2 border-paper-creaseDark pb-2">
              <Calendar className="w-5 h-5 text-origami-teal" />
              <span>Penyelarasan Takwim Penggal Persekolahan 2026</span>
            </h3>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="p-3 bg-paper-sheet rounded-md border-2 border-paper-creaseDark space-y-1">
                <div className="font-black text-slate-900">Penggal 1 Persekolahan (Kumpulan B)</div>
                <div className="text-xs text-slate-700">Selangor, Kuala Lumpur & Putrajaya</div>
                <div className="text-xs font-mono text-origami-teal font-black mt-1">10 Mac 2026 - 22 Mei 2026</div>
              </div>

              <div className="p-3 bg-paper-sheet rounded-md border-2 border-paper-creaseDark space-y-1">
                <div className="font-black text-slate-900">Cuti Pertengahan Penggal 1</div>
                <div className="text-xs text-slate-700">Tiada operasi bas berjadual</div>
                <div className="text-xs font-mono text-origami-terracotta font-black mt-1">23 Mei 2026 - 31 Mei 2026</div>
              </div>

              <div className="p-3 bg-amber-50 rounded-md border-2 border-amber-300 space-y-1">
                <div className="font-black text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-origami-terracotta" />
                  <span>SOP Cuaca Banjir Kilat Seksyen 13</span>
                </div>
                <div className="text-xs text-slate-800 leading-relaxed font-medium">
                  Sekiranya paras air Persiaran Sukan meningkat melebihi 0.3m, laluan dialihkan serta-merta ke Lebuhraya Persekutuan.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BILLING & PAYMENT AUDIT TRAIL */}
      {adminTab === 'billing' && (
        <div className="bg-white rounded-lg border-2 border-origami-slate p-4 sm:p-5 shadow-paper-lg space-y-4">
          <div className="flex items-center justify-between border-b-2 border-paper-creaseDark pb-3">
            <div>
              <h3 className="font-black text-lg text-slate-900">Jejak Audit Pembayaran FPX & Resit</h3>
              <p className="text-xs sm:text-sm text-slate-700 font-semibold">
                Rekod masa nyata transaksi pembayaran yuran bas sekolah yang telah disahkan
              </p>
            </div>
            <button
              onClick={() => actions.setRole('billing')}
              className="origami-btn origami-btn-primary px-4 py-2 rounded text-xs sm:text-sm font-black shadow-paper"
            >
              Buka Hab Langganan Penuh
            </button>
          </div>

          <div className="overflow-x-auto border-2 border-origami-slate rounded-md">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-paper-sheet border-b-2 border-origami-slate text-slate-900 uppercase font-black text-xs">
                <tr>
                  <th className="p-3">No. Resit</th>
                  <th className="p-3">Rujukan FPX</th>
                  <th className="p-3">Murid</th>
                  <th className="p-3">Bank</th>
                  <th className="p-3">Jumlah</th>
                  <th className="p-3">Masa Bayaran</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-paper-creaseDark">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-paper-sheet transition-colors">
                    <td className="p-3 font-mono font-black text-slate-900">{tx.receiptNumber}</td>
                    <td className="p-3 font-mono text-slate-700 font-bold">{tx.fpxRef}</td>
                    <td className="p-3 font-black text-slate-900">{tx.studentName}</td>
                    <td className="p-3 font-bold text-slate-800">{tx.bankName}</td>
                    <td className="p-3 font-black text-emerald-800 font-mono text-sm sm:text-base">RM {tx.amount}.00</td>
                    <td className="p-3 font-mono text-xs text-slate-700 font-bold">{tx.timestamp}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-950 border-2 border-emerald-600 px-2.5 py-1 rounded-full font-black text-xs uppercase shadow-xs">
                        ✓ SAH / LUNAS
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
          <div className="lg:col-span-5 bg-white rounded-lg border-2 border-origami-slate p-4 sm:p-5 shadow-paper-lg space-y-3.5">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2 border-b-2 border-paper-creaseDark pb-2">
              <Send className="w-5 h-5 text-origami-yellowDark" />
              <span>Keluarkan Pekeliling Baharu (Push Broadcast)</span>
            </h3>

            <form onSubmit={handlePostNotice} className="space-y-3.5">
              <div>
                <label className="block text-xs sm:text-sm font-black text-slate-800 mb-1">Tajuk Pekeliling:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="cth. Amaran Hujan Lebat di Persiaran Monfort"
                  className="w-full text-xs sm:text-sm p-2.5 bg-paper-bg border-2 border-paper-creaseDark rounded font-medium text-slate-900 focus:outline-hidden focus:border-origami-slate"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-slate-800 mb-1">Kategori:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full text-xs sm:text-sm p-2.5 bg-paper-bg border-2 border-paper-creaseDark rounded font-black text-slate-900 focus:outline-hidden focus:border-origami-slate"
                >
                  <option value="weather">Cuaca & Kelajuan Bas</option>
                  <option value="reminder">Peringatan Yuran Bulanan</option>
                  <option value="urgent">Kecemasan / Lencongan</option>
                  <option value="holiday">Cuti Sekolah & Peristiwa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-slate-800 mb-1.5">Warna Nota Kertas:</label>
                <div className="flex gap-2">
                  {(['yellow', 'teal', 'terracotta', 'slate'] as const).map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setNewColor(col)}
                      className={`px-3 py-1.5 text-xs rounded font-black capitalize border-2 transition-all ${
                        newColor === col ? 'ring-2 ring-origami-slate shadow-paper scale-105' : 'opacity-70'
                      } ${
                        col === 'yellow'
                          ? 'bg-amber-100 text-amber-950 border-amber-500'
                          : col === 'teal'
                          ? 'bg-teal-100 text-teal-950 border-teal-500'
                          : col === 'terracotta'
                          ? 'bg-red-100 text-red-950 border-red-500'
                          : 'bg-slate-200 text-slate-950 border-slate-500'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-slate-800 mb-1">Kandungan Pesanan:</label>
                <textarea
                  rows={3}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Kandungan notis rasmi untuk semua ibu bapa dan pemandu..."
                  className="w-full text-xs sm:text-sm p-2.5 bg-paper-bg border-2 border-paper-creaseDark rounded font-medium text-slate-900 focus:outline-hidden focus:border-origami-slate resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="origami-btn origami-btn-primary w-full py-2.5 rounded text-xs sm:text-sm font-black shadow-paper"
              >
                Papar Pekeliling ke Semua Papan
              </button>
            </form>
          </div>

          {/* Sticky Notes Board */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-900">
              Papan Memo Origami Kertas
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {circulars.map((circ) => {
                const memoClass =
                  circ.stickyColor === 'teal'
                    ? 'origami-memo-teal'
                    : circ.stickyColor === 'terracotta'
                    ? 'origami-memo-terracotta'
                    : circ.stickyColor === 'slate'
                    ? 'origami-memo-slate'
                    : 'origami-memo-yellow';

                return (
                  <div
                    key={circ.id}
                    className={`p-4 rounded-md border-2 shadow-paper space-y-2 flex flex-col justify-between ${memoClass}`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-700 font-bold mb-1">
                        <span className="font-black uppercase tracking-wider bg-white/70 px-1.5 py-0.5 rounded border border-black/10">
                          {circ.category}
                        </span>
                        <span className="font-mono">{circ.date}</span>
                      </div>
                      <h4 className="font-black text-sm sm:text-base text-slate-950 leading-tight">
                        {circ.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-800 font-medium mt-2 leading-relaxed">
                        {circ.message}
                      </p>
                    </div>

                    <div className="text-xs font-black text-slate-700 border-t-2 border-black/10 pt-2">
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
