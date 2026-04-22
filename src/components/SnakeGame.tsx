/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 1, y: 0 });
    setIsGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        setIsPaused(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
        setSpeed((prev) => Math.max(50, prev - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood, isGameOver, isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, speed, isPaused, isGameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const blockSize = canvas.width / GRID_SIZE;

    ctx.fillStyle = '#020202';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle Grid Pattern
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * blockSize, 0);
        ctx.lineTo(i * blockSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * blockSize);
        ctx.lineTo(canvas.width, i * blockSize);
        ctx.stroke();
    }

    // Food
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#d946ef'; // fuchsia-500
    ctx.fillStyle = '#d946ef';
    const foodSize = blockSize * 0.7;
    ctx.save();
    ctx.translate(food.x * blockSize + blockSize / 2, food.y * blockSize + blockSize / 2);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-foodSize / 2, -foodSize / 2, foodSize, foodSize);
    ctx.restore();

    // Snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.shadowBlur = isHead ? 20 : 10;
      ctx.shadowColor = '#22d3ee'; // cyan-400
      ctx.fillStyle = isHead ? '#22d3ee' : '#0891b2';
      
      const padding = index === 0 ? 0 : 2;
      ctx.fillRect(
        segment.x * blockSize + padding,
        segment.y * blockSize + padding,
        blockSize - padding * 2,
        blockSize - padding * 2
      );

      if (isHead) {
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#000';
          const eyeSize = 2;
          ctx.beginPath();
          ctx.arc(segment.x * blockSize + blockSize/3, segment.y * blockSize + blockSize/2, eyeSize, 0, Math.PI * 2);
          ctx.arc(segment.x * blockSize + (blockSize * 2)/3, segment.y * blockSize + blockSize/2, eyeSize, 0, Math.PI * 2);
          ctx.fill();
      }
    });

    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <section 
      ref={containerRef}
      className="w-full h-full bg-[#020202] border-2 border-cyan-500/30 rounded-[40px] relative overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col"
    >
      {/* Background Score */}
      <div className="absolute top-8 left-8 select-none pointer-events-none transition-opacity duration-1000">
        <span className="text-[120px] font-black text-white/5 italic leading-none">{score || 500}</span>
      </div>

      <div className="absolute top-8 left-8 flex flex-col gap-1 z-10 opacity-40">
        <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest italic tracking-tighter">Score Target</div>
      </div>

      <div className="absolute bottom-8 right-8 flex gap-4 z-10">
        <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex flex-col items-center opacity-30">
          <span className="text-[8px] text-fuchsia-500 uppercase font-bold tracking-tighter">Multiplier</span>
          <span className="text-xl font-mono italic">x2.5</span>
        </div>
        <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex flex-col items-center opacity-30">
          <span className="text-[8px] text-cyan-500 uppercase font-bold tracking-tighter">Lives</span>
          <span className="text-xl font-mono tracking-tighter italic">///</span>
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center p-8">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="w-full h-full object-contain"
        />

        <AnimatePresence>
          {isPaused && !isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer z-20"
              onClick={() => setIsPaused(false)}
            >
              <div className="text-center group">
                <p className="text-white text-2xl font-black tracking-widest italic animate-pulse">SYSTEM_STANDBY</p>
                <div className="mt-4 w-12 h-12 rounded-full border-2 border-cyan-500 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-cyan-500 border-b-8 border-b-transparent ml-1" />
                </div>
                <p className="text-zinc-500 text-[10px] font-mono mt-4 uppercase tracking-[0.3em]">Press Space or Click to Wake</p>
              </div>
            </motion.div>
          )}

          {isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-30 p-8"
            >
              <div className="relative w-full max-w-lg aspect-auto border-[16px] border-fuchsia-500/20 rounded-[48px] bg-transparent p-1 shadow-[0_0_100px_rgba(217,70,239,0.15)] flex items-center justify-center">
                <div className="w-full h-full bg-[#0a0a0a] border border-white/10 rounded-[32px] p-12 text-center flex flex-col items-center justify-center gap-4">
                  <h2 className="text-[42px] leading-tight font-black text-fuchsia-500 italic uppercase tracking-tighter shadow-fuchsia-500/20 text-shadow-glow">
                    SESSION_TERMINATED
                  </h2>
                  <p className="text-zinc-500 font-mono uppercase text-xs tracking-widest mb-4">
                    SYSTEM RECOVERY POINTS: {score || 500}
                  </p>
                  <button
                    onClick={resetGame}
                    className="group relative px-12 py-4 bg-cyan-400 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.5)] active:scale-95 transition-all"
                  >
                    <span className="relative z-10 text-black font-black italic tracking-widest uppercase text-sm">
                      REBOOT_SEQUENCE
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
