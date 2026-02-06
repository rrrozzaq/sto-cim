import { useState, useEffect } from "react";
import { User } from "lucide-react";
import {
  MenuItem,
  Rack,
  CraneStatus,
  MovementLog,
  Alarm,
  Carrier,
} from "./types/stocker";

// Import komponen (tanpa ekstensi .tsx untuk kompatibilitas)
import { LoginModal } from "./components/LoginModal.tsx";
import { MainScreen } from "./components/MainScreen.tsx";
import { MaintenanceScreen } from "./components/MaintenanceScreen.tsx";
import { InformationScreen } from "./components/InformationScreen.tsx";
import { AlarmModal } from "./components/AlarmModal.tsx";
import { ShutdownModal } from "./components/ShutdownModal.tsx";
import { NavigationBar } from "./components/NavigationBar.tsx";
import { MoveConfirmModal } from "./components/MoveConfirmModal.tsx";
import { CarrierDetailModal } from "./components/CarrierDetailModal.tsx";

type AnimationStage =
  | "idle"
  | "moving-to-source"
  | "picking-up"
  | "lifting"
  | "moving-to-dest"
  | "lowering"
  | "placing"
  | "carrier-moving-with-arm";

interface PendingMove {
  fromCol: number;
  fromRow: number;
  fromShelf: "deep" | "front";
  toCol: number;
  toRow: number;
  carrierId: string;
}

