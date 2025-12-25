export function TokovaLogo({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Shopping bag shape */}
            <path
                d="M8 16C8 14.8954 8.89543 14 10 14H38C39.1046 14 40 14.8954 40 16V40C40 42.2091 38.2091 44 36 44H12C9.79086 44 8 42.2091 8 40V16Z"
                fill="url(#tokova-gradient)"
            />
            {/* Bag handles */}
            <path
                d="M16 14V12C16 7.58172 19.5817 4 24 4C28.4183 4 32 7.58172 32 12V14"
                stroke="url(#tokova-gradient)"
                strokeWidth="3"
                strokeLinecap="round"
            />
            {/* Arrow up - growth symbol */}
            <path
                d="M24 35V23"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
            />
            <path
                d="M18 28L24 22L30 28"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Sparkle dot */}
            <circle cx="36" cy="10" r="3" fill="#FCD34D" />
            <defs>
                <linearGradient id="tokova-gradient" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F97316" />
                    <stop offset="1" stopColor="#EA580C" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export function TokovaLogoWhite({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M8 16C8 14.8954 8.89543 14 10 14H38C39.1046 14 40 14.8954 40 16V40C40 42.2091 38.2091 44 36 44H12C9.79086 44 8 42.2091 8 40V16Z"
                fill="white"
            />
            <path
                d="M16 14V12C16 7.58172 19.5817 4 24 4C28.4183 4 32 7.58172 32 12V14"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
            />
            <path
                d="M24 35V23"
                stroke="#F97316"
                strokeWidth="3"
                strokeLinecap="round"
            />
            <path
                d="M18 28L24 22L30 28"
                stroke="#F97316"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="36" cy="10" r="3" fill="#FCD34D" />
        </svg>
    );
}
