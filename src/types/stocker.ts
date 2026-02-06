export type MenuItem = 'main' | 'maintenance' | 'information';

export interface Carrier {
  id: string;
  entryTime: Date;
  isProhibited: boolean;
  prohibitedBy?: 'admin' | 'worker' | 'system' | null;
  prohibitReason?: string;
}

export interface Rack {
  column: number;
  row: number;
  deepShelf: Carrier | null;
  frontShelf: Carrier | null;
}

export interface CraneStatus {
  position: number;
  isOnline: boolean;
  isMoving: boolean;
  currentCarrier: Carrier | null;
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