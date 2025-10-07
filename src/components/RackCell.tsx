interface RackCellProps {
  column: number;
  row: number;
  deepShelf: string | null;
  frontShelf: string | null;
  onDragStart: (column: number, row: number, shelf: 'deep' | 'front') => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (column: number, row: number) => void;
  isDragOver: boolean;
}

export function RackCell({
  column,
  row,
  deepShelf,
  frontShelf,
  onDragStart,
  onDragOver,
  onDrop,
  isDragOver,
}: RackCellProps) {
  const getColor = () => {
    const carrierCount = (deepShelf ? 1 : 0) + (frontShelf ? 1 : 0);
    if (carrierCount === 0) return 'bg-gray-700';
    if (carrierCount === 1) return 'bg-blue-500';
    return 'bg-red-500';
  };

  const canDragFront = frontShelf;
  const canDragDeep = deepShelf && !frontShelf;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(column, row);
  };

  return (
    <div
      className={`w-14 h-14 ${getColor()} rounded flex flex-col items-center justify-center text-white text-xs font-semibold border-2 transition-all ${
        isDragOver ? 'border-green-400 border-4 ring-4 ring-green-400 ring-opacity-50 scale-105' : 'border-gray-800'
      }`}
      onDragOver={onDragOver}
      onDrop={handleDrop}
    >
      {deepShelf && (
        <div
          draggable={canDragDeep}
          onDragStart={(e) => {
            if (canDragDeep) {
              onDragStart(column, row, 'deep');
            } else {
              e.preventDefault();
            }
          }}
          className={`leading-tight px-2 py-0.5 rounded transition-all mb-0.5 ${
            canDragDeep ? 'cursor-move hover:bg-white hover:text-gray-900' : 'opacity-50 cursor-not-allowed'
          }`}
        >
          2
        </div>
      )}
      {frontShelf && (
        <div
          draggable={canDragFront}
          onDragStart={(e) => {
            if (canDragFront) {
              onDragStart(column, row, 'front');
            } else {
              e.preventDefault();
            }
          }}
          className={`leading-tight px-2 py-0.5 rounded cursor-move hover:bg-white hover:text-gray-900 transition-all`}
        >
          1
        </div>
      )}
    </div>
  );
}
