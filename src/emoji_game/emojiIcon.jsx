import React from 'react';

const EmojiIcon = ({ size = 60, animated = true }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', cursor: 'pointer' }}
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="url(#gradient)" stroke="#667eea" strokeWidth="2" />
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
        
        {/* Animation definitions */}
        <animateTransform
          id="bounce"
          attributeName="transform"
          type="translate"
          values="0,0; 0,-5; 0,0"
          dur="2s"
          repeatCount="indefinite"
        />
        
        <animateTransform
          id="rotate"
          attributeName="transform"
          type="rotate"
          values="0 50 50; 360 50 50"
          dur="20s"
          repeatCount="indefinite"
        />
        
        <animate
          id="blink"
          attributeName="opacity"
          values="1;0.3;1"
          dur="3s"
          repeatCount="indefinite"
        />
        
        <animate
          id="pulse"
          attributeName="r"
          values="48;50;48"
          dur="4s"
          repeatCount="indefinite"
        />
      </defs>
      
      {/* Smiling face emoji */}
      <g transform="translate(25, 25)" style={animated ? { animation: 'float 3s ease-in-out infinite' } : {}}>
        {/* Face */}
        <circle cx="25" cy="25" r="20" fill="#FFD93D" stroke="#FFB300" strokeWidth="2">
          {animated && <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" />}
        </circle>
        
        {/* Left eye */}
        <circle cx="18" cy="20" r="3" fill="#333">
          {animated && <animate attributeName="cy" values="20;18;20" dur="1.5s" repeatCount="indefinite" />}
        </circle>
        
        {/* Right eye */}
        <circle cx="32" cy="20" r="3" fill="#333">
          {animated && <animate attributeName="cy" values="20;18;20" dur="1.5s" repeatCount="indefinite" />}
        </circle>
        
        {/* Smile */}
        <path 
          d="M15 30 Q25 40 35 30" 
          stroke="#333" 
          strokeWidth="3" 
          fill="none" 
          strokeLinecap="round"
        >
          {animated && (
            <animate
              attributeName="d"
              values="M15 30 Q25 40 35 30; M15 32 Q25 38 35 32; M15 30 Q25 40 35 30"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </path>
      </g>
      
      {/* Heart eyes emoji - floating */}
      <g transform="translate(60, 15)" style={animated ? { animation: 'float 3s ease-in-out infinite 0.5s' } : {}}>
        {/* Face */}
        <circle cx="20" cy="20" r="15" fill="#FFD93D" stroke="#FFB300" strokeWidth="2" />
        
        {/* Left heart eye */}
        <g transform="translate(12, 15)">
          <path 
            d="M0 0 C -5 -8, -10 -5, 0 -10 C 10 -5, 5 -8, 0 0" 
            fill="#FF6B8B"
          >
            {animated && (
              <animateTransform
                attributeName="transform"
                type="scale"
                values="1;1.2;1"
                dur="1.5s"
                repeatCount="indefinite"
              />
            )}
          </path>
        </g>
        
        {/* Right heart eye */}
        <g transform="translate(28, 15)">
          <path 
            d="M0 0 C -5 -8, -10 -5, 0 -10 C 10 -5, 5 -8, 0 0" 
            fill="#FF6B8B"
          >
            {animated && (
              <animateTransform
                attributeName="transform"
                type="scale"
                values="1;1.2;1"
                dur="1.5s"
                repeatCount="indefinite"
                begin="0.2s"
              />
            )}
          </path>
        </g>
        
        {/* Smile */}
        <path 
          d="M10 28 Q20 35 30 28" 
          stroke="#333" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round"
        />
      </g>
      
      {/* Laughing emoji - floating */}
      <g transform="translate(15, 60)" style={animated ? { animation: 'float 3s ease-in-out infinite 1s' } : {}}>
        {/* Face */}
        <circle cx="20" cy="20" r="15" fill="#FFD93D" stroke="#FFB300" strokeWidth="2" />
        
        {/* Eyes - closed from laughing */}
        <path 
          d="M12 18 Q15 22 18 18" 
          stroke="#333" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round"
        />
        <path 
          d="M22 18 Q25 22 28 18" 
          stroke="#333" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round"
        />
        
        {/* Big laughing mouth */}
        <ellipse 
          cx="20" 
          cy="28" 
          rx="8" 
          ry="6" 
          fill="#FF6B8B" 
          stroke="#333" 
          strokeWidth="1.5"
        >
          {animated && (
            <animate
              attributeName="ry"
              values="6;8;6"
              dur="1s"
              repeatCount="indefinite"
            />
          )}
        </ellipse>
        
        {/* Tongue */}
        <ellipse 
          cx="20" 
          cy="30" 
          rx="4" 
          ry="2" 
          fill="#FF8FA3"
        >
          {animated && (
            <animate
              attributeName="cy"
              values="30;31;30"
              dur="0.8s"
              repeatCount="indefinite"
            />
          )}
        </ellipse>
      </g>
      
      {/* Speech bubble with emoji */}
      <g transform="translate(65, 65)" style={animated ? { animation: 'float 3s ease-in-out infinite 1.5s' } : {}}>
        {/* Speech bubble */}
        <path 
          d="M25 5 L35 0 L30 10 L40 5 Q45 5 45 10 L45 25 Q45 30 40 30 L10 30 Q5 30 5 25 L5 10 Q5 5 10 5 Z" 
          fill="white" 
          stroke="#667eea" 
          strokeWidth="1.5"
        />
        
        {/* Thinking emoji inside */}
        <g transform="translate(25, 18) scale(0.8)">
          {/* Face */}
          <circle cx="15" cy="15" r="12" fill="#FFD93D" stroke="#FFB300" strokeWidth="1.5" />
          
          {/* Thinking eyes */}
          <circle cx="10" cy="12" r="2" fill="#333">
            {animated && (
              <animate
                attributeName="opacity"
                values="1;0.5;1"
                dur="2s"
                repeatCount="indefinite"
              />
            )}
          </circle>
          <circle cx="20" cy="12" r="2" fill="#333">
            {animated && (
              <animate
                attributeName="opacity"
                values="1;0.5;1"
                dur="2s"
                repeatCount="indefinite"
                begin="0.5s"
              />
            )}
          </circle>
          
          {/* Thinking mouth */}
          <circle cx="15" cy="20" r="1.5" fill="#333">
            {animated && (
              <animate
                attributeName="r"
                values="1.5;2;1.5"
                dur="1.5s"
                repeatCount="indefinite"
              />
            )}
          </circle>
        </g>
      </g>
      
      {/* Floating particles */}
      {animated && (
        <>
          <circle cx="10" cy="20" r="1.5" fill="#FF6B8B">
            <animate
              attributeName="cy"
              values="20;15;20"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="90" cy="80" r="1" fill="#667eea">
            <animate
              attributeName="cy"
              values="80;75;80"
              dur="2.5s"
              repeatCount="indefinite"
              begin="0.3s"
            />
          </circle>
          <circle cx="85" cy="15" r="1.2" fill="#764ba2">
            <animate
              attributeName="cy"
              values="15;10;15"
              dur="2.8s"
              repeatCount="indefinite"
              begin="0.7s"
            />
          </circle>
          <circle cx="15" cy="85" r="1" fill="#FFD93D">
            <animate
              attributeName="cy"
              values="85;80;85"
              dur="3.2s"
              repeatCount="indefinite"
              begin="1s"
            />
          </circle>
        </>
      )}
      
      <style jsx="true">{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </svg>
  );
};

export default EmojiIcon;
