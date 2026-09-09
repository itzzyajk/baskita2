import React from 'react';
import { OrigamiAvatar } from '@/types';

// Origami School Bus Marker SVG
export const OrigamiBusIcon: React.FC<{
  className?: string;
  heading?: number;
  size?: number;
}> = ({ className = '', heading = 0, size = 48 }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `rotate(${heading}deg)`,
        transition: 'transform 0.4s ease-out',
      }}
      className={`inline-flex items-center justify-center filter drop-shadow-md select-none ${className}`}
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Body - Folded Canary Van */}
        {/* Roof Fold */}
        <polygon points="18,10 46,10 42,18 22,18" fill="#FFF275" stroke="#264653" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Windshield - Folded Cyan Glass */}
        <polygon points="22,18 42,18 46,28 18,28" fill="#A8DADC" stroke="#264653" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Windshield Crease Divider */}
        <line x1="32" y1="18" x2="32" y2="28" stroke="#264653" strokeWidth="1.5" />
        
        {/* Main Cabin Left Facet */}
        <polygon points="12,28 32,28 32,46 14,46" fill="#F4D06F" stroke="#264653" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Main Cabin Right Facet (Shaded) */}
        <polygon points="32,28 52,28 50,46 32,46" fill="#E5B942" stroke="#264653" strokeWidth="1.5" strokeLinejoin="round" />
        
        {/* Side Windows */}
        <polygon points="14,30 20,30 19,37 13,37" fill="#E2F3F5" stroke="#264653" strokeWidth="1" />
        <polygon points="23,30 29,30 29,37 23,37" fill="#E2F3F5" stroke="#264653" strokeWidth="1" />
        <polygon points="35,30 41,30 41,37 35,37" fill="#C5E3E6" stroke="#264653" strokeWidth="1" />
        <polygon points="44,30 50,30 49,37 43,37" fill="#C5E3E6" stroke="#264653" strokeWidth="1" />
        
        {/* Front Grill & Bumper */}
        <polygon points="14,46 50,46 48,52 16,52" fill="#264653" stroke="#264653" strokeWidth="1" strokeLinejoin="round" />
        {/* Terracotta Hazard Accent Line */}
        <polygon points="18,48 46,48 45,50 19,50" fill="#E76F51" />
        
        {/* Headlights */}
        <polygon points="15,44 19,44 18,48 14,48" fill="#FFF" stroke="#264653" strokeWidth="0.8" />
        <polygon points="45,44 49,44 50,48 46,48" fill="#FFF" stroke="#264653" strokeWidth="0.8" />

        {/* Origami Wheels */}
        <polygon points="10,38 14,34 14,46 10,42" fill="#264653" />
        <polygon points="50,34 54,38 54,42 50,46" fill="#264653" />
        <circle cx="12" cy="40" r="1.5" fill="#FAF8F5" />
        <circle cx="52" cy="40" r="1.5" fill="#FAF8F5" />
      </svg>
    </div>
  );
};

// Origami Schoolhouse SVG
export const OrigamiSchoolIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className = '',
}) => {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Belfry Tower */}
      <polygon points="32,6 26,16 38,16" fill="#E76F51" stroke="#264653" strokeWidth="1.5" strokeLinejoin="round" />
      <polygon points="27,16 37,16 36,24 28,24" fill="#FAF8F5" stroke="#264653" strokeWidth="1.5" />
      <circle cx="32" cy="20" r="2" fill="#F4D06F" stroke="#264653" strokeWidth="0.8" />
      {/* Roof Facet Left */}
      <polygon points="8,28 32,18 32,26 12,32" fill="#E76F51" stroke="#264653" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Roof Facet Right */}
      <polygon points="32,18 56,28 52,32 32,26" fill="#D6593A" stroke="#264653" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Main Building Left */}
      <polygon points="12,32 32,26 32,56 12,56" fill="#FAF8F5" stroke="#264653" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Main Building Right */}
      <polygon points="32,26 52,32 52,56 32,56" fill="#E2DCD5" stroke="#264653" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Folded Door */}
      <polygon points="28,42 36,42 36,56 28,56" fill="#2A9D8F" stroke="#264653" strokeWidth="1.2" />
      {/* Windows */}
      <polygon points="16,36 24,36 24,44 16,44" fill="#A8DADC" stroke="#264653" strokeWidth="1" />
      <polygon points="40,36 48,36 48,44 40,44" fill="#88BEC0" stroke="#264653" strokeWidth="1" />
    </svg>
  );
};

// Origami Paper Airplane SVG
export const OrigamiPaperPlane: React.FC<{ size?: number; className?: string }> = ({
  size = 24,
  className = '',
}) => {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left Wing Top */}
      <polygon points="6,24 42,6 28,40" fill="#FAF8F5" stroke="#264653" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Center Fold Crease */}
      <polygon points="28,40 42,6 24,28" fill="#E2DCD5" stroke="#264653" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Bottom Keel Fold */}
      <polygon points="24,28 28,40 20,33" fill="#2A9D8F" stroke="#264653" strokeWidth="1.2" strokeLinejoin="round" />
      {/* Accent crease tip */}
      <polygon points="36,12 42,6 38,15" fill="#E76F51" />
    </svg>
  );
};

// Origami Avatar Icons
export const OrigamiAvatarIcon: React.FC<{
  avatar: OrigamiAvatar;
  size?: number;
  className?: string;
}> = ({ avatar, size = 36, className = '' }) => {
  switch (avatar) {
    case 'fox':
      return (
        <svg viewBox="0 0 48 48" width={size} height={size} fill="none" className={className}>
          {/* Left Ear */}
          <polygon points="12,8 18,22 6,20" fill="#E76F51" stroke="#264653" strokeWidth="1.5" />
          <polygon points="10,12 15,20 8,18" fill="#F4D06F" />
          {/* Right Ear */}
          <polygon points="36,8 42,20 30,22" fill="#D6593A" stroke="#264653" strokeWidth="1.5" />
          <polygon points="38,12 40,18 33,20" fill="#E5B942" />
          {/* Forehead */}
          <polygon points="18,22 30,22 24,14" fill="#E76F51" stroke="#264653" strokeWidth="1.5" />
          {/* Left Cheek */}
          <polygon points="6,20 18,22 24,36 12,38" fill="#FFF" stroke="#264653" strokeWidth="1.5" />
          {/* Right Cheek */}
          <polygon points="42,20 36,38 24,36 30,22" fill="#F4F0EA" stroke="#264653" strokeWidth="1.5" />
          {/* Snout */}
          <polygon points="18,22 30,22 24,42" fill="#E76F51" stroke="#264653" strokeWidth="1.5" />
          <polygon points="22,39 26,39 24,42" fill="#264653" />
          {/* Eyes */}
          <circle cx="18" cy="26" r="1.5" fill="#264653" />
          <circle cx="30" cy="26" r="1.5" fill="#264653" />
        </svg>
      );
    case 'crane':
      return (
        <svg viewBox="0 0 48 48" width={size} height={size} fill="none" className={className}>
          {/* Crane Wings & Body */}
          <polygon points="24,6 4,28 20,24" fill="#2A9D8F" stroke="#264653" strokeWidth="1.5" />
          <polygon points="24,6 44,28 28,24" fill="#21867A" stroke="#264653" strokeWidth="1.5" />
          <polygon points="20,24 24,6 28,24 24,42" fill="#FAF8F5" stroke="#264653" strokeWidth="1.5" />
          <polygon points="24,42 20,24 16,36" fill="#E2DCD5" stroke="#264653" strokeWidth="1" />
          <polygon points="24,42 28,24 32,36" fill="#DDD6CE" stroke="#264653" strokeWidth="1" />
          {/* Crown red dot */}
          <polygon points="23,8 25,8 24,6" fill="#E76F51" />
        </svg>
      );
    case 'rabbit':
      return (
        <svg viewBox="0 0 48 48" width={size} height={size} fill="none" className={className}>
          {/* Left Long Ear */}
          <polygon points="16,4 20,20 12,18" fill="#FAF8F5" stroke="#264653" strokeWidth="1.5" />
          <polygon points="16,8 18,17 14,16" fill="#F8C0C8" />
          {/* Right Long Ear */}
          <polygon points="32,4 36,18 28,20" fill="#F4F0EA" stroke="#264653" strokeWidth="1.5" />
          <polygon points="32,8 34,16 30,17" fill="#F2A7B5" />
          {/* Rabbit Face */}
          <polygon points="14,19 34,19 40,32 30,42 18,42 8,32" fill="#FAF8F5" stroke="#264653" strokeWidth="1.5" />
          <polygon points="20,26 28,26 24,34" fill="#F8C0C8" stroke="#264653" strokeWidth="1" />
          <circle cx="18" cy="27" r="1.5" fill="#264653" />
          <circle cx="30" cy="27" r="1.5" fill="#264653" />
        </svg>
      );
    case 'tiger':
      return (
        <svg viewBox="0 0 48 48" width={size} height={size} fill="none" className={className}>
          {/* Tiger Ears */}
          <polygon points="8,10 18,16 8,22" fill="#264653" stroke="#264653" strokeWidth="1.5" />
          <polygon points="40,10 32,16 40,22" fill="#264653" stroke="#264653" strokeWidth="1.5" />
          {/* Face */}
          <polygon points="12,16 36,16 42,32 24,44 6,32" fill="#F4D06F" stroke="#264653" strokeWidth="1.5" />
          {/* Tiger Stripes */}
          <polygon points="24,16 22,22 26,22" fill="#264653" />
          <polygon points="12,22 17,24 13,27" fill="#264653" />
          <polygon points="36,22 31,24 35,27" fill="#264653" />
          {/* White Muzzle */}
          <polygon points="18,32 30,32 24,42" fill="#FAF8F5" stroke="#264653" strokeWidth="1" />
          <circle cx="18" cy="26" r="1.5" fill="#264653" />
          <circle cx="30" cy="26" r="1.5" fill="#264653" />
        </svg>
      );
    case 'panda':
      return (
        <svg viewBox="0 0 48 48" width={size} height={size} fill="none" className={className}>
          {/* Black Ears */}
          <polygon points="8,8 18,14 10,22" fill="#264653" stroke="#264653" strokeWidth="1.5" />
          <polygon points="40,8 38,22 30,14" fill="#264653" stroke="#264653" strokeWidth="1.5" />
          {/* Head */}
          <polygon points="14,14 34,14 42,28 32,42 16,42 6,28" fill="#FAF8F5" stroke="#264653" strokeWidth="1.5" />
          {/* Eye Patches */}
          <polygon points="14,22 20,24 18,32 12,28" fill="#264653" />
          <polygon points="34,22 36,28 30,32 28,24" fill="#264653" />
          <circle cx="16" cy="27" r="1" fill="#FFF" />
          <circle cx="32" cy="27" r="1" fill="#FFF" />
          <polygon points="22,34 26,34 24,37" fill="#264653" />
        </svg>
      );
    case 'elephant':
      return (
        <svg viewBox="0 0 48 48" width={size} height={size} fill="none" className={className}>
          {/* Large Folded Ears */}
          <polygon points="4,14 16,14 12,34 2,26" fill="#A8DADC" stroke="#264653" strokeWidth="1.5" />
          <polygon points="44,14 32,14 36,34 46,26" fill="#88BEC0" stroke="#264653" strokeWidth="1.5" />
          {/* Forehead */}
          <polygon points="16,14 32,14 30,28 18,28" fill="#FAF8F5" stroke="#264653" strokeWidth="1.5" />
          {/* Trunk */}
          <polygon points="20,28 28,28 26,44 22,44" fill="#E2DCD5" stroke="#264653" strokeWidth="1.5" />
          <polygon points="22,44 26,44 28,40 20,40" fill="#2A9D8F" />
          {/* Eyes */}
          <circle cx="19" cy="23" r="1.5" fill="#264653" />
          <circle cx="29" cy="23" r="1.5" fill="#264653" />
        </svg>
      );
    default:
      return null;
  }
};
