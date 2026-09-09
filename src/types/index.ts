export type OrigamiAvatar = 'fox' | 'crane' | 'rabbit' | 'tiger' | 'panda' | 'elephant';

export type StudentStatus = 'waiting' | 'arrived' | 'boarded' | 'dropped_off' | 'absent';

export type SessionType = 'morning' | 'afternoon';

export type CompanionGuide = 'kip' | 'rex';

export type StudentLoungeMode = 'junior' | 'senior';

export type MiniGameId =
  | 'paper_bus_runner'
  | 'route_fold_puzzle'
  | 'transit_drift'
  | 'transit_trivia';

export type SubscriptionTier = 'single_leg' | 'return_trip' | 'sibling_bundle';

export type InvoiceStatus = 'unpaid' | 'paid' | 'overdue';

export interface Student {
  id: string;
  name: string;
  initials: string;
  grade: string; // e.g., "Tahun 4 Amanah", "Tingkatan 2 Teratai"
  ageGroup: 'junior' | 'senior';
  schoolId: string;
  schoolName: string;
  busId: string;
  routeId: string;
  session: SessionType;
  pickupStopId: string;
  pickupStopName: string;
  pickupTime: string;
  dropoffStopId: string;
  dropoffStopName: string;
  dropoffTime: string;
  status: StudentStatus;
  statusNotes?: string;
  guardianName: string;
  guardianPhone: string;
  emergencyContact: string;
  address: string;
  avatar: OrigamiAvatar;
  qrCode: string;
  subscriptionTier: SubscriptionTier;
  monthlyFee: number; // in MYR
  registeredAt: string;
  bufferSeconds?: number;
  afternoonFlag?: 'normal' | 'grandma' | 'self_pickup';
}

export interface School {
  id: string;
  name: string;
  code: string;
  type: 'primary' | 'secondary' | 'tamil';
  lat: number;
  lng: number;
  address: string;
  morningStart: string;
  morningDismiss: string;
  afternoonStart: string;
  afternoonDismiss: string;
}

export interface BusStop {
  id: string;
  name: string;
  landmark: string;
  lat: number;
  lng: number;
  sequence: number;
  scheduledTime: string;
  etaMinutes?: number;
  studentIds: string[];
  type: 'pickup' | 'dropoff' | 'school';
  isCompleted: boolean;
  schoolId?: string;
  waitBufferSeconds?: number;
}

export interface RouteData {
  id: string;
  name: string;
  code: string;
  description: string;
  color: string;
  startLocation: string;
  endLocation: string;
  distanceKm: number;
  durationMinutes: number;
  waypoints: [number, number][]; // [lng, lat] for MapLibre / GeoJSON
  stops: BusStop[];
}

export interface BusVehicle {
  id: string;
  name: string;
  plateNumber: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  enrolledCount: number;
  status: 'idle' | 'in_transit' | 'boarding' | 'completed';
  currentLat: number;
  currentLng: number;
  heading: number; // in degrees 0-360
  speedKmH: number;
  currentStopIndex: number;
  nextStopETA: string;
  isEngineOn: boolean;
  activeRouteId: string;
}

export interface CircularNotice {
  id: string;
  title: string;
  date: string;
  category: 'urgent' | 'reminder' | 'weather' | 'holiday';
  message: string;
  author: string;
  stickyColor: 'yellow' | 'teal' | 'terracotta' | 'slate';
}

export interface QuickStatusUpdate {
  id: string;
  studentId: string;
  studentName: string;
  action: 'absent' | 'late' | 'grandma' | 'self_pickup' | 'custom';
  note: string;
  timestamp: string;
  source: 'parent' | 'driver' | 'admin';
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  guardianName: string;
  guardianPhone: string;
  tier: SubscriptionTier;
  amount: number;
  period: string; // e.g. "Mac 2026"
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  paidAt?: string;
  fpxTransactionId?: string;
  bankName?: string;
}

export interface PaymentTransaction {
  id: string;
  invoiceId: string;
  fpxRef: string;
  bankName: string;
  amount: number;
  studentName: string;
  timestamp: string;
  receiptNumber: string;
}

export type UserRole = 'parent' | 'student' | 'driver' | 'admin' | 'billing';

