interface AnimatedArrowProps {
  isActive: boolean;
  direction: 'to-crane' | 'from-crane';
}

export function AnimatedArrow({ isActive, direction }: AnimatedArrowProps) {
  if (!isActive) return null;

  return (
    <div className="absolute left-32 top-1/2 transform -translate-y-1/2 pointer-events-none z-20">
      <svg width="200" height="60" className="overflow-visible">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#f97316" />
          </marker>

          <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#f97316" stopOpacity="1" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        <path
          d="M 10 30 Q 100 10, 190 30"
          fill="none"
          stroke="url(#arrowGradient)"
          strokeWidth="3"
          markerEnd="url(#arrowhead)"
          className={direction === 'to-crane' ? 'animate-flow-forward' : 'animate-flow-reverse'}
        />

        <circle r="4" fill="#f97316" className="animate-flow-dot">
          <animateMotion
            dur="1.5s"
            repeatCount="indefinite"
            path="M 10 30 Q 100 10, 190 30"
          />
        </circle>
      </svg>

      <style>{`
        @keyframes dash-forward {
          to {
            stroke-dashoffset: 0;
          }
        }

        .animate-flow-forward {
          stroke-dasharray: 10 5;
          animation: dash-forward 0.8s linear infinite;
        }

        .animate-flow-reverse {
          stroke-dasharray: 10 5;
          animation: dash-forward 0.8s linear infinite reverse;
        }

        .animate-flow-dot {
          filter: drop-shadow(0 0 3px #f97316);
        }
      `}</style>
    </div>
  );
}
