import { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Carrier } from '../types/stocker';

interface CarrierDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  carrier: Carrier | null;
  rackPosition: { col: number; row: number; shelf: 'deep' | 'front' } | null;
  onSave: (updatedCarrier: Carrier) => void;
}

export function CarrierDetailModal({ isOpen, onClose, carrier, rackPosition, onSave }: CarrierDetailModalProps) {
  const [isProhibited, setIsProhibited] = useState(false);
  const [prohibitedBy, setProhibitedBy] = useState<'admin' | 'worker' | 'system'>('admin');
  const [prohibitReason, setProhibitReason] = useState('');

  // Cek apakah ini slot kosong (Placeholder Maintenance)
  const isPlaceholder = carrier?.id === "MAINTENANCE";

  useEffect(() => {
    if (carrier) {
      setIsProhibited(carrier.isProhibited || false);
      setProhibitedBy(carrier.prohibitedBy || 'admin');
      setProhibitReason(carrier.prohibitReason || '');
    }
  }, [carrier, isOpen]);

  if (!isOpen || !carrier) return null;

  const handleSave = () => {
    onSave({
      ...carrier,
      isProhibited,
      prohibitedBy: isProhibited ? prohibitedBy : undefined,
      prohibitReason: isProhibited ? prohibitReason : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-bold text-gray-800">
            {isPlaceholder ? 'Slot Management' : 'Carrier Details'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Info Section - Sembunyikan detail jika Placeholder */}
          {!isPlaceholder && (
            <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="font-semibold text-gray-600">Carrier ID:</span>
                <span className="font-bold text-gray-900">{carrier.id}</span>
                <span className="font-semibold text-gray-600">Entry Time:</span>
                <span className="text-gray-900 text-xs">
                  {carrier.entryTime ? new Date(carrier.entryTime).toLocaleString() : '-'}
                </span>
              </div>
            </div>
          )}

          {/* Location Info (Selalu tampil) */}
          <div className="bg-gray-50 p-2 rounded text-sm text-center text-gray-600 border">
            Location: <strong>Col {rackPosition?.col}</strong>, <strong>Row {rackPosition?.row}</strong> ({rackPosition?.shelf})
          </div>

          {/* Prohibit Section */}
          <div className={`border rounded-md p-3 transition-colors ${isProhibited ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="prohibitCheck"
                checked={isProhibited}
                onChange={(e) => setIsProhibited(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500 cursor-pointer"
              />
              <label htmlFor="prohibitCheck" className="font-bold text-red-700 flex items-center gap-2 cursor-pointer text-sm">
                <AlertTriangle size={16} />
                {isPlaceholder ? 'BLOCK / MAINTENANCE' : 'PROHIBIT MOVEMENT'}
              </label>
            </div>

            {isProhibited && (
              <div className="space-y-3 pl-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Set By</label>
                  <select
                    value={prohibitedBy}
                    onChange={(e) => setProhibitedBy(e.target.value as any)}
                    className="w-full text-sm border-gray-300 rounded-md shadow-sm p-2 bg-white"
                  >
                    <option value="admin">Administrator</option>
                    <option value="worker">Worker</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Reason</label>
                  <textarea
                    value={prohibitReason}
                    onChange={(e) => setProhibitReason(e.target.value)}
                    className="w-full text-sm border-gray-300 rounded-md shadow-sm p-2"
                    rows={2}
                    placeholder="e.g. Broken sensor, Maintenance..."
                  />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition-colors font-semibold shadow-sm"
          >
            {isProhibited ? 'Save & Block Slot' : 'Save & Open Slot'}
          </button>
        </div>
      </div>
    </div>
  );
}