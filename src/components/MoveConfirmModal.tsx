import { MoveRight, X } from 'lucide-react';

interface MoveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  moveDetails: {
    carrierId: string;
    from: string;
    to: string;
  } | null;
}

export function MoveConfirmModal({ isOpen, onClose, onConfirm, moveDetails }: MoveConfirmModalProps) {
  if (!isOpen || !moveDetails) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-96 transform scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <MoveRight className="text-blue-600" />
            Confirm Movement
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="mb-8">
          <p className="text-gray-600 mb-3 text-sm">
            Are you sure you want to move this carrier?
          </p>
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between border-b border-blue-200 pb-2">
              <span className="text-blue-600 font-semibold">Carrier ID</span>
              <span className="font-mono font-bold text-blue-900">{moveDetails.carrierId}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-gray-500">From</span>
              <span className="font-medium text-gray-800">{moveDetails.from}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">To</span>
              <span className="font-medium text-gray-800">{moveDetails.to}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors shadow-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}