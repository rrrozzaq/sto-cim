import { RackCell } from './RackCell.tsx';
import { Rack } from '../types/stocker';

interface RackGridProps {
  racks: Rack[];
  columns: number;
  rows: number;
  isTopSection?: boolean;
  onDragStart: (column: number, row: number, shelf: 'deep' | 'front') => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (column: number, row: number) => void;
  dragOverCell: { column: number; row: number } | null;
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
}: RackGridProps) {
  const getRack = (col: number, row: number) => {
    return racks.find(r => r.column === col && r.row === row);
  };

  const rowLabels = isTopSection
    ? Array.from({ length: rows }, (_, i) => rows + 4 - i)
    : Array.from({ length: rows }, (_, i) => rows - i);

  return (
    <div className="flex gap-3">
      <div className="flex flex-col justify-around">
        {rowLabels.map((label) => (
          <div
            key={label}
            className="w-12 h-14 bg-gray-400 rounded flex items-center justify-center text-xl font-bold text-gray-800"
          >
            {label}
          </div>
        ))}
      </div>

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
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
