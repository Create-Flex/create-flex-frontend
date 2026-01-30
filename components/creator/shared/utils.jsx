import React from 'react';
import { Youtube, Twitch, Instagram, Smartphone, Monitor } from 'lucide-react';
import { PALETTE } from './constants';

export const renderPlatformIcon = (platform, size = 16) => {
    switch (platform) {
        case 'YouTube': return <Youtube size={size} className="text-black" />;
        case 'Twitch': return <Twitch size={size} className="text-black" />;
        case 'Instagram': return <Instagram size={size} className="text-black" />;
        case 'TikTok': return <Smartphone size={size} className="text-black" />;
        case 'Chzzk': return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 11.5L15.5 2.5L13.5 10.5H21.5L11.5 21.5L13.5 11.5H5.5Z" fill="#000000" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
        default: return <Monitor size={size} className="text-gray-500" />;
    }
};

export const getCreatorColorStyles = (id) => {
    const idx = parseInt(id) || 0;
    return PALETTE[idx % PALETTE.length];
};
