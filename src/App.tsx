import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { MenuItem, Rack, CraneStatus, MovementLog, Alarm } from './types/stocker';
import { LoginModal } from './components/LoginModal.tsx';
import { MainScreen } from './components/MainScreen.tsx';
import { MaintenanceScreen } from './components/MaintenanceScreen.tsx';
import { InformationScreen } from './components/InformationScreen.tsx';
import { AlarmModal } from './components/AlarmModal.tsx';
import { ShutdownModal } from './components/ShutdownModal.tsx';
import { NavigationBar } from './components/NavigationBar.tsx';

type AnimationStage = 'idle' | 'moving-to-source' | 'picking-up' | 'lifting' | 'moving-to-dest' | 'lowering' | 'placing';

interface UndoState {
  racks: Rack[];
  cranePosition: number;
  movementLogs: MovementLog[];
}

function App() {
  const [activeMenu, setActiveMenu] = useState<MenuItem>('main');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  const [isShutdownOpen, setIsShutdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [racks, setRacks] = useState<Rack[]>([]);
  const [craneStatus, setCraneStatus] = useState<CraneStatus>({
    position: 1,
    isOnline: true,
    isMoving: false,
    currentCarrier: null,
  });
  const [movementLogs, setMovementLogs] = useState<MovementLog[]>([]);
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  const [draggedCarrier, setDraggedCarrier] = useState<{ column: number; row: number; shelf: 'deep' | 'front' } | null>(null);
  const [dragOverCell, setDragOverCell] = useState<{ column: number; row: number } | null>(null);
  const [animationStage, setAnimationStage] = useState<AnimationStage>('idle');
  const [carrierColor, setCarrierColor] = useState<'blue' | 'red' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [targetRow, setTargetRow] = useState<number | null>(null);
  const [undoState, setUndoState] = useState<UndoState | null>(null);

  useEffect(() => {
    const initialRacks: Rack[] = [];
    for (let row = 1; row <= 8; row++) {
      for (let col = 1; col <= 7; col++) {
        const rack: Rack = {
          column: col,
          row: row,
          deepShelf: null,
          frontShelf: null,
        };

        if (Math.random() > 0.4) {
          rack.deepShelf = `C${col}R${row}-D`;
          if (Math.random() > 0.5) {
            rack.frontShelf = `C${col}R${row}-F`;
          }
        }

        initialRacks.push(rack);
      }
    }
    setRacks(initialRacks);

    const sampleLogs: MovementLog[] = [
      {
        id: '1',
        carrierId: 'C3R5-D',
        fromColumn: 3,
        fromRow: 5,
        toColumn: 1,
        toRow: 3,
        timestamp: new Date(Date.now() - 3600000),
        status: 'completed',
      },
      {
        id: '2',
        carrierId: 'C7R2-F',
        fromColumn: 7,
        fromRow: 2,
        toColumn: 4,
        toRow: 4,
        timestamp: new Date(Date.now() - 7200000),
        status: 'completed',
      },
      {
        id: '3',
        carrierId: 'C2R8-D',
        fromColumn: 2,
        fromRow: 8,
        toColumn: 6,
        toRow: 1,
        timestamp: new Date(Date.now() - 10800000),
        status: 'failed',
      },
    ];
    setMovementLogs(sampleLogs);

    const sampleAlarms: Alarm[] = [
      {
        id: '1',
        alarmType: 'Sensor Fault',
        severity: 'medium',
        message: 'Position sensor at Column 3 showing intermittent readings',
        isActive: true,
        createdAt: new Date(Date.now() - 1800000),
      },
    ];
    setAlarms(sampleAlarms);
  }, []);

  const handleLogin = (username: string, password: string) => {
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      setIsLoginOpen(false);
      alert('Login successful!');
    } else {
      alert('Invalid credentials. Use admin/admin for demo.');
    }
  };

  const handleToggleCrane = () => {
    if (!isAuthenticated) {
      alert('Please login as administrator to perform this action');
      setIsLoginOpen(true);
      return;
    }
    setCraneStatus(prev => ({ ...prev, isOnline: !prev.isOnline }));
  };

  const handleResetAlarms = () => {
    if (!isAuthenticated) {
      alert('Please login as administrator to perform this action');
      setIsLoginOpen(true);
      return;
    }
    setAlarms(prev => prev.map(alarm => ({ ...alarm, isActive: false })));
    alert('All alarms have been reset');
  };

  const handleShutdown = () => {
    alert('Stocker CIM system shutting down...');
    window.close();
  };

  const handleDragStart = (column: number, row: number, shelf: 'deep' | 'front') => {
    if (isAnimating) return;
    if (!craneStatus.isOnline) {
      alert('Crane is offline. Please turn it on in the Maintenance menu.');
      return;
    }
    setDraggedCarrier({ column, row, shelf });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (toCol: number, toRow: number) => {
    if (!draggedCarrier) return;

    const destRack = racks.find(r => r.column === toCol && r.row === toRow);
    if (!destRack) return;

    if (destRack.deepShelf && destRack.frontShelf) {
      setDraggedCarrier(null);
      setDragOverCell(null);
      return;
    }

    executeCarrierMovement(draggedCarrier.column, draggedCarrier.row, draggedCarrier.shelf, toCol, toRow);
    setDraggedCarrier(null);
    setDragOverCell(null);
  };

  const executeCarrierMovement = async (
    fromCol: number,
    fromRow: number,
    fromShelf: 'deep' | 'front',
    toCol: number,
    toRow: number
  ) => {
    setUndoState({
      racks: JSON.parse(JSON.stringify(racks)),
      cranePosition: craneStatus.position,
      movementLogs: [...movementLogs],
    });

    setIsAnimating(true);
    setTargetRow(fromRow);

    const sourceRack = racks.find(r => r.column === fromCol && r.row === fromRow);
    if (!sourceRack) return;

    const carrierId = fromShelf === 'deep' ? sourceRack.deepShelf : sourceRack.frontShelf;
    if (!carrierId) return;

    const hasOnlyDeep = sourceRack.deepShelf && !sourceRack.frontShelf;
    const color: 'blue' | 'red' = hasOnlyDeep ? 'blue' : 'red';
    setCarrierColor(color);

    setAnimationStage('moving-to-source');
    setCraneStatus(prev => ({ ...prev, isMoving: true, position: fromCol }));
    await sleep(2000);

    setAnimationStage('picking-up');
    await sleep(800);

    setRacks(prevRacks =>
      prevRacks.map(r => {
        if (r.column === fromCol && r.row === fromRow) {
          return {
            ...r,
            deepShelf: fromShelf === 'deep' ? null : r.deepShelf,
            frontShelf: fromShelf === 'front' ? null : r.frontShelf,
          };
        }
        return r;
      })
    );

    setAnimationStage('lifting');
    await sleep(800);

    setTargetRow(toRow);
    setAnimationStage('moving-to-dest');
    setCraneStatus(prev => ({ ...prev, position: toCol }));
    await sleep(2000);

    setAnimationStage('lowering');
    await sleep(800);

    setAnimationStage('placing');
    await sleep(800);

    setRacks(prevRacks =>
      prevRacks.map(r => {
        if (r.column === toCol && r.row === toRow) {
          const destHasDeep = r.deepShelf !== null;

          if (fromShelf === 'front') {
            if (!destHasDeep) {
              return { ...r, frontShelf: carrierId };
            } else {
              return { ...r, frontShelf: carrierId };
            }
          } else {
            if (!destHasDeep && !r.frontShelf) {
              return { ...r, deepShelf: carrierId };
            } else if (!destHasDeep && r.frontShelf) {
              return { ...r, deepShelf: carrierId };
            } else {
              return { ...r, frontShelf: carrierId };
            }
          }
        }
        return r;
      })
    );

    const newLog: MovementLog = {
      id: Date.now().toString(),
      carrierId: carrierId,
      fromColumn: fromCol,
      fromRow: fromRow,
      toColumn: toCol,
      toRow: toRow,
      timestamp: new Date(),
      status: 'completed',
    };
    setMovementLogs(prev => [newLog, ...prev]);

    setAnimationStage('idle');
    setCarrierColor(null);
    setTargetRow(null);
    setCraneStatus(prev => ({ ...prev, isMoving: false }));
    setIsAnimating(false);
  };

  const handleUndo = () => {
    if (!undoState) return;

    setRacks(undoState.racks);
    setCraneStatus(prev => ({ ...prev, position: undoState.cranePosition }));
    setMovementLogs(undoState.movementLogs);
    setUndoState(null);
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const activeAlarmCount = alarms.filter(a => a.isActive).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold">Stocker CIM</h1>
            <p className="text-sm text-gray-300">Automated Warehouse Management System</p>
          </div>
          <button
            onClick={() => setIsLoginOpen(true)}
            className="flex flex-col items-center bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors"
          >
            <User size={28} />
            <span className="text-sm font-semibold mt-1">Login</span>
          </button>
        </div>
      </header>

      {activeMenu === 'main' && (
        <MainScreen
          racks={racks}
          craneStatus={craneStatus}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          dragOverCell={dragOverCell}
          animationStage={animationStage}
          carrierColor={carrierColor}
          targetRow={targetRow}
        />
      )}
      {activeMenu === 'maintenance' && (
        <MaintenanceScreen
          craneStatus={craneStatus}
          onToggleCrane={handleToggleCrane}
          onResetAlarms={handleResetAlarms}
        />
      )}
      {activeMenu === 'information' && <InformationScreen logs={movementLogs} />}

      <NavigationBar
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        onAlarmClick={() => setIsAlarmOpen(true)}
        onShutdownClick={() => setIsShutdownOpen(true)}
        onUndo={handleUndo}
        alarmCount={activeAlarmCount}
        canUndo={undoState !== null && !isAnimating}
      />

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleLogin} />
      <AlarmModal isOpen={isAlarmOpen} onClose={() => setIsAlarmOpen(false)} alarms={alarms} />
      <ShutdownModal
        isOpen={isShutdownOpen}
        onClose={() => setIsShutdownOpen(false)}
        onConfirm={handleShutdown}
      />
    </div>
  );
}

export default App;