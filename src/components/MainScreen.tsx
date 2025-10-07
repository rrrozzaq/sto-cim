import { RackGrid } from './RackGrid.tsx';
import { Crane } from './Crane.tsx';
import { Rack, CraneStatus } from '../types/stocker';

interface MainScreenProps {
  racks: Rack[];
  craneStatus: CraneStatus;
  onDragStart: (column: number, row: number, shelf: 'deep' | 'front') => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (column: number, row: number) => void;
  dragOverCell: { column: number; row: number } | null;
  animationStage: 'idle' | 'moving-to-source' | 'picking-up' | 'lifting' | 'moving-to-dest' | 'lowering' | 'placing';
  carrierColor: 'blue' | 'red' | null;
  targetRow: number | null;
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
}: MainScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col gap-4">
        <RackGrid
          racks={racks}
          columns={7}
          rows={4}
          isTopSection={true}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          dragOverCell={dragOverCell}
        />

        <div className="flex justify-center">
          <div className="flex gap-3">
            <div className="w-12"></div>
            {Array.from({ length: 7 }, (_, i) => i + 1).map((col) => (
              <div
                key={col}
                className="w-14 h-12 bg-rose-300 rounded flex items-center justify-center text-xl font-bold text-gray-800"
              >
                {col}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl px-12">
        <Crane
          position={craneStatus.position}
          isMoving={craneStatus.isMoving}
          animationStage={animationStage}
          carrierColor={carrierColor}
          targetRow={targetRow}
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-center">
          <div className="flex gap-3">
            <div className="w-12"></div>
            {Array.from({ length: 7 }, (_, i) => i + 1).map((col) => (
              <div
                key={col}
                className="w-14 h-12 bg-rose-300 rounded flex items-center justify-center text-xl font-bold text-gray-800"
              >
                {col}
              </div>
            ))}
          </div>
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
        />
      </div>
    </div>
  );
}
