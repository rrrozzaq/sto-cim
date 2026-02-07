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
  const RACK_GAP = 8;
  const RACK_CELL_HEIGHT = 64;
  const ROW_LABEL_WIDTH = 48;
  const COLUMN_LABEL_HEIGHT = 32;
  const HORIZONTAL_OFFSET = ROW_LABEL_WIDTH + 12;
  const TOP_SECTION_OFFSET = COLUMN_LABEL_HEIGHT + 8;

  const calculatePosition = (col: number, row: number) => {
    const x = HORIZONTAL_OFFSET + (col - 1) * (RACK_WIDTH + RACK_GAP) + RACK_WIDTH / 2;

    let y: number;
    if (row > 4) {
      const topSectionRow = row - 5;
      const yInTopSection = TOP_SECTION_OFFSET + (3 - topSectionRow) * (RACK_CELL_HEIGHT + RACK_GAP) + RACK_CELL_HEIGHT / 2;
      y = yInTopSection;
    } else {
      const bottomSectionRow = row - 1;
      const topSectionHeight = TOP_SECTION_OFFSET + 4 * (RACK_CELL_HEIGHT + RACK_GAP);
      const craneHeight = 130;
      const bottomSectionOffset = topSectionHeight + craneHeight + COLUMN_LABEL_HEIGHT;
      const yInBottomSection = bottomSectionOffset + (3 - bottomSectionRow) * (RACK_CELL_HEIGHT + RACK_GAP) + RACK_CELL_HEIGHT / 2;
      y = yInBottomSection;
    }

    return { x, y };
  };

  const start = calculatePosition(fromCol, fromRow);
  const end = calculatePosition(toCol, toRow);

  const topSectionHeight = TOP_SECTION_OFFSET + 4 * (RACK_CELL_HEIGHT + RACK_GAP);
  const craneHeight = 130;
  const CRANE_Y = topSectionHeight + craneHeight / 2;

  const pathData = `
    M ${start.x} ${start.y}
    L ${start.x} ${CRANE_Y}
    L ${end.x} ${CRANE_Y}
    L ${end.x} ${end.y}
  `;

  return (
    <div className="fixed inset-0 pointer-events-none z-40" style={{ top: 0, left: 0 }}>
      <svg className="w-full h-full">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <polygon points="0 0, 8 4, 0 8" fill="#fb923c" />
          </marker>
        </defs>

        <g>
          <path
            d={pathData}
            stroke="#fb923c"
            strokeWidth="5"
            fill="none"
            markerEnd="url(#arrowhead)"
            strokeDasharray="15 8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="23"
              to="0"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </path>

          <circle cx={start.x} cy={start.y} r="8" fill="#ef4444" opacity="0.9">
            <animate
              attributeName="r"
              from="8"
              to="11"
              dur="0.8s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from="0.9"
              to="0.4"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </circle>

          <circle cx={end.x} cy={end.y} r="8" fill="#10b981" opacity="0.9">
            <animate
              attributeName="r"
              from="8"
              to="11"
              dur="0.8s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from="0.9"
              to="0.4"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </circle>

          <circle r="6" fill="white" opacity="0.95" filter="drop-shadow(0 0 3px rgba(0,0,0,0.3))">
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
            >
              <mpath href={`#pathdef`} />
            </animateMotion>
          </circle>
        </g>

        <path id="pathdef" d={pathData} style={{ display: 'none' }} />
      </svg>

      <div
        className="absolute bg-orange-400 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg border-2 border-white"
        style={{
          left: `${Math.min(start.x, end.x) + Math.abs(end.x - start.x) / 2}px`,
          top: `${CRANE_Y - 30}px`,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }}
      >
        Moving...
      </div>
    </div>
  );
}
