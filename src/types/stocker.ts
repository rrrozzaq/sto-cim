export interface Rack {
  column: number;
  row: number;
  deepShelf: string | null;
  frontShelf: string | null;
}

export interface CraneStatus {
  position: number;
  isOnline: boolean;
  isMoving: boolean;
  currentCarrier: string | null;
}

export interface MovementLog {
  id: string;
  carrierId: string;
  fromColumn: number;
  fromRow: number;
  toColumn: number;
  toRow: number;
  timestamp: Date;
  status: 'completed' | 'failed';
}

export interface Alarm {
  id: string;
  alarmType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  isActive: boolean;
  createdAt: Date;
}

export type MenuItem = 'main' | 'maintenance' | 'information';
