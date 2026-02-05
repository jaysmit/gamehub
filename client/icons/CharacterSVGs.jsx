import React from 'react';

export const CharacterSVG = ({ characterId, size = 120, color = '#06b6d4' }) => {
    const svgStyle = { width: size, height: size };
    
    // Tron Characters
    if (characterId === 'cyber-knight') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <rect x="35" y="20" width="30" height="35" fill={color} opacity="0.3" rx="3"/>
                <rect x="30" y="15" width="40" height="10" fill={color} rx="2"/>
                <circle cx="42" cy="22" r="3" fill={color}/>
                <circle cx="58" cy="22" r="3" fill={color}/>
                <rect x="38" y="30" width="24" height="2" fill={color}/>
                <rect x="40" y="55" width="7" height="25" fill={color} opacity="0.5"/>
                <rect x="53" y="55" width="7" height="25" fill={color} opacity="0.5"/>
                <rect x="25" y="35" width="10" height="20" fill={color} opacity="0.4"/>
                <rect x="65" y="35" width="10" height="20" fill={color} opacity="0.4"/>
                <path d="M 45 32 L 55 32 L 52 38 L 48 38 Z" fill={color}/>
            </svg>
        );
    }
    if (characterId === 'neon-ninja') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 50 15 L 40 25 L 40 45 L 60 45 L 60 25 Z" fill={color} opacity="0.3"/>
                <path d="M 35 20 L 50 10 L 65 20 L 60 25 L 40 25 Z" fill={color}/>
                <rect x="43" y="28" width="4" height="8" fill={color}/>
                <rect x="53" y="28" width="4" height="8" fill={color}/>
                <rect x="38" y="45" width="24" height="30" fill={color} opacity="0.4" rx="2"/>
                <rect x="38" y="75" width="9" height="15" fill={color} opacity="0.5"/>
                <rect x="53" y="75" width="9" height="15" fill={color} opacity="0.5"/>
                <path d="M 30 50 L 35 45 L 35 65 L 30 60 Z" fill={color} opacity="0.6"/>
                <path d="M 70 50 L 65 45 L 65 65 L 70 60 Z" fill={color} opacity="0.6"/>
            </svg>
        );
    }
    if (characterId === 'data-runner') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <circle cx="50" cy="25" r="12" fill={color} opacity="0.3"/>
                <circle cx="46" cy="23" r="2" fill={color}/>
                <circle cx="54" cy="23" r="2" fill={color}/>
                <path d="M 45 28 Q 50 31 55 28" stroke={color} strokeWidth="2" fill="none"/>
                <rect x="40" y="37" width="20" height="25" fill={color} opacity="0.4" rx="3"/>
                <rect x="42" y="62" width="6" height="20" fill={color} opacity="0.5"/>
                <rect x="52" y="62" width="6" height="20" fill={color} opacity="0.5"/>
                <path d="M 32 45 L 40 40 L 40 55 L 32 50 Z" fill={color} opacity="0.5"/>
                <path d="M 68 45 L 60 40 L 60 55 L 68 50 Z" fill={color} opacity="0.5"/>
                <rect x="44" y="82" width="12" height="3" fill={color} rx="1"/>
            </svg>
        );
    }
    if (characterId === 'circuit-breaker') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <rect x="35" y="18" width="30" height="30" fill={color} opacity="0.2" rx="4"/>
                <rect x="40" y="15" width="20" height="8" fill={color} rx="2"/>
                <circle cx="44" cy="28" r="3" fill={color}/>
                <circle cx="56" cy="28" r="3" fill={color}/>
                <rect x="46" y="34" width="8" height="3" fill={color}/>
                <rect x="38" y="48" width="24" height="22" fill={color} opacity="0.4" rx="2"/>
                <rect x="40" y="70" width="8" height="18" fill={color} opacity="0.5"/>
                <rect x="52" y="70" width="8" height="18" fill={color} opacity="0.5"/>
                <rect x="28" y="50" width="10" height="15" fill={color} opacity="0.5"/>
                <rect x="62" y="50" width="10" height="15" fill={color} opacity="0.5"/>
                <line x1="35" y1="25" x2="30" y2="25" stroke={color} strokeWidth="2"/>
                <line x1="65" y1="25" x2="70" y2="25" stroke={color} strokeWidth="2"/>
            </svg>
        );
    }
    if (characterId === 'byte-fighter') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <rect x="38" y="18" width="24" height="25" fill={color} opacity="0.3" rx="3"/>
                <rect x="35" y="15" width="30" height="8" fill={color} rx="2"/>
                <rect x="42" y="22" width="5" height="10" fill={color}/>
                <rect x="53" y="22" width="5" height="10" fill={color}/>
                <rect x="40" y="43" width="20" height="25" fill={color} opacity="0.4" rx="2"/>
                <rect x="41" y="68" width="7" height="20" fill={color} opacity="0.5"/>
                <rect x="52" y="68" width="7" height="20" fill={color} opacity="0.5"/>
                <path d="M 25 48 L 35 43 L 35 60 L 28 58 Z" fill={color} opacity="0.6"/>
                <path d="M 75 48 L 65 43 L 65 60 L 72 58 Z" fill={color} opacity="0.6"/>
                <rect x="20" y="45" width="8" height="3" fill={color}/>
                <rect x="72" y="45" width="8" height="3" fill={color}/>
            </svg>
        );
    }
    if (characterId === 'pixel-warrior') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <rect x="40" y="20" width="20" height="20" fill={color} opacity="0.3"/>
                <rect x="38" y="17" width="24" height="6" fill={color}/>
                <rect x="43" y="25" width="4" height="4" fill={color}/>
                <rect x="53" y="25" width="4" height="4" fill={color}/>
                <rect x="45" y="32" width="10" height="2" fill={color}/>
                <rect x="38" y="40" width="24" height="28" fill={color} opacity="0.4"/>
                <rect x="40" y="68" width="8" height="20" fill={color} opacity="0.5"/>
                <rect x="52" y="68" width="8" height="20" fill={color} opacity="0.5"/>
                <rect x="30" y="45" width="8" height="18" fill={color} opacity="0.5"/>
                <rect x="62" y="45" width="8" height="18" fill={color} opacity="0.5"/>
            </svg>
        );
    }
    if (characterId === 'tech-ghost') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 35 30 Q 35 15 50 15 Q 65 15 65 30 L 65 75 L 60 70 L 55 75 L 50 70 L 45 75 L 40 70 L 35 75 Z" fill={color} opacity="0.3"/>
                <circle cx="43" cy="32" r="4" fill={color}/>
                <circle cx="57" cy="32" r="4" fill={color}/>
                <path d="M 42 42 Q 50 46 58 42" stroke={color} strokeWidth="2" fill="none" opacity="0.6"/>
                <rect x="36" y="50" width="28" height="3" fill={color} opacity="0.4"/>
                <rect x="38" y="58" width="24" height="2" fill={color} opacity="0.3"/>
                <circle cx="50" cy="28" r="2" fill={color} opacity="0.5"/>
            </svg>
        );
    }
    if (characterId === 'cyber-samurai') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 35 18 L 50 12 L 65 18 L 63 25 L 37 25 Z" fill={color}/>
                <rect x="38" y="25" width="24" height="20" fill={color} opacity="0.3" rx="2"/>
                <rect x="42" y="30" width="4" height="6" fill={color}/>
                <rect x="54" y="30" width="4" height="6" fill={color}/>
                <path d="M 44 38 L 56 38" stroke={color} strokeWidth="2"/>
                <rect x="40" y="45" width="20" height="25" fill={color} opacity="0.4" rx="2"/>
                <rect x="42" y="70" width="6" height="18" fill={color} opacity="0.5"/>
                <rect x="52" y="70" width="6" height="18" fill={color} opacity="0.5"/>
                <path d="M 32 50 L 38 48 L 38 62 L 32 60 Z" fill={color} opacity="0.6"/>
                <path d="M 68 50 L 62 48 L 62 62 L 68 60 Z" fill={color} opacity="0.6"/>
                <rect x="25" y="48" width="10" height="2" fill={color}/>
            </svg>
        );
    }
    if (characterId === 'grid-master') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <rect x="36" y="16" width="28" height="28" fill="none" stroke={color} strokeWidth="2"/>
                <line x1="36" y1="23" x2="64" y2="23" stroke={color} strokeWidth="1"/>
                <line x1="36" y1="30" x2="64" y2="30" stroke={color} strokeWidth="1"/>
                <line x1="36" y1="37" x2="64" y2="37" stroke={color} strokeWidth="1"/>
                <line x1="43" y1="16" x2="43" y2="44" stroke={color} strokeWidth="1"/>
                <line x1="50" y1="16" x2="50" y2="44" stroke={color} strokeWidth="1"/>
                <line x1="57" y1="16" x2="57" y2="44" stroke={color} strokeWidth="1"/>
                <rect x="40" y="44" width="20" height="24" fill={color} opacity="0.3" rx="2"/>
                <rect x="42" y="68" width="7" height="20" fill={color} opacity="0.5"/>
                <rect x="51" y="68" width="7" height="20" fill={color} opacity="0.5"/>
                <rect x="32" y="50" width="8" height="15" fill={color} opacity="0.4"/>
                <rect x="60" y="50" width="8" height="15" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    if (characterId === 'binary-ace') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <circle cx="50" cy="28" r="14" fill={color} opacity="0.3"/>
                <text x="42" y="27" fill={color} fontSize="10" fontWeight="bold">01</text>
                <text x="42" y="35" fill={color} fontSize="10" fontWeight="bold">10</text>
                <rect x="38" y="42" width="24" height="26" fill={color} opacity="0.4" rx="2"/>
                <rect x="40" y="68" width="8" height="20" fill={color} opacity="0.5"/>
                <rect x="52" y="68" width="8" height="20" fill={color} opacity="0.5"/>
                <rect x="30" y="48" width="8" height="16" fill={color} opacity="0.5"/>
                <rect x="62" y="48" width="8" height="16" fill={color} opacity="0.5"/>
                <circle cx="44" cy="55" r="2" fill={color}/>
                <circle cx="56" cy="55" r="2" fill={color}/>
            </svg>
        );
    }
    
    // Kids Characters
    if (characterId === 'happy-unicorn') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <circle cx="50" cy="40" r="18" fill={color} opacity="0.3"/>
                <path d="M 48 22 L 50 10 L 52 22" fill={color}/>
                <circle cx="43" cy="38" r="3" fill="#000"/>
                <circle cx="57" cy="38" r="3" fill="#000"/>
                <path d="M 44 45 Q 50 49 56 45" stroke={color} strokeWidth="2" fill="none"/>
                <ellipse cx="50" cy="65" rx="16" ry="22" fill={color} opacity="0.4"/>
                <ellipse cx="40" cy="80" rx="6" ry="10" fill={color} opacity="0.5"/>
                <ellipse cx="60" cy="80" rx="6" ry="10" fill={color} opacity="0.5"/>
                <path d="M 35 50 Q 30 55 33 60" stroke={color} strokeWidth="3" fill="none"/>
                <path d="M 65 50 Q 70 55 67 60" stroke={color} strokeWidth="3" fill="none"/>
                <ellipse cx="46" cy="27" rx="3" ry="5" fill={color} opacity="0.6"/>
                <ellipse cx="54" cy="27" rx="3" ry="5" fill={color} opacity="0.6"/>
            </svg>
        );
    }
    if (characterId === 'cool-fox') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 35 25 L 30 10 L 38 20 Z" fill={color}/>
                <path d="M 65 25 L 70 10 L 62 20 Z" fill={color}/>
                <circle cx="50" cy="38" r="16" fill={color} opacity="0.4"/>
                <circle cx="43" cy="36" r="3" fill="#000"/>
                <circle cx="57" cy="36" r="3" fill="#000"/>
                <path d="M 50 42 L 50 47 L 46 47" stroke="#000" strokeWidth="2"/>
                <path d="M 45 48 Q 50 51 55 48" stroke="#000" strokeWidth="2" fill="none"/>
                <ellipse cx="50" cy="65" rx="14" ry="20" fill={color} opacity="0.4"/>
                <ellipse cx="42" cy="80" rx="5" ry="8" fill={color} opacity="0.5"/>
                <ellipse cx="58" cy="80" rx="5" ry="8" fill={color} opacity="0.5"/>
                <path d="M 40 55 L 35 50 L 38 58" fill={color} opacity="0.5"/>
                <path d="M 60 55 L 65 50 L 62 58" fill={color} opacity="0.5"/>
            </svg>
        );
    }
    if (characterId === 'brave-lion') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <circle cx="50" cy="38" r="20" fill={color} opacity="0.2"/>
                <path d="M 35 25 Q 30 20 32 28 M 40 20 Q 38 15 40 23 M 45 18 Q 45 12 46 20 M 55 18 Q 55 12 54 20 M 60 20 Q 62 15 60 23 M 65 25 Q 70 20 68 28" stroke={color} strokeWidth="2" fill="none"/>
                <circle cx="50" cy="38" r="14" fill={color} opacity="0.4"/>
                <circle cx="44" cy="36" r="3" fill="#000"/>
                <circle cx="56" cy="36" r="3" fill="#000"/>
                <path d="M 50 40 L 50 44 L 47 44" stroke="#000" strokeWidth="2"/>
                <path d="M 46 46 Q 50 49 54 46" stroke="#000" strokeWidth="2" fill="none"/>
                <ellipse cx="50" cy="65" rx="15" ry="22" fill={color} opacity="0.4"/>
                <ellipse cx="41" cy="82" rx="6" ry="9" fill={color} opacity="0.5"/>
                <ellipse cx="59" cy="82" rx="6" ry="9" fill={color} opacity="0.5"/>
            </svg>
        );
    }
    if (characterId === 'smart-panda') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <circle cx="38" cy="30" r="8" fill="#000"/>
                <circle cx="62" cy="30" r="8" fill="#000"/>
                <circle cx="50" cy="40" r="16" fill="#fff"/>
                <ellipse cx="44" cy="38" rx="5" ry="7" fill="#000"/>
                <ellipse cx="56" cy="38" rx="5" ry="7" fill="#000"/>
                <circle cx="44" cy="38" r="2" fill="#fff"/>
                <circle cx="56" cy="38" r="2" fill="#fff"/>
                <path d="M 50 44 L 50 48 L 48 48" stroke="#000" strokeWidth="2"/>
                <path d="M 47 49 Q 50 51 53 49" stroke="#000" strokeWidth="2" fill="none"/>
                <ellipse cx="50" cy="68" rx="14" ry="20" fill="#fff"/>
                <ellipse cx="43" cy="83" rx="5" ry="8" fill="#000"/>
                <ellipse cx="57" cy="83" rx="5" ry="8" fill="#000"/>
                <ellipse cx="35" cy="60" rx="5" ry="8" fill="#000"/>
                <ellipse cx="65" cy="60" rx="5" ry="8" fill="#000"/>
            </svg>
        );
    }
    if (characterId === 'silly-frog') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <ellipse cx="50" cy="40" rx="18" ry="16" fill={color} opacity="0.4"/>
                <circle cx="40" cy="35" r="8" fill="#fff"/>
                <circle cx="60" cy="35" r="8" fill="#fff"/>
                <circle cx="40" cy="35" r="4" fill="#000"/>
                <circle cx="60" cy="35" r="4" fill="#000"/>
                <path d="M 42 48 Q 50 52 58 48" stroke={color} strokeWidth="2.5" fill="none"/>
                <ellipse cx="50" cy="68" rx="16" ry="20" fill={color} opacity="0.4"/>
                <ellipse cx="40" cy="85" rx="8" ry="6" fill={color} opacity="0.5"/>
                <ellipse cx="60" cy="85" rx="8" ry="6" fill={color} opacity="0.5"/>
                <circle cx="30" cy="85" r="5" fill={color} opacity="0.6"/>
                <circle cx="70" cy="85" r="5" fill={color} opacity="0.6"/>
                <circle cx="25" cy="87" r="3" fill={color} opacity="0.6"/>
                <circle cx="75" cy="87" r="3" fill={color} opacity="0.6"/>
            </svg>
        );
    }
    if (characterId === 'speedy-rabbit') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <ellipse cx="38" cy="18" rx="6" ry="16" fill={color} opacity="0.4"/>
                <ellipse cx="62" cy="18" rx="6" ry="16" fill={color} opacity="0.4"/>
                <circle cx="50" cy="42" r="16" fill={color} opacity="0.4"/>
                <circle cx="44" cy="40" r="3" fill="#000"/>
                <circle cx="56" cy="40" r="3" fill="#000"/>
                <path d="M 50 46 L 50 50 L 48 50" stroke="#000" strokeWidth="2"/>
                <path d="M 46 51 Q 50 54 54 51" stroke="#000" strokeWidth="2" fill="none"/>
                <ellipse cx="50" cy="70" rx="14" ry="18" fill={color} opacity="0.4"/>
                <circle cx="50" cy="88" r="5" fill={color} opacity="0.5"/>
                <ellipse cx="42" cy="85" rx="5" ry="7" fill={color} opacity="0.5"/>
                <ellipse cx="58" cy="85" rx="5" ry="7" fill={color} opacity="0.5"/>
            </svg>
        );
    }
    if (characterId === 'friendly-bear') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <circle cx="35" cy="28" r="9" fill={color} opacity="0.4"/>
                <circle cx="65" cy="28" r="9" fill={color} opacity="0.4"/>
                <circle cx="50" cy="40" r="18" fill={color} opacity="0.4"/>
                <circle cx="43" cy="38" r="3" fill="#000"/>
                <circle cx="57" cy="38" r="3" fill="#000"/>
                <ellipse cx="50" cy="46" rx="6" ry="5" fill={color} opacity="0.6"/>
                <path d="M 50 48 L 50 51" stroke="#000" strokeWidth="2"/>
                <path d="M 46 52 Q 50 55 54 52" stroke="#000" strokeWidth="2" fill="none"/>
                <ellipse cx="50" cy="70" rx="16" ry="22" fill={color} opacity="0.4"/>
                <ellipse cx="41" cy="86" rx="6" ry="8" fill={color} opacity="0.5"/>
                <ellipse cx="59" cy="86" rx="6" ry="8" fill={color} opacity="0.5"/>
            </svg>
        );
    }
    if (characterId === 'magical-cat') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 35 22 L 30 10 L 38 25 Z" fill={color} opacity="0.5"/>
                <path d="M 65 22 L 70 10 L 62 25 Z" fill={color} opacity="0.5"/>
                <circle cx="50" cy="38" r="15" fill={color} opacity="0.4"/>
                <circle cx="44" cy="36" r="3" fill="#000"/>
                <circle cx="56" cy="36" r="3" fill="#000"/>
                <path d="M 50 40 L 50 44 L 48 44" stroke="#000" strokeWidth="2"/>
                <path d="M 46 45 Q 50 48 54 45" stroke="#000" strokeWidth="2" fill="none"/>
                <line x1="38" y1="44" x2="28" y2="42" stroke={color} strokeWidth="1.5"/>
                <line x1="38" y1="47" x2="28" y2="47" stroke={color} strokeWidth="1.5"/>
                <line x1="62" y1="44" x2="72" y2="42" stroke={color} strokeWidth="1.5"/>
                <line x1="62" y1="47" x2="72" y2="47" stroke={color} strokeWidth="1.5"/>
                <ellipse cx="50" cy="65" rx="13" ry="20" fill={color} opacity="0.4"/>
                <ellipse cx="43" cy="82" rx="5" ry="8" fill={color} opacity="0.5"/>
                <ellipse cx="57" cy="82" rx="5" ry="8" fill={color} opacity="0.5"/>
                <path d="M 55 75 Q 60 70 65 75" stroke={color} strokeWidth="2.5" fill="none"/>
            </svg>
        );
    }
    if (characterId === 'happy-penguin') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <ellipse cx="50" cy="50" rx="20" ry="30" fill="#000"/>
                <ellipse cx="50" cy="55" rx="14" ry="22" fill="#fff"/>
                <circle cx="50" cy="35" r="12" fill="#000"/>
                <circle cx="45" cy="33" r="3" fill="#fff"/>
                <circle cx="55" cy="33" r="3" fill="#fff"/>
                <circle cx="45" cy="33" r="1.5" fill="#000"/>
                <circle cx="55" cy="33" r="1.5" fill="#000"/>
                <path d="M 48 38 L 52 38 L 50 41 Z" fill={color}/>
                <path d="M 47 43 Q 50 45 53 43" stroke="#000" strokeWidth="1.5" fill="none"/>
                <ellipse cx="32" cy="55" rx="5" ry="12" fill="#000"/>
                <ellipse cx="68" cy="55" rx="5" ry="12" fill="#000"/>
                <ellipse cx="42" cy="82" rx="6" ry="4" fill={color}/>
                <ellipse cx="58" cy="82" rx="6" ry="4" fill={color}/>
            </svg>
        );
    }
    if (characterId === 'rainbow-koala') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <circle cx="35" cy="30" r="10" fill={color} opacity="0.3"/>
                <circle cx="65" cy="30" r="10" fill={color} opacity="0.3"/>
                <ellipse cx="50" cy="42" rx="18" ry="16" fill={color} opacity="0.4"/>
                <circle cx="44" cy="40" r="4" fill="#000"/>
                <circle cx="56" cy="40" r="4" fill="#000"/>
                <ellipse cx="50" cy="47" rx="5" ry="4" fill={color} opacity="0.6"/>
                <path d="M 46 52 Q 50 54 54 52" stroke="#000" strokeWidth="2" fill="none"/>
                <ellipse cx="50" cy="70" rx="15" ry="22" fill={color} opacity="0.4"/>
                <ellipse cx="42" cy="86" rx="6" ry="8" fill={color} opacity="0.5"/>
                <ellipse cx="58" cy="86" rx="6" ry="8" fill={color} opacity="0.5"/>
                <path d="M 33 60 Q 28 65 30 70" stroke={color} strokeWidth="3" fill="none"/>
                <path d="M 67 60 Q 72 65 70 70" stroke={color} strokeWidth="3" fill="none"/>
            </svg>
        );
    }
    
    // Scary Characters
    if (characterId === 'vampire-lord') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 40 22 L 35 10 L 42 20 Z" fill={color}/>
                <path d="M 60 22 L 65 10 L 58 20 Z" fill={color}/>
                <ellipse cx="50" cy="35" rx="16" ry="18" fill={color} opacity="0.2"/>
                <circle cx="43" cy="32" r="4" fill="#ff0000"/>
                <circle cx="57" cy="32" r="4" fill="#ff0000"/>
                <path d="M 46 42 L 48 48 L 46 46" fill="#fff"/>
                <path d="M 54 42 L 52 48 L 54 46" fill="#fff"/>
                <path d="M 45 45 Q 50 48 55 45" stroke="#ff0000" strokeWidth="2" fill="none"/>
                <ellipse cx="50" cy="65" rx="14" ry="24" fill={color} opacity="0.3"/>
                <path d="M 36 55 L 30 60 L 35 68 L 40 65 Z" fill={color} opacity="0.5"/>
                <path d="M 64 55 L 70 60 L 65 68 L 60 65 Z" fill={color} opacity="0.5"/>
                <ellipse cx="43" cy="85" rx="5" ry="7" fill={color} opacity="0.4"/>
                <ellipse cx="57" cy="85" rx="5" ry="7" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    if (characterId === 'howling-wolf') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 38 24 L 33 12 L 40 22 Z" fill={color} opacity="0.5"/>
                <path d="M 62 24 L 67 12 L 60 22 Z" fill={color} opacity="0.5"/>
                <ellipse cx="50" cy="38" rx="16" ry="15" fill={color} opacity="0.3"/>
                <circle cx="43" cy="35" r="3" fill="#ffaa00"/>
                <circle cx="57" cy="35" r="3" fill="#ffaa00"/>
                <path d="M 50 40 L 50 48" stroke={color} strokeWidth="2"/>
                <path d="M 45 50 L 50 48 L 55 50" stroke={color} strokeWidth="2" fill="none"/>
                <path d="M 44 50 Q 48 53 52 50" stroke="#fff" strokeWidth="1.5" fill="none"/>
                <ellipse cx="50" cy="68" rx="14" ry="22" fill={color} opacity="0.3"/>
                <ellipse cx="42" cy="84" rx="6" ry="10" fill={color} opacity="0.4"/>
                <ellipse cx="58" cy="84" rx="6" ry="10" fill={color} opacity="0.4"/>
                <path d="M 36 58 L 32 60 L 35 66" fill={color} opacity="0.4"/>
                <path d="M 64 58 L 68 60 L 65 66" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    if (characterId === 'ghost-haunter') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 35 30 Q 35 15 50 15 Q 65 15 65 30 L 65 78 L 60 72 L 55 78 L 50 72 L 45 78 L 40 72 L 35 78 Z" fill={color} opacity="0.3"/>
                <circle cx="42" cy="32" r="5" fill="#000"/>
                <circle cx="58" cy="32" r="5" fill="#000"/>
                <circle cx="42" cy="32" r="2" fill="#fff"/>
                <circle cx="58" cy="32" r="2" fill="#fff"/>
                <ellipse cx="50" cy="42" rx="6" ry="8" fill="#000" opacity="0.5"/>
                <path d="M 44 52 Q 50 48 56 52" stroke={color} strokeWidth="2" fill="none" opacity="0.6"/>
                <circle cx="38" cy="55" r="3" fill={color} opacity="0.4"/>
                <circle cx="62" cy="55" r="3" fill={color} opacity="0.4"/>
                <circle cx="45" cy="62" r="2" fill={color} opacity="0.3"/>
                <circle cx="55" cy="62" r="2" fill={color} opacity="0.3"/>
            </svg>
        );
    }
    if (characterId === 'zombie-king') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 38 18 L 35 12 L 40 16 L 42 10 L 44 16 L 48 12 L 50 18 L 52 12 L 56 16 L 58 10 L 60 16 L 65 12 L 62 18 Z" fill="#ffd700"/>
                <ellipse cx="50" cy="38" rx="18" ry="17" fill={color} opacity="0.2"/>
                <rect x="41" y="33" width="5" height="7" fill="#000" opacity="0.7"/>
                <rect x="54" y="33" width="5" height="7" fill="#000" opacity="0.7"/>
                <path d="M 43 46 L 57 46" stroke="#000" strokeWidth="2.5"/>
                <rect x="46" y="42" width="8" height="2" fill="#000"/>
                <ellipse cx="50" cy="68" rx="15" ry="24" fill={color} opacity="0.3"/>
                <ellipse cx="42" cy="86" rx="6" ry="8" fill={color} opacity="0.4"/>
                <ellipse cx="58" cy="86" rx="6" ry="8" fill={color} opacity="0.4"/>
                <path d="M 34 58 L 30 62 L 34 68" fill={color} opacity="0.4"/>
                <path d="M 66 58 L 70 62 L 66 68" fill={color} opacity="0.4"/>
                <rect x="36" y="50" width="3" height="8" fill={color} opacity="0.3" transform="rotate(15 37.5 54)"/>
                <rect x="61" y="50" width="3" height="8" fill={color} opacity="0.3" transform="rotate(-15 62.5 54)"/>
            </svg>
        );
    }
    if (characterId === 'witch-mage') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 35 25 L 50 8 L 65 25 L 62 28 L 38 28 Z" fill={color} opacity="0.6"/>
                <circle cx="50" cy="28" r="3" fill="#ffd700"/>
                <ellipse cx="50" cy="40" rx="16" ry="15" fill={color} opacity="0.3"/>
                <circle cx="44" cy="38" r="3" fill={color}/>
                <circle cx="56" cy="38" r="3" fill={color}/>
                <path d="M 46 46 Q 50 48 54 46" stroke={color} strokeWidth="2" fill="none"/>
                <ellipse cx="50" cy="68" rx="14" ry="24" fill={color} opacity="0.3"/>
                <path d="M 36 56 L 28 60 L 32 68 L 38 65 Z" fill={color} opacity="0.5"/>
                <path d="M 64 56 L 72 60 L 68 68 L 62 65 Z" fill={color} opacity="0.5"/>
                <ellipse cx="43" cy="86" rx="5" ry="7" fill={color} opacity="0.4"/>
                <ellipse cx="57" cy="86" rx="5" ry="7" fill={color} opacity="0.4"/>
                <line x1="30" y1="50" x2="25" y2="55" stroke={color} strokeWidth="2"/>
                <circle cx="24" cy="56" r="2" fill="#ffd700"/>
            </svg>
        );
    }
    if (characterId === 'skeleton-warrior') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <circle cx="50" cy="30" r="15" fill="none" stroke={color} strokeWidth="2"/>
                <circle cx="43" cy="28" r="4" fill={color}/>
                <circle cx="57" cy="28" r="4" fill={color}/>
                <path d="M 44 36 L 48 38 L 52 38 L 56 36" stroke={color} strokeWidth="2" fill="none"/>
                <rect x="40" y="45" width="20" height="20" fill="none" stroke={color} strokeWidth="2" rx="2"/>
                <line x1="45" y1="50" x2="45" y2="60" stroke={color} strokeWidth="2"/>
                <line x1="50" y1="50" x2="50" y2="60" stroke={color} strokeWidth="2"/>
                <line x1="55" y1="50" x2="55" y2="60" stroke={color} strokeWidth="2"/>
                <rect x="42" y="65" width="6" height="22" fill="none" stroke={color} strokeWidth="2"/>
                <rect x="52" y="65" width="6" height="22" fill="none" stroke={color} strokeWidth="2"/>
                <line x1="32" y1="48" x2="40" y2="52" stroke={color} strokeWidth="2"/>
                <line x1="68" y1="48" x2="60" y2="52" stroke={color} strokeWidth="2"/>
                <line x1="40" y1="52" x2="32" y2="58" stroke={color} strokeWidth="2"/>
                <line x1="60" y1="52" x2="68" y2="58" stroke={color} strokeWidth="2"/>
            </svg>
        );
    }
    if (characterId === 'demon-hunter') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 38 20 L 32 8 L 38 18 L 42 14 L 44 20" fill={color}/>
                <path d="M 62 20 L 68 8 L 62 18 L 58 14 L 56 20" fill={color}/>
                <ellipse cx="50" cy="36" rx="17" ry="16" fill={color} opacity="0.2"/>
                <path d="M 41 32 L 45 35 L 41 38" fill="#ff0000"/>
                <path d="M 59 32 L 55 35 L 59 38" fill="#ff0000"/>
                <path d="M 44 44 Q 50 48 56 44" stroke="#ff0000" strokeWidth="2.5" fill="none"/>
                <path d="M 47 45 L 49 50 L 47 48" fill="#fff"/>
                <path d="M 53 45 L 51 50 L 53 48" fill="#fff"/>
                <ellipse cx="50" cy="66" rx="14" ry="24" fill={color} opacity="0.3"/>
                <path d="M 36 54 L 28 58 L 32 66 L 38 63 Z" fill={color} opacity="0.5"/>
                <path d="M 64 54 L 72 58 L 68 66 L 62 63 Z" fill={color} opacity="0.5"/>
                <ellipse cx="42" cy="85" rx="5" ry="8" fill={color} opacity="0.4"/>
                <ellipse cx="58" cy="85" rx="5" ry="8" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    if (characterId === 'dark-wizard') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 36 26 L 50 10 L 64 26 L 60 30 L 40 30 Z" fill={color} opacity="0.7"/>
                <circle cx="48" cy="18" r="2" fill="#9333ea"/>
                <circle cx="52" cy="18" r="2" fill="#9333ea"/>
                <circle cx="50" cy="22" r="2" fill="#9333ea"/>
                <ellipse cx="50" cy="42" rx="16" ry="16" fill={color} opacity="0.3"/>
                <path d="M 42 40 L 48 42 L 42 44" fill={color}/>
                <path d="M 58 40 L 52 42 L 58 44" fill={color}/>
                <path d="M 46 48 Q 50 50 54 48" stroke={color} strokeWidth="2" fill="none"/>
                <ellipse cx="50" cy="70" rx="15" ry="26" fill={color} opacity="0.3"/>
                <path d="M 35 58 L 26 64 L 30 74 L 38 70 Z" fill={color} opacity="0.5"/>
                <path d="M 65 58 L 74 64 L 70 74 L 62 70 Z" fill={color} opacity="0.5"/>
                <ellipse cx="43" cy="88" rx="5" ry="6" fill={color} opacity="0.4"/>
                <ellipse cx="57" cy="88" rx="5" ry="6" fill={color} opacity="0.4"/>
                <path d="M 24 58 L 20 52 L 22 58" stroke="#9333ea" strokeWidth="2"/>
                <circle cx="20" cy="50" r="3" fill="#9333ea" opacity="0.6"/>
            </svg>
        );
    }
    if (characterId === 'shadow-reaper') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 40 22 L 35 10 L 42 20 Z" fill="#000" opacity="0.8"/>
                <path d="M 60 22 L 65 10 L 58 20 Z" fill="#000" opacity="0.8"/>
                <ellipse cx="50" cy="36" rx="18" ry="17" fill="#000" opacity="0.7"/>
                <circle cx="43" cy="33" r="5" fill={color}/>
                <circle cx="57" cy="33" r="5" fill={color}/>
                <circle cx="43" cy="33" r="2" fill="#000"/>
                <circle cx="57" cy="33" r="2" fill="#000"/>
                <path d="M 46 44 Q 50 46 54 44" stroke={color} strokeWidth="2" fill="none"/>
                <ellipse cx="50" cy="68" rx="16" ry="26" fill="#000" opacity="0.6"/>
                <path d="M 34 56 Q 26 62 28 72 L 36 68 Z" fill="#000" opacity="0.7"/>
                <path d="M 66 56 Q 74 62 72 72 L 64 68 Z" fill="#000" opacity="0.7"/>
                <path d="M 32 72 Q 28 78 30 86" stroke={color} strokeWidth="2" fill="none"/>
                <path d="M 68 72 Q 72 78 70 86" stroke={color} strokeWidth="2" fill="none"/>
                <ellipse cx="43" cy="88" rx="6" ry="5" fill="#000" opacity="0.6"/>
                <ellipse cx="57" cy="88" rx="6" ry="5" fill="#000" opacity="0.6"/>
            </svg>
        );
    }
    if (characterId === 'cursed-mummy') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <ellipse cx="50" cy="34" rx="16" ry="18" fill={color} opacity="0.3"/>
                <rect x="38" y="28" width="24" height="4" fill={color} opacity="0.5"/>
                <rect x="40" y="34" width="20" height="3" fill={color} opacity="0.5"/>
                <rect x="38" y="38" width="24" height="4" fill={color} opacity="0.5"/>
                <circle cx="43" cy="32" r="3" fill="#000"/>
                <circle cx="57" cy="32" r="3" fill="#000"/>
                <path d="M 46 42 L 54 42" stroke={color} strokeWidth="2"/>
                <ellipse cx="50" cy="66" rx="15" ry="24" fill={color} opacity="0.3"/>
                <rect x="36" y="54" width="28" height="3" fill={color} opacity="0.5"/>
                <rect x="38" y="60" width="24" height="3" fill={color} opacity="0.5"/>
                <rect x="36" y="66" width="28" height="3" fill={color} opacity="0.5"/>
                <rect x="38" y="72" width="24" height="3" fill={color} opacity="0.5"/>
                <ellipse cx="42" cy="85" rx="6" ry="8" fill={color} opacity="0.4"/>
                <ellipse cx="58" cy="85" rx="6" ry="8" fill={color} opacity="0.4"/>
                <path d="M 34 58 L 30 62 L 34 68" fill={color} opacity="0.4"/>
                <path d="M 66 58 L 70 62 L 66 68" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    
    // --- New Tron Characters ---
    if (characterId === 'volt-striker') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <polygon points="50,10 42,30 48,30 40,55 52,35 46,35 54,10" fill={color}/>
                <rect x="35" y="55" width="30" height="25" fill={color} opacity="0.3" rx="3"/>
                <circle cx="43" cy="64" r="3" fill={color}/><circle cx="57" cy="64" r="3" fill={color}/>
                <rect x="40" y="80" width="8" height="15" fill={color} opacity="0.5"/>
                <rect x="52" y="80" width="8" height="15" fill={color} opacity="0.5"/>
            </svg>
        );
    }
    if (characterId === 'quantum-thief') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <circle cx="50" cy="35" r="18" fill={color} opacity="0.2"/>
                <ellipse cx="50" cy="35" rx="18" ry="12" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="4 3"/>
                <ellipse cx="50" cy="35" rx="12" ry="18" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="4 3"/>
                <circle cx="44" cy="32" r="3" fill={color}/><circle cx="56" cy="32" r="3" fill={color}/>
                <path d="M 44 40 Q 50 46 56 40" stroke={color} strokeWidth="2" fill="none"/>
                <rect x="38" y="55" width="24" height="28" fill={color} opacity="0.3" rx="4"/>
                <rect x="42" y="83" width="6" height="12" fill={color} opacity="0.4"/>
                <rect x="52" y="83" width="6" height="12" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    if (characterId === 'plasma-drone') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <ellipse cx="50" cy="45" rx="25" ry="15" fill={color} opacity="0.3"/>
                <ellipse cx="50" cy="45" rx="25" ry="15" fill="none" stroke={color} strokeWidth="2"/>
                <circle cx="42" cy="42" r="4" fill={color}/><circle cx="58" cy="42" r="4" fill={color}/>
                <rect x="46" y="48" width="8" height="2" fill={color}/>
                <line x1="25" y1="45" x2="15" y2="35" stroke={color} strokeWidth="2"/>
                <line x1="75" y1="45" x2="85" y2="35" stroke={color} strokeWidth="2"/>
                <circle cx="15" cy="35" r="5" fill={color} opacity="0.5"/>
                <circle cx="85" cy="35" r="5" fill={color} opacity="0.5"/>
                <ellipse cx="50" cy="70" rx="8" ry="12" fill={color} opacity="0.2"/>
            </svg>
        );
    }
    if (characterId === 'hex-coder') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <rect x="32" y="18" width="36" height="28" fill={color} opacity="0.2" rx="4"/>
                <rect x="32" y="18" width="36" height="28" fill="none" stroke={color} strokeWidth="2" rx="4"/>
                <text x="50" y="37" textAnchor="middle" fill={color} fontSize="10" fontFamily="monospace">0x</text>
                <circle cx="43" cy="28" r="3" fill={color}/><circle cx="57" cy="28" r="3" fill={color}/>
                <rect x="36" y="50" width="28" height="30" fill={color} opacity="0.3" rx="3"/>
                <rect x="40" y="80" width="8" height="14" fill={color} opacity="0.4"/>
                <rect x="52" y="80" width="8" height="14" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    if (characterId === 'ion-scout') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <circle cx="50" cy="30" r="15" fill={color} opacity="0.25"/>
                <path d="M 50 15 L 54 22 L 50 20 L 46 22 Z" fill={color}/>
                <circle cx="44" cy="30" r="3" fill={color}/><circle cx="56" cy="30" r="3" fill={color}/>
                <rect x="38" y="48" width="24" height="30" fill={color} opacity="0.3" rx="4"/>
                <line x1="62" y1="55" x2="78" y2="45" stroke={color} strokeWidth="2"/>
                <circle cx="80" cy="43" r="4" fill="none" stroke={color} strokeWidth="1.5"/>
                <rect x="42" y="78" width="6" height="14" fill={color} opacity="0.4"/>
                <rect x="52" y="78" width="6" height="14" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    if (characterId === 'wire-wraith') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 35 25 Q 50 10 65 25 L 62 50 L 38 50 Z" fill={color} opacity="0.25"/>
                <circle cx="44" cy="32" r="3" fill={color}/><circle cx="56" cy="32" r="3" fill={color}/>
                <path d="M 44 40 L 56 40" stroke={color} strokeWidth="1.5"/>
                <path d="M 38 50 Q 30 65 35 85" stroke={color} strokeWidth="2" fill="none" strokeDasharray="4 3"/>
                <path d="M 62 50 Q 70 65 65 85" stroke={color} strokeWidth="2" fill="none" strokeDasharray="4 3"/>
                <path d="M 46 50 Q 44 70 46 90" stroke={color} strokeWidth="2" fill="none" strokeDasharray="4 3"/>
                <path d="M 54 50 Q 56 70 54 90" stroke={color} strokeWidth="2" fill="none" strokeDasharray="4 3"/>
            </svg>
        );
    }
    if (characterId === 'signal-flare') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <circle cx="50" cy="30" r="14" fill={color} opacity="0.3"/>
                <circle cx="50" cy="20" r="5" fill={color} opacity="0.6"/>
                <circle cx="50" cy="20" r="8" fill="none" stroke={color} strokeWidth="1" opacity="0.4"/>
                <circle cx="50" cy="20" r="12" fill="none" stroke={color} strokeWidth="1" opacity="0.2"/>
                <circle cx="44" cy="32" r="3" fill={color}/><circle cx="56" cy="32" r="3" fill={color}/>
                <rect x="38" y="48" width="24" height="30" fill={color} opacity="0.3" rx="3"/>
                <rect x="42" y="78" width="6" height="14" fill={color} opacity="0.4"/>
                <rect x="52" y="78" width="6" height="14" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    if (characterId === 'core-sentinel') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <rect x="32" y="18" width="36" height="30" fill={color} opacity="0.25" rx="5"/>
                <rect x="32" y="18" width="36" height="30" fill="none" stroke={color} strokeWidth="2.5" rx="5"/>
                <circle cx="44" cy="30" r="4" fill={color}/><circle cx="56" cy="30" r="4" fill={color}/>
                <rect x="42" y="38" width="16" height="3" fill={color} rx="1"/>
                <rect x="35" y="52" width="30" height="32" fill={color} opacity="0.3" rx="4"/>
                <path d="M 28 58 L 35 62 L 35 72 L 28 68 Z" fill={color} opacity="0.4"/>
                <path d="M 72 58 L 65 62 L 65 72 L 72 68 Z" fill={color} opacity="0.4"/>
                <rect x="41" y="84" width="8" height="12" fill={color} opacity="0.5"/>
                <rect x="51" y="84" width="8" height="12" fill={color} opacity="0.5"/>
            </svg>
        );
    }
    if (characterId === 'glitch-fox') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 35 30 L 30 12 L 40 25 Z" fill={color}/>
                <path d="M 65 30 L 70 12 L 60 25 Z" fill={color}/>
                <ellipse cx="50" cy="38" rx="18" ry="14" fill={color} opacity="0.3"/>
                <circle cx="43" cy="35" r="3" fill={color}/><circle cx="57" cy="35" r="3" fill={color}/>
                <path d="M 46 42 L 50 45 L 54 42" stroke={color} strokeWidth="2" fill="none"/>
                <rect x="40" y="54" width="20" height="24" fill={color} opacity="0.3" rx="3"/>
                <rect x="38" y="60" width="24" height="3" fill={color} opacity="0.15"/>
                <rect x="38" y="68" width="24" height="3" fill={color} opacity="0.15"/>
                <path d="M 60 60 Q 75 55 80 65 Q 75 62 60 66" fill={color} opacity="0.4"/>
                <rect x="43" y="78" width="6" height="14" fill={color} opacity="0.4"/>
                <rect x="51" y="78" width="6" height="14" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    if (characterId === 'null-agent') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <rect x="34" y="18" width="32" height="22" fill={color} opacity="0.15" rx="3"/>
                <rect x="36" y="22" width="28" height="8" fill={color} opacity="0.4" rx="2"/>
                <rect x="36" y="22" width="28" height="8" fill="none" stroke={color} strokeWidth="1.5" rx="2"/>
                <path d="M 44 40 L 56 40" stroke={color} strokeWidth="1.5"/>
                <rect x="36" y="44" width="28" height="35" fill={color} opacity="0.2" rx="4"/>
                <line x1="50" y1="50" x2="50" y2="72" stroke={color} strokeWidth="1.5"/>
                <line x1="42" y1="61" x2="58" y2="61" stroke={color} strokeWidth="1.5"/>
                <rect x="40" y="79" width="8" height="14" fill={color} opacity="0.4"/>
                <rect x="52" y="79" width="8" height="14" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    
    // --- New Kids Characters ---
    if (characterId === 'buzzy-bee') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <ellipse cx="50" cy="40" rx="18" ry="16" fill="#ffd700" opacity="0.5"/>
                <rect x="36" y="34" width="28" height="4" fill="#000" opacity="0.5"/>
                <rect x="36" y="42" width="28" height="4" fill="#000" opacity="0.5"/>
                <circle cx="44" cy="36" r="3" fill="#000"/>
                <circle cx="56" cy="36" r="3" fill="#000"/>
                <path d="M 46 48 Q 50 50 54 48" stroke="#000" strokeWidth="2" fill="none"/>
                <path d="M 42 26 Q 38 18 42 14" stroke={color} strokeWidth="2" fill="none"/>
                <circle cx="42" cy="13" r="3" fill={color}/>
                <path d="M 58 26 Q 62 18 58 14" stroke={color} strokeWidth="2" fill="none"/>
                <circle cx="58" cy="13" r="3" fill={color}/>
                <ellipse cx="36" cy="34" rx="10" ry="6" fill={color} opacity="0.2" transform="rotate(-20 36 34)"/>
                <ellipse cx="64" cy="34" rx="10" ry="6" fill={color} opacity="0.2" transform="rotate(20 64 34)"/>
                <ellipse cx="50" cy="65" rx="12" ry="16" fill="#ffd700" opacity="0.4"/>
                <ellipse cx="44" cy="80" rx="4" ry="6" fill={color} opacity="0.4"/>
                <ellipse cx="56" cy="80" rx="4" ry="6" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    if (characterId === 'tiny-turtle') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <circle cx="50" cy="36" r="12" fill={color} opacity="0.4"/>
                <circle cx="45" cy="34" r="3" fill="#000"/>
                <circle cx="55" cy="34" r="3" fill="#000"/>
                <path d="M 46 40 Q 50 42 54 40" stroke="#000" strokeWidth="2" fill="none"/>
                <ellipse cx="50" cy="64" rx="22" ry="18" fill={color} opacity="0.4"/>
                <ellipse cx="50" cy="64" rx="18" ry="14" fill={color} opacity="0.3"/>
                <line x1="50" y1="50" x2="50" y2="78" stroke={color} strokeWidth="1.5" opacity="0.5"/>
                <line x1="36" y1="64" x2="64" y2="64" stroke={color} strokeWidth="1.5" opacity="0.5"/>
                <ellipse cx="36" cy="76" rx="5" ry="4" fill={color} opacity="0.5"/>
                <ellipse cx="64" cy="76" rx="5" ry="4" fill={color} opacity="0.5"/>
                <ellipse cx="36" cy="56" rx="5" ry="4" fill={color} opacity="0.5"/>
                <ellipse cx="64" cy="56" rx="5" ry="4" fill={color} opacity="0.5"/>
            </svg>
        );
    }
    if (characterId === 'dotty-ladybug') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <circle cx="50" cy="34" r="10" fill="#000"/>
                <circle cx="45" cy="32" r="3" fill={color}/>
                <circle cx="55" cy="32" r="3" fill={color}/>
                <path d="M 46 38 Q 50 40 54 38" stroke={color} strokeWidth="2" fill="none"/>
                <path d="M 44 26 Q 40 18 42 14" stroke="#000" strokeWidth="2" fill="none"/>
                <circle cx="42" cy="13" r="2" fill="#000"/>
                <path d="M 56 26 Q 60 18 58 14" stroke="#000" strokeWidth="2" fill="none"/>
                <circle cx="58" cy="13" r="2" fill="#000"/>
                <ellipse cx="50" cy="64" rx="20" ry="22" fill="#ff0000" opacity="0.4"/>
                <line x1="50" y1="44" x2="50" y2="86" stroke="#000" strokeWidth="2"/>
                <circle cx="40" cy="56" r="3" fill="#000" opacity="0.5"/>
                <circle cx="60" cy="56" r="3" fill="#000" opacity="0.5"/>
                <circle cx="42" cy="68" r="3" fill="#000" opacity="0.5"/>
                <circle cx="58" cy="68" r="3" fill="#000" opacity="0.5"/>
                <circle cx="44" cy="80" r="3" fill="#000" opacity="0.5"/>
                <circle cx="56" cy="80" r="3" fill="#000" opacity="0.5"/>
            </svg>
        );
    }
    if (characterId === 'fluffy-sheep') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <circle cx="40" cy="30" r="8" fill={color} opacity="0.3"/>
                <circle cx="60" cy="30" r="8" fill={color} opacity="0.3"/>
                <circle cx="50" cy="28" r="8" fill={color} opacity="0.3"/>
                <circle cx="44" cy="36" r="8" fill={color} opacity="0.3"/>
                <circle cx="56" cy="36" r="8" fill={color} opacity="0.3"/>
                <circle cx="45" cy="36" r="3" fill="#000"/>
                <circle cx="55" cy="36" r="3" fill="#000"/>
                <path d="M 48 42 Q 50 44 52 42" stroke="#000" strokeWidth="2" fill="none"/>
                <ellipse cx="50" cy="62" rx="18" ry="18" fill={color} opacity="0.3"/>
                <circle cx="38" cy="56" r="6" fill={color} opacity="0.3"/>
                <circle cx="62" cy="56" r="6" fill={color} opacity="0.3"/>
                <circle cx="38" cy="68" r="6" fill={color} opacity="0.3"/>
                <circle cx="62" cy="68" r="6" fill={color} opacity="0.3"/>
                <rect x="42" y="80" width="6" height="12" fill={color} opacity="0.4"/>
                <rect x="52" y="80" width="6" height="12" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    if (characterId === 'jolly-dolphin') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <ellipse cx="50" cy="45" rx="18" ry="25" fill={color} opacity="0.3"/>
                <circle cx="44" cy="36" r="3" fill="#000"/>
                <circle cx="56" cy="36" r="3" fill="#000"/>
                <path d="M 46 44 Q 50 47 54 44" stroke="#000" strokeWidth="2" fill="none"/>
                <path d="M 50 20 Q 55 14 60 18" fill={color} opacity="0.5"/>
                <ellipse cx="50" cy="58" rx="12" ry="8" fill={color} opacity="0.15"/>
                <path d="M 32 40 Q 24 44 28 52" fill={color} opacity="0.4"/>
                <path d="M 68 40 Q 76 44 72 52" fill={color} opacity="0.4"/>
                <path d="M 44 70 Q 50 78 56 70" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    if (characterId === 'cheeky-monkey') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <circle cx="32" cy="38" r="8" fill={color} opacity="0.4"/>
                <circle cx="68" cy="38" r="8" fill={color} opacity="0.4"/>
                <circle cx="32" cy="38" r="5" fill={color} opacity="0.3"/>
                <circle cx="68" cy="38" r="5" fill={color} opacity="0.3"/>
                <ellipse cx="50" cy="40" rx="18" ry="16" fill={color} opacity="0.3"/>
                <circle cx="44" cy="38" r="3" fill="#000"/>
                <circle cx="56" cy="38" r="3" fill="#000"/>
                <ellipse cx="50" cy="46" rx="8" ry="5" fill={color} opacity="0.4"/>
                <path d="M 48 48 Q 50 50 52 48" stroke="#000" strokeWidth="2" fill="none"/>
                <ellipse cx="50" cy="68" rx="14" ry="20" fill={color} opacity="0.3"/>
                <ellipse cx="42" cy="84" rx="5" ry="6" fill={color} opacity="0.4"/>
                <ellipse cx="58" cy="84" rx="5" ry="6" fill={color} opacity="0.4"/>
                <path d="M 60 68 Q 70 60 75 65 Q 78 72 72 75 Q 68 72 64 74" fill={color} opacity="0.3"/>
            </svg>
        );
    }
    if (characterId === 'snowy-owl') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 38 22 L 32 14 L 40 24 Z" fill={color} opacity="0.5"/>
                <path d="M 62 22 L 68 14 L 60 24 Z" fill={color} opacity="0.5"/>
                <ellipse cx="50" cy="40" rx="20" ry="18" fill={color} opacity="0.3"/>
                <circle cx="42" cy="36" r="6" fill="#fff" opacity="0.7"/>
                <circle cx="58" cy="36" r="6" fill="#fff" opacity="0.7"/>
                <circle cx="42" cy="36" r="3" fill="#000"/>
                <circle cx="58" cy="36" r="3" fill="#000"/>
                <path d="M 48 44 L 50 47 L 52 44" fill={color}/>
                <ellipse cx="50" cy="66" rx="16" ry="20" fill={color} opacity="0.3"/>
                <path d="M 34 50 Q 24 56 28 66" fill={color} opacity="0.3"/>
                <path d="M 66 50 Q 76 56 72 66" fill={color} opacity="0.3"/>
                <ellipse cx="44" cy="84" rx="5" ry="5" fill={color} opacity="0.4"/>
                <ellipse cx="56" cy="84" rx="5" ry="5" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    if (characterId === 'lucky-clover') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <circle cx="44" cy="20" r="8" fill={color} opacity="0.3"/>
                <circle cx="56" cy="20" r="8" fill={color} opacity="0.3"/>
                <circle cx="40" cy="30" r="8" fill={color} opacity="0.3"/>
                <circle cx="60" cy="30" r="8" fill={color} opacity="0.3"/>
                <circle cx="50" cy="40" r="12" fill={color} opacity="0.4"/>
                <circle cx="46" cy="38" r="2" fill="#000"/>
                <circle cx="54" cy="38" r="2" fill="#000"/>
                <path d="M 48 44 Q 50 46 52 44" stroke="#000" strokeWidth="2" fill="none"/>
                <rect x="48" y="52" width="4" height="20" fill={color} opacity="0.4"/>
                <ellipse cx="50" cy="78" rx="12" ry="14" fill={color} opacity="0.3"/>
                <ellipse cx="44" cy="90" rx="4" ry="5" fill={color} opacity="0.4"/>
                <ellipse cx="56" cy="90" rx="4" ry="5" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    if (characterId === 'starry-fish') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <polygon points="50,10 58,38 90,38 64,56 74,84 50,68 26,84 36,56 10,38 42,38" fill={color} opacity="0.3"/>
                <circle cx="44" cy="42" r="3" fill="#000"/>
                <circle cx="56" cy="42" r="3" fill="#000"/>
                <path d="M 46 50 Q 50 52 54 50" stroke="#000" strokeWidth="2" fill="none"/>
                <circle cx="50" cy="30" r="2" fill={color} opacity="0.5"/>
                <circle cx="38" cy="48" r="2" fill={color} opacity="0.5"/>
                <circle cx="62" cy="48" r="2" fill={color} opacity="0.5"/>
                <circle cx="42" cy="66" r="2" fill={color} opacity="0.5"/>
                <circle cx="58" cy="66" r="2" fill={color} opacity="0.5"/>
            </svg>
        );
    }
    if (characterId === 'candy-dragon') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 40 20 L 35 10 L 42 18 Z" fill={color} opacity="0.5"/>
                <path d="M 60 20 L 65 10 L 58 18 Z" fill={color} opacity="0.5"/>
                <ellipse cx="50" cy="36" rx="16" ry="14" fill={color} opacity="0.3"/>
                <circle cx="44" cy="34" r="4" fill="#000"/>
                <circle cx="56" cy="34" r="4" fill="#000"/>
                <circle cx="44" cy="34" r="2" fill="#fff"/>
                <circle cx="56" cy="34" r="2" fill="#fff"/>
                <path d="M 46 44 Q 50 46 54 44" stroke="#000" strokeWidth="2" fill="none"/>
                <ellipse cx="50" cy="64" rx="16" ry="22" fill={color} opacity="0.3"/>
                <ellipse cx="50" cy="60" rx="10" ry="12" fill={color} opacity="0.15"/>
                <path d="M 34 50 Q 24 54 26 64" fill={color} opacity="0.3"/>
                <path d="M 66 50 Q 76 54 74 64" fill={color} opacity="0.3"/>
                <path d="M 44 86 Q 50 92 56 86" fill={color} opacity="0.4"/>
                <ellipse cx="42" cy="84" rx="5" ry="6" fill={color} opacity="0.4"/>
                <ellipse cx="58" cy="84" rx="5" ry="6" fill={color} opacity="0.4"/>
            </svg>
        );
    }

    // --- New Scary Characters ---
    if (characterId === 'bone-crawler') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <ellipse cx="50" cy="30" rx="16" ry="12" fill={color} opacity="0.2"/>
                <circle cx="42" cy="28" r="5" fill={color}/>
                <circle cx="58" cy="28" r="5" fill={color}/>
                <circle cx="42" cy="28" r="2" fill="#000"/>
                <circle cx="58" cy="28" r="2" fill="#000"/>
                <path d="M 44 38 L 56 38" stroke={color} strokeWidth="2"/>
                <line x1="46" y1="36" x2="46" y2="40" stroke={color} strokeWidth="1.5"/>
                <line x1="50" y1="36" x2="50" y2="40" stroke={color} strokeWidth="1.5"/>
                <line x1="54" y1="36" x2="54" y2="40" stroke={color} strokeWidth="1.5"/>
                <ellipse cx="50" cy="58" rx="12" ry="8" fill={color} opacity="0.2"/>
                <path d="M 38 58 Q 30 65 34 76 Q 38 72 42 76 Q 40 65 44 58" fill={color} opacity="0.3"/>
                <path d="M 56 58 Q 60 65 58 76 Q 62 72 66 76 Q 70 65 62 58" fill={color} opacity="0.3"/>
                <path d="M 46 66 Q 44 76 46 86" stroke={color} strokeWidth="2" fill="none"/>
                <path d="M 54 66 Q 56 76 54 86" stroke={color} strokeWidth="2" fill="none"/>
            </svg>
        );
    }
    if (characterId === 'plague-doctor') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 36 20 Q 36 10 50 10 Q 64 10 64 20 L 64 30 L 36 30 Z" fill={color} opacity="0.3"/>
                <circle cx="42" cy="24" r="4" fill={color}/>
                <circle cx="58" cy="24" r="4" fill={color}/>
                <path d="M 50 30 L 50 46 L 46 44" stroke={color} strokeWidth="2.5" fill="none"/>
                <ellipse cx="50" cy="66" rx="16" ry="26" fill={color} opacity="0.25"/>
                <path d="M 34 52 L 26 58 L 30 68 L 36 64 Z" fill={color} opacity="0.4"/>
                <path d="M 66 52 L 74 58 L 70 68 L 64 64 Z" fill={color} opacity="0.4"/>
                <ellipse cx="43" cy="86" rx="5" ry="7" fill={color} opacity="0.4"/>
                <ellipse cx="57" cy="86" rx="5" ry="7" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    if (characterId === 'blood-raven') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <ellipse cx="50" cy="36" rx="14" ry="12" fill={color} opacity="0.3"/>
                <circle cx="44" cy="34" r="3" fill="#ff0000"/>
                <circle cx="56" cy="34" r="3" fill="#ff0000"/>
                <path d="M 48 42 L 50 46 L 52 42" fill={color}/>
                <path d="M 30 30 Q 20 40 26 55 L 38 45 Z" fill={color} opacity="0.4"/>
                <path d="M 70 30 Q 80 40 74 55 L 62 45 Z" fill={color} opacity="0.4"/>
                <ellipse cx="50" cy="64" rx="12" ry="18" fill={color} opacity="0.3"/>
                <path d="M 44 82 Q 50 88 56 82" fill={color} opacity="0.4"/>
                <ellipse cx="44" cy="80" rx="4" ry="5" fill={color} opacity="0.4"/>
                <ellipse cx="56" cy="80" rx="4" ry="5" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    if (characterId === 'swamp-fiend') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <ellipse cx="50" cy="38" rx="20" ry="18" fill={color} opacity="0.25"/>
                <circle cx="42" cy="28" r="6" fill={color} opacity="0.4"/>
                <circle cx="58" cy="28" r="6" fill={color} opacity="0.4"/>
                <circle cx="42" cy="28" r="3" fill="#000"/>
                <circle cx="58" cy="28" r="3" fill="#000"/>
                <path d="M 44 44 Q 50 48 56 44" stroke={color} strokeWidth="2.5" fill="none"/>
                <path d="M 36 56 Q 32 62 34 72 Q 38 68 40 72 Q 42 64 40 56" fill={color} opacity="0.3"/>
                <path d="M 60 56 Q 64 62 62 72 Q 66 68 68 72 Q 70 64 64 56" fill={color} opacity="0.3"/>
                <ellipse cx="50" cy="68" rx="14" ry="22" fill={color} opacity="0.2"/>
                <ellipse cx="43" cy="86" rx="6" ry="6" fill={color} opacity="0.3"/>
                <ellipse cx="57" cy="86" rx="6" ry="6" fill={color} opacity="0.3"/>
            </svg>
        );
    }
    if (characterId === 'night-stalker') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 36 25 Q 50 10 64 25 L 60 45 L 40 45 Z" fill={color} opacity="0.2"/>
                <circle cx="44" cy="32" r="4" fill={color}/>
                <circle cx="56" cy="32" r="4" fill={color}/>
                <path d="M 46 40 Q 50 42 54 40" stroke={color} strokeWidth="2" fill="none"/>
                <rect x="38" y="48" width="24" height="30" fill={color} opacity="0.2" rx="3"/>
                <path d="M 30 52 L 38 56 L 38 68 L 30 64 Z" fill={color} opacity="0.3"/>
                <path d="M 70 52 L 62 56 L 62 68 L 70 64 Z" fill={color} opacity="0.3"/>
                <rect x="42" y="78" width="6" height="14" fill={color} opacity="0.4"/>
                <rect x="52" y="78" width="6" height="14" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    if (characterId === 'venom-spider') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <ellipse cx="50" cy="34" rx="14" ry="12" fill={color} opacity="0.3"/>
                <circle cx="42" cy="30" r="5" fill="#ff0000" opacity="0.6"/>
                <circle cx="46" cy="26" r="3" fill="#ff0000" opacity="0.6"/>
                <circle cx="58" cy="30" r="5" fill="#ff0000" opacity="0.6"/>
                <circle cx="54" cy="26" r="3" fill="#ff0000" opacity="0.6"/>
                <path d="M 46 40 L 50 44 L 54 40" stroke={color} strokeWidth="2" fill="none"/>
                <ellipse cx="50" cy="58" rx="16" ry="14" fill={color} opacity="0.25"/>
                <path d="M 34 48 Q 22 42 18 50" stroke={color} strokeWidth="2" fill="none"/>
                <path d="M 34 54 Q 22 52 16 58" stroke={color} strokeWidth="2" fill="none"/>
                <path d="M 34 60 Q 22 62 18 68" stroke={color} strokeWidth="2" fill="none"/>
                <path d="M 34 66 Q 26 72 22 78" stroke={color} strokeWidth="2" fill="none"/>
                <path d="M 66 48 Q 78 42 82 50" stroke={color} strokeWidth="2" fill="none"/>
                <path d="M 66 54 Q 78 52 84 58" stroke={color} strokeWidth="2" fill="none"/>
                <path d="M 66 60 Q 78 62 82 68" stroke={color} strokeWidth="2" fill="none"/>
                <path d="M 66 66 Q 74 72 78 78" stroke={color} strokeWidth="2" fill="none"/>
            </svg>
        );
    }
    if (characterId === 'tomb-keeper') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 38 14 L 50 8 L 62 14 L 62 34 L 38 34 Z" fill={color} opacity="0.3"/>
                <rect x="42" y="14" width="16" height="8" fill={color} opacity="0.2"/>
                <circle cx="44" cy="28" r="3" fill={color}/>
                <circle cx="56" cy="28" r="3" fill={color}/>
                <path d="M 46 34 L 54 34" stroke={color} strokeWidth="2"/>
                <rect x="36" y="38" width="28" height="35" fill={color} opacity="0.2" rx="3"/>
                <line x1="50" y1="44" x2="50" y2="66" stroke={color} strokeWidth="1.5"/>
                <line x1="42" y1="55" x2="58" y2="55" stroke={color} strokeWidth="1.5"/>
                <rect x="40" y="73" width="8" height="16" fill={color} opacity="0.4"/>
                <rect x="52" y="73" width="8" height="16" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    if (characterId === 'banshee-wail') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 35 30 Q 35 12 50 12 Q 65 12 65 30 L 65 48 L 35 48 Z" fill={color} opacity="0.2"/>
                <circle cx="42" cy="28" r="5" fill={color}/>
                <circle cx="58" cy="28" r="5" fill={color}/>
                <ellipse cx="50" cy="42" rx="6" ry="8" fill={color} opacity="0.5"/>
                <path d="M 35 48 Q 35 70 40 85 L 45 78 L 50 85 L 55 78 L 60 85 Q 65 70 65 48 Z" fill={color} opacity="0.2"/>
                <path d="M 28 32 Q 22 28 20 34" stroke={color} strokeWidth="2" fill="none" opacity="0.4"/>
                <path d="M 26 38 Q 20 36 18 42" stroke={color} strokeWidth="2" fill="none" opacity="0.3"/>
                <path d="M 72 32 Q 78 28 80 34" stroke={color} strokeWidth="2" fill="none" opacity="0.4"/>
                <path d="M 74 38 Q 80 36 82 42" stroke={color} strokeWidth="2" fill="none" opacity="0.3"/>
            </svg>
        );
    }
    if (characterId === 'inferno-imp') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 40 22 L 35 10 L 42 20 Z" fill="#ff4400"/>
                <path d="M 60 22 L 65 10 L 58 20 Z" fill="#ff4400"/>
                <circle cx="50" cy="34" r="14" fill={color} opacity="0.3"/>
                <circle cx="44" cy="32" r="3" fill="#ff4400"/>
                <circle cx="56" cy="32" r="3" fill="#ff4400"/>
                <path d="M 44 40 Q 50 44 56 40" stroke="#ff4400" strokeWidth="2" fill="none"/>
                <ellipse cx="50" cy="62" rx="12" ry="18" fill={color} opacity="0.3"/>
                <path d="M 38 54 L 32 58 L 34 64 L 40 62 Z" fill={color} opacity="0.4"/>
                <path d="M 62 54 L 68 58 L 66 64 L 60 62 Z" fill={color} opacity="0.4"/>
                <path d="M 56 78 Q 60 72 64 78 Q 68 84 56 82" fill="#ff4400" opacity="0.4"/>
                <ellipse cx="44" cy="78" rx="4" ry="6" fill={color} opacity="0.4"/>
                <ellipse cx="56" cy="78" rx="4" ry="6" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    if (characterId === 'crypt-wyrm') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <ellipse cx="50" cy="28" rx="16" ry="12" fill={color} opacity="0.3"/>
                <circle cx="44" cy="26" r="4" fill={color}/>
                <circle cx="56" cy="26" r="4" fill={color}/>
                <path d="M 44 36 Q 50 40 56 36" stroke={color} strokeWidth="2" fill="none"/>
                <path d="M 40 22 L 35 14 L 42 20 Z" fill={color} opacity="0.5"/>
                <path d="M 60 22 L 65 14 L 58 20 Z" fill={color} opacity="0.5"/>
                <path d="M 50 40 Q 46 55 50 70 Q 54 85 50 95" stroke={color} strokeWidth="6" fill="none" opacity="0.3"/>
                <path d="M 50 40 Q 46 55 50 70 Q 54 85 50 95" stroke={color} strokeWidth="2" fill="none"/>
                <path d="M 34 46 Q 24 50 26 60" fill={color} opacity="0.3"/>
                <path d="M 66 46 Q 76 50 74 60" fill={color} opacity="0.3"/>
            </svg>
        );
    }

    // --- Rare Characters ---
    if (characterId === 'prism-knight') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <polygon points="50,8 62,22 62,38 38,38 38,22" fill={color} opacity="0.3"/>
                <polygon points="50,8 62,22 62,38 38,38 38,22" fill="none" stroke={color} strokeWidth="2"/>
                <circle cx="44" cy="28" r="3" fill={color}/>
                <circle cx="56" cy="28" r="3" fill={color}/>
                <rect x="44" y="34" width="12" height="2" fill={color}/>
                <rect x="34" y="42" width="32" height="35" fill={color} opacity="0.25" rx="4"/>
                <rect x="34" y="42" width="32" height="35" fill="none" stroke={color} strokeWidth="2" rx="4"/>
                <polygon points="50,50 56,60 50,68 44,60" fill={color} opacity="0.4"/>
                <path d="M 26 48 L 34 52 L 34 68 L 26 64 Z" fill={color} opacity="0.4"/>
                <path d="M 74 48 L 66 52 L 66 68 L 74 64 Z" fill={color} opacity="0.4"/>
                <rect x="40" y="77" width="8" height="16" fill={color} opacity="0.5"/>
                <rect x="52" y="77" width="8" height="16" fill={color} opacity="0.5"/>
            </svg>
        );
    }
    if (characterId === 'void-archer') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <circle cx="50" cy="28" r="14" fill={color} opacity="0.2"/>
                <path d="M 42 20 Q 50 14 58 20" stroke={color} strokeWidth="2" fill="none"/>
                <circle cx="44" cy="28" r="3" fill={color}/>
                <circle cx="56" cy="28" r="3" fill={color}/>
                <path d="M 46 36 Q 50 38 54 36" stroke={color} strokeWidth="1.5" fill="none"/>
                <rect x="38" y="44" width="24" height="32" fill={color} opacity="0.25" rx="3"/>
                <path d="M 30 48 L 22 42 L 18 48 L 22 46" stroke={color} strokeWidth="2" fill="none"/>
                <path d="M 70 48 L 78 42" stroke={color} strokeWidth="2" fill="none"/>
                <line x1="78" y1="42" x2="78" y2="82" stroke={color} strokeWidth="2"/>
                <path d="M 76 42 L 78 38 L 80 42" fill={color}/>
                <rect x="42" y="76" width="6" height="16" fill={color} opacity="0.4"/>
                <rect x="52" y="76" width="6" height="16" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    if (characterId === 'neon-ronin') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <rect x="36" y="16" width="28" height="26" fill={color} opacity="0.2" rx="3"/>
                <rect x="40" y="12" width="20" height="4" fill={color} opacity="0.5"/>
                <circle cx="44" cy="28" r="3" fill={color}/>
                <circle cx="56" cy="28" r="3" fill={color}/>
                <path d="M 46 36 L 54 36" stroke={color} strokeWidth="2"/>
                <rect x="36" y="46" width="28" height="30" fill={color} opacity="0.25" rx="3"/>
                <line x1="50" y1="50" x2="50" y2="70" stroke={color} strokeWidth="1.5" opacity="0.5"/>
                <path d="M 64 46 L 78 38 L 80 42 L 66 50" fill={color} opacity="0.4"/>
                <path d="M 36 52 L 28 56 L 30 62 L 36 60" fill={color} opacity="0.3"/>
                <rect x="40" y="76" width="8" height="16" fill={color} opacity="0.4"/>
                <rect x="52" y="76" width="8" height="16" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    if (characterId === 'data-alchemist') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 38 24 L 50 10 L 62 24 L 58 28 L 42 28 Z" fill={color} opacity="0.4"/>
                <circle cx="50" cy="38" r="14" fill={color} opacity="0.2"/>
                <circle cx="44" cy="36" r="3" fill={color}/>
                <circle cx="56" cy="36" r="3" fill={color}/>
                <path d="M 46 44 Q 50 46 54 44" stroke={color} strokeWidth="2" fill="none"/>
                <rect x="36" y="54" width="28" height="28" fill={color} opacity="0.25" rx="4"/>
                <circle cx="50" cy="68" r="8" fill="none" stroke={color} strokeWidth="1.5"/>
                <circle cx="50" cy="68" r="3" fill={color} opacity="0.4"/>
                <path d="M 30 58 L 36 62 L 36 74 L 30 70 Z" fill={color} opacity="0.4"/>
                <path d="M 70 58 L 64 62 L 64 74 L 70 70 Z" fill={color} opacity="0.4"/>
                <rect x="42" y="82" width="6" height="12" fill={color} opacity="0.4"/>
                <rect x="52" y="82" width="6" height="12" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    if (characterId === 'circuit-witch') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 36 26 L 50 10 L 64 26 L 60 30 L 40 30 Z" fill={color} opacity="0.5"/>
                <circle cx="50" cy="40" r="14" fill={color} opacity="0.2"/>
                <circle cx="44" cy="38" r="3" fill={color}/>
                <circle cx="56" cy="38" r="3" fill={color}/>
                <path d="M 46 46 Q 50 48 54 46" stroke={color} strokeWidth="2" fill="none"/>
                <rect x="36" y="56" width="28" height="26" fill={color} opacity="0.25" rx="4"/>
                <path d="M 42 62 L 46 66 L 42 70" stroke={color} strokeWidth="1.5" fill="none"/>
                <path d="M 54 62 L 58 66 L 54 70" stroke={color} strokeWidth="1.5" fill="none"/>
                <path d="M 30 60 L 22 56 L 20 62" stroke={color} strokeWidth="2" fill="none"/>
                <circle cx="20" cy="64" r="3" fill={color} opacity="0.5"/>
                <rect x="42" y="82" width="6" height="12" fill={color} opacity="0.4"/>
                <rect x="52" y="82" width="6" height="12" fill={color} opacity="0.4"/>
            </svg>
        );
    }

    // --- Legendary Characters ---
    if (characterId === 'grid-phoenix') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 50 8 L 56 20 L 44 20 Z" fill={color}/>
                <circle cx="50" cy="32" r="14" fill={color} opacity="0.3"/>
                <circle cx="50" cy="32" r="14" fill="none" stroke={color} strokeWidth="2"/>
                <circle cx="44" cy="30" r="3" fill={color}/>
                <circle cx="56" cy="30" r="3" fill={color}/>
                <path d="M 46 38 Q 50 40 54 38" stroke={color} strokeWidth="2" fill="none"/>
                <ellipse cx="50" cy="62" rx="16" ry="24" fill={color} opacity="0.25"/>
                <path d="M 34 48 Q 20 44 18 56 Q 22 52 28 58 L 36 54 Z" fill={color} opacity="0.5"/>
                <path d="M 66 48 Q 80 44 82 56 Q 78 52 72 58 L 64 54 Z" fill={color} opacity="0.5"/>
                <path d="M 34 58 Q 22 64 24 74" stroke={color} strokeWidth="1.5" fill="none" opacity="0.4"/>
                <path d="M 66 58 Q 78 64 76 74" stroke={color} strokeWidth="1.5" fill="none" opacity="0.4"/>
                <rect x="42" y="82" width="6" height="12" fill={color} opacity="0.5"/>
                <rect x="52" y="82" width="6" height="12" fill={color} opacity="0.5"/>
                <path d="M 44 86 Q 50 94 56 86" fill={color} opacity="0.3"/>
            </svg>
        );
    }
    if (characterId === 'neon-titan') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <rect x="34" y="14" width="32" height="28" fill={color} opacity="0.25" rx="5"/>
                <rect x="34" y="14" width="32" height="28" fill="none" stroke={color} strokeWidth="2.5" rx="5"/>
                <circle cx="44" cy="26" r="4" fill={color}/>
                <circle cx="56" cy="26" r="4" fill={color}/>
                <rect x="42" y="34" width="16" height="3" fill={color} rx="1"/>
                <rect x="30" y="46" width="40" height="38" fill={color} opacity="0.25" rx="5"/>
                <rect x="30" y="46" width="40" height="38" fill="none" stroke={color} strokeWidth="2" rx="5"/>
                <path d="M 22 52 L 30 56 L 30 72 L 22 68 Z" fill={color} opacity="0.5"/>
                <path d="M 78 52 L 70 56 L 70 72 L 78 68 Z" fill={color} opacity="0.5"/>
                <rect x="40" y="84" width="8" height="12" fill={color} opacity="0.5"/>
                <rect x="52" y="84" width="8" height="12" fill={color} opacity="0.5"/>
            </svg>
        );
    }
    if (characterId === 'cyber-bear') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <circle cx="34" cy="22" r="8" fill={color} opacity="0.3"/>
                <circle cx="34" cy="22" r="8" fill="none" stroke={color} strokeWidth="1.5"/>
                <circle cx="66" cy="22" r="8" fill={color} opacity="0.3"/>
                <circle cx="66" cy="22" r="8" fill="none" stroke={color} strokeWidth="1.5"/>
                <circle cx="50" cy="36" r="18" fill={color} opacity="0.3"/>
                <circle cx="50" cy="36" r="18" fill="none" stroke={color} strokeWidth="2"/>
                <circle cx="43" cy="34" r="3" fill={color}/>
                <circle cx="57" cy="34" r="3" fill={color}/>
                <ellipse cx="50" cy="42" rx="6" ry="4" fill={color} opacity="0.5"/>
                <path d="M 46 48 Q 50 50 54 48" stroke={color} strokeWidth="2" fill="none"/>
                <ellipse cx="50" cy="68" rx="18" ry="22" fill={color} opacity="0.25"/>
                <ellipse cx="50" cy="68" rx="18" ry="22" fill="none" stroke={color} strokeWidth="2"/>
                <ellipse cx="41" cy="86" rx="6" ry="8" fill={color} opacity="0.4"/>
                <ellipse cx="59" cy="86" rx="6" ry="8" fill={color} opacity="0.4"/>
            </svg>
        );
    }
    if (characterId === 'quantum-dragon') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <path d="M 38 20 L 32 8 L 40 18 Z" fill={color}/>
                <path d="M 62 20 L 68 8 L 60 18 Z" fill={color}/>
                <ellipse cx="50" cy="32" rx="18" ry="16" fill={color} opacity="0.3"/>
                <ellipse cx="50" cy="32" rx="18" ry="16" fill="none" stroke={color} strokeWidth="2"/>
                <circle cx="42" cy="28" r="4" fill={color}/>
                <circle cx="58" cy="28" r="4" fill={color}/>
                <path d="M 44 40 Q 50 44 56 40" stroke={color} strokeWidth="2" fill="none"/>
                <ellipse cx="50" cy="62" rx="16" ry="24" fill={color} opacity="0.25"/>
                <path d="M 34 50 Q 20 52 18 64 Q 24 58 30 62 L 36 56 Z" fill={color} opacity="0.4"/>
                <path d="M 66 50 Q 80 52 82 64 Q 76 58 70 62 L 64 56 Z" fill={color} opacity="0.4"/>
                <ellipse cx="42" cy="82" rx="6" ry="8" fill={color} opacity="0.4"/>
                <ellipse cx="58" cy="82" rx="6" ry="8" fill={color} opacity="0.4"/>
                <path d="M 44 86 Q 50 94 56 86" fill={color} opacity="0.3"/>
            </svg>
        );
    }
    if (characterId === 'omega-prime') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                <circle cx="50" cy="50" r="38" fill={color} opacity="0.1"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke={color} strokeWidth="2"/>
                <circle cx="50" cy="50" r="30" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="4 3"/>
                <circle cx="50" cy="30" r="12" fill={color} opacity="0.3"/>
                <circle cx="50" cy="30" r="12" fill="none" stroke={color} strokeWidth="2"/>
                <circle cx="46" cy="28" r="2" fill={color}/>
                <circle cx="54" cy="28" r="2" fill={color}/>
                <path d="M 47 34 Q 50 36 53 34" stroke={color} strokeWidth="1.5" fill="none"/>
                <text x="50" y="62" textAnchor="middle" fill={color} fontSize="18" fontFamily="serif">{'\u03A9'}</text>
                <rect x="42" y="72" width="6" height="14" fill={color} opacity="0.4"/>
                <rect x="52" y="72" width="6" height="14" fill={color} opacity="0.4"/>
            </svg>
        );
    }

    // --- Meta Avatar ---
    if (characterId === 'meta') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
                {/* Rotating outer ring */}
                <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="1" strokeDasharray="8 4" opacity="0.3">
                    <animate attributeName="stroke-dashoffset" values="0;100" dur="10s" repeatCount="indefinite"/>
                </circle>
                {/* Inner pulsing circle */}
                <circle cx="50" cy="50" r="30" fill={color} opacity="0.1">
                    <animate attributeName="r" values="28;32;28" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.1;0.2;0.1" dur="3s" repeatCount="indefinite"/>
                </circle>
                <circle cx="50" cy="50" r="30" fill="none" stroke={color} strokeWidth="2"/>
                {/* Face */}
                <circle cx="44" cy="44" r="3" fill={color}/>
                <circle cx="56" cy="44" r="3" fill={color}/>
                <path d="M 44 56 Q 50 60 56 56" stroke={color} strokeWidth="2" fill="none"/>
                {/* Orbiting dots */}
                <circle cx="50" cy="12" r="3" fill={color} opacity="0.6">
                    <animate attributeName="cx" values="50;88;50;12;50" dur="8s" repeatCount="indefinite"/>
                    <animate attributeName="cy" values="12;50;88;50;12" dur="8s" repeatCount="indefinite"/>
                </circle>
                <circle cx="88" cy="50" r="2" fill={color} opacity="0.4">
                    <animate attributeName="cx" values="88;50;12;50;88" dur="8s" repeatCount="indefinite"/>
                    <animate attributeName="cy" values="50;88;50;12;50" dur="8s" repeatCount="indefinite"/>
                </circle>
            </svg>
        );
    }

    // Default fallback
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={svgStyle}>
            <circle cx="50" cy="35" r="15" fill={color} opacity="0.3"/>
            <circle cx="44" cy="32" r="3" fill={color}/>
            <circle cx="56" cy="32" r="3" fill={color}/>
            <path d="M 44 40 Q 50 44 56 40" stroke={color} strokeWidth="2" fill="none"/>
            <rect x="38" y="52" width="24" height="30" fill={color} opacity="0.3" rx="4"/>
            <rect x="42" y="82" width="6" height="12" fill={color} opacity="0.4"/>
            <rect x="52" y="82" width="6" height="12" fill={color} opacity="0.4"/>
        </svg>
    );
};

export default CharacterSVG;
