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
      <div className="bg-white p-4 sm:p-5 rounded-lg border-2 border-origami-slate shadow-paper-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="bg-origami-yellow border-2 border-origami-slate text-slate-900 text-xs font-black uppercase px-2.5 py-0.5 rounded-xs shadow-xs">
              Pendaftaran Baharu 2026
            </span>
            <h2 className="font-black text-lg sm:text-xl text-slate-900 mt-1">
              Borang Pendaftaran Murid BasKita (TTDI Jaya)
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-0.5">
              Lengkapkan 4 langkah mudah untuk pengesahan tempat duduk dan laluan bas anak anda.
            </p>
          </div>

          {/* Stepper Dots / Tape */}
          <div className="flex items-center gap-2 bg-paper-sheet p-2 rounded-md border-2 border-origami-slate shadow-xs">
            {[1, 2, 3, 4].map((step) => {
              const isActive = currentStep === step;
              const isPast = currentStep > step;
              return (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-sm flex items-center justify-center font-black text-xs sm:text-sm border-2 transition-all ${
                    isActive
                      ? 'bg-origami-terracotta text-white border-origami-slate shadow-paper scale-105'
                      : isPast
                      ? 'bg-origami-teal text-white border-origami-slate'
                      : 'bg-white text-slate-500 border-slate-300'
                  }`}
                >
                  {isPast ? <Check className="w-4 h-4" /> : step}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Contents Container */}
      <div className="origami-card origami-folded-corner p-5 sm:p-6 rounded-lg border-2 border-origami-slate bg-white shadow-paper-lg animate-unfold min-h-[440px]">
        {/* STEP 1: Guardian Details */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b-2 border-paper-creaseDark pb-2.5">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-origami-terracotta" />
                <span>Langkah 1: Maklumat Waris & Penjaga</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
                Maklumat ini digunakan untuk makluman kecemasan, status ketibaan bas, dan komunikasi terus bersama pemandu.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-black text-slate-800 mb-1.5">
                  Nama Penuh Ibu / Bapa / Penjaga:
                </label>
                <input
                  type="text"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 bg-paper-bg border-2 border-paper-creaseDark rounded font-bold text-slate-900 focus:outline-hidden focus:border-origami-slate"
                  placeholder="cth. Puan Nurul Huda binti Ismail"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-slate-800 mb-1.5">
                  Nombor Telefon WhatsApp (Utama):
                </label>
                <input
                  type="tel"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 bg-paper-bg border-2 border-paper-creaseDark rounded font-mono font-bold text-slate-900 focus:outline-hidden focus:border-origami-slate"
                  placeholder="+60 12-xxxxxxx"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-slate-800 mb-1.5">
                  Nombor Telefon Kecemasan (Pasangan / Waris Ke-2):
                </label>
                <input
                  type="tel"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 bg-paper-bg border-2 border-paper-creaseDark rounded font-mono font-bold text-slate-900 focus:outline-hidden focus:border-origami-slate"
                  placeholder="+60 19-xxxxxxx (Hubungan)"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-slate-800 mb-1.5">
                  Alamat Rumah Kediaman (TTDI Jaya & Sekitar):
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 bg-paper-bg border-2 border-paper-creaseDark rounded font-bold text-slate-900 focus:outline-hidden focus:border-origami-slate"
                  placeholder="No, Jalan, Kawasan Perumahan"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Student Details & Origami Avatar Choice */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b-2 border-paper-creaseDark pb-2.5">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-origami-yellowDark" />
                <span>Langkah 2: Maklumat Anak & Pilihan Maskot Origami</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
                Pilih sekolah, sesi pembelajaran, dan maskot lipatan origami kegemaran anak anda untuk pas digitalnya.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-black text-slate-800 mb-1.5">
                  Nama Penuh Murid:
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 bg-paper-bg border-2 border-paper-creaseDark rounded font-bold text-slate-900 focus:outline-hidden focus:border-origami-slate"
                  placeholder="Nama anak"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-slate-800 mb-1.5">
                  Tahun / Tingkatan:
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 bg-paper-bg border-2 border-paper-creaseDark rounded font-bold text-slate-900 focus:outline-hidden focus:border-origami-slate"
                >
                  {grades.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-slate-800 mb-1.5">
                  Sekolah Pilihan:
                </label>
                <select
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 bg-paper-bg border-2 border-paper-creaseDark rounded font-bold text-slate-900 focus:outline-hidden focus:border-origami-slate"
                >
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-slate-800 mb-1.5">
                  Sesi Persekolahan:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSession('morning')}
                    className={`py-2.5 px-3 text-xs sm:text-sm rounded border-2 font-black transition-all ${
                      session === 'morning'
                        ? 'bg-origami-yellow border-origami-slate text-slate-900 shadow-paper'
                        : 'bg-paper-sheet border-slate-300 text-slate-800 hover:border-slate-500'
                    }`}
                  >
                    🌅 Sesi Pagi (07:00 AM)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSession('afternoon')}
                    className={`py-2.5 px-3 text-xs sm:text-sm rounded border-2 font-black transition-all ${
                      session === 'afternoon'
                        ? 'bg-origami-terracotta border-origami-slate text-white shadow-paper'
                        : 'bg-paper-sheet border-slate-300 text-slate-800 hover:border-slate-500'
                    }`}
                  >
                    ☀️ Sesi Petang (01:00 PM)
                  </button>
                </div>
              </div>
            </div>

            {/* Avatar Selection Picker */}
            <div className="pt-3 border-t-2 border-paper-creaseDark">
              <label className="block text-xs sm:text-sm font-black text-slate-800 mb-2">
                Pilih Maskot Origami Kertas:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {avatars.map((av) => {
                  const isSelected = selectedAvatar === av;
                  return (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setSelectedAvatar(av)}
                      className={`p-2.5 rounded-md border-2 flex flex-col items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'border-origami-slate bg-origami-yellow/40 shadow-paper scale-105 ring-2 ring-origami-slate'
                          : 'border-slate-300 bg-white hover:bg-paper-sheet opacity-85 hover:opacity-100 hover:border-slate-500'
                      }`}
                    >
                      <OrigamiAvatarIcon avatar={av} size={46} />
                      <span className="text-xs font-black capitalize text-slate-900">
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
            <div className="border-b-2 border-paper-creaseDark pb-2.5">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-origami-teal" />
                <span>Langkah 3: Tentukan Lokasi Ambil di Peta TTDI Jaya</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
                Klik mana-mana titik pada peta di bawah untuk menentukan lokasi menunggu anak anda. Sistem akan mengesahkan kesesuaian laluan bas.
              </p>
            </div>

            <div className="bg-paper-sheet p-3 rounded-md border-2 border-origami-slate flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm shadow-xs">
              <div>
                <span className="text-slate-700 font-bold">Titik Lokasi Terpilih: </span>
                <strong className="text-slate-950 font-black">{pickedCoords.address}</strong>
              </div>
              <span className="bg-origami-teal text-white text-xs font-black px-2.5 py-0.5 rounded uppercase border border-origami-slate shadow-xs">
                Dalam Zon Operasi (20 km)
              </span>
            </div>

            {/* Interactive Map Embed */}
            <div className="h-[300px] w-full rounded border-2 border-origami-slate overflow-hidden relative shadow-paper">
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
              <div className="w-14 h-14 bg-origami-yellow rounded-full border-2 border-origami-slate flex items-center justify-center mx-auto shadow-paper animate-bounce">
                <Sparkles className="w-7 h-7 text-slate-900" />
              </div>
              <h3 className="font-black text-xl text-slate-900 mt-2">
                Pendaftaran Berjaya Disahkan! 🎉
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-bold">
                Tempat duduk anak anda telah diperuntukkan dalam <strong>Bas 01 (Laluan Saujana - Jelutong)</strong>.
              </p>
            </div>

            {/* Confirmation Pass Card */}
            <div className="max-w-md mx-auto bg-paper-bg border-2 border-origami-slate rounded-lg p-5 shadow-paper-lg space-y-3.5">
              <div className="flex items-center justify-between border-b-2 border-paper-creaseDark pb-2.5">
                <div className="flex items-center gap-2.5">
                  <OrigamiAvatarIcon avatar={registeredStudent.avatar} size={42} />
                  <div>
                    <h4 className="font-black text-base text-slate-900">{registeredStudent.name}</h4>
                    <p className="text-xs text-origami-terracotta font-black">
                      {registeredStudent.grade} • {registeredStudent.schoolName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black bg-origami-teal text-white px-2.5 py-1 rounded border border-origami-slate shadow-xs">
                    LULUS AKTIF
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-900 bg-white p-3 rounded border-2 border-paper-creaseDark">
                <div>
                  <span className="text-slate-600 text-[11px] uppercase font-black block">Bas Ditugaskan:</span>
                  <strong className="text-slate-950 font-black">Bas 01 (TTDI Jaya)</strong>
                </div>
                <div>
                  <span className="text-slate-600 text-[11px] uppercase font-black block">Kadar Yuran Bulanan:</span>
                  <strong className="text-origami-terracotta font-black text-sm">RM 160 / bulan</strong>
                </div>
                <div>
                  <span className="text-slate-600 text-[11px] uppercase font-black block">Waktu Ambil Pagi:</span>
                  <span className="font-mono font-black text-slate-950">{registeredStudent.pickupTime}</span>
                </div>
                <div>
                  <span className="text-slate-600 text-[11px] uppercase font-black block">Hentian:</span>
                  <span className="truncate block font-bold">{registeredStudent.pickupStopName}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <QrCode className="w-10 h-10 text-slate-900" />
                  <div className="text-xs font-mono text-slate-700 font-black">{registeredStudent.qrCode}</div>
                </div>
                <span className="text-xs font-black text-slate-900 bg-origami-yellow px-2.5 py-1 rounded border-2 border-origami-slate shadow-xs">
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
                className="origami-btn origami-btn-primary px-8 py-3 rounded text-xs sm:text-sm font-black shadow-paper"
              >
                Lihat di Penjejak Ibu Bapa (Parent Tracker)
              </button>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        {currentStep < 4 && (
          <div className="flex items-center justify-between pt-5 mt-5 border-t-2 border-paper-creaseDark">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="origami-btn px-5 py-2.5 bg-paper-sheet text-slate-900 text-xs sm:text-sm font-black rounded flex items-center gap-2 shadow-paper"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>
            ) : (
              <div></div>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="origami-btn origami-btn-primary px-6 py-2.5 text-xs sm:text-sm font-black rounded flex items-center gap-2 shadow-paper"
            >
              <span>{currentStep === 3 ? 'Sahkan Pendaftaran & Jana Pas' : 'Seterusnya'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
