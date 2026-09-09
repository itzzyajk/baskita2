'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { sounds } from '@/components/common/SoundEffects';
import { Play, Pause, RotateCcw, ArrowLeft, ArrowRight, Award, Star } from 'lucide-react';

interface PaperBusRunnerProps {
  isBusArriving?: boolean;
  onGameOver?: (score: number) => void;
}

interface Obstacle {
  lane: number; // 0: left, 1: center, 2: right
  y: number;
  type: 'cone' | 'cloud';
}

interface OrigamiStar {
  lane: number;
  y: number;
  collected: boolean;
}

export const PaperBusRunner: React.FC<PaperBusRunnerProps> = ({
  isBusArriving = false,
  onGameOver,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lane, setLane] = useState<number>(1); // 0, 1, 2
  const [score, setScore] = useState<number>(0);
  const [starsCount, setStarsCount] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(180);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'gameover'>('idle');

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const laneRef = useRef(lane);
  laneRef.current = lane;

  const obstaclesRef = useRef<Obstacle[]>([]);
  const starsRef = useRef<OrigamiStar[]>([]);
  const speedRef = useRef<number>(3.5);
  const lastSpawnRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);

  // Auto-pause if bus is arriving
  useEffect(() => {
    if (isBusArriving && gameStateRef.current === 'playing') {
      setGameState('paused');
    }
  }, [isBusArriving]);

  const moveLeft = useCallback(() => {
    setLane((prev) => Math.max(0, prev - 1));
    sounds.playPaperFold();
  }, []);

  const moveRight = useCallback(() => {
    setLane((prev) => Math.min(2, prev + 1));
    sounds.playPaperFold();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStateRef.current !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveRight();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveLeft, moveRight]);

  const startGame = () => {
    obstaclesRef.current = [];
    starsRef.current = [];
    speedRef.current = 3.5;
    setScore(0);
    setStarsCount(0);
    setLane(1);
    setGameState('playing');
    sounds.playBusHorn();
  };

  const resumeGame = () => {
    setGameState('playing');
  };

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let roadOffset = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const laneWidth = width / 3;

      // Clear & Draw Paper Road
      ctx.fillStyle = '#FAF8F5';
      ctx.fillRect(0, 0, width, height);

      // Road boundary borders
      ctx.strokeStyle = '#DDD6CE';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 0, width - 4, height);

      // Lane crease dividers (Dashed paper fold creases)
      ctx.strokeStyle = '#E2DCD5';
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 10]);
      ctx.lineDashOffset = -roadOffset;

      ctx.beginPath();
      ctx.moveTo(laneWidth, 0);
      ctx.lineTo(laneWidth, height);
      ctx.moveTo(laneWidth * 2, 0);
      ctx.lineTo(laneWidth * 2, height);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      if (gameStateRef.current === 'playing') {
        roadOffset = (roadOffset + speedRef.current) % 22;

        // Spawn obstacles & stars
        const now = Date.now();
        if (now - lastSpawnRef.current > 1200 - Math.min(speedRef.current * 80, 500)) {
          lastSpawnRef.current = now;
          const randomLane = Math.floor(Math.random() * 3);
          const isStar = Math.random() > 0.45;

          if (isStar) {
            starsRef.current.push({
              lane: randomLane,
              y: -30,
              collected: false,
            });
          } else {
            obstaclesRef.current.push({
              lane: randomLane,
              y: -40,
              type: Math.random() > 0.5 ? 'cone' : 'cloud',
            });
          }
        }

        // Increase speed slightly
        speedRef.current += 0.0008;
        setScore((prev) => prev + 1);
      }

      // Draw & Update Stars
      starsRef.current.forEach((star) => {
        if (gameStateRef.current === 'playing') {
          star.y += speedRef.current;
        }

        if (!star.collected) {
          const cx = star.lane * laneWidth + laneWidth / 2;
          const cy = star.y;

          // Folded Origami Star
          ctx.save();
          ctx.translate(cx, cy);
          ctx.fillStyle = '#F4D06F';
          ctx.strokeStyle = '#264653';
          ctx.lineWidth = 1.5;

          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            ctx.lineTo(
              Math.cos(((18 + i * 72) * Math.PI) / 180) * 14,
              -Math.sin(((18 + i * 72) * Math.PI) / 180) * 14
            );
            ctx.lineTo(
              Math.cos(((54 + i * 72) * Math.PI) / 180) * 7,
              -Math.sin(((54 + i * 72) * Math.PI) / 7) * 7
            );
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Fold crease center
          ctx.beginPath();
          ctx.arc(0, 0, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#E5B942';
          ctx.fill();
          ctx.restore();

          // Collision with player
          const playerY = height - 90;
          if (
            star.lane === laneRef.current &&
            star.y >= playerY - 15 &&
            star.y <= playerY + 60
          ) {
            star.collected = true;
            setStarsCount((prev) => prev + 1);
            setScore((prev) => prev + 50);
            sounds.playStarCollect();
          }
        }
      });

      // Filter stars out of bounds
      starsRef.current = starsRef.current.filter((s) => s.y < height + 40 && !s.collected);

      // Draw & Update Obstacles
      obstaclesRef.current.forEach((obs) => {
        if (gameStateRef.current === 'playing') {
          obs.y += speedRef.current;
        }

        const cx = obs.lane * laneWidth + laneWidth / 2;
        const cy = obs.y;

        if (obs.type === 'cone') {
          // Origami Traffic Cone
          ctx.save();
          ctx.translate(cx, cy);
          ctx.fillStyle = '#E76F51';
          ctx.strokeStyle = '#264653';
          ctx.lineWidth = 1.8;

          // Cone base
          ctx.beginPath();
          ctx.moveTo(-18, 16);
          ctx.lineTo(18, 16);
          ctx.lineTo(12, 22);
          ctx.lineTo(-12, 22);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Cone pyramid facet left
          ctx.beginPath();
          ctx.moveTo(0, -20);
          ctx.lineTo(-14, 16);
          ctx.lineTo(0, 16);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Cone pyramid facet right (darker)
          ctx.fillStyle = '#D6593A';
          ctx.beginPath();
          ctx.moveTo(0, -20);
          ctx.lineTo(0, 16);
          ctx.lineTo(14, 16);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Reflective white stripe
          ctx.fillStyle = '#FAF8F5';
          ctx.fillRect(-7, -4, 14, 6);
          ctx.strokeRect(-7, -4, 14, 6);
          ctx.restore();
        } else {
          // Origami Rain Cloud
          ctx.save();
          ctx.translate(cx, cy);
          ctx.fillStyle = '#A8DADC';
          ctx.strokeStyle = '#264653';
          ctx.lineWidth = 1.8;

          // Geometric cloud polygons
          ctx.beginPath();
          ctx.moveTo(-22, 10);
          ctx.lineTo(-12, -8);
          ctx.lineTo(6, -14);
          ctx.lineTo(24, 0);
          ctx.lineTo(20, 10);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Rain drops
          ctx.fillStyle = '#2A9D8F';
          ctx.fillRect(-10, 16, 2.5, 7);
          ctx.fillRect(4, 16, 2.5, 7);
          ctx.fillRect(16, 16, 2.5, 7);
          ctx.restore();
        }

        // Collision detection with player van
        const playerY = height - 90;
        if (
          obs.lane === laneRef.current &&
          obs.y >= playerY - 20 &&
          obs.y <= playerY + 55
        ) {
          // CRASH!
          sounds.playCrashFold();
          setGameState('gameover');
          if (onGameOver) onGameOver(score);
        }
      });

      // Filter obstacles out of bounds
      obstaclesRef.current = obstaclesRef.current.filter((o) => o.y < height + 50);

      // Draw Player: Folded Canary School Bus
      const playerX = laneRef.current * laneWidth + laneWidth / 2;
      const playerY = height - 90;

      ctx.save();
      ctx.translate(playerX, playerY);

      // Van drop shadow
      ctx.fillStyle = 'rgba(38, 70, 83, 0.18)';
      ctx.beginPath();
      ctx.ellipse(0, 36, 24, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bus Roof
      ctx.fillStyle = '#FFF275';
      ctx.strokeStyle = '#264653';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-16, -34);
      ctx.lineTo(16, -34);
      ctx.lineTo(20, -18);
      ctx.lineTo(-20, -18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Front Windshield (Teal)
      ctx.fillStyle = '#A8DADC';
      ctx.beginPath();
      ctx.moveTo(-18, -18);
      ctx.lineTo(18, -18);
      ctx.lineTo(15, -4);
      ctx.lineTo(-15, -4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Main Cabin Facet Left (Canary #F4D06F)
      ctx.fillStyle = '#F4D06F';
      ctx.beginPath();
      ctx.moveTo(-20, -4);
      ctx.lineTo(0, -4);
      ctx.lineTo(0, 30);
      ctx.lineTo(-20, 30);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Main Cabin Facet Right (Shaded #E5B942)
      ctx.fillStyle = '#E5B942';
      ctx.beginPath();
      ctx.moveTo(0, -4);
      ctx.lineTo(20, -4);
      ctx.lineTo(20, 30);
      ctx.lineTo(0, 30);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Front Grill / Terracotta Hazard
      ctx.fillStyle = '#E76F51';
      ctx.fillRect(-14, 20, 28, 5);
      ctx.strokeRect(-14, 20, 28, 5);

      // Wheels
      ctx.fillStyle = '#264653';
      ctx.fillRect(-22, -10, 4, 14);
      ctx.fillRect(18, -10, 4, 14);
      ctx.fillRect(-22, 14, 4, 14);
      ctx.fillRect(18, 14, 4, 14);

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [score, onGameOver]);

  // Update high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center select-none w-full max-w-md mx-auto">
      {/* Top Game Bar */}
      <div className="w-full flex items-center justify-between bg-white px-3 py-2 rounded-t-lg border-2 border-paper-creaseDark shadow-paper text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-500">Mata:</span>
          <span className="font-mono font-black text-sm text-origami-terracotta">{score}</span>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-0.5 rounded border border-origami-yellow text-origami-slate font-bold">
          <Star className="w-3.5 h-3.5 fill-origami-yellow text-origami-yellowDark" />
          <span>{starsCount}</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-gray-600 font-medium">
          <Award className="w-3.5 h-3.5 text-origami-teal" />
          <span>Rekod: {highScore}</span>
        </div>
      </div>

      {/* Canvas Game Area */}
      <div className="relative w-full aspect-[3/4] max-h-[460px] bg-paper-bg border-2 border-x-origami-slate border-b-2 border-paper-creaseDark overflow-hidden shadow-paper-lg">
        <canvas
          ref={canvasRef}
          width={320}
          height={420}
          className="w-full h-full block"
        />

        {/* Start Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-origami-slate/75 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white space-y-3">
            <div className="w-12 h-12 rounded-full bg-origami-yellow border-2 border-white flex items-center justify-center shadow-paper">
              <span className="text-xl">🚌</span>
            </div>
            <h3 className="font-black text-base tracking-wide">Paper Bus Runner</h3>
            <p className="text-xs text-paper-sheet max-w-xs leading-relaxed">
              Kawal van origami kuning di 3 laluan! Elak kon jalan & awan hujan, kutip bintang origami.
            </p>
            <button
              onClick={startGame}
              className="origami-btn origami-btn-primary px-6 py-2.5 rounded text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-paper"
            >
              <Play className="w-4 h-4 fill-origami-slate" />
              <span>Mula Main</span>
            </button>
          </div>
        )}

        {/* Paused Overlay */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-origami-slate/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white space-y-3">
            <h3 className="font-black text-base">Permainan Dijeda</h3>
            {isBusArriving && (
              <p className="text-xs text-amber-300 font-bold bg-origami-terracotta/40 px-3 py-1.5 rounded border border-amber-300">
                ⚠️ Bas sekolah sedang tiba! Sila bersiap di kaki lima.
              </p>
            )}
            <button
              onClick={resumeGame}
              className="origami-btn origami-btn-primary px-5 py-2 rounded text-xs font-bold"
            >
              Sambung Main
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-origami-slate/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white space-y-3 animate-fadeIn">
            <div className="text-3xl">💥</div>
            <h3 className="font-black text-lg text-origami-yellow">Lipatan Terhempas!</h3>
            <div className="bg-white/10 p-3 rounded border border-white/20 text-xs space-y-1 w-48">
              <div>Jumlah Skor: <strong className="text-amber-300 text-sm">{score}</strong></div>
              <div>Bintang Dikutip: <strong>{starsCount} ⭐</strong></div>
            </div>
            <button
              onClick={startGame}
              className="origami-btn origami-btn-primary px-5 py-2.5 rounded text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-paper"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Cuba Lagi</span>
            </button>
          </div>
        )}
      </div>

      {/* Touch Control Pad for Mobile Devices */}
      <div className="w-full bg-white p-2.5 rounded-b-lg border-2 border-t-0 border-paper-creaseDark shadow-paper flex items-center justify-between gap-3">
        <button
          onClick={moveLeft}
          disabled={gameState !== 'playing'}
          className="origami-btn flex-1 py-3 bg-paper-sheet hover:bg-paper-crease text-origami-slate font-black text-xs rounded flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kiri (Lane Left)</span>
        </button>

        {gameState === 'playing' ? (
          <button
            onClick={() => setGameState('paused')}
            className="origami-btn p-3 bg-paper-sheet text-gray-700 rounded"
            title="Jeda"
          >
            <Pause className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={resumeGame}
            disabled={gameState === 'idle' || gameState === 'gameover'}
            className="origami-btn p-3 bg-origami-yellow text-origami-slate rounded"
            title="Sambung"
          >
            <Play className="w-4 h-4 fill-origami-slate" />
          </button>
        )}

        <button
          onClick={moveRight}
          disabled={gameState !== 'playing'}
          className="origami-btn flex-1 py-3 bg-paper-sheet hover:bg-paper-crease text-origami-slate font-black text-xs rounded flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
        >
          <span>Kanan (Lane Right)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
