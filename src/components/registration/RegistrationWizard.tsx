'use client';

import React, { useState } from 'react';
import { useBusStore } from '@/store/busState';
import { OrigamiAvatar, SessionType, Student } from '@/types';
import { OrigamiAvatarIcon } from '@/components/common/OrigamiIcons';
import { OrigamiMap } from '@/components/map/OrigamiMap';
import {
  User,
  Phone,
  GraduationCap,
  MapPin,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  QrCode,
  ShieldCheck,
  Calendar,
  DollarSign,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RegistrationWizardProps {
  onFinish?: () => void;
}

export const RegistrationWizard: React.FC<RegistrationWizardProps> = ({ onFinish }) => {
  const { schools, actions } = useBusStore();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [guardianName, setGuardianName] = useState('Puan Nurul Huda binti Ismail');
  const [guardianPhone, setGuardianPhone] = useState('+60 12-449 8123');
  const [emergencyContact, setEmergencyContact] = useState('+60 19-381 2291 (Suami)');
  const [address, setAddress] = useState('No 24, Jalan Opera B U2/1, TTDI Jaya, 40150 Shah Alam');

  const [studentName, setStudentName] = useState('Aisyah Humaira binti Khairul');
  const [grade, setGrade] = useState('Tahun 2 Bijak');
  const [schoolId, setSchoolId] = useState(schools[0]?.id || 'sch-sk-ttdi-jaya');
  const [session, setSession] = useState<SessionType>('morning');
  const [selectedAvatar, setSelectedAvatar] = useState<OrigamiAvatar>('rabbit');

  const [pickedCoords, setPickedCoords] = useState<{ lat: number; lng: number; address: string }>({
    lat: 3.0945,
    lng: 101.5583,
    address: 'Hentian Jalan Ilham U2/14, TTDI Jaya, Shah Alam',
  });

  const [registeredStudent, setRegisteredStudent] = useState<Student | null>(null);

  const avatars: OrigamiAvatar[] = ['fox', 'crane', 'rabbit', 'tiger', 'panda', 'elephant'];
  const grades = [
    'Tahun 1 Amanah',
    'Tahun 2 Bijak',
    'Tahun 3 Cerdik',
    'Tahun 4 Bestari',
    'Tahun 5 Jaya',
    'Tahun 6 Pintar',
    'Tingkatan 1 Mawar',
    'Tingkatan 2 Teratai',
    'Tingkatan 3 Melur',
    'Tingkatan 4 Sains',
    'Tingkatan 5 Perakaunan',
  ];

  const handleNext = () => {
    if (currentStep === 3) {
      // Complete Registration
      const targetSchool = schools.find((s) => s.id === schoolId) || schools[0];
      const newStudentData = {
        name: studentName,
        grade,
        schoolId: targetSchool.id,
        schoolName: targetSchool.name,
        busId: 'bus-01',
        routeId: 'route-tj-01',
        session,
        pickupStopId: 'stop-02',
        pickupStopName: pickedCoords.address,
        pickupTime: session === 'morning' ? '06:40 AM' : '12:45 PM',
        dropoffStopId: 'stop-07',
        dropoffStopName: targetSchool.name,
        dropoffTime: session === 'morning' ? '07:15 AM' : '01:10 PM',
        status: 'waiting' as const,
        guardianName,
        guardianPhone,
        emergencyContact,
        address,
        avatar: selectedAvatar,
        ageGroup: grade.startsWith('Tingkatan') ? ('senior' as const) : ('junior' as const),
        subscriptionTier: 'return_trip' as const,
        monthlyFee: 160,
      };

      const newId = actions.registerNewStudent(newStudentData);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F4D06F', '#E76F51', '#2A9D8F', '#264653'],
        });
      } catch {
        // ignore
      }

      setRegisteredStudent({
        ...newStudentData,
        id: newId,
        initials: 'AH',
        qrCode: `BASKITA-TJ-2026-${newId.toUpperCase()}`,
        registeredAt: new Date().toISOString().split('T')[0],
      });

      setCurrentStep(4);
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 space-y-4">
      {/* Wizard Header */}
      <div className="bg-white p-4 rounded-lg border-2 border-origami-slate shadow-paper-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="bg-origami-yellow border border-origami-slate text-origami-slate text-[10px] font-black uppercase px-2 py-0.5 rounded-xs shadow-xs">
              Pendaftaran Baharu
            </span>
            <h2 className="font-black text-lg text-origami-slate mt-1">
              Borang Pendaftaran Murid BasKita (TTDI Jaya)
            </h2>
            <p className="text-xs text-gray-500">
              Lengkapkan 4 langkah mudah untuk pengesahan tempat duduk dan laluan bas anak anda.
            </p>
          </div>

          {/* Stepper Dots / Tape */}
          <div className="flex items-center gap-1.5 bg-paper-sheet p-1.5 rounded border border-paper-creaseDark">
            {[1, 2, 3, 4].map((step) => {
              const isActive = currentStep === step;
              const isPast = currentStep > step;
              return (
                <div
                  key={step}
                  className={`w-7 h-7 rounded-sm flex items-center justify-center font-bold text-xs border ${
                    isActive
                      ? 'bg-origami-terracotta text-white border-origami-slate shadow-paper'
                      : isPast
                      ? 'bg-origami-teal text-white border-origami-slate'
                      : 'bg-white text-gray-400 border-paper-crease'
                  }`}
                >
                  {isPast ? <Check className="w-3.5 h-3.5" /> : step}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Contents Container */}
      <div className="origami-card origami-folded-corner p-5 rounded-lg border-2 border-paper-creaseDark bg-white shadow-paper-lg animate-unfold min-h-[420px]">
        {/* STEP 1: Guardian Details */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b border-paper-crease pb-2">
              <h3 className="font-bold text-sm text-origami-slate flex items-center gap-2">
                <User className="w-4 h-4 text-origami-terracotta" />
                <span>Langkah 1: Maklumat Waris & Penjaga</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Maklumat ini digunakan untuk makluman kecemasan, status ketibaan bas, dan komunikasi terus bersama pemandu.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nama Penuh Ibu / Bapa / Penjaga:
                </label>
                <input
                  type="text"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-paper-bg border border-paper-creaseDark rounded font-medium focus:outline-hidden focus:border-origami-slate"
                  placeholder="cth. Puan Nurul Huda binti Ismail"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nombor Telefon WhatsApp (Utama):
                </label>
                <input
                  type="tel"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  className="w-full text-xs p-2.5 bg-paper-bg border border-paper-creaseDark rounded font-mono focus:outline-hidden focus:border-origami-slate"
                  placeholder="+60 12-xxxxxxx"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nombor Telefon Kecemasan (Pasangan / Waris Ke-2):
                </label>
                <input
                  type="tel"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full text-xs p-2.5 bg-paper-bg border border-paper-creaseDark rounded font-mono focus:outline-hidden focus:border-origami-slate"
                  placeholder="+60 19-xxxxxxx (Hubungan)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Alamat Rumah Kediaman (TTDI Jaya & Sekitar):
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs p-2.5 bg-paper-bg border border-paper-creaseDark rounded font-medium focus:outline-hidden focus:border-origami-slate"
                  placeholder="No, Jalan, Kawasan Perumahan"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Student Details & Origami Avatar Choice */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b border-paper-crease pb-2">
              <h3 className="font-bold text-sm text-origami-slate flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-origami-yellowDark" />
                <span>Langkah 2: Maklumat Anak & Pilihan Maskot Origami</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Pilih sekolah, sesi pembelajaran, dan maskot lipatan origami kegemaran anak anda untuk pas digitalnya.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nama Penuh Murid:
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-paper-bg border border-paper-creaseDark rounded font-medium focus:outline-hidden focus:border-origami-slate"
                  placeholder="Nama anak"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Tahun / Tingkatan:
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full text-xs p-2.5 bg-paper-bg border border-paper-creaseDark rounded font-medium focus:outline-hidden focus:border-origami-slate"
                >
                  {grades.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Sekolah Pilihan:
                </label>
                <select
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-paper-bg border border-paper-creaseDark rounded font-medium focus:outline-hidden focus:border-origami-slate"
                >
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Sesi Persekolahan:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSession('morning')}
                    className={`py-2 px-3 text-xs rounded border-2 font-bold transition-all ${
                      session === 'morning'
                        ? 'bg-origami-yellow border-origami-slate text-origami-slate shadow-xs'
                        : 'bg-paper-sheet border-paper-crease text-gray-600'
                    }`}
                  >
                    🌅 Sesi Pagi (07:00 AM)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSession('afternoon')}
                    className={`py-2 px-3 text-xs rounded border-2 font-bold transition-all ${
                      session === 'afternoon'
                        ? 'bg-origami-terracotta border-origami-slate text-white shadow-xs'
                        : 'bg-paper-sheet border-paper-crease text-gray-600'
                    }`}
                  >
                    ☀️ Sesi Petang (01:00 PM)
                  </button>
                </div>
              </div>
            </div>

            {/* Avatar Selection Picker */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Pilih Maskot Origami Kertas:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {avatars.map((av) => {
                  const isSelected = selectedAvatar === av;
                  return (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setSelectedAvatar(av)}
                      className={`p-2 rounded-md border-2 flex flex-col items-center gap-1 transition-all ${
                        isSelected
                          ? 'border-origami-slate bg-origami-yellow/30 shadow-paper scale-105'
                          : 'border-paper-creaseDark bg-white hover:bg-paper-sheet opacity-75 hover:opacity-100'
                      }`}
                    >
                      <OrigamiAvatarIcon avatar={av} size={42} />
                      <span className="text-[10px] font-bold capitalize text-origami-slate">
                        {av}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Interactive Map Pin Selector */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b border-paper-crease pb-2">
              <h3 className="font-bold text-sm text-origami-slate flex items-center gap-2">
                <MapPin className="w-4 h-4 text-origami-teal" />
                <span>Langkah 3: Tentukan Lokasi Ambil di Peta TTDI Jaya</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Klik mana-mana titik pada peta di bawah untuk menentukan lokasi menunggu anak anda. Sistem akan mengesahkan kesesuaian laluan bas.
              </p>
            </div>

            <div className="bg-paper-sheet/80 p-2.5 rounded border border-paper-crease flex items-center justify-between text-xs">
              <div>
                <span className="text-gray-500 font-medium">Titik Lokasi Terpilih: </span>
                <strong className="text-origami-slate">{pickedCoords.address}</strong>
              </div>
              <span className="bg-origami-teal text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Dalam Zon Operasi (20 km)
              </span>
            </div>

            {/* Interactive Map Embed */}
            <div className="h-[280px] w-full rounded border-2 border-origami-slate overflow-hidden relative shadow-paper">
              <OrigamiMap
                interactivePicker={true}
                pickedCoords={pickedCoords}
                onPinLocation={(coords) => setPickedCoords(coords)}
              />
            </div>
          </div>
        )}

        {/* STEP 4: Registration Summary & Digital Boarding Pass */}
        {currentStep === 4 && registeredStudent && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center py-2">
              <div className="w-12 h-12 bg-origami-yellow rounded-full border-2 border-origami-slate flex items-center justify-center mx-auto shadow-paper animate-bounce">
                <Sparkles className="w-6 h-6 text-origami-slate" />
              </div>
              <h3 className="font-black text-lg text-origami-slate mt-2">
                Pendaftaran Berjaya Disahkan!
              </h3>
              <p className="text-xs text-gray-600">
                Tempat duduk anak anda telah diperuntukkan dalam <strong>Bas 01 (Laluan Saujana - Jelutong)</strong>.
              </p>
            </div>

            {/* Confirmation Pass Card */}
            <div className="max-w-md mx-auto bg-paper-bg border-2 border-origami-slate rounded-lg p-4 shadow-paper-lg space-y-3">
              <div className="flex items-center justify-between border-b border-paper-creaseDark pb-2">
                <div className="flex items-center gap-2">
                  <OrigamiAvatarIcon avatar={registeredStudent.avatar} size={36} />
                  <div>
                    <h4 className="font-black text-sm text-origami-slate">{registeredStudent.name}</h4>
                    <p className="text-[11px] text-origami-terracotta font-semibold">
                      {registeredStudent.grade} • {registeredStudent.schoolName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold bg-origami-teal text-white px-2 py-0.5 rounded">
                    LULUS AKTIF
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 bg-white p-2.5 rounded border border-paper-crease">
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Bas Ditugaskan:</span>
                  <strong className="text-origami-slate">Bas 01 (TTDI Jaya)</strong>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Kadar Yuran Bulanan:</span>
                  <strong className="text-origami-terracotta">RM 140 / bulan</strong>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Waktu Ambil Pagi:</span>
                  <span className="font-mono font-bold text-origami-slate">{registeredStudent.pickupTime}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Hentian:</span>
                  <span className="truncate block font-medium">{registeredStudent.pickupStopName}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <QrCode className="w-8 h-8 text-origami-slate" />
                  <div className="text-[10px] font-mono text-gray-500 font-bold">{registeredStudent.qrCode}</div>
                </div>
                <span className="text-xs font-bold text-origami-slate bg-origami-yellow px-2 py-1 rounded border border-origami-slate">
                  Pas Tersimpan
                </span>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  if (onFinish) onFinish();
                  actions.setRole('parent');
                }}
                className="origami-btn origami-btn-primary px-6 py-2.5 rounded text-xs font-black shadow-paper"
              >
                Lihat di Penjejak Ibu Bapa (Parent Tracker)
              </button>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        {currentStep < 4 && (
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-paper-creaseDark">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="origami-btn px-4 py-2 bg-paper-sheet text-origami-slate text-xs font-bold rounded flex items-center gap-1.5 shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sebelumnya</span>
              </button>
            ) : (
              <div></div>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="origami-btn origami-btn-primary px-5 py-2 text-xs font-black rounded flex items-center gap-1.5 shadow-paper"
            >
              <span>{currentStep === 3 ? 'Sahkan Pendaftaran & Jana Pas' : 'Seterusnya'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
