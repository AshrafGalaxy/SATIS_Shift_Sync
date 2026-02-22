"use client";

import { motion } from "framer-motion";

export const HeroAbstractSVG = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <defs>
            <linearGradient id="gradient1" x1="0" y1="0" x2="800" y2="600" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1E3A8A" /> {/* Deep blue */}
                <stop offset="1" stopColor="#4C1D95" /> {/* Deep purple */}
            </linearGradient>
            <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#2DD4BF" stopOpacity="0.8" /> {/* Teal accent */}
                <stop offset="1" stopColor="#A78BFA" stopOpacity="0.2" /> {/* Purple accent */}
            </linearGradient>
            <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="30" />
            </filter>
        </defs>

        {/* Background glow base */}
        <motion.circle
            cx="400"
            cy="300"
            r="200"
            fill="url(#glow)"
            filter="url(#blur)"
            animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />

        {/* Central Core: Time / AI Node */}
        <motion.circle
            cx="400"
            cy="300"
            r="80"
            fill="url(#gradient1)"
            stroke="url(#glow)"
            strokeWidth="2"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "400px 300px" }}
        />
        <motion.circle
            cx="400"
            cy="300"
            r="60"
            fill="#0F172A" /* Tailwind slate-950 */
        />
        {/* Inner AI network lines */}
        <path d="M400 240 L360 330 L440 330 Z" stroke="#2DD4BF" strokeWidth="1.5" fill="none" opacity="0.8" />
        <path d="M400 360 L350 280 L450 280 Z" stroke="#A78BFA" strokeWidth="1.5" fill="none" opacity="0.8" />

        {/* Orbiting Calendar Nodes */}
        <g style={{ transformOrigin: "400px 300px" }}>
            <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "400px 300px" }}
            >
                {/* Node 1 */}
                <line x1="400" y1="300" x2="250" y2="150" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="250" cy="150" r="25" fill="#1E293B" stroke="#2DD4BF" strokeWidth="2" />
                <rect x="238" y="138" width="24" height="24" rx="4" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
                <line x1="238" y1="146" x2="262" y2="146" stroke="#94A3B8" strokeWidth="1.5" />

                {/* Node 2 */}
                <line x1="400" y1="300" x2="600" y2="200" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="600" cy="200" r="20" fill="#1E293B" stroke="#A78BFA" strokeWidth="2" />
                <rect x="590" y="190" width="20" height="20" rx="3" fill="none" stroke="#94A3B8" strokeWidth="1.5" />

                {/* Node 3 */}
                <line x1="400" y1="300" x2="300" y2="500" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="300" cy="500" r="30" fill="#1E293B" stroke="#2DD4BF" strokeWidth="2" />
                <polyline points="295,495 300,500 308,492" stroke="#94A3B8" strokeWidth="2" fill="none" strokeLinecap="round" />

                {/* Node 4 */}
                <line x1="400" y1="300" x2="550" y2="450" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="550" cy="450" r="15" fill="#1E293B" stroke="#818CF8" strokeWidth="2" />
            </motion.g>
        </g>

        {/* Floating Data Particles */}
        <motion.circle cx="150" cy="400" r="3" fill="#2DD4BF" animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }} />
        <motion.circle cx="650" cy="100" r="4" fill="#A78BFA" animate={{ y: [0, 30, 0], opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} />
        <motion.circle cx="700" cy="500" r="2" fill="#818CF8" animate={{ x: [0, -30, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 5, repeat: Infinity, delay: 2 }} />
        <motion.circle cx="100" cy="200" r="3" fill="#2DD4BF" animate={{ x: [0, 20, 0], opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }} />
    </svg>
);

export const SolverLoadingGear = ({ className }: { className?: string }) => (
    <motion.svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    >
        <circle cx="50" cy="50" r="30" stroke="#2DD4BF" strokeWidth="8" strokeDasharray="20 10" strokeLinecap="round" />
        <circle cx="50" cy="50" r="15" stroke="#A78BFA" strokeWidth="4" strokeDasharray="10 5" strokeLinecap="round" />
        <path d="M50 40 L50 60 L60 50 Z" fill="#818CF8" />
    </motion.svg>
);
