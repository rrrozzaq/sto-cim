import { MovementLog } from '../types/stocker';
import { ArrowRight } from 'lucide-react';

interface InformationScreenProps {
  logs: MovementLog[];
}

export function InformationScreen({ logs }: InformationScreenProps) {
  const sortedLogs = [...logs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full max-h-[80vh] flex flex-col">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Movement Log History</h2>

        <div className="overflow-auto flex-1">
          <table className="w-full">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Carrier ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  From
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700"></th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  To
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No movement logs available
                  </td>
                </tr>
              ) : (
                sortedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {log.timestamp.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {log.carrierId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      Col {log.fromColumn}, Row {log.fromRow}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <ArrowRight size={16} className="text-gray-400 mx-auto" />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      Col {log.toColumn}, Row {log.toRow}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          log.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
