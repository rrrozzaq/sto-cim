import { Power, AlertTriangle } from 'lucide-react';
import { CraneStatus } from '../types/stocker';

interface MaintenanceScreenProps {
  craneStatus: CraneStatus;
  onToggleCrane: () => void;
  onResetAlarms: () => void;
}

export function MaintenanceScreen({
  craneStatus,
  onToggleCrane,
  onResetAlarms,
}: MaintenanceScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Maintenance Menu</h2>

        <div className="space-y-6">
          <div className="border-b pb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Crane Control</h3>
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Power size={32} className={craneStatus.isOnline ? 'text-green-600' : 'text-red-600'} />
                <div>
                  <p className="font-semibold text-gray-800">Crane Status</p>
                  <p className="text-sm text-gray-600">
                    {craneStatus.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <button
                onClick={onToggleCrane}
                className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                  craneStatus.isOnline
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                Turn {craneStatus.isOnline ? 'OFF' : 'ON'}
              </button>
            </div>
          </div>

          <div className="border-b pb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Alarm Management</h3>
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle size={32} className="text-orange-600" />
                <div>
                  <p className="font-semibold text-gray-800">Reset Fault Alarms</p>
                  <p className="text-sm text-gray-600">Clear all active equipment alarms</p>
                </div>
              </div>
              <button
                onClick={onResetAlarms}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-md font-semibold transition-colors"
              >
                Reset Alarms
              </button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Turning off the crane will halt all operations. Ensure no
              carriers are in transit before powering down.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
