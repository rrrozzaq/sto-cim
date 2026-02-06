import { RackCell } from './RackCell.tsx';
import { Rack, Carrier } from '../types/stocker.tsx';

interface RackGridProps {
  racks: Rack[];
  columns: number;
  rows: number;
  isTopSection?: boolean;
  onDragStart: (e: React.DragEvent, column: number, row: number, shelf: 'deep' | 'front') => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, column: number, row: number) => void;
  dragOverCell: { column: number; row: number } | null;
  onCarrierClick: (carrier: Carrier | null, col: number, row: number, shelf: 'deep' | 'front') => void;
}

export function RackGrid({
  racks,
  columns,
  rows,
  isTopSection = false,
  onDragStart,
  onDragOver,
  onDrop,
  dragOverCell,
  onCarrierClick
}: RackGridProps) {
  const getRack = (col: number, row: number) => {
    return racks.find(r => r.column === col && r.row === row);
  };

  // Logic label baris (top section dibalik urutannya)
  const rowLabels = isTopSection
    ? Array.from({ length: rows }, (_, i) => rows + 4 - i)
    : Array.from({ length: rows }, (_, i) => rows - i);

  return (
    <div className="flex gap-3">
      {/* Label Baris */}
      <div className="flex flex-col justify-around">
        {rowLabels.map((label) => (
          <div key={label} className="w-12 h-14 bg-slate-400 rounded flex items-center justify-center text-xl font-bold text-white shadow-sm">
            {label}
          </div>
        ))}
      </div>

      {/* Grid Rak */}
      <div className="flex flex-col gap-2">
        {rowLabels.map((rowLabel) => (
          <div key={rowLabel} className="flex gap-2">
            {Array.from({ length: columns }, (_, i) => i + 1).map((col) => {
              const rack = getRack(col, rowLabel);
              const isDragOver = dragOverCell?.column === col && dragOverCell?.row === rowLabel;
              return (
                <RackCell
                  key={`${col}-${rowLabel}`}
                  column={col}
                  row={rowLabel}
                  deepShelf={rack?.deepShelf || null}
                  frontShelf={rack?.frontShelf || null}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  isDragOver={isDragOver}
                  onCarrierClick={onCarrierClick}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}