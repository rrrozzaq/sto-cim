import { RackGrid } from './RackGrid.tsx';
import { Crane } from './Crane.tsx';
import { Port } from './Port.tsx';
import { AnimatedArrow } from './AnimatedArrow.tsx';
import { Rack, CraneStatus, Carrier } from '../types/stocker';

interface MainScreenProps {
  racks: Rack[];
  craneStatus: CraneStatus;
  onDragStart: (e: React.DragEvent, column: number, row: number, shelf: 'deep' | 'front') => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, column: number, row: number) => void;
  dragOverCell: { column: number; row: number } | null;
  animationStage: 'idle' | 'moving-to-source' | 'picking-up' | 'lifting' | 'moving-to-dest' | 'lowering' | 'placing' | 'carrier-moving-with-arm';
  carrierColor: 'blue' | 'red' | null;
  targetRow: number | null;
  isCarryingOnArm: boolean;
  onCarrierClick: (carrier: Carrier | null, col: number, row: number, shelf: 'deep' | 'front') => void;
  portIn: Carrier | null;
  portOut: Carrier | null;
  onPortDragStart: (e: React.DragEvent, type: 'in' | 'out') => void;
  onPortDragOver: (e: React.DragEvent) => void;
  onPortDrop: (e: React.DragEvent, type: 'in' | 'out') => void;
  dragOverPort: 'in' | 'out' | null;
  onPortCarrierClick: (carrier: Carrier | null, type: 'in' | 'out') => void;
}

export function MainScreen({
  racks,
  craneStatus,
  onDragStart,
  onDragOver,
  onDrop,
  dragOverCell,
  animationStage,
  carrierColor,
  targetRow,
  isCarryingOnArm,
  onCarrierClick,
  portIn,
  portOut,
  onPortDragStart,
  onPortDragOver,
  onPortDrop,
  dragOverPort,
  onPortCarrierClick
}: MainScreenProps) {
  
  // Array kolom 1-7
  const cols = Array.from({ length: 7 }, (_, i) => i + 1);

  const showArrow = animationStage !== 'idle' && (
    animationStage === 'picking-up' ||
    animationStage === 'lifting' ||
    animationStage === 'lowering' ||
    animationStage === 'placing'
  );

  const arrowDirection = (animationStage === 'picking-up' || animationStage === 'lifting')
    ? 'to-crane'
    : 'from-crane';

  return (
    <div className="flex-1 flex items-center justify-center gap-6 py-6 w-full max-w-7xl mx-auto overflow-hidden">

      {/* === PORT IN & PORT OUT (LEFT SIDE) === */}
      <div className="flex flex-col gap-6 items-center">
        <Port
          type="in"
          carrier={portIn}
          onDragStart={onPortDragStart}
          onDragOver={onPortDragOver}
          onDrop={onPortDrop}
          isDragOver={dragOverPort === 'in'}
          onCarrierClick={onPortCarrierClick}
        />
        <Port
          type="out"
          carrier={portOut}
          onDragStart={onPortDragStart}
          onDragOver={onPortDragOver}
          onDrop={onPortDrop}
          isDragOver={dragOverPort === 'out'}
          onCarrierClick={onPortCarrierClick}
        />
      </div>

      {/* === MAIN RACK AREA === */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 relative">

        {/* Animated Arrow */}
        <AnimatedArrow isActive={showArrow} direction={arrowDirection} />

        {/* === BAGIAN ATAS (RAK 5-8) === */}
        <div className="flex flex-col gap-2">
        <RackGrid
          racks={racks}
          columns={7}
          rows={4}
          isTopSection={true}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          dragOverCell={dragOverCell}
          onCarrierClick={onCarrierClick}
        />
        {/* Label Kolom Atas - Padding Left disesuaikan dengan lebar label baris di RackGrid (48px + 12px gap = 60px/3.75rem) */}
        <div className="flex justify-center gap-2 pl-[3.75rem]">
          {cols.map((col) => (
            <div key={col} className="w-14 h-8 bg-rose-200 rounded flex items-center justify-center text-base font-bold text-rose-800 shadow-sm">
              {col}
            </div>
          ))}
        </div>
      </div>

      {/* === AREA CRANE === */}
      {/* Padding horizontal disesuaikan agar ujung kiri 'Track' sejajar visual dengan grid */}
      <div className="w-full px-4"> 
        <Crane
          position={craneStatus.position}
          isMoving={craneStatus.isMoving}
          animationStage={animationStage}
          carrierColor={carrierColor}
          targetRow={targetRow}
          isCarryingOnArm={isCarryingOnArm}
        />
      </div>

      {/* === BAGIAN BAWAH (RAK 1-4) === */}
      <div className="flex flex-col gap-2">
         {/* Label Kolom Bawah */}
        <div className="flex justify-center gap-2 pl-[3.75rem]">
          {cols.map((col) => (
            <div key={col} className="w-14 h-8 bg-rose-200 rounded flex items-center justify-center text-base font-bold text-rose-800 shadow-sm">
              {col}
            </div>
          ))}
        </div>
        <RackGrid
          racks={racks}
          columns={7}
          rows={4}
          isTopSection={false}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          dragOverCell={dragOverCell}
          onCarrierClick={onCarrierClick}
        />
      </div>
      </div>
    </div>
  );
}