import React from "react";

interface MovementArrowProps {
  fromCol: number;
  fromRow: number;
  toCol: number;
  toRow: number;
  isVisible: boolean;
}

export function MovementArrow({
  fromCol,
  fromRow,
  toCol,
  toRow,
  isVisible,
}: MovementArrowProps) {
  if (!isVisible) return null;

  // --- KONFIGURASI DIMENSI (Sesuaikan dengan CSS RackGrid & MainScreen) ---
  const RACK_WIDTH = 56;
  const RACK_GAP = 8;
  const RACK_CELL_HEIGHT = 64;
  const CRANE_HEIGHT = 130; // Tinggi area crane visual

  // --- OFFSET HORIZONTAL (X) ---
  // Pastikan ini match dengan padding-left di MainScreen.
  // Jika di MainScreen pl-[3.75rem] (~60px) + lebar label baris.
  // Value 1070 + 12 sepertinya sangat besar, tapi saya pertahankan sesuai request Anda.
  // Jika X melenceng, coba kurangi nilai ini (misal ke 100-200).
  const ROW_LABEL_WIDTH = 1070;
  const HORIZONTAL_OFFSET = ROW_LABEL_WIDTH + 12;

  // --- OFFSET VERTIKAL (Y) ---
  // Offset awal rak atas dari atas layar
  const TOP_SECTION_START_Y = 190;

  // Jarak antara akhir Rak Atas dan awal Rak Bawah
  // Terdiri dari: Label Atas (~40px) + Crane (~130px) + Label Bawah (~40px)
  const SECTION_GAP = 210;

  // --- FUNGSI KALKULASI ---

  const calculatePosition = (col: number, row: number) => {
    // 1. Hitung X
    let x = 0;
    if (col === 0) {
      // Port In
      x = HORIZONTAL_OFFSET - 80;
    } else if (col === 8) {
      // Port Out
      x = HORIZONTAL_OFFSET + 7 * (RACK_WIDTH + RACK_GAP) + 80;
    } else {
      // Rack
      x =
        HORIZONTAL_OFFSET +
        (col - 1) * (RACK_WIDTH + RACK_GAP) +
        RACK_WIDTH / 2;
    }

    // 2. Hitung Y
    let y = 0;

    // Tinggi total blok rak atas (4 baris)
    const topRackHeight = 4 * (RACK_CELL_HEIGHT + RACK_GAP);

    // -- KASUS 1: Port / Jalur Tengah --
    if (!row || row === 0) {
      y = TOP_SECTION_START_Y + topRackHeight + SECTION_GAP / 2;
    }
    // -- KASUS 2: Rak Atas (Row 5-8) --
    else if (row > 4) {
      // Urutan visual (Y makin besar ke bawah): 8->5
      // Row 8 (Paling atas) = index 0
      // Row 5 (Paling bawah rak atas) = index 3
      const visualIndex = 3 - (row - 5);
      y =
        TOP_SECTION_START_Y +
        visualIndex * (RACK_CELL_HEIGHT + RACK_GAP) +
        RACK_CELL_HEIGHT / 2;
    }
    // -- KASUS 3: Rak Bawah (Row 1-4) --
    else {
      const bottomSectionStartY =
        TOP_SECTION_START_Y + topRackHeight + SECTION_GAP;
      // Urutan visual: 4->1
      // Row 4 (Paling atas rak bawah) = index 0
      // Row 1 (Paling bawah) = index 3
      const visualIndex = 3 - (row - 1);
      y =
        bottomSectionStartY +
        visualIndex * (RACK_CELL_HEIGHT + RACK_GAP) +
        RACK_CELL_HEIGHT / 2;
    }

    return { x, y };
  };

  const start = calculatePosition(fromCol, fromRow);
  const end = calculatePosition(toCol, toRow);

  // Posisi Y Garis Tengah (Track Crane)
  const topRackH = 4 * (RACK_CELL_HEIGHT + RACK_GAP);
  const CRANE_TRACK_Y = TOP_SECTION_START_Y + topRackH + SECTION_GAP / 2;

  // Path L-Shape
  const pathData = `
    M ${start.x} ${start.y}
    L ${start.x} ${CRANE_TRACK_Y}
    L ${end.x} ${CRANE_TRACK_Y}
    L ${end.x} ${end.y}
  `;

  const markerId = `arrow-${fromCol}-${fromRow}-${toCol}-${toRow}`;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ top: 0, left: 0 }}
    >
      <svg className="w-full h-full overflow-visible">
        <defs>
          <marker
            id={markerId}
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L6,3 z" fill="#ea580c" />
          </marker>
        </defs>

        {/* Shadow Path */}
        <path
          d={pathData}
          stroke="white"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />

        {/* Main Path */}
        <path
          d={pathData}
          stroke="#ea580c"
          strokeWidth="3"
          fill="none"
          markerEnd={`url(#${markerId})`}
          strokeDasharray="10 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="16"
            to="0"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </path>

        {/* Dots */}
        <circle
          cx={start.x}
          cy={start.y}
          r="5"
          fill="#ef4444"
          stroke="white"
          strokeWidth="2"
        >
          <animate
            attributeName="r"
            values="4;6;4"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx={end.x}
          cy={end.y}
          r="5"
          fill="#10b981"
          stroke="white"
          strokeWidth="2"
        />

        {/* Label Moving */}
        {/* <g
          transform={`translate(${(start.x + end.x) / 2}, ${CRANE_TRACK_Y - 20})`}
        >
          <rect
            x="-30"
            y="-10"
            width="60"
            height="20"
            rx="10"
            fill="#ea580c"
            stroke="white"
            strokeWidth="2"
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="white"
            fontSize="9"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            MOVING
          </text>
        </g> */}
      </svg>
    </div>
  );
}
