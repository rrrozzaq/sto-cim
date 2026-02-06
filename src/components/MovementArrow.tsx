interface MovementArrowProps {
  fromCol: number;
  fromRow: number;
  toCol: number;
  toRow: number;
  isVisible: boolean;
}

export function MovementArrow({ fromCol, fromRow, toCol, toRow, isVisible }: MovementArrowProps) {
  if (!isVisible) return null;

  const RACK_WIDTH = 56;
  const RACK_HEIGHT = 64;
  const RACK_GAP = 8;
  const ROW_LABEL_WIDTH = 48;
  const HORIZONTAL_OFFSET = ROW_LABEL_WIDTH + 12;

  const calculatePosition = (col: number, row: number) => {
    const x = HORIZONTAL_OFFSET + (col - 1) * (RACK_WIDTH + RACK_GAP) + RACK_WIDTH / 2;

    let y: number;
    if (row > 4) {
      const topSectionRow = row - 5;
      y = (3 - topSectionRow) * (RACK_HEIGHT + RACK_GAP) + RACK_HEIGHT / 2 + 32;
    } else {
      const bottomSectionRow = row - 1;
      y = 600 + (3 - bottomSectionRow) * (RACK_HEIGHT + RACK_GAP) + RACK_HEIGHT / 2 + 32;
    }

    return { x, y };
  };

  const start = calculatePosition(fromCol, fromRow);
  const end = calculatePosition(toCol, toRow);

  return (
    <div className="fixed inset-0 pointer-events-none z-40" style={{ top: 0, left: 0 }}>
      <svg className="w-full h-full">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#f59e0b" />
          </marker>

          <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>

        <g>
          <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="url(#arrowGradient)"
            strokeWidth="4"
            markerEnd="url(#arrowhead)"
            className="animate-pulse"
            strokeDasharray="10 5"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="15"
              to="0"
              dur="1s"
              repeatCount="indefinite"
            />
          </line>

          <circle cx={start.x} cy={start.y} r="8" fill="#ef4444" opacity="0.8">
            <animate
              attributeName="r"
              from="8"
              to="12"
              dur="0.8s"
              repeatCount="indefinite"
              begin="0s"
            />
            <animate
              attributeName="opacity"
              from="0.8"
              to="0.3"
              dur="0.8s"
              repeatCount="indefinite"
              begin="0s"
            />
          </circle>

          <circle cx={end.x} cy={end.y} r="8" fill="#10b981" opacity="0.8">
            <animate
              attributeName="r"
              from="8"
              to="12"
              dur="0.8s"
              repeatCount="indefinite"
              begin="0s"
            />
            <animate
              attributeName="opacity"
              from="0.8"
              to="0.3"
              dur="0.8s"
              repeatCount="indefinite"
              begin="0s"
            />
          </circle>

          <circle cx={start.x} cy={start.y} r="4" fill="white">
            <animateMotion
              path={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>

      <div
        className="absolute bg-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border-2 border-white"
        style={{
          left: `${(start.x + end.x) / 2}px`,
          top: `${(start.y + end.y) / 2 - 20}px`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        Moving...
      </div>
    </div>
  );
}
