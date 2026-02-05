import React from 'react';

// Werewolf Howling Icon for Scary theme
export const WerewolfHowlingIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className} fill="currentColor">
        {/* Left ear */}
        <path d="M 25 25 L 20 10 L 30 20 Z" fill="currentColor"/>
        {/* Right ear */}
        <path d="M 75 25 L 80 10 L 70 20 Z" fill="currentColor"/>
        {/* Head */}
        <ellipse cx="50" cy="40" rx="25" ry="22" fill="currentColor" opacity="0.3"/>
        <circle cx="50" cy="40" r="22" fill="currentColor" opacity="0.5"/>
        {/* Eyes */}
        <circle cx="42" cy="36" r="4" fill="#ff8800"/>
        <circle cx="58" cy="36" r="4" fill="#ff8800"/>
        <circle cx="43" cy="35" r="2" fill="#fff"/>
        <circle cx="59" cy="35" r="2" fill="#fff"/>
        {/* Snout */}
        <ellipse cx="50" cy="48" rx="8" ry="10" fill="currentColor" opacity="0.6"/>
        <path d="M 50 45 L 50 52" stroke="currentColor" strokeWidth="2"/>
        <path d="M 45 54 Q 50 56 55 54" stroke="currentColor" strokeWidth="2" fill="none"/>
        {/* Fangs */}
        <path d="M 46 54 L 47 60 L 45 58" fill="#fff"/>
        <path d="M 54 54 L 53 60 L 55 58" fill="#fff"/>
        {/* Body */}
        <ellipse cx="50" cy="72" rx="20" ry="18" fill="currentColor" opacity="0.4"/>
        {/* Arms raised howling */}
        <path d="M 30 65 L 22 55 L 25 68" fill="currentColor" opacity="0.5"/>
        <path d="M 70 65 L 78 55 L 75 68" fill="currentColor" opacity="0.5"/>
        {/* Moon */}
        <circle cx="80" cy="20" r="8" fill="#ffa500" opacity="0.8"/>
    </svg>
);

// Daft Punk-inspired Helmet Icon for Tron mode with animated eyes
export const DaftPunkRobotHead = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className} fill="currentColor">
        {/* Helmet outline - sleek angular design */}
        <path d="M 30 20 L 20 40 L 20 75 Q 20 85 30 85 L 70 85 Q 80 85 80 75 L 80 40 L 70 20 Z"
              stroke="currentColor" strokeWidth="2.5" fill="none"/>

        {/* Top chrome strip */}
        <rect x="25" y="22" width="50" height="6" rx="1" fill="currentColor" opacity="0.4"/>

        {/* Visor - iconic horizontal band */}
        <rect x="22" y="38" width="56" height="20" rx="2" fill="currentColor"/>
        <rect x="24" y="40" width="52" height="16" rx="1" fill="black" opacity="0.3"/>

        {/* LED lights on visor - animated */}
        <circle cx="35" cy="48" r="2" fill="#00ffff" opacity="0.8" className="robot-eye-glow"/>
        <circle cx="50" cy="48" r="2" fill="#00ffff" opacity="0.8" className="robot-eye-glow" style={{animationDelay: '0.5s'}}/>
        <circle cx="65" cy="48" r="2" fill="#00ffff" opacity="0.8" className="robot-eye-glow" style={{animationDelay: '1s'}}/>

        {/* Ventilation grills */}
        <line x1="30" y1="65" x2="45" y2="65" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
        <line x1="55" y1="65" x2="70" y2="65" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
        <line x1="30" y1="70" x2="45" y2="70" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
        <line x1="55" y1="70" x2="70" y2="70" stroke="currentColor" strokeWidth="2" opacity="0.6"/>

        {/* Chin piece */}
        <path d="M 30 80 L 35 85 L 65 85 L 70 80" stroke="currentColor" strokeWidth="2" fill="none"/>

        {/* Side details */}
        <circle cx="22" cy="48" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <circle cx="78" cy="48" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>

        {/* Angular accents */}
        <line x1="25" y1="58" x2="20" y2="63" stroke="currentColor" strokeWidth="2"/>
        <line x1="75" y1="58" x2="80" y2="63" stroke="currentColor" strokeWidth="2"/>
    </svg>
);

// Daft Punk Helmet Icon (keeping for kids mode)
export const DaftPunkHelmet = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className} fill="currentColor">
        <path d="M50 10 C30 10 15 25 15 45 L15 70 C15 80 20 85 30 85 L70 85 C80 85 85 80 85 70 L85 45 C85 25 70 10 50 10 Z" stroke="currentColor" strokeWidth="2" fill="none"/>
        <rect x="25" y="35" width="20" height="15" rx="2" fill="currentColor"/>
        <rect x="55" y="35" width="20" height="15" rx="2" fill="currentColor"/>
        <path d="M35 60 Q50 70 65 60" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
);
