'use client';

import React, { useState, useEffect } from 'react';
import { sounds } from '@/components/common/SoundEffects';
import confetti from 'canvas-confetti';
import { RotateCcw, Clock, Trophy, CheckCircle2 } from 'lucide-react';

interface Tile {
  id: number;
  pairId: number;
  name: string;
  symbol: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const WILDLIFE_PAIRS = [
  { pairId: 1, name: 'Kancil', symbol: '🦌', color: 'bg-amber-100 border-origami-yellow' },
  { pairId: 2, name: 'Harimau', symbol: '🐯', color: 'bg-orange-100 border-origami-terracotta' },
  { pairId: 3, name: 'Kenyalang', symbol: '🪶', color: 'bg-teal-100 border-origami-teal' },
  { pairId: 4, name: 'Gajah', symbol: '🐘', color: 'bg-slate-100 border-origami-slate' },
  { pairId: 5, name: 'Rama-Rama', symbol: '🦋', color: 'bg-emerald-100 border-emerald-500' },
  { pairId: 6, name: 'Penyu', symbol: '🐢', color: 'bg-cyan-100 border-cyan-500' },
];

export const RouteFoldPuzzle: React.FC<{ isBusArriving?: boolean }> = ({ isBusArriving }) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isWon, setIsWon] = useState(false);

  // Initialize and shuffle tiles
  const initGame = () => {
    const deck: Tile[] = [];
    let idCounter = 0;

    WILDLIFE_PAIRS.forEach((item) => {
      // 2 cards per pair
      for (let i = 0; i < 2; i++) {
        deck.push({
          id: idCounter++,
          pairId: item.pairId,
          name: item.name,
          symbol: item.symbol,
          color: item.color,
          isFlipped: false,
          isMatched: false,
        });
      }
    });

    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setTiles(deck);
    setFlippedIndices([]);
    setMoves(0);
    setMatchedPairs(0);
    setSecondsElapsed(0);
    setIsWon(false);
    sounds.playPaperFold();
  };

  useEffect(() => {
    initGame();
  }, []);

  // Timer
  useEffect(() => {
    if (isWon || isBusArriving) return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isWon, isBusArriving]);

  // Tile click logic
  const handleTileClick = (index: number) => {
    if (isBusArriving || isWon) return;
    if (flippedIndices.length >= 2) return;
    if (tiles[index].isFlipped || tiles[index].isMatched) return;

    sounds.playPaperFold();

    const newTiles = [...tiles];
    newTiles[index].isFlipped = true;
    const nextFlipped = [...flippedIndices, index];

    setTiles(newTiles);
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = nextFlipped;

      if (newTiles[firstIdx].pairId === newTiles[secondIdx].pairId) {
        // MATCH!
        setTimeout(() => {
          newTiles[firstIdx].isMatched = true;
          newTiles[secondIdx].isMatched = true;
          setTiles([...newTiles]);
          setFlippedIndices([]);
          setMatchedPairs((p) => {
            const updated = p + 1;
            if (updated === WILDLIFE_PAIRS.length) {
              setIsWon(true);
              sounds.playChime('arrival');
              try {
                confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
              } catch {}
            } else {
              sounds.playChime('success');
            }
            return updated;
          });
        }, 350);
      } else {
        // NO MATCH -> Flip back
        setTimeout(() => {
          newTiles[firstIdx].isFlipped = false;
          newTiles[secondIdx].isFlipped = false;
          setTiles([...newTiles]);
          setFlippedIndices([]);
        }, 850);
      }
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-md mx-auto space-y-3">
      {/* Top Status Bar */}
      <div className="w-full flex items-center justify-between bg-white px-3.5 py-2.5 rounded-lg border-2 border-paper-creaseDark shadow-paper text-xs">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-origami-teal" />
          <span className="font-mono font-bold text-origami-slate">{formatTime(secondsElapsed)}</span>
        </div>

        <div className="flex items-center gap-1 text-gray-600">
          <span>Langkah:</span>
          <strong className="font-mono text-origami-slate">{moves}</strong>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-gray-500 font-medium">Padanan:</span>
          <span className="font-mono font-bold text-origami-terracotta">
            {matchedPairs}/{WILDLIFE_PAIRS.length}
          </span>
        </div>

        <button
          onClick={initGame}
          className="origami-btn p-1.5 bg-paper-sheet hover:bg-paper-crease text-origami-slate rounded shadow-xs"
          title="Ulang Semula"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of Origami Cards */}
      <div className="w-full bg-paper-bg p-4 rounded-lg border-2 border-origami-slate shadow-paper-lg">
        {isWon ? (
          <div className="py-8 text-center space-y-3 animate-fadeIn">
            <div className="w-16 h-16 bg-origami-yellow rounded-full border-2 border-origami-slate flex items-center justify-center mx-auto shadow-paper">
              <Trophy className="w-8 h-8 text-origami-slate" />
            </div>
            <h3 className="font-black text-lg text-origami-slate">Hebat! Lipatan Padan Sepenuhnya!</h3>
            <p className="text-xs text-gray-600">
              Diselesaikan dalam <strong>{moves} langkah</strong> dan <strong>{formatTime(secondsElapsed)}</strong>.
            </p>
            <button
              onClick={initGame}
              className="origami-btn origami-btn-primary px-5 py-2 rounded text-xs font-black shadow-paper"
            >
              Main Lagi
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {tiles.map((tile, idx) => {
              const isRevealed = tile.isFlipped || tile.isMatched;

              return (
                <button
                  key={tile.id}
                  onClick={() => handleTileClick(idx)}
                  disabled={isRevealed || isBusArriving}
                  className={`aspect-square rounded-md border-2 p-1.5 flex flex-col items-center justify-center transition-all duration-300 relative ${
                    tile.isMatched
                      ? `${tile.color} ring-2 ring-emerald-500 opacity-90 scale-95 shadow-xs`
                      : isRevealed
                      ? `${tile.color} shadow-paper scale-100 ring-2 ring-origami-slate`
                      : 'bg-white border-paper-creaseDark shadow-paper hover:bg-paper-sheet hover:-translate-y-0.5'
                  }`}
                >
                  {isRevealed ? (
                    <div className="flex flex-col items-center justify-center text-center animate-unfold">
                      <span className="text-2xl sm:text-3xl">{tile.symbol}</span>
                      <span className="text-[10px] font-black uppercase text-origami-slate tracking-tight mt-1">
                        {tile.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center opacity-70">
                      <div className="w-6 h-6 border border-dashed border-gray-400 rounded-xs flex items-center justify-center text-[10px] font-mono text-gray-400">
                        ✂️
                      </div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase mt-1">LIPAT</span>
                    </div>
                  )}

                  {tile.isMatched && (
                    <span className="absolute top-1 right-1 text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
