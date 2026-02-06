interface CraneProps {
  position: number;
  isMoving: boolean;
  animationStage:
    | "idle"
    | "moving-to-source"
    | "picking-up"
    | "lifting"
    | "moving-to-dest"
    | "lowering"
    | "placing";
  carrierColor: "blue" | "red" | null;
  targetRow: number | null;
}

export function Crane({
  position,
  isMoving,
  animationStage,
  carrierColor,
  targetRow,
}: CraneProps) {
  // --- PERHITUNGAN POSISI YANG SUDAH DIKOREKSI SECARA AKURAT ---

  // Jarak dari tepi kiri ke pusat kolom PERTAMA.
  // (Lebar label [48px] + jarak [12px] + setengah lebar rak [28px])
  const HORIZONTAL_OFFSET = 330; // 48 + 12 + 28 = 88px

  // Jarak antar pusat kolom.
  // (Lebar rak [56px] + jarak antar rak [8px])
  const DISTANCE_PER_COLUMN = 64; // 56 + 8 = 64px

  // Formula posisi final yang akurat
  const leftPosition = HORIZONTAL_OFFSET + (position - 1) * DISTANCE_PER_COLUMN;

  // Sisa dari logika (tampilan dan lengan) tetap sama
  const isCarrying = carrierColor !== null;

  const getArmExtension = () => {
    if (
      animationStage === "picking-up" ||
      animationStage === "lowering" ||
      animationStage === "placing"
    ) {
      if (targetRow && targetRow > 4) {
        return "h-20";
      }
      return "h-16";
    }
    if (animationStage === "lifting" && isCarrying) {
      return "h-0";
    }
    return "h-0";
  };

  const getArmDirection = () => {
    if (targetRow && targetRow > 4) {
      return "top-auto bottom-full";
    }
    return "top-full";
  };

  return (
    <div className="relative w-full h-24 bg-gray-300 rounded-lg shadow-inner overflow-visible">
      <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-900 transform -translate-y-1/2"></div>
      <div
        className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-[2500ms] ease-in-out`}
        style={{ left: `${leftPosition}px` }}
      >
        <div className="relative">
          <div className="w-16 h-12 bg-green-500 rounded-lg shadow-lg border-4 border-green-600 relative">
            {isCarrying && (
              <div
                className="absolute left-1/2 transform -translate-x-1/2 w-8 h-6 bg-green-600 rounded border-2 border-white shadow-md"
                style={{ top: "-28px" }}
              />
            )}
            <div
              className={`absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-800 transition-all duration-500 ${getArmExtension()} ${getArmDirection()}`}
            >
              {(animationStage === "picking-up" ||
                animationStage === "lowering" ||
                animationStage === "placing") && (
                <div
                  className={`absolute ${
                    targetRow && targetRow > 4 ? "top-0" : "bottom-0"
                  } left-1/2 transform -translate-x-1/2 w-4 h-1 bg-gray-900`}
                ></div>
              )}
            </div>
          </div>
          <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-900 rounded-full border-2 border-gray-600"></div>
        </div>
      </div>
    </div>
  );
}
