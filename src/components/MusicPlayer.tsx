/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { TRACKS } from '../constants';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  const formattedTime = (percent: number) => {
      const totalSeconds = 252; // Mock duration 4:12 from design
      const currentSeconds = Math.floor((percent / 100) * totalSeconds);
      const mins = Math.floor(currentSeconds / 60);
      const secs = currentSeconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="h-full bg-[#0a0a0a] border border-white/5 rounded-3xl p-5 flex flex-col gap-5 shadow-xl">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest italic mb-2">Now Playing</div>
      
      <div className="aspect-square w-full bg-gradient-to-br from-[#1a1a1a] to-[#050505] rounded-2xl border border-white/10 overflow-hidden relative group shadow-2xl shadow-cyan-900/10">
        <AnimatePresence mode="wait">
            <motion.img 
                key={currentTrack.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={currentTrack.cover} 
                alt={currentTrack.title}
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
            />
        </AnimatePresence>

        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-6">
          <div className="text-xl font-black text-white leading-none tracking-tighter italic mb-1">
            {currentTrack.title.toUpperCase()}
          </div>
          <div className="text-[10px] text-cyan-400 font-mono italic uppercase tracking-widest opacity-80">
            {currentTrack.artist}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 mt-auto">
        <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-cyan-400"
            initial={false}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest italic">
          <span>{formattedTime(progress)}</span>
          <span>04:12</span>
        </div>
        <div className="flex justify-between items-center px-4 pt-4">
          <button 
            onClick={skipBackward}
            className="text-white/40 hover:text-cyan-400 transition-colors transform hover:scale-110 active:scale-90"
          >
            <SkipBack size={28} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black hover:bg-cyan-400 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>

          <button 
            onClick={skipForward}
            className="text-white/40 hover:text-cyan-400 transition-colors transform hover:scale-110 active:scale-90"
          >
            <SkipForward size={28} fill="currentColor" />
          </button>
        </div>
      </div>
    </section>
  );
}
