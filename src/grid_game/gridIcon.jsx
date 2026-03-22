import React from 'react';

const GridGameIcon = ({ size = 128, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 128 128" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background with subtle grid pattern */}
      <defs>
        <pattern id="gridPattern" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="16" height="16" fill="#f0f8ff"/>
          <path d="M16 0L0 0 0 16" fill="none" stroke="#e0e0e0" stroke-width="1"/>
        </pattern>
        
        <linearGradient id="playerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2196F3"/>
          <stop offset="100%" stopColor="#1976D2"/>
        </linearGradient>
        
        <linearGradient id="computerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f44336"/>
          <stop offset="100%" stopColor="#D32F2F"/>
        </linearGradient>
        
        <linearGradient id="goalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4CAF50"/>
          <stop offset="100%" stopColor="#388E3C"/>
        </linearGradient>
        
        <linearGradient id="obstacleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9C27B0"/>
          <stop offset="100%" stopColor="#7B1FA2"/>
        </linearGradient>
        
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.3)"/>
        </filter>
        
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Main icon container with rounded corners */}
      <rect width="128" height="128" rx="20" fill="url(#gridPattern)" stroke="#e0e0e0" strokeWidth="2"/>
      
      {/* Grid lines */}
      <g stroke="#c0c0c0" strokeWidth="1.5" opacity="0.7">
        {/* Horizontal lines */}
        <line x1="24" y1="40" x2="104" y2="40"/>
        <line x1="24" y1="56" x2="104" y2="56"/>
        <line x1="24" y1="72" x2="104" y2="72"/>
        <line x1="24" y1="88" x2="104" y2="88"/>
        
        {/* Vertical lines */}
        <line x1="24" y1="24" x2="24" y2="104"/>
        <line x1="40" y1="24" x2="40" y2="104"/>
        <line x1="56" y1="24" x2="56" y2="104"/>
        <line x1="72" y1="24" x2="72" y2="104"/>
        <line x1="88" y1="24" x2="88" y2="104"/>
        <line x1="104" y1="24" x2="104" y2="104"/>
        
        {/* Top horizontal line */}
        <line x1="24" y1="24" x2="104" y2="24"/>
        {/* Bottom horizontal line */}
        <line x1="24" y1="104" x2="104" y2="104"/>
      </g>
      
      {/* Start position (top-left) */}
      <g transform="translate(32, 32)">
        <rect x="-8" y="-8" width="16" height="16" rx="3" fill="#ffebee" stroke="#f44336" strokeWidth="2"/>
        <text x="0" y="5" textAnchor="middle" fill="#d32f2f" fontSize="10" fontWeight="bold">S</text>
      </g>
      
      {/* Finish position (bottom-right) */}
      <g transform="translate(96, 96)">
        <rect x="-8" y="-8" width="16" height="16" rx="3" fill="#e8f5e8" stroke="#4CAF50" strokeWidth="2"/>
        <text x="0" y="5" textAnchor="middle" fill="#2e7d32" fontSize="10" fontWeight="bold">F</text>
      </g>
      
      {/* Player icon (blue person) */}
      <g transform="translate(48, 48)" filter="url(#shadow)">
        <circle cx="0" cy="-4" r="6" fill="url(#playerGradient)"/>
        <path d="M-6 0 Q0 6 6 0 L6 12 Q0 18 -6 12 Z" fill="url(#playerGradient)"/>
        <circle cx="-2" cy="-2" r="1" fill="white" opacity="0.8"/>
        <circle cx="2" cy="-2" r="1" fill="white" opacity="0.8"/>
      </g>
      
      {/* Computer icon (red robot) */}
      <g transform="translate(80, 64)" filter="url(#shadow)">
        <rect x="-6" y="-6" width="12" height="10" rx="2" fill="url(#computerGradient)"/>
        <rect x="-4" y="-4" width="8" height="6" fill="white" opacity="0.9"/>
        <circle cx="-2" cy="-1" r="1" fill="url(#computerGradient)"/>
        <circle cx="2" cy="-1" r="1" fill="url(#computerGradient)"/>
        <rect x="-3" y="6" width="6" height="2" fill="url(#computerGradient)"/>
      </g>
      
      {/* Second computer (orange) for hard mode representation */}
      <g transform="translate(64, 80)" filter="url(#shadow)">
        <rect x="-5" y="-5" width="10" height="8" rx="2" fill="#FF9800"/>
        <rect x="-3" y="-3" width="6" height="4" fill="white" opacity="0.9"/>
        <circle cx="-1.5" cy="-1" r="0.8" fill="#FF9800"/>
        <circle cx="1.5" cy="-1" r="0.8" fill="#FF9800"/>
        <rect x="-2.5" y="5" width="5" height="1.5" fill="#FF9800"/>
      </g>
      
      {/* Obstacle (purple hexagon) */}
      <g transform="translate(96, 48)" filter="url(#shadow)">
        <polygon 
          points="0,-6 5,-3 5,3 0,6 -5,3 -5,-3" 
          fill="url(#obstacleGradient)"
        />
        <polygon 
          points="0,-3 2.5,-1.5 2.5,1.5 0,3 -2.5,1.5 -2.5,-1.5" 
          fill="#7B1FA2"
        />
      </g>
      
      {/* Arrow showing movement path */}
      <g transform="translate(56, 56)">
        <path 
          d="M0,0 L16,0 L12,-4 M16,0 L12,4" 
          fill="none" 
          stroke="#2196F3" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          opacity="0.8"
        />
      </g>
      
      {/* Diagonal arrow showing escape path */}
      <g transform="translate(72, 72)">
        <path 
          d="M0,0 L11,11 L7,7 M11,11 L7,15" 
          fill="none" 
          stroke="#4CAF50" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          opacity="0.8"
        />
      </g>
      
      {/* Game title/logo text */}
      <text 
        x="64" 
        y="120" 
        textAnchor="middle" 
        fill="#333" 
        fontSize="12" 
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        Grid Chase
      </text>
      
      {/* Decorative corner elements */}
      <g opacity="0.3">
        <circle cx="20" cy="20" r="4" fill="#2196F3"/>
        <circle cx="108" cy="20" r="4" fill="#f44336"/>
        <circle cx="20" cy="108" r="4" fill="#4CAF50"/>
        <circle cx="108" cy="108" r="4" fill="#FF9800"/>
      </g>
      
      {/* Glow effect around player */}
      <circle cx="48" cy="48" r="12" fill="none" stroke="#2196F3" strokeWidth="1" opacity="0.3" filter="url(#glow)"/>
    </svg>
  );
};

export default GridGameIcon;
