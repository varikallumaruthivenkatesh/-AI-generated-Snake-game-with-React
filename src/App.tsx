/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { TRACKS } from './constants';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-6 flex flex-col gap-6 selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Header Section */}
      <header className="flex items-center justify-between border-b border-cyan-500/20 pb-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-fuchsia-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <div className="hidden sm:block h-8 w-32 bg-gradient-to-r from-cyan-400 to-fuchsia-400 opacity-80 rounded-sm relative overflow-hidden">
            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] font-mono text-black font-bold">v2.0.4</span>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-xl md:text-2xl font-black tracking-[0.2em] text-cyan-400 italic">
            SNAKE GAME
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-fuchsia-500 font-bold">System Status</span>
            <span className="text-xs font-mono text-emerald-400 uppercase">Stable_OS // Optimized</span>
          </div>
          <div className="w-10 h-10 rounded-full border border-cyan-500/30 p-1 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-cyan-500/10 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Bento Grid */}
      <main className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-6 max-w-7xl mx-auto w-full flex-1">
        
        {/* LEFT COLUMN: Music Player */}
        <div className="md:col-span-3 md:row-span-4 h-full">
          <MusicPlayer />
        </div>

        {/* CENTER COLUMN: Snake Game */}
        <div className="md:col-span-6 md:row-span-6 h-full min-h-[500px]">
          <SnakeGame />
        </div>

        {/* RIGHT COLUMN: Stats & Tracklist */}
        <section className="md:col-span-3 md:row-span-3 bg-[#0a0a0a] border border-white/5 rounded-3xl p-5 flex flex-col shadow-xl">
          <div className="text-xs font-mono text-fuchsia-500 uppercase tracking-widest mb-4 italic">Player Statistics</div>
          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-end border-b border-white/5 pb-2">
              <span className="text-white/60 text-sm">High Score</span>
              <span className="text-xl font-mono text-cyan-400 tracking-tighter">18,902</span>
            </div>
            <div className="flex justify-between items-end border-b border-white/5 pb-2">
              <span className="text-white/60 text-sm">Blocks Eaten</span>
              <span className="text-xl font-mono tracking-tighter">452</span>
            </div>
            <div className="flex justify-between items-end border-b border-white/5 pb-2">
              <span className="text-white/60 text-sm">Time Played</span>
              <span className="text-xl font-mono tracking-tighter uppercase">12:44:02</span>
            </div>
          </div>
          <button className="w-full mt-4 py-3 bg-fuchsia-600/10 border border-fuchsia-500/50 rounded-xl text-fuchsia-500 text-[10px] font-bold uppercase tracking-widest hover:bg-fuchsia-500 hover:text-white transition-all transform active:scale-95 cursor-not-allowed opacity-50">
            Reset Session
          </button>
        </section>

        <section className="md:col-span-3 md:row-span-3 bg-[#0a0a0a] border border-white/5 rounded-3xl p-5 flex flex-col overflow-hidden shadow-xl">
          <div className="text-xs font-mono text-cyan-500 uppercase tracking-widest mb-4 italic">Up Next</div>
          <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar">
            {TRACKS.map((track, i) => (
              <motion.div 
                key={track.id}
                whileHover={{ x: 5 }}
                className={`flex items-center gap-3 p-3 rounded-xl border border-transparent transition-all ${i === 0 ? 'bg-white/5 border border-white/5 border-l-cyan-500 border-l-4' : 'hover:bg-white/5'}`}
              >
                <div className="w-8 h-8 rounded-md overflow-hidden bg-zinc-800">
                  <img src={track.cover} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold truncate">{track.title}</span>
                  <span className="text-[9px] text-white/40 uppercase font-mono truncate">{track.artist}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* BOTTOM LEFT: Controls Info (Desktop only or shared) */}
        <section className="md:col-span-3 md:row-span-2 bg-gradient-to-br from-[#121212] to-[#0a0a0a] border border-white/5 rounded-3xl p-5 flex flex-col justify-between shadow-xl">
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest italic">Game Controls</div>
          <div className="grid grid-cols-3 gap-2 max-w-[120px]">
            <div className="w-10 h-10 border border-white/10 rounded-lg flex items-center justify-center text-xs font-mono font-bold bg-white/5">W</div>
            <div className="w-10 h-10 border border-white/10 rounded-lg flex items-center justify-center text-xs font-mono font-bold bg-white/5">A</div>
            <div className="w-10 h-10 border border-white/10 rounded-lg flex items-center justify-center text-xs font-mono font-bold bg-white/5">S</div>
            <div className="col-start-2 w-10 h-10 border border-white/10 rounded-lg flex items-center justify-center text-xs font-mono font-bold bg-cyan-500 text-black">D</div>
          </div>
        </section>
      </main>

      {/* Footer Details */}
      <footer className="flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-white/20 pt-4 border-t border-white/5 max-w-7xl mx-auto w-full gap-4">
        <div className="flex gap-4 uppercase tracking-widest">
          <span>Latency: 4ms</span>
          <span>FPS: 144</span>
          <span>Buffer: 100%</span>
        </div>
        <div className="uppercase tracking-widest">© 2026 NEURAL_AUDIO_GAMES.INC</div>
      </footer>
    </div>
  );
}
