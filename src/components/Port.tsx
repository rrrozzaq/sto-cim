import { Carrier } from '../types/stocker';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface PortProps {
  type: 'in' | 'out';
  carrier: Carrier | null;
  onDragStart: (e: React.DragEvent, type: 'in' | 'out') => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, type: 'in' | 'out') => void;
  isDragOver: boolean;
  onCarrierClick: (carrier: Carrier | null, type: 'in' | 'out') => void;
}

export function Port({
  type,
  carrier,
  onDragStart,
  onDragOver: onDragOverProp,
  onDrop,
  isDragOver,
  onCarrierClick
}: PortProps) {
  const handleDragOver = (e: React.DragEvent) => {
    onDragOverProp(e);
  };
  const isPortIn = type === 'in';
  const hasCarrier = carrier !== null;
  const canDrag = hasCarrier && !carrier?.isProhibited;

  const portLabel = isPortIn ? 'PORT IN' : 'PORT OUT';
  const stateLabel = hasCarrier
    ? (isPortIn ? 'WAIT IN' : 'WAIT OUT')
    : 'EMPTY';

  const getStateColor = () => {
    if (!hasCarrier) return 'bg-gray-300 text-gray-600';
    if (carrier.isProhibited) return 'bg-red-600 text-white';
    return isPortIn ? 'bg-green-500 text-white' : 'bg-orange-500 text-white';
  };

  return (
    <div
      className={`
        w-28 bg-white border-4 rounded-lg shadow-lg transition-all relative
        ${isDragOver ? 'border-green-500 scale-105 shadow-xl' : 'border-gray-400'}
      `}
      onDragOver={handleDragOver}
      onDrop={(e) => onDrop(e, type)}
    >
      <div className="bg-gray-700 text-white text-center py-1 font-bold text-xs rounded-t flex items-center justify-center gap-1">
        {isPortIn ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
        {portLabel}
      </div>

      <div
        className={`
          h-20 flex flex-col items-center justify-center p-2 cursor-pointer
          ${canDrag ? 'cursor-grab active:cursor-grabbing' : ''}
        `}
        draggable={canDrag}
        onDragStart={(e) => {
          if (canDrag) onDragStart(e, type);
          else e.preventDefault();
        }}
        onClick={(e) => {
          e.stopPropagation();
          onCarrierClick(carrier, type);
        }}
      >
        <div className={`
          w-full px-2 py-2 rounded text-center font-bold text-xs mb-1
          ${getStateColor()}
        `}>
          {stateLabel}
        </div>

        {hasCarrier && (
          <div className="text-[10px] font-mono font-bold text-gray-800 truncate w-full text-center">
            {carrier.id}
          </div>
        )}
      </div>

      {carrier?.isProhibited && (
        <div className="absolute top-0 right-0 text-lg">🚫</div>
      )}
    </div>
  );
}
