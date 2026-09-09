'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { sounds } from '@/components/common/SoundEffects';
import { Play, Pause, RotateCcw, Zap, Compass, Flag } from 'lucide-react';

interface TransitDriftProps {
  isBusArriving?: boolean;
  onFinish?: (timeSeconds: number, score: number) => void;
}

export const TransitDrift: React.FC<TransitDriftProps> = ({ isBusArriving, onFinish }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'racing' | 'finished'>('idle');
  const [lap, setLap] = useState<number>(1);
  const [driftScore, setDriftScore] = useState<number>(0);
  const [speedKmH, setSpeedKmH] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  // Car physics state
  const carRef = useRef({
    x: 160,
    y: 310,
    angle: 0, // In radians
    speed: 0,
    angularVelocity: 0,
    isDrifting: false,
    checkpointsPassed: 0,
    currentLap: 1,
  });

  const keysRef = useRef<{ left: boolean; right: boolean; up: boolean; drift: boolean }>({
    left: false,
    right: false,
    up: false,
    drift: false,
  });

  const trailsRef = useRef<{ x: number; y: number; alpha: number }[]>([]);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStateRef.current !== 'racing') return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keysRef.current.up = true;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = true;
      if (e.key === ' ' || e.key === 'Shift') keysRef.current.drift = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keysRef.current.up = false;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false;
      if (e.key === ' ' || e.key === 'Shift') keysRef.current.drift = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const startRace = () => {
    carRef.current = {
      x: 160,
      y: 320,
      angle: 0,
      speed: 0,
      angularVelocity: 0,
      isDrifting: false,
      checkpointsPassed: 0,
      currentLap: 1,
    };
    trailsRef.current = [];
    setLap(1);
    setDriftScore(0);
    setElapsedTime(0);
    setGameState('racing');
    sounds.playBusHorn();
  };

  // Timer
  useEffect(() => {
    if (gameState !== 'racing' || isBusArriving) return;
    const timer = setInterval(() => {
      setElapsedTime((t) => t + 0.1);
    }, 100);
    return () => clearInterval(timer);
  }, [gameState, isBusArriving]);

  // Main Canvas Physics & Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const outerRadius = 140;
      const innerRadius = 75;

      // 1. Draw Paper Track (Seksyen 13 Roundabout)
      ctx.fillStyle = '#FAF8F5';
      ctx.fillRect(0, 0, width, height);

      // Outer grass / paper background pattern
      ctx.strokeStyle = '#DDD6CE';
      ctx.lineWidth = 1;

      // Asphalt Ring / Track
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2, true);
      ctx.fillStyle = '#EBE5DC';
      ctx.fill();
      ctx.strokeStyle = '#264653';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Track inner center island (Bulatan Stadium Origami Island)
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#A8DADC';
      ctx.fill();
      ctx.strokeStyle = '#2A9D8F';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Stadium Origami Icon in center
      ctx.fillStyle = '#264653';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('BULATAN', centerX, centerY - 6);
      ctx.fillText('SEKSYEN 13', centerX, centerY + 8);

      // Start / Finish Line at bottom
      ctx.strokeStyle = '#E76F51';
      ctx.lineWidth = 4;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY + innerRadius);
      ctx.lineTo(centerX, centerY + outerRadius);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Physics Update
      if (gameStateRef.current === 'racing' && !isBusArriving) {
        const car = carRef.current;

        // Acceleration
        if (keysRef.current.up) {
          car.speed = Math.min(car.speed + 0.12, 4.8);
        } else {
          car.speed = Math.max(car.speed - 0.05, 0);
        }

        // Steering
        const turnSpeed = car.isDrifting ? 0.075 : 0.05;
        if (keysRef.current.left) car.angle -= turnSpeed;
        if (keysRef.current.right) car.angle += turnSpeed;

        // Drift state toggle
        car.isDrifting = keysRef.current.drift && car.speed > 2.0;

        if (car.isDrifting) {
          setDriftScore((prev) => prev + 2);
          if (Math.random() > 0.6) {
            sounds.playDrift();
          }
          // Add skid trail
          trailsRef.current.push({
            x: car.x,
            y: car.y,
            alpha: 1.0,
          });
        }

        // Move car
        car.x += Math.cos(car.angle) * car.speed;
        car.y += Math.sin(car.angle) * car.speed;

        // Track boundary constraints (Keep inside roundabout)
        const distFromCenter = Math.hypot(car.x - centerX, car.y - centerY);
        if (distFromCenter < innerRadius + 10) {
          car.speed *= 0.7; // grass friction
        } else if (distFromCenter > outerRadius - 10) {
          car.speed *= 0.7;
        }

        // Lap progression check
        // Checkpoints around circle
        const angleFromCenter = Math.atan2(car.y - centerY, car.x - centerX);
        // Cross finish line downwards at bottom (angle near PI/2)
        if (
          car.checkpointsPassed === 0 &&
          angleFromCenter > -Math.PI &&
          angleFromCenter < -Math.PI / 2
        ) {
          car.checkpointsPassed = 1;
        } else if (
          car.checkpointsPassed === 1 &&
          angleFromCenter > 0 &&
          angleFromCenter < Math.PI / 4
        ) {
          car.checkpointsPassed = 2;
        } else if (car.checkpointsPassed === 2 && angleFromCenter > Math.PI / 2) {
          // Completed Lap!
          car.checkpointsPassed = 0;
          if (car.currentLap >= 3) {
            setGameState('finished');
            sounds.playChime('arrival');
          } else {
            car.currentLap += 1;
            setLap(car.currentLap);
            sounds.playChime('success');
          }
        }

        setSpeedKmH(Math.round(car.speed * 22));
      }

      // 3. Draw Tire Skid Trails
      ctx.fillStyle = '#264653';
      trailsRef.current.forEach((t) => {
        ctx.globalAlpha = t.alpha * 0.35;
        ctx.fillRect(t.x - 2, t.y - 2, 4, 4);
        t.alpha -= 0.015;
      });
      ctx.globalAlpha = 1.0;
      trailsRef.current = trailsRef.current.filter((t) => t.alpha > 0);

      // 4. Draw Origami Drift Car
      const car = carRef.current;
      ctx.save();
      ctx.translate(car.x, car.y);
      ctx.rotate(car.angle);

      // Car shadow
      ctx.fillStyle = 'rgba(38, 70, 83, 0.25)';
      ctx.fillRect(-12, -7, 24, 14);

      // Origami Chassis (Teal & Slate Facets)
      ctx.fillStyle = car.isDrifting ? '#E76F51' : '#2A9D8F';
      ctx.strokeStyle = '#264653';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(8, -8);
      ctx.lineTo(-14, -8);
      ctx.lineTo(-10, 0);
      ctx.lineTo(-14, 8);
      ctx.lineTo(8, 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Hood Facet
      ctx.fillStyle = '#264653';
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(4, -6);
      ctx.lineTo(4, 6);
      ctx.closePath();
      ctx.fill();

      // Rear Spoiler
      ctx.fillStyle = '#F4D06F';
      ctx.fillRect(-15, -9, 3, 18);

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isBusArriving]);

  return (
    <div className="flex flex-col items-center select-none w-full max-w-md mx-auto">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between bg-slate-900 text-white px-3 py-2 rounded-t-lg border-2 border-origami-teal text-xs">
        <div className="flex items-center gap-1.5">
          <Flag className="w-3.5 h-3.5 text-origami-yellow" />
          <span>Pusingan: <strong>{lap}/3</strong></span>
        </div>

        <div className="flex items-center gap-1 font-mono text-origami-yellow">
          <Zap className="w-3.5 h-3.5 fill-origami-yellow" />
          <span>Drift: <strong>{driftScore} pts</strong></span>
        </div>

        <div className="font-mono text-teal-300 font-bold">
          {speedKmH} km/j
        </div>

        <div className="font-mono text-gray-300">
          {elapsedTime.toFixed(1)}s
        </div>
      </div>

      {/* Canvas Roundabout */}
      <div className="relative w-full aspect-square max-h-[380px] bg-paper-bg border-2 border-origami-slate overflow-hidden shadow-paper-lg">
        <canvas ref={canvasRef} width={340} height={340} className="w-full h-full block" />

        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-origami-slate/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white space-y-3">
            <h3 className="font-black text-lg text-origami-yellow">Transit Drift: Neon Crease</h3>
            <p className="text-xs text-gray-300 max-w-xs leading-relaxed">
              Kawal jentera origami di Bulatan Seksyen 13! Gunakan drift untuk membina skor masa terpantas.
            </p>
            <button
              onClick={startRace}
              className="origami-btn bg-origami-teal text-white border-white px-5 py-2.5 rounded font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-paper"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Mula Perlumbaan</span>
            </button>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white space-y-3 animate-fadeIn">
            <h3 className="font-black text-lg text-origami-yellow">Garisan Penamat!</h3>
            <div className="bg-white/10 p-3 rounded border border-white/20 text-xs space-y-1 w-52">
              <div>Masa: <strong className="text-teal-300">{elapsedTime.toFixed(2)} saat</strong></div>
              <div>Mata Drift: <strong className="text-origami-yellow">{driftScore} pts</strong></div>
            </div>
            <button
              onClick={startRace}
              className="origami-btn bg-origami-teal text-white border-white px-5 py-2 rounded text-xs font-black shadow-paper"
            >
              Ulang Litar
            </button>
          </div>
        )}
      </div>

      {/* On-screen Controls */}
      <div className="w-full bg-slate-900 p-2.5 rounded-b-lg border-2 border-t-0 border-origami-teal flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onMouseDown={() => (keysRef.current.left = true)}
            onMouseUp={() => (keysRef.current.left = false)}
            onTouchStart={() => (keysRef.current.left = true)}
            onTouchEnd={() => (keysRef.current.left = false)}
            className="origami-btn px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded border border-white/30"
          >
            ◀ Belok Kiri
          </button>
          <button
            onMouseDown={() => (keysRef.current.right = true)}
            onMouseUp={() => (keysRef.current.right = false)}
            onTouchStart={() => (keysRef.current.right = true)}
            onTouchEnd={() => (keysRef.current.right = false)}
            className="origami-btn px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded border border-white/30"
          >
            Belok Kanan ▶
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onMouseDown={() => (keysRef.current.drift = true)}
            onMouseUp={() => (keysRef.current.drift = false)}
            onTouchStart={() => (keysRef.current.drift = true)}
            onTouchEnd={() => (keysRef.current.drift = false)}
            className="origami-btn px-3.5 py-2.5 bg-origami-terracotta text-white font-black text-xs rounded border border-white/40 shadow-xs"
          >
            🔥 DRIFT
          </button>

          <button
            onMouseDown={() => (keysRef.current.up = true)}
            onMouseUp={() => (keysRef.current.up = false)}
            onTouchStart={() => (keysRef.current.up = true)}
            onTouchEnd={() => (keysRef.current.up = false)}
            className="origami-btn px-4 py-2.5 bg-origami-teal text-white font-black text-xs rounded border border-white/40 shadow-paper"
          >
            ⚡ TEKAN GAS
          </button>
        </div>
      </div>
    </div>
  );
};
