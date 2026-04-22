/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
  color: string;
}

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'AI Composer Alpha',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon/400/400',
    color: '#a855f7', // purple-500
  },
  {
    id: '2',
    title: 'Cyber Dreams',
    artist: 'Neural Network Beta',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/cyber/400/400',
    color: '#06b6d4', // cyan-500
  },
  {
    id: '3',
    title: 'Shadow Rhythm',
    artist: 'Ethereal Intelligence',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/shadow/400/400',
    color: '#ef4444', // red-500
  },
];
