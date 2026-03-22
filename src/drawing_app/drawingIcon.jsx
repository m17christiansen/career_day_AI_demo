import React, { useState } from 'react';

const AnimatedDrawingGameIcon = ({ size = 64, color = '#667eea', ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}
      {...props}
    >
      {/* Animated background */}
      <rect
        x="8"
        y="8"
        width="48"
        height="48"
        rx="6"
        fill="white"
        stroke={color}
        strokeWidth="2"
        style={{
          filter: isHovered ? 'drop-shadow(0 0 8px rgba(102, 126, 234, 0.3))' : 'none',
          transition: 'filter 0.3s ease'
        }}
      />
      
      {/* Pulsing AI core */}
      <circle
        cx="32"
        cy="24"
        r="8"
        fill={`${color}20`}
        stroke={color}
        strokeWidth="1.5"
        style={{
          animation: isHovered ? 'pulse 1.5s ease-in-out infinite' : 'none'
        }}
      />
      <circle cx="32" cy="24" r="4" fill={color} />
      
      {/* Brush that moves on hover */}
      <g style={{ transform: isHovered ? 'translate(2px, -2px)' : 'none', transition: 'transform 0.3s ease' }}>
        <path
          d="M44 40L52 32L56 36L48 44L44 40Z"
          fill="#FF6B6B"
          stroke="#FF5252"
          strokeWidth="1.5"
        />
      </g>
      
      {/* Animated drawing line */}
      <path
        d="M20 36C22 34 24 34 26 36C28 38 30 40 32 38C34 36 36 36 38 38C40 40 42 42 44 40"
        stroke="#4ECDC4"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        strokeDasharray={isHovered ? "0" : "100"}
        strokeDashoffset={isHovered ? "0" : "100"}
        style={{
          transition: 'stroke-dasharray 1s ease, stroke-dashoffset 1s ease'
        }}
      />
      
      {/* Color palette dots */}
      <circle cx="20" cy="48" r="5" fill="#FFD166">
        <animate
          attributeName="r"
          values="5;6;5"
          dur="2s"
          repeatCount="indefinite"
          begin={isHovered ? "0s" : "indefinite"}
        />
      </circle>
      <circle cx="28" cy="44" r="4" fill="#06D6A0">
        <animate
          attributeName="r"
          values="4;5;4"
          dur="2s"
          repeatCount="indefinite"
          begin={isHovered ? "0.2s" : "indefinite"}
        />
      </circle>
      <circle cx="16" cy="44" r="4" fill="#EF476F">
        <animate
          attributeName="r"
          values="4;5;4"
          dur="2s"
          repeatCount="indefinite"
          begin={isHovered ? "0.4s" : "indefinite"}
        />
      </circle>
      
      {/* Floating AI particles */}
      {isHovered && (
        <>
          <circle cx="48" cy="20" r="1.5" fill="#FFD700">
            <animate
              attributeName="cy"
              values="20;18;20"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="56" cy="24" r="1.5" fill="#FFD700">
            <animate
              attributeName="cy"
              values="24;22;24"
              dur="1.5s"
              repeatCount="indefinite"
              begin="0.3s"
            />
          </circle>
          <circle cx="52" cy="28" r="1.5" fill="#FFD700">
            <animate
              attributeName="cy"
              values="28;26;28"
              dur="1.5s"
              repeatCount="indefinite"
              begin="0.6s"
            />
          </circle>
        </>
      )}
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </svg>
  );
};

export default AnimatedDrawingGameIcon;
