'use client';

import React, { useState, useEffect } from 'react';
import { sounds } from '@/components/common/SoundEffects';
import { RexTheHelang } from '@/components/companions/OrigamiCompanions';
import { Clock, Award, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  rexCommentary: string;
}

const TRIVIA_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Apakah lebuhraya utama yang menghubungkan TTDI Jaya ke Seksyen 13 Shah Alam?',
    options: ['Lebuhraya Persekutuan (Federal Highway)', 'Lebuhraya Pantai Timur (LPT)', 'Lebuhraya Karak', 'PLUS Utara'],
    correctIndex: 0,
    explanation: 'Lebuhraya Persekutuan menghubungkan TTDI Jaya / Batu Tiga terus ke bulatan Seksyen 13.',
    rexCommentary: 'Tepat. Jangan sampai keliru dengan jalan kampung pula.',
  },
  {
    id: 2,
    question: 'Berapakah had laju operasi telematik selamat bas sekolah di kawasan perumahan U2?',
    options: ['80 km/j', '35 - 40 km/j', '110 km/j', '15 km/j'],
    correctIndex: 1,
    explanation: 'BasKita dihadkan kepada kelajuan 35-40 km/j bagi menjamin keselamatan murid.',
    rexCommentary: 'Bijak. Memandu laju dalam taman perumahan memang cari nahas.',
  },
  {
    id: 3,
    question: 'Manakah antara sekolah berikut terletak berhampiran Jalan Sastera U2/1 TTDI Jaya?',
    options: ['SK TTDI Jaya & SMK TTDI Jaya', 'SMK Subang Jaya SS14', 'SK Seksyen 9', 'Kolej Vokasional Klang'],
    correctIndex: 0,
    explanation: 'Kedua-dua SK dan SMK TTDI Jaya terletak bersebelahan di Jalan Sastera U2/1.',
    rexCommentary: 'Betul. Kalau salah yang ni, kamu naik bas mana selama ni?',
  },
  {
    id: 4,
    question: 'Di manakah terletaknya Depot Bas operasi utama BasKita?',
    options: ['Jalan Saujana Indah U2', 'Klia Terminal 1', 'Pelabuhan Klang', 'Bukit Bintang'],
    correctIndex: 0,
    explanation: 'Depot dan bengkel operasi BasKita berpusat di Jalan Saujana Indah, Seksyen U2.',
    rexCommentary: 'Tepat sekali. Depot itu tempat bas berehat sebelum jam 6 pagi.',
  },
  {
    id: 5,
    question: 'Jika banjir kilat melanda Persiaran Sukan, laluan lencongan manakah yang diaktifkan?',
    options: ['Laluan Alternatif Persiaran Kerjaya / Glenmarie', 'Tutup semua sekolah 1 bulan', 'Laluan Gua Musang', 'Laluan Feri'],
    correctIndex: 0,
    explanation: 'SOP lencongan kecemasan mengarahkan bas melalui Persiaran Kerjaya Glenmarie.',
    rexCommentary: 'SOP selamat. Air naik bukan alasan untuk panik.',
  },
];

export const TransitTrivia: React.FC<{ isBusArriving?: boolean }> = ({ isBusArriving }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const currentQ = TRIVIA_QUESTIONS[currentIndex];

  // 15-second countdown timer
  useEffect(() => {
    if (isAnswered || isQuizComplete || isBusArriving) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up
          handleAnswer(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isAnswered, isQuizComplete, isBusArriving]);

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQ.correctIndex) {
      setScore((s) => s + 100 + timeLeft * 5);
      sounds.playChime('success');
    } else {
      sounds.playCrashFold();
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < TRIVIA_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(15);
      sounds.playPaperFold();
    } else {
      setIsQuizComplete(true);
      sounds.playChime('arrival');
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setTimeLeft(15);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsQuizComplete(false);
    sounds.playPaperFold();
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-md mx-auto space-y-3">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between bg-slate-900 text-white px-3.5 py-2.5 rounded-lg border-2 border-origami-teal text-xs">
        <div className="flex items-center gap-1.5 font-bold">
          <span>Soalan {currentIndex + 1}/{TRIVIA_QUESTIONS.length}</span>
        </div>

        {/* 15s Timer Gauge */}
        <div className="flex items-center gap-1.5">
          <Clock className={`w-3.5 h-3.5 ${timeLeft <= 5 ? 'text-red-400 animate-ping' : 'text-teal-300'}`} />
          <span className={`font-mono font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-teal-300'}`}>
            {timeLeft}s
          </span>
        </div>

        <div className="flex items-center gap-1 text-origami-yellow font-mono font-bold">
          <Award className="w-3.5 h-3.5" />
          <span>{score} pts</span>
        </div>
      </div>

      {/* Main Trivia Card */}
      <div className="w-full bg-slate-900 text-white p-4 rounded-lg border-2 border-origami-teal shadow-paper-lg space-y-4">
        {isQuizComplete ? (
          <div className="py-6 text-center space-y-3 animate-fadeIn">
            <RexTheHelang size={64} mood="happy" className="mx-auto" />
            <h3 className="font-black text-lg text-origami-yellow">Ujian Transit Tamat!</h3>
            <p className="text-xs text-gray-300">
              Skor Akhir: <strong className="text-teal-300 text-base">{score} Mata</strong>
            </p>
            <p className="text-[11px] text-gray-400 italic bg-white/5 p-2 rounded max-w-xs mx-auto">
              &quot;Pengetahuan navigasi Shah Alam kamu agak tajam. Teruskan peka dengan keadaan jalan.&quot; - Rex
            </p>
            <button
              onClick={restartQuiz}
              className="origami-btn bg-origami-teal text-white border-white px-5 py-2 rounded text-xs font-black shadow-paper"
            >
              Ulang Kuiz
            </button>
          </div>
        ) : (
          <>
            {/* Question Text */}
            <div className="min-h-[52px]">
              <h3 className="font-bold text-sm text-white leading-snug">
                {currentQ.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let btnStyle = 'bg-white/10 hover:bg-white/15 border-white/20 text-gray-200';
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-600/90 border-emerald-400 text-white font-bold ring-2 ring-emerald-300';
                  } else if (isSelected) {
                    btnStyle = 'bg-red-600/90 border-red-400 text-white font-bold';
                  } else {
                    btnStyle = 'bg-white/5 border-white/10 text-gray-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={isAnswered || isBusArriving}
                    className={`w-full text-left p-2.5 rounded-sm border transition-all text-xs flex items-center justify-between gap-2 ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Rex's Commentary Feedback */}
            {isAnswered && (
              <div className="p-3 rounded bg-white/10 border border-teal-500/40 text-xs space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <RexTheHelang size={24} mood={selectedOption === currentQ.correctIndex ? 'happy' : 'alert'} />
                  <span className="text-[10px] uppercase font-bold text-teal-300">Ulasan Rex the Helang:</span>
                </div>
                <p className="text-gray-300 text-[11px] italic">
                  &quot;{currentQ.rexCommentary}&quot;
                </p>
                <div className="text-[10px] text-gray-400 border-t border-white/10 pt-1">
                  Info: {currentQ.explanation}
                </div>

                <div className="pt-2 text-right">
                  <button
                    onClick={nextQuestion}
                    className="origami-btn bg-origami-teal text-white border-white px-4 py-1.5 rounded text-xs font-bold shadow-xs"
                  >
                    {currentIndex + 1 < TRIVIA_QUESTIONS.length ? 'Soalan Seterusnya ▶' : 'Lihat Keputusan 🏁'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
