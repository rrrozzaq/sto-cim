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
    | "placing"
    | "carrier-moving-with-arm";
  carrierColor: "blue" | "red" | null;
  targetRow: number | null;
  isCarryingOnArm: boolean;
}

export function Crane({
  position,
  isMoving,
  animationStage,
  carrierColor,
  targetRow,
  isCarryingOnArm,
}: CraneProps) {
  // --- KONFIGURASI POSISI ---
  const HORIZONTAL_OFFSET = 330;
  const DISTANCE_PER_COLUMN = 64;

  const leftPosition = HORIZONTAL_OFFSET + (position - 1) * DISTANCE_PER_COLUMN;

  // --- LOGIKA LENGAN (FORK) ---
  const getArmStyle = () => {
    // Default: Lengan pendek/sembunyi
    const hiddenStyle = {
      height: "0px",
      opacity: 0,
      transition: "height 0.3s ease-out",
    };

    // Jika tidak ada target row atau stage bukan aksi vertikal, sembunyikan
    if (
      !targetRow ||
      (animationStage !== "picking-up" &&
        animationStage !== "lowering" &&
        animationStage !== "placing" &&
        animationStage !== "carrier-moving-with-arm")
    ) {
      return hiddenStyle;
    }

    const ROW_HEIGHT_PX = 64;
    const BASE_REACH = 45;

    let height = 0;
    let isTopRack = targetRow >= 5;

    // Hitung tinggi lengan
    if (isTopRack) {
      height = BASE_REACH + (targetRow - 5) * ROW_HEIGHT_PX;
    } else {
      height = BASE_REACH + (4 - targetRow) * ROW_HEIGHT_PX;
    }

    return {
      height: `${height}px`,
      // Set top/bottom secara eksplisit untuk mencegah bug visual
      top: isTopRack ? "auto" : "50%",
      bottom: isTopRack ? "50%" : "auto",
      opacity: 1,
      // Hanya animasikan height
      transition: "height 0.8s ease-in-out",
    };
  };

  const armStyle = getArmStyle();

  // Tentukan arah gripper head (ujung)
  const isTargetTop = targetRow && targetRow >= 5;

  return (
    <div className="relative w-full h-24 bg-gray-300 rounded-lg shadow-inner overflow-visible">
      {/* Track Line */}
      <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-900 transform -translate-y-1/2"></div>

      {/* Crane Body Container */}
      <div
        className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all ease-in-out z-20`}
        style={{
          left: `${leftPosition}px`,
          // Durasi gerak horizontal (lama) vs diam (cepat)
          transitionDuration: isMoving ? "2500ms" : "500ms",
        }}
      >
        <div className="relative">
          {/* Main Box Crane */}
          <div className="w-16 h-12 bg-green-500 rounded-lg shadow-lg border-4 border-green-600 relative flex items-center justify-center z-20">
            {/* Carrier di Body (Saat bergerak horizontal) */}
            {/* PERUBAHAN: Warna dikunci ke bg-green-600 */}
            {carrierColor && !isCarryingOnArm && (
              <div
                className="absolute w-8 h-6 bg-green-600 rounded border-2 border-white shadow-md z-30"
                style={{ top: "-28px" }}
              />
            )}

            {/* Lengan Vertikal (Arm) */}
            <div
              className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-800 z-10"
              style={armStyle}
            >
              {/* Gripper Head (Garis horizontal kecil di ujung lengan) */}
              {(animationStage === "picking-up" ||
                animationStage === "lowering" ||
                animationStage === "placing" ||
                animationStage === "carrier-moving-with-arm") && (
                <div
                  className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-1 bg-gray-900 ${
                    isTargetTop ? "top-0" : "bottom-0"
                  }`}
                ></div>
              )}

              {/* Carrier di Lengan (Saat naik/turun) */}
              {/* PERUBAHAN: Warna dikunci ke bg-green-600 */}
              {isCarryingOnArm && carrierColor && (
                <div
                  className="absolute left-1/2 transform -translate-x-1/2 w-8 h-6 bg-green-600 rounded border-2 border-white shadow-md z-30"
                  style={{
                    // Tempelkan carrier di ujung lengan sesuai arah
                    [isTargetTop ? "top" : "bottom"]: "-28px",
                  }}
                />
              )}
            </div>
          </div>
          {/* Roda/Hiasan */}
          <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-900 rounded-full border-2 border-gray-600 z-20"></div>
        </div>
      </div>
    </div>
  );
}
