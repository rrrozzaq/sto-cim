interface CraneProps {
  position: number;
  isMoving: boolean;
  animationStage: 'idle' | 'moving-to-source' | 'picking-up' | 'lifting' | 'moving-to-dest' | 'lowering' | 'placing';
  carrierColor: 'blue' | 'red' | null;
  targetRow: number | null;
}

export function Crane({ position, isMoving, animationStage, carrierColor, targetRow }: CraneProps) {
  const leftPosition = 60 + (position - 1) * 60;
  const isCarrying = carrierColor !== null;

  const getArmExtension = () => {
    if (animationStage === 'picking-up' || animationStage === 'lowering' || animationStage === 'placing') {
      if (targetRow && targetRow > 4) {
        return 'h-20';
      }
      return 'h-16';
    }
    if (animationStage === 'lifting' && isCarrying) {
      return 'h-0';
    }
    return 'h-0';
  };

  const getArmDirection = () => {
    if (targetRow && targetRow > 4) {
      return 'top-auto bottom-full';
    }
    return 'top-full';
  };

  return (
    <div className="relative w-full h-24 bg-gray-300 rounded-lg shadow-inner overflow-visible">
      <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-900 transform -translate-y-1/2"></div>
      <div
        className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all ${
          isMoving ? 'duration-2000' : 'duration-500'
        } ease-in-out`}
        style={{ left: `${leftPosition}px` }}
      >
        <div className="relative">
          <div className="w-16 h-12 bg-green-500 rounded-lg shadow-lg border-4 border-green-600 relative overflow-visible">
            {isCarrying && (
              <div
                className="absolute left-1/2 transform -translate-x-1/2 w-8 h-6 bg-green-600 rounded border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold transition-all duration-500"
                style={{ top: '-32px' }}
              >
                <div className="w-1 h-full bg-gray-800 absolute left-1/2 transform -translate-x-1/2"></div>
              </div>
            )}

            <div
              className={`absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-800 transition-all duration-500 ${getArmExtension()} ${getArmDirection()}`}
            >
              {(animationStage === 'picking-up' || animationStage === 'lowering' || animationStage === 'placing') && (
                <div className={`absolute ${targetRow && targetRow > 4 ? 'top-0' : 'bottom-0'} left-1/2 transform -translate-x-1/2 w-4 h-1 bg-gray-900`}></div>
              )}
            </div>
          </div>
          <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-900 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
