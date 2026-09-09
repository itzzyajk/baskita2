'use client';

import React from 'react';
import { CompanionGuide } from '@/types';
import { Sparkles, ShieldCheck, Zap, AlertCircle } from 'lucide-react';

interface CompanionProps {
  guide: CompanionGuide;
  size?: number;
  className?: string;
  mood?: 'idle' | 'happy' | 'alert' | 'curious';
}

// 2D Origami Mouse-Deer: Kip the Kancil (Canary Yellow #F4D06F)
export const KipTheKancil: React.FC<{
  size?: number;
  className?: string;
  mood?: 'idle' | 'happy' | 'alert' | 'curious';
}> = ({ size = 80, className = '', mood = 'idle' }) => {
  const earBounceClass =
    mood === 'happy' ? 'animate-bounce' : mood === 'alert' ? '-rotate-6' : 'hover:scale-105';

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center select-none filter drop-shadow-md ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Folded Ear - Bouncy */}
        <g className={`transition-transform duration-300 origin-bottom-right ${earBounceClass}`}>
          <polygon
            points="32,12 42,34 24,30"
            fill="#F4D06F"
            stroke="#264653"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <polygon points="30,18 38,32 26,29" fill="#E76F51" />
        </g>

        {/* Right Folded Ear */}
        <g className="transition-transform duration-300 origin-bottom-left">
          <polygon
            points="68,12 76,30 58,34"
            fill="#E5B942"
            stroke="#264653"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <polygon points="70,18 74,29 62,32" fill="#D6593A" />
        </g>

        {/* Crown Forehead Triangle */}
        <polygon
          points="38,32 62,32 50,22"
          fill="#FAF8F5"
          stroke="#264653"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Left Cheek / Snout Facet */}
        <polygon
          points="24,30 50,42 50,72 28,58"
          fill="#F4D06F"
          stroke="#264653"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Right Cheek / Snout Facet (Shadowed) */}
        <polygon
          points="50,42 76,30 72,58 50,72"
          fill="#E5B942"
          stroke="#264653"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* White Belly & Throat Patch */}
        <polygon
          points="40,56 60,56 50,86"
          fill="#FAF8F5"
          stroke="#264653"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Sharp Origami Snout Tip */}
        <polygon
          points="46,70 54,70 50,78"
          fill="#264653"
          stroke="#264653"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Big Curious Eyes */}
        <g>
          {/* Left Eye */}
          <polygon points="34,40 42,42 38,48 30,46" fill="#264653" />
          <circle cx="36" cy="43" r="2" fill="#FFFFFF" />

          {/* Right Eye */}
          <polygon points="66,40 70,46 62,48 58,42" fill="#264653" />
          <circle cx="64" cy="43" r="2" fill="#FFFFFF" />
        </g>

        {/* Cute Cheek Blushes */}
        <polygon points="28,50 36,52 32,56 26,54" fill="#F8C0C8" />
        <polygon points="72,50 74,54 68,56 64,52" fill="#F8C0C8" />

        {/* Cute Fold Crease Detail */}
        <line x1="50" y1="22" x2="50" y2="70" stroke="#264653" strokeWidth="1.8" strokeDasharray="3 2" />
      </svg>
    </div>
  );
};

// 2D Origami Hawk: Rex the Helang (Deep Slate #264653 & Teal #2A9D8F)
export const RexTheHelang: React.FC<{
  size?: number;
  className?: string;
  mood?: 'idle' | 'happy' | 'alert' | 'curious';
}> = ({ size = 80, className = '', mood = 'idle' }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center select-none filter drop-shadow-md ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hawk Crest Feather Spikes */}
        <polygon
          points="50,6 42,22 50,18"
          fill="#264653"
          stroke="#1F3641"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <polygon
          points="56,10 66,24 54,20"
          fill="#2A9D8F"
          stroke="#1F3641"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Left Wing Facet */}
        <polygon
          points="16,36 44,24 38,62 10,54"
          fill="#2A9D8F"
          stroke="#264653"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Right Wing Facet */}
        <polygon
          points="56,24 84,36 90,54 62,62"
          fill="#21867A"
          stroke="#264653"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Head Diamond */}
        <polygon
          points="50,16 68,34 50,52 32,34"
          fill="#264653"
          stroke="#1F3641"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Sharp Angular Beak */}
        <polygon
          points="44,44 56,44 50,66"
          fill="#F4D06F"
          stroke="#264653"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <polygon points="50,44 56,44 50,66" fill="#E5B942" />

        {/* Piercing Hawk Eyes */}
        <polygon points="38,32 46,34 42,38 34,36" fill="#F4D06F" />
        <polygon points="41,33 45,34 43,36 39,35" fill="#264653" />

        <polygon points="62,32 66,36 58,38 54,34" fill="#F4D06F" />
        <polygon points="59,33 61,35 57,36 55,34" fill="#264653" />

        {/* Chest Plate - Slate & Teal Crease */}
        <polygon
          points="38,62 50,52 62,62 50,88"
          fill="#FAF8F5"
          stroke="#264653"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        <polygon points="46,62 54,62 50,78" fill="#E76F51" />

        {/* Center Crease Vector */}
        <line x1="50" y1="16" x2="50" y2="88" stroke="#264653" strokeWidth="1.6" strokeDasharray="3 2" />
      </svg>
    </div>
  );
};

// Companion Speech Bubble Card with dynamic quote and role
interface CompanionDialogProps {
  guide: CompanionGuide;
  title?: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  variant?: 'junior' | 'senior';
}

export const CompanionDialog: React.FC<CompanionDialogProps> = ({
  guide,
  title,
  message,
  actionText,
  onAction,
  variant = guide === 'kip' ? 'junior' : 'senior',
}) => {
  const isKip = guide === 'kip';

  return (
    <div
      className={`origami-card origami-folded-corner p-4 rounded-lg border-2 transition-all flex items-start gap-3.5 shadow-paper ${
        isKip
          ? 'border-origami-yellow bg-amber-50/40 text-origami-slate'
          : 'border-origami-teal bg-slate-900 text-white'
      }`}
    >
      <div className="shrink-0">
        {isKip ? (
          <KipTheKancil size={56} mood="happy" />
        ) : (
          <RexTheHelang size={56} mood="alert" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-xs border shadow-xs ${
                isKip
                  ? 'bg-origami-yellow border-origami-slate text-origami-slate'
                  : 'bg-origami-teal border-white text-white'
              }`}
            >
              {isKip ? 'Kip the Kancil (Junior 7-12)' : 'Rex the Helang (Senior 13-17)'}
            </span>
          </div>

          <span
            className={`text-[10px] font-bold ${
              isKip ? 'text-amber-700' : 'text-teal-300'
            }`}
          >
            {isKip ? 'Pemandu Ceria 🌟' : 'Penganalisis Laluan ⚡'}
          </span>
        </div>

        {title && (
          <h4
            className={`font-black text-sm mt-1 leading-tight ${
              isKip ? 'text-origami-slate' : 'text-white'
            }`}
          >
            {title}
          </h4>
        )}

        <p
          className={`text-xs mt-1 leading-relaxed ${
            isKip ? 'text-gray-700' : 'text-gray-300'
          }`}
        >
          {message}
        </p>

        {actionText && onAction && (
          <div className="mt-2.5">
            <button
              onClick={onAction}
              className={`origami-btn px-3 py-1.5 rounded-xs text-xs font-bold shadow-xs ${
                isKip
                  ? 'bg-origami-yellow text-origami-slate border-origami-slate'
                  : 'bg-origami-teal text-white border-white'
              }`}
            >
              {actionText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
