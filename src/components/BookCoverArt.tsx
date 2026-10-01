import React, { useMemo } from 'react';
import { CoverTheme } from '../types/story';

interface BookCoverArtProps {
  title: string;
  author: string;
  theme: CoverTheme;
  className?: string;
  badge?: string;
}

function buildCoverSvg(title: string, author: string, theme: CoverTheme, badge?: string): string {
  const safeTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeAuthor = author.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeBadge = (badge || 'JEYDAHSAN').toUpperCase();

  // Split title into readable lines
  const words = safeTitle.split(' ');
  const lines: string[] = [];
  let curr = '';
  for (const w of words) {
    if ((curr + ' ' + w).trim().length <= 15) {
      curr = (curr + ' ' + w).trim();
    } else {
      if (curr) lines.push(curr);
      curr = w;
    }
  }
  if (curr) lines.push(curr);
  const displayLines = lines.slice(0, 3);

  const configs: Record<
    CoverTheme,
    {
      bg1: string;
      bg2: string;
      accent: string;
      text: string;
      sub: string;
      artwork: string;
    }
  > = {
    'emerald-botanical': {
      bg1: '#064E3B',
      bg2: '#022C22',
      accent: '#34D399',
      text: '#FFFFFF',
      sub: '#A7F3D0',
      artwork: `
        <circle cx="200" cy="275" r="90" fill="none" stroke="#34D399" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.6"/>
        <circle cx="200" cy="275" r="65" fill="#047857" opacity="0.4"/>
        <g fill="#10B981" opacity="0.85">
          <path d="M 200 370 Q 170 300 130 250 Q 180 270 200 340 Z"/>
          <path d="M 200 370 Q 230 300 270 250 Q 220 270 200 340 Z"/>
          <path d="M 200 370 Q 185 270 170 210 Q 195 240 200 320 Z" fill="#6EE7B7"/>
          <path d="M 200 370 Q 215 270 230 210 Q 205 240 200 320 Z" fill="#6EE7B7"/>
        </g>
        <circle cx="200" cy="195" r="8" fill="#ECFDF5"/>
      `,
    },
    'mint-constellation': {
      bg1: '#065F46',
      bg2: '#042F2C',
      accent: '#6EE7B7',
      text: '#FFFFFF',
      sub: '#D1FAE5',
      artwork: `
        <g stroke="#A7F3D0" stroke-width="1.2" opacity="0.75">
          <line x1="120" y1="220" x2="160" y2="280"/>
          <line x1="160" y1="280" x2="240" y2="260"/>
          <line x1="240" y1="260" x2="280" y2="330"/>
          <line x1="160" y1="280" x2="200" y2="350"/>
          <line x1="200" y1="350" x2="280" y2="330"/>
        </g>
        <g fill="#FFFFFF">
          <circle cx="120" cy="220" r="4"/>
          <circle cx="160" cy="280" r="5" fill="#34D399"/>
          <circle cx="240" cy="260" r="4.5"/>
          <circle cx="280" cy="330" r="4"/>
          <circle cx="200" cy="350" r="5.5" fill="#6EE7B7"/>
        </g>
        <circle cx="200" cy="285" r="95" stroke="#34D399" stroke-width="0.8" fill="none" opacity="0.3"/>
      `,
    },
    'forest-silhouette': {
      bg1: '#0F291E',
      bg2: '#051810',
      accent: '#10B981',
      text: '#FFFFFF',
      sub: '#6EE7B7',
      artwork: `
        <!-- Mist and pine layers -->
        <circle cx="200" cy="245" r="60" fill="#ECFDF5" opacity="0.85"/>
        <path d="M 60 410 L 120 310 L 145 340 L 200 270 L 255 340 L 280 310 L 340 410 Z" fill="#047857" opacity="0.9"/>
        <path d="M 100 420 L 160 330 L 180 360 L 220 300 L 260 360 L 300 330 L 350 420 Z" fill="#064E3B"/>
        <circle cx="200" cy="245" r="70" stroke="#10B981" stroke-width="1" fill="none" opacity="0.3"/>
      `,
    },
    'jade-arch': {
      bg1: '#064E3B',
      bg2: '#0B291B',
      accent: '#A7F3D0',
      text: '#FFFFFF',
      sub: '#6EE7B7',
      artwork: `
        <!-- Minimal architectural portal -->
        <rect x="110" y="210" width="180" height="200" rx="90" fill="none" stroke="#34D399" stroke-width="1.8" opacity="0.8"/>
        <rect x="130" y="235" width="140" height="175" rx="70" fill="none" stroke="#6EE7B7" stroke-width="1" opacity="0.45"/>
        <path d="M 140 370 L 260 370" stroke="#A7F3D0" stroke-width="1.5"/>
        <circle cx="200" cy="290" r="18" fill="#ECFDF5" opacity="0.9"/>
        <circle cx="200" cy="290" r="28" stroke="#34D399" stroke-width="1" fill="none"/>
      `,
    },
    'sage-minimal': {
      bg1: '#F0FDF4',
      bg2: '#DCFCE7',
      accent: '#059669',
      text: '#064E3B',
      sub: '#047857',
      artwork: `
        <circle cx="200" cy="280" r="85" fill="#A7F3D0" opacity="0.35"/>
        <circle cx="200" cy="280" r="70" stroke="#059669" stroke-width="1.5" fill="#FFFFFF"/>
        <path d="M 160 280 C 180 230 220 230 240 280 C 220 330 180 330 160 280 Z" fill="#10B981" opacity="0.8"/>
        <circle cx="200" cy="280" r="6" fill="#FFFFFF"/>
      `,
    },
    'pine-vintage': {
      bg1: '#064E3B',
      bg2: '#022C22',
      accent: '#FCD34D',
      text: '#FFFFFF',
      sub: '#D1FAE5',
      artwork: `
        <rect x="60" y="190" width="280" height="190" fill="none" stroke="#FCD34D" stroke-width="1" opacity="0.5"/>
        <circle cx="200" cy="285" r="55" fill="#047857"/>
        <circle cx="200" cy="285" r="48" stroke="#FCD34D" stroke-width="1" fill="none"/>
        <text x="200" y="293" text-anchor="middle" fill="#FCD34D" font-family="serif" font-size="24" font-style="italic">JS</text>
      `,
    },
  };

  const c = configs[theme] || configs['emerald-botanical'];

  const titleSvg = displayLines
    .map(
      (line, i) =>
        `<text x="200" y="${94 + i * 32}" text-anchor="middle" fill="${c.text}" font-family="Georgia, serif" font-size="26" font-weight="700" letter-spacing="-0.01em">${line}</text>`
    )
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 550" width="400" height="550">
    <defs>
      <linearGradient id="covBg" x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0%" stop-color="${c.bg1}"/>
        <stop offset="100%" stop-color="${c.bg2}"/>
      </linearGradient>
      <linearGradient id="covSpine" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.4"/>
        <stop offset="6%" stop-color="#FFFFFF" stop-opacity="0.18"/>
        <stop offset="12%" stop-color="#000000" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="400" height="550" fill="url(#covBg)" />
    <!-- White / Gold border framing -->
    <rect x="20" y="20" width="360" height="510" fill="none" stroke="${c.accent}" stroke-width="1" opacity="0.4"/>
    <rect x="26" y="26" width="348" height="498" fill="none" stroke="${c.accent}" stroke-width="0.5" opacity="0.2"/>
    <!-- Top Brand Imprint Badge -->
    <text x="200" y="52" text-anchor="middle" fill="${c.sub}" font-family="sans-serif" font-size="9" font-weight="700" letter-spacing="0.25em">${safeBadge}</text>
    <!-- Story Title Lines -->
    ${titleSvg}
    <!-- Center Theme Artwork -->
    ${c.artwork}
    <!-- Author Byline -->
    <text x="200" y="498" text-anchor="middle" fill="${c.sub}" font-family="sans-serif" font-size="11" font-weight="600" letter-spacing="0.15em">${safeAuthor.toUpperCase()}</text>
    <!-- Realistic 3D Book Spine Shading -->
    <rect width="52" height="550" fill="url(#covSpine)"/>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const BookCoverArt: React.FC<BookCoverArtProps> = ({
  title,
  author,
  theme,
  className = '',
  badge,
}) => {
  const src = useMemo(
    () => buildCoverSvg(title, author, theme, badge),
    [title, author, theme, badge]
  );

  return (
    <div
      className={`relative aspect-[3/4] w-full overflow-hidden rounded-md bg-[#064E3B] shadow-sm border border-[#064E3B]/10 select-none group-hover:shadow-md transition-shadow ${className}`}
    >
      <img
        src={src}
        alt={`Cover of ${title} by ${author}`}
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02]"
      />
    </div>
  );
};
