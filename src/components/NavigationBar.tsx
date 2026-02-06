import { Home, Wrench, Info, Bell, Power } from 'lucide-react';
import { MenuItem } from '../types/stocker';

interface NavigationBarProps {
  activeMenu: MenuItem;
  onMenuChange: (menu: MenuItem) => void;
  onAlarmClick: () => void;
  onShutdownClick: () => void;
  onUndo: () => void;
  alarmCount: number;
  canUndo: boolean;
}

export function NavigationBar({
  activeMenu,
  onMenuChange,
  onAlarmClick,
  onShutdownClick,
  alarmCount,
}: NavigationBarProps) {
  return (
    <div className="bg-gray-200 border-t-4 border-gray-400 shadow-lg">
      <div className="flex items-center justify-center gap-4 p-4">
        <button
          onClick={() => onMenuChange('main')}
          className={`flex flex-col items-center justify-center px-8 py-4 rounded-lg font-bold transition-all ${
            activeMenu === 'main'
              ? 'bg-white text-gray-900 shadow-md scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-white hover:shadow'
          }`}
        >
          <Home size={24} className="mb-1" />
          <span className="text-lg">Main</span>
        </button>

        <button
          onClick={() => onMenuChange('maintenance')}
          className={`flex flex-col items-center justify-center px-6 py-4 rounded-lg font-semibold transition-all ${
            activeMenu === 'maintenance'
              ? 'bg-white text-gray-900 shadow-md scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-white hover:shadow'
          }`}
        >
          <Wrench size={24} className="mb-1" />
          <span className="text-sm">Maintenance</span>
        </button>

        <button
          onClick={() => onMenuChange('information')}
          className={`flex flex-col items-center justify-center px-6 py-4 rounded-lg font-semibold transition-all ${
            activeMenu === 'information'
              ? 'bg-white text-gray-900 shadow-md scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-white hover:shadow'
          }`}
        >
          <Info size={24} className="mb-1" />
          <span className="text-sm">Information</span>
        </button>

        <button
          onClick={onAlarmClick}
          className="relative flex flex-col items-center justify-center px-6 py-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-white hover:shadow transition-all"
        >
          <Bell size={24} className="mb-1" />
          <span className="text-sm">Alarm</span>
          {alarmCount > 0 && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {alarmCount}
            </span>
          )}
        </button>

        <button
          onClick={onShutdownClick}
          className="flex flex-col items-center justify-center px-6 py-4 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 hover:shadow transition-all"
        >
          <Power size={24} className="mb-1" />
          <span className="text-sm">Shutdown</span>
        </button>
      </div>
    </div>
  );
}
