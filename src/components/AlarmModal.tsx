import { X, AlertCircle } from 'lucide-react';
import { Alarm } from '../types/stocker';

interface AlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  alarms: Alarm[];
}

export function AlarmModal({ isOpen, onClose, alarms }: AlarmModalProps) {
  if (!isOpen) return null;

  const activeAlarms = alarms.filter(a => a.isActive);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 border-red-500 text-red-900';
      case 'high':
        return 'bg-orange-100 border-orange-500 text-orange-900';
      case 'medium':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900';
      case 'low':
        return 'bg-blue-100 border-blue-500 text-blue-900';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-900';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <AlertCircle className="text-red-600" />
            Active Alarms
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-auto flex-1">
          {activeAlarms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <AlertCircle size={48} className="mb-4 text-green-500" />
              <p className="text-lg">No active alarms</p>
              <p className="text-sm">All systems operating normally</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeAlarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className={`border-l-4 p-4 rounded ${getSeverityColor(alarm.severity)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-sm uppercase tracking-wide">
                      {alarm.alarmType}
                    </h3>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-white bg-opacity-50">
                      {alarm.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{alarm.message}</p>
                  <p className="text-xs opacity-75">
                    {alarm.createdAt.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