// Fungsi helper sleep
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function App() {
  // --- STATE MANAGEMENT ---
  const [activeMenu, setActiveMenu] = useState<MenuItem>("main");
  
  // Modal States
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  const [isShutdownOpen, setIsShutdownOpen] = useState(false);
  const [isMoveConfirmOpen, setIsMoveConfirmOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false); // Modal Detail Carrier

  // Auth & System States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Data States
  const [racks, setRacks] = useState<Rack[]>([]);
  const [movementLogs, setMovementLogs] = useState<MovementLog[]>([]);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  
  // Crane States
  const [craneStatus, setCraneStatus] = useState<CraneStatus>({
    position: 0,
    isOnline: true,
    isMoving: false,
    currentCarrier: null,
  });
  const [animationStage, setAnimationStage] = useState<AnimationStage>("idle");
  const [carrierColor, setCarrierColor] = useState<"blue" | "red" | null>(null);
  const [targetRow, setTargetRow] = useState<number | null>(null);
  const [isCarryingOnArm, setIsCarryingOnArm] = useState(false);

  // Drag & Drop Data
  const [pendingMove, setPendingMove] = useState<PendingMove | null>(null);
  const [dragOverCell, setDragOverCell] = useState<{ column: number; row: number; } | null>(null);
  
  // State untuk Carrier yang sedang diklik detailnya
  const [selectedCarrierData, setSelectedCarrierData] = useState<{
    carrier: Carrier;
    pos: { col: number; row: number; shelf: "deep" | "front" };
  } | null>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    const initialRacks: Rack[] = [];
    for (let row = 1; row <= 8; row++) {
      for (let col = 1; col <= 7; col++) {
        const rack: Rack = { 
          column: col, 
          row: row, 
          deepShelf: null, 
          frontShelf: null 
        };

        // Generate Dummy Data (Objek Carrier)
        if (Math.random() > 0.4) {
          rack.deepShelf = {
            id: `C${col}R${row}-D`,
            entryTime: new Date(Date.now() - Math.random() * 100000000),
            isProhibited: false,
          };
          if (Math.random() > 0.5) {
            rack.frontShelf = {
              id: `C${col}R${row}-F`,
              entryTime: new Date(Date.now() - Math.random() * 50000000),
              isProhibited: false,
            };
          }
        }
        initialRacks.push(rack);
      }
    }
    setRacks(initialRacks);
    
    // Dummy Logs & Alarms
    setMovementLogs([{
        id: "1", carrierId: "C3R5-D", fromColumn: 3, fromRow: 5, toColumn: 1, toRow: 3,
        timestamp: new Date(Date.now() - 3600000), status: "completed",
    }]);
    setAlarms([{
        id: "1", alarmType: "Sensor Fault", severity: "medium",
        message: "Position sensor at Column 3 showing intermittent readings",
        isActive: true, createdAt: new Date(Date.now() - 1800000),
    }]);
  }, []);

  // --- HANDLERS: AUTH & SYSTEM ---
  const handleLogin = (username: string, password: string) => {
    if (username === "admin" && password === "admin") {
      setIsAuthenticated(true);
      setIsLoginOpen(false);
      alert("Login successful!");
    } else {
      alert("Invalid credentials. Use admin/admin for demo.");
    }
  };

  const handleToggleCrane = () => {
    if (!isAuthenticated) { alert("Please login as administrator"); setIsLoginOpen(true); return; }
    setCraneStatus((prev) => ({ ...prev, isOnline: !prev.isOnline }));
  };

  const handleResetAlarms = () => {
    if (!isAuthenticated) { alert("Please login as administrator"); setIsLoginOpen(true); return; }
    setAlarms((prev) => prev.map((alarm) => ({ ...alarm, isActive: false })));
    alert("All alarms have been reset");
  };

  const handleShutdown = () => {
    alert("Stocker CIM system shutting down...");
    window.close();
  };

  // --- HANDLERS: CARRIER DETAILS ---
  // Update Signature: carrier bisa null
  const handleCarrierClick = (carrier: Carrier | null, col: number, row: number, shelf: 'deep' | 'front') => {
    // Jika slot kosong (null), buat objek placeholder sementara
    const targetCarrier = carrier || {
      id: "MAINTENANCE", // ID khusus untuk slot kosong yg diprohibit
      entryTime: new Date(),
      isProhibited: false, // Default false saat dibuka
      prohibitedBy: null,
      prohibitReason: ""
    };
    
    setSelectedCarrierData({ carrier: targetCarrier, pos: { col, row, shelf } });
    setDetailModalOpen(true);
  };

  const handleCarrierSave = (updatedCarrier: Carrier) => {
    if (!selectedCarrierData) return;
    const { col, row, shelf } = selectedCarrierData.pos;
    
    setRacks(prev => prev.map(r => {
      if (r.column === col && r.row === row) {
        const shelfKey = shelf === 'deep' ? 'deepShelf' : 'frontShelf';
        
        let newValue: Carrier | null = updatedCarrier;

        // LOGIKA PENYIMPANAN:
        // 1. Jika ID adalah "MAINTENANCE" (berasal dari slot kosong) DAN user tidak mem-prohibit -> Kembalikan ke NULL (Kosong)
        // 2. Jika ID adalah "MAINTENANCE" DAN user mem-prohibit -> Simpan objek tersebut (Slot jadi terisi blocker)
        if (updatedCarrier.id === "MAINTENANCE" && !updatedCarrier.isProhibited) {
          newValue = null;
        }

        return {
          ...r,
          [shelfKey]: newValue
        };
      }
      return r;
    }));
  };

  // --- HANDLERS: DRAG & DROP (Fix N/A Issue & Revisi Poin 3) ---
  const handleDragStart = (
    e: React.DragEvent, 
    column: number, 
    row: number, 
    shelf: "deep" | "front"
  ) => {
    if (isAnimating) { e.preventDefault(); return; }
    if (!craneStatus.isOnline) { 
      alert("Crane is offline. Please turn it on in the Maintenance menu."); 
      e.preventDefault(); 
      return; 
    }

    const sourceRack = racks.find(r => r.column === column && r.row === row);
    
    // REVISI POIN 3: Blokir pindah Deep jika Front ada isinya
    if (shelf === 'deep' && sourceRack?.frontShelf !== null) {
      e.preventDefault();
      alert("Cannot move Deep Shelf (1) while Front Shelf (2) is occupied. Please move the Front carrier first.");
      return;
    }

    // Cek Prohibited
    const carrier = shelf === 'deep' ? sourceRack?.deepShelf : sourceRack?.frontShelf;
    if (carrier?.isProhibited) {
      e.preventDefault();
      alert(`Carrier ${carrier.id} is PROHIBITED by ${carrier.prohibitedBy}. Reason: ${carrier.prohibitReason}`);
      return;
    }

    // Gunakan DataTransfer (Fix ID N/A)
    const dragData = JSON.stringify({ column, row, shelf, carrierId: carrier?.id });
    e.dataTransfer.setData("application/json", dragData);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, toCol: number, toRow: number) => {
    e.preventDefault();
    const dragDataString = e.dataTransfer.getData("application/json");
    if (!dragDataString) return;

    const { column: fromCol, row: fromRow, shelf: fromShelf, carrierId } = JSON.parse(dragDataString);

    // Cek rak tujuan
    const destRack = racks.find((r) => r.column === toCol && r.row === toRow);
    // Jika penuh, batalkan
    if (!destRack || (destRack.deepShelf && destRack.frontShelf)) {
      setDragOverCell(null);
      return;
    }

    setPendingMove({ 
      fromCol, 
      fromRow, 
      fromShelf, 
      toCol, 
      toRow,
      carrierId 
    });
    setIsMoveConfirmOpen(true);
    setDragOverCell(null);
  };

  const handleConfirmMove = () => {
    if (!pendingMove) return;
    executeCarrierMovement(
      pendingMove.fromCol,
      pendingMove.fromRow,
      pendingMove.fromShelf,
      pendingMove.toCol,
      pendingMove.toRow
    );
    setIsMoveConfirmOpen(false);
    setPendingMove(null);
  };

  // --- CORE LOGIC: ANIMASI PERPINDAHAN ---
  const executeCarrierMovement = async (fromCol: number, fromRow: number, fromShelf: 'deep' | 'front', toCol: number, toRow: number) => {
    setIsAnimating(true);
    
    // Ambil Data Carrier Asli (Objek)
    const sourceRack = racks.find(r => r.column === fromCol && r.row === fromRow);
    const carrierObj = fromShelf === 'deep' ? sourceRack?.deepShelf : sourceRack?.frontShelf;
    
    if (!carrierObj) { setIsAnimating(false); return; }
    
    // Tentukan warna visual untuk animasi crane (Merah jika rak sumber penuh dua-duanya, Biru jika satu)
    const color = (sourceRack?.deepShelf && sourceRack?.frontShelf) ? 'red' : 'blue';

    // TAHAP 1: Menuju Rak Sumber
    setCarrierColor(null);
    setIsCarryingOnArm(false);
    setTargetRow(fromRow);
    setAnimationStage('moving-to-source');
    setCraneStatus(prev => ({ ...prev, isMoving: true, position: fromCol }));
    await sleep(2500);

    // TAHAP 2: Mengambil Carrier (Lengan turun)
    setAnimationStage('picking-up');
    await sleep(800);

    // TAHAP 3: Carrier di Lengan (muncul dan naik)
    setAnimationStage('carrier-moving-with-arm');
    setIsCarryingOnArm(true);
    setCarrierColor(color);
    
    // Update Rack: Hapus carrier dari sumber
    setRacks(prevRacks =>
      prevRacks.map(r => {
        if (r.column === fromCol && r.row === fromRow) {
          return { ...r, [fromShelf === 'deep' ? 'deepShelf' : 'frontShelf']: null };
        }
        return r;
      })
    );
    await sleep(800);

    // TAHAP 4: Carrier Masuk Crane & Bergerak
    setIsCarryingOnArm(false); // Pindah ke badan crane
    await sleep(500);
    
    setTargetRow(toRow);
    setAnimationStage('moving-to-dest');
    setCraneStatus(prev => ({ ...prev, position: toCol }));
    await sleep(2500);

    // TAHAP 5: Meletakkan Carrier
    await sleep(500);
    setAnimationStage('lowering');
    setIsCarryingOnArm(true); // Pindah ke lengan lagi
    await sleep(800);

    // TAHAP 6: Carrier Diletakkan ke Rak
    setCarrierColor(null);
    setIsCarryingOnArm(false);
    
    // Update Rack: Masukkan carrier ke tujuan
    setRacks(prevRacks =>
      prevRacks.map(r => {
        if (r.column === toCol && r.row === toRow) {
          // Logika Smart Placement: Isi deep dulu jika kosong
          const targetShelf = r.deepShelf === null ? 'deepShelf' : 'frontShelf';
          return { ...r, [targetShelf]: carrierObj }; // Memindahkan OBJEK carrier
        }
        return r;
      })
    );
    setAnimationStage('placing');
    await sleep(800);

    // TAHAP 7: Selesai & Kembali ke Parkir
    const newLog: MovementLog = {
      id: Date.now().toString(),
      carrierId: carrierObj.id,
      fromColumn: fromCol,
      fromRow: fromRow,
      toColumn: toCol,
      toRow: toRow,
      timestamp: new Date(),
      status: 'completed'
    };
    setMovementLogs(prev => [newLog, ...prev]);
    
    setAnimationStage('idle');
    setTargetRow(null);
    setCraneStatus(prev => ({ ...prev, isMoving: false }));
    
    await sleep(1000); // Jeda sebelum pulang
    
    // Pulang ke posisi 0
    setCraneStatus(prev => ({ ...prev, isMoving: true, position: 0 }));
    await sleep(2500);
    setCraneStatus(prev => ({ ...prev, isMoving: false, position: 0 }));
    
    setIsAnimating(false);
  };

  const getMoveDetailsForModal = () => {
    if (!pendingMove) return null;
    return {
      carrierId: pendingMove.carrierId,
      from: `Col ${pendingMove.fromCol}, Row ${pendingMove.fromRow}`,
      to: `Col ${pendingMove.toCol}, Row ${pendingMove.toRow}`,
    };
  };

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

      {activeMenu === "main" && (
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
          isCarryingOnArm={isCarryingOnArm}
          onCarrierClick={handleCarrierClick} // Prop baru untuk klik detail
        />
      )}
      {activeMenu === "maintenance" && (
        <MaintenanceScreen
          craneStatus={craneStatus}
          onToggleCrane={handleToggleCrane}
          onResetAlarms={handleResetAlarms}
        />
      )}
      {activeMenu === "information" && (
        <InformationScreen logs={movementLogs} />
      )}

      <NavigationBar
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        onAlarmClick={() => setIsAlarmOpen(true)}
        onShutdownClick={() => setIsShutdownOpen(true)}
        alarmCount={alarms.filter((a) => a.isActive).length}
        // Dummy props untuk kompabilitas interface NavigationBar Anda
        onUndo={() => {}} 
        canUndo={false}
      />

      {/* Modals */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleLogin} />
      <AlarmModal isOpen={isAlarmOpen} onClose={() => setIsAlarmOpen(false)} alarms={alarms} />
      <ShutdownModal isOpen={isShutdownOpen} onClose={() => setIsShutdownOpen(false)} onConfirm={handleShutdown} />
      
      <MoveConfirmModal
        isOpen={isMoveConfirmOpen}
        onClose={() => setIsMoveConfirmOpen(false)}
        onConfirm={handleConfirmMove}
        moveDetails={getMoveDetailsForModal()}
      />

      {/* Komponen Modal Baru */}
      <CarrierDetailModal 
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        carrier={selectedCarrierData?.carrier || null}
        rackPosition={selectedCarrierData?.pos || null}
        onSave={handleCarrierSave}
      />
    </div>
  );
}

export default App;