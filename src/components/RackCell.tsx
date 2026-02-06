import { Carrier } from '../types/stocker';

interface RackCellProps {
  column: number;
  row: number;
  deepShelf: Carrier | null;
  frontShelf: Carrier | null;
  onDragStart: (e: React.DragEvent, column: number, row: number, shelf: 'deep' | 'front') => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, column: number, row: number) => void;
  // Update Type: allow null carrier
  onCarrierClick: (carrier: Carrier | null, col: number, row: number, shelf: 'deep' | 'front') => void;
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
  onCarrierClick,
  isDragOver,
}: RackCellProps) {
  
  const renderSlot = (shelfType: 'deep' | 'front', carrier: Carrier | null) => {
    const label = shelfType === 'deep' ? '1' : '2'; 
    const isFilled = carrier !== null;
    const isProhibited = carrier?.isProhibited;
    const isMaintenance = carrier?.id === "MAINTENANCE"; // Cek flag khusus

    // Default Style (Kosong)
    let bgClass = "bg-rose-50"; 
    let borderClass = "border-rose-200";
    let textClass = "text-rose-900/50";
    let hoverClass = "hover:bg-rose-100"; // Efek hover saat kosong

    if (isFilled) {
      if (isProhibited) {
        // Style Prohibited / Maintenance
        bgClass = "bg-gray-700";
        textClass = "text-white";
        borderClass = "border-gray-600";
        hoverClass = "hover:bg-gray-800";
      } else {
        // Style Normal Filled
        bgClass = "bg-blue-500"; 
        borderClass = "border-blue-600";
        textClass = "text-white";
        hoverClass = "hover:bg-blue-600";
      }
    }

    const canDrag = isFilled && !isProhibited && (shelfType === 'front' || !frontShelf); 

    return (
      <div
        className={`
          flex-1 w-full flex items-center justify-center 
          text-xs font-bold border rounded-sm mb-[2px] last:mb-0
          transition-all duration-200 relative
          ${bgClass} ${borderClass} ${textClass} ${hoverClass}
          ${canDrag ? 'cursor-grab active:cursor-grabbing' : ''}
          cursor-pointer shadow-sm
        `}
        draggable={canDrag}
        onDragStart={(e) => {
          if (canDrag) onDragStart(e, column, row, shelfType);
          else e.preventDefault();
        }}
        onClick={(e) => {
          e.stopPropagation();
          // Selalu trigger klik, baik kosong maupun isi
          onCarrierClick(carrier, column, row, shelfType);
        }}
        // Tooltip dinamis
        title={isFilled 
          ? (isMaintenance ? "Slot Under Maintenance" : `ID: ${carrier?.id}\nProhibited: ${isProhibited ? 'Yes' : 'No'}`) 
          : 'Empty Slot (Click to Prohibit)'}
      >
        {label}
        {isProhibited && <span className="absolute top-0 right-1 text-[10px]">🚫</span>}
      </div>
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(e, column, row);
  };

  return (
    <div
      className={`
        w-14 h-16 bg-gray-200 rounded flex flex-col p-1 border-2 transition-all 
        ${isDragOver ? 'border-green-500 bg-green-50 scale-105 shadow-lg z-10' : 'border-gray-300'}
      `}
      onDragOver={onDragOver}
      onDrop={handleDrop}
    >
      {renderSlot('deep', deepShelf)}
      {renderSlot('front', frontShelf)}
    </div>
  );
}