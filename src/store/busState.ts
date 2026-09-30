'use client';

import { useState, useEffect } from 'react';
import {
  Student,
  BusVehicle,
  RouteData,
  School,
  CircularNotice,
  StudentStatus,
  UserRole,
  QuickStatusUpdate,
  Invoice,
  PaymentTransaction,
  StudentLoungeMode,
  MiniGameId,
} from '@/types';
import { INITIAL_STUDENTS } from '@/data/students';
import { FLEET_BUSES } from '@/data/fleet';
import { ROUTES } from '@/data/routes';
import { SCHOOLS } from '@/data/schools';
import { INITIAL_CIRCULARS } from '@/data/circulars';
import { INITIAL_INVOICES } from '@/data/invoices';
import { sounds } from '@/components/common/SoundEffects';

// Global state container
interface BusStoreState {
  role: UserRole;
  activeStudentId: string;
  activeBusId: string;
  activeRouteId: string;
  students: Student[];
  buses: BusVehicle[];
  routes: RouteData[];
  schools: School[];
  circulars: CircularNotice[];
  invoices: Invoice[];
  transactions: PaymentTransaction[];
  recentUpdates: QuickStatusUpdate[];
  studentLoungeMode: StudentLoungeMode;
  activeMiniGame: MiniGameId | null;
  isSimulating: boolean;
  simulationSpeed: number; // 1 = 40 km/h, 2 = 80 km/h, 5 = 200 km/h
  simulationProgress: number; // 0 to waypoints.length - 1 (floating point)
}

let storeState: BusStoreState = {
  role: 'parent',
  activeStudentId: 'stu-01', // Muhammad Rayyan
  activeBusId: 'bus-01',
  activeRouteId: 'route-tj-01',
  students: INITIAL_STUDENTS,
  buses: FLEET_BUSES,
  routes: ROUTES,
  schools: SCHOOLS,
  circulars: INITIAL_CIRCULARS,
  invoices: INITIAL_INVOICES,
  transactions: [
    {
      id: 'tx-001',
      invoiceId: 'inv-2026-001',
      fpxRef: 'FPX-MY-20260302-8812',
      bankName: 'Maybank2u',
      amount: 140,
      studentName: 'Muhammad Rayyan bin Khairul',
      timestamp: '2026-03-02 09:14 AM',
      receiptNumber: 'BK-RCT-20260302-01',
    },
    {
      id: 'tx-002',
      invoiceId: 'inv-2026-002',
      fpxRef: 'FPX-MY-20260302-8812',
      bankName: 'Maybank2u',
      amount: 140,
      studentName: 'Nur Sofea binti Khairul',
      timestamp: '2026-03-02 09:14 AM',
      receiptNumber: 'BK-RCT-20260302-02',
    },
    {
      id: 'tx-003',
      invoiceId: 'inv-2026-005',
      fpxRef: 'FPX-MY-20260303-4491',
      bankName: 'CIMB Clicks',
      amount: 90,
      studentName: 'Adam Hariz bin Zulkifli',
      timestamp: '2026-03-03 11:20 AM',
      receiptNumber: 'BK-RCT-20260303-05',
    },
  ],
  recentUpdates: [],
  studentLoungeMode: 'junior',
  activeMiniGame: null,
  isSimulating: true,
  simulationSpeed: 1,
  simulationProgress: 2.5, // Start between Saujana and Jalan Ilham
};

const listeners = new Set<() => void>();
let broadcastChannel: BroadcastChannel | null = null;

if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel('baskita_bus_sync');
    broadcastChannel.onmessage = (event) => {
      if (event.data && event.data.type === 'SYNC_STATE') {
        storeState = { ...storeState, ...event.data.payload };
        notifyListeners();
      }
    };
  } catch {
    // Channel not supported or blocked
  }
}

function notifyListeners(syncCrossTab = false) {
  listeners.forEach((listener) => listener());
  if (syncCrossTab && broadcastChannel) {
    try {
      broadcastChannel.postMessage({
        type: 'SYNC_STATE',
        payload: {
          students: storeState.students,
          buses: storeState.buses,
          recentUpdates: storeState.recentUpdates,
          circulars: storeState.circulars,
          invoices: storeState.invoices,
          transactions: storeState.transactions,
          isSimulating: storeState.isSimulating,
          simulationProgress: storeState.simulationProgress,
        },
      });
    } catch {
      // ignore
    }
  }
}

// Calculate bearing/heading between two points [lng, lat]
function calculateBearing(start: [number, number], end: [number, number]): number {
  const startLat = (start[1] * Math.PI) / 180;
  const startLng = (start[0] * Math.PI) / 180;
  const endLat = (end[1] * Math.PI) / 180;
  const endLng = (end[0] * Math.PI) / 180;

  const dLng = endLng - startLng;
  const y = Math.sin(dLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

// Calculate distance in kilometers
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const busActions = {
  setRole(newRole: UserRole) {
    storeState = { ...storeState, role: newRole };
    sounds.playPaperFold();
    notifyListeners();
  },

  setActiveStudent(studentId: string) {
    const student = storeState.students.find((s) => s.id === studentId);
    storeState = {
      ...storeState,
      activeStudentId: studentId,
      studentLoungeMode: student ? student.ageGroup : storeState.studentLoungeMode,
    };
    sounds.playPaperFold();
    notifyListeners();
  },

  setStudentLoungeMode(mode: StudentLoungeMode) {
    storeState = { ...storeState, studentLoungeMode: mode };
    sounds.playPaperFold();
    notifyListeners();
  },

  setActiveMiniGame(gameId: MiniGameId | null) {
    storeState = { ...storeState, activeMiniGame: gameId };
    sounds.playPaperFold();
    notifyListeners();
  },

  setSimulation(isRunning: boolean) {
    storeState = { ...storeState, isSimulating: isRunning };
    notifyListeners(true);
  },

  setSimulationSpeed(speed: number) {
    storeState = { ...storeState, simulationSpeed: speed };
    notifyListeners(true);
  },

  resetRoute() {
    storeState = {
      ...storeState,
      simulationProgress: 0,
      buses: storeState.buses.map((bus) =>
        bus.id === 'bus-01'
          ? {
              ...bus,
              currentStopIndex: 0,
              nextStopETA: 'Departs 06:30 AM',
              status: 'in_transit',
            }
          : bus
      ),
      routes: storeState.routes.map((r) =>
        r.id === 'route-tj-01'
          ? {
              ...r,
              stops: r.stops.map((s, idx) => ({ ...s, isCompleted: idx === 0, waitBufferSeconds: 0 })),
            }
          : r
      ),
    };
    sounds.playPaperFold();
    notifyListeners(true);
  },

  // Update student status (e.g. absent, boarded, arrived)
  updateStudentStatus(studentId: string, newStatus: StudentStatus, note?: string) {
    const student = storeState.students.find((s) => s.id === studentId);
    if (!student) return;

    storeState = {
      ...storeState,
      students: storeState.students.map((s) =>
        s.id === studentId
          ? {
              ...s,
              status: newStatus,
              statusNotes: note || s.statusNotes,
            }
          : s
      ),
      recentUpdates: [
        {
          id: `upd-${Date.now()}`,
          studentId,
          studentName: student.name,
          action: newStatus === 'absent' ? 'absent' : 'custom',
          note: note || `Status bertukar kepada ${newStatus}`,
          timestamp: new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' }),
          source: storeState.role === 'student' ? 'parent' : storeState.role === 'billing' ? 'admin' : storeState.role,
        },
        ...storeState.recentUpdates.slice(0, 9),
      ],
    };

    if (newStatus === 'absent') {
      sounds.playChime('alert');
      sounds.speakAlert(`Makluman kehadiran: ${student.name.split(' ')[1] || student.name} ditanda tidak hadir.`);
    } else if (newStatus === 'boarded') {
      sounds.playChime('success');
      sounds.speakAlert(`${student.name.split(' ')[1] || student.name} telah menaiki bas.`);
    } else {
      sounds.playPaperFold();
    }

    notifyListeners(true);
  },

  // One-Tap "Paper Airplane" Dispatcher from Parent Tracker
  sendParentQuickMessage(
    studentId: string,
    action: 'absent' | 'late' | 'grandma' | 'self_pickup' | 'custom',
    text: string
  ) {
    const student = storeState.students.find((s) => s.id === studentId);
    if (!student) return;

    let newStatus = student.status;
    let bufferSeconds = student.bufferSeconds || 0;
    let afternoonFlag = student.afternoonFlag || 'normal';

    if (action === 'absent') {
      newStatus = 'absent';
    } else if (action === 'late') {
      bufferSeconds = 120; // 2 minutes buffer
    } else if (action === 'grandma') {
      afternoonFlag = 'grandma';
    } else if (action === 'self_pickup') {
      afternoonFlag = 'self_pickup';
    }

    // Also update route stop buffer if late
    let updatedRoutes = storeState.routes;
    if (action === 'late') {
      updatedRoutes = storeState.routes.map((r) => ({
        ...r,
        stops: r.stops.map((s) =>
          s.id === student.pickupStopId
            ? { ...s, waitBufferSeconds: (s.waitBufferSeconds || 0) + 120 }
            : s
        ),
      }));
    }

    storeState = {
      ...storeState,
      routes: updatedRoutes,
      students: storeState.students.map((s) =>
        s.id === studentId
          ? {
              ...s,
              status: newStatus,
              statusNotes: text,
              bufferSeconds,
              afternoonFlag,
            }
          : s
      ),
      recentUpdates: [
        {
          id: `upd-${Date.now()}`,
          studentId,
          studentName: student.name,
          action,
          note: text,
          timestamp: new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' }),
          source: 'parent',
        },
        ...storeState.recentUpdates.slice(0, 9),
      ],
    };

    sounds.playChime('alert');

    // Voice announcement for driver cockpit
    if (action === 'absent') {
      sounds.speakAlert(
        `Perhatian pemandu: ${student.name.split(' ')[1] || student.name} tidak hadir hari ini. Hentian boleh dilangkau.`
      );
    } else if (action === 'late') {
      sounds.speakAlert(
        `Perhatian pemandu: ${student.name.split(' ')[1] || student.name} lewat 2 minit di hentian ${student.pickupStopName.split('(')[0]}.`
      );
    } else if (action === 'grandma') {
      sounds.speakAlert(
        `Makluman: Petang ini ${student.name.split(' ')[1] || student.name} diambil oleh waris atau nenek.`
      );
    } else if (action === 'self_pickup') {
      sounds.speakAlert(
        `Makluman: ${student.name.split(' ')[1] || student.name} pulang sendiri petang ini.`
      );
    }

    notifyListeners(true);
  },

  // Driver action: Add +1 Min wait buffer to stop
  addStopWaitBuffer(stopId: string, seconds: number = 60) {
    const route = storeState.routes.find((r) => r.id === 'route-tj-01');
    if (!route) return;

    storeState = {
      ...storeState,
      routes: storeState.routes.map((r) =>
        r.id === 'route-tj-01'
          ? {
              ...r,
              stops: r.stops.map((s) =>
                s.id === stopId ? { ...s, waitBufferSeconds: (s.waitBufferSeconds || 0) + seconds } : s
              ),
            }
          : r
      ),
    };

    sounds.playChime('alert');
    sounds.speakAlert(`Masa tunggu hentian ditambah ${seconds} saat.`);
    notifyListeners(true);
  },

  // Driver action: Add +1 Min wait buffer to student
  addStudentWaitBuffer(studentId: string, seconds: number = 60) {
    const student = storeState.students.find((s) => s.id === studentId);
    if (!student) return;

    const newBuffer = (student.bufferSeconds || 0) + seconds;

    // Also update stop buffer
    const updatedRoutes = storeState.routes.map((r) => ({
      ...r,
      stops: r.stops.map((s) =>
        s.id === student.pickupStopId
          ? { ...s, waitBufferSeconds: (s.waitBufferSeconds || 0) + seconds }
          : s
      ),
    }));

    storeState = {
      ...storeState,
      routes: updatedRoutes,
      students: storeState.students.map((s) =>
        s.id === studentId
          ? {
              ...s,
              bufferSeconds: newBuffer,
              statusNotes: `Buffer masa +${newBuffer}s`,
            }
          : s
      ),
    };

    sounds.playChime('alert');
    sounds.speakAlert(`Masa tunggu untuk ${student.name.split(' ')[1] || student.name} ditambah ${seconds} saat.`);
    notifyListeners(true);
  },

  // Driver action: Clear / dismiss student delay buffer & note
  dismissStudentBuffer(studentId: string) {
    const student = storeState.students.find((s) => s.id === studentId);
    if (!student) return;

    storeState = {
      ...storeState,
      students: storeState.students.map((s) =>
        s.id === studentId
          ? {
              ...s,
              bufferSeconds: 0,
              statusNotes: undefined,
            }
          : s
      ),
    };

    sounds.playPaperFold();
    sounds.speakAlert(`Nota buffer untuk ${student.name.split(' ')[1] || student.name} telah diselesaikan.`);
    notifyListeners(true);
  },

  // Driver action on current stop
  driverMarkStopAction(stopId: string, action: 'arrive' | 'complete' | 'skip') {
    const route = storeState.routes.find((r) => r.id === 'route-tj-01');
    if (!route) return;

    const stopIndex = route.stops.findIndex((s) => s.id === stopId);
    if (stopIndex === -1) return;

    const targetStop = route.stops[stopIndex];

    // If completed or skipped, mark stop as completed and board students at this stop
    const updatedStops = route.stops.map((s, idx) =>
      idx <= stopIndex ? { ...s, isCompleted: true } : s
    );

    // Board waiting students at this stop if action is complete
    let updatedStudents = storeState.students;
    if (action === 'complete') {
      updatedStudents = storeState.students.map((st) => {
        if (targetStop.studentIds.includes(st.id) && st.status === 'waiting') {
          return { ...st, status: 'boarded', statusNotes: `Dinaikkan di ${targetStop.name}` };
        }
        return st;
      });
      sounds.playChime('success');
    } else {
      sounds.playPaperFold();
    }

    const nextStop = updatedStops[stopIndex + 1];

    storeState = {
      ...storeState,
      students: updatedStudents,
      routes: storeState.routes.map((r) => (r.id === 'route-tj-01' ? { ...r, stops: updatedStops } : r)),
      buses: storeState.buses.map((b) =>
        b.id === 'bus-01'
          ? {
              ...b,
              currentStopIndex: Math.min(stopIndex + 1, updatedStops.length - 1),
              nextStopETA: nextStop
                ? `${nextStop.scheduledTime} (${nextStop.name.split('(')[0]})`
                : 'Tiba di destinasi',
            }
          : b
      ),
    };

    notifyListeners(true);
  },

  // Add registered student from wizard
  registerNewStudent(newStudent: Omit<Student, 'id' | 'initials' | 'qrCode' | 'registeredAt'>) {
    const initials = newStudent.name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() || '')
      .join('');
    const id = `stu-${Date.now().toString().slice(-4)}`;
    const qrCode = `BASKITA-TJ-2026-${id.toUpperCase()}`;

    const studentRecord: Student = {
      ...newStudent,
      id,
      initials: initials || 'BK',
      qrCode,
      registeredAt: new Date().toISOString().split('T')[0],
    };

    // Also auto-generate first invoice
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNo: `BK-INV-2026-${id.slice(-4)}`,
      studentId: id,
      studentName: newStudent.name,
      guardianName: newStudent.guardianName,
      guardianPhone: newStudent.guardianPhone,
      tier: newStudent.subscriptionTier,
      amount: newStudent.monthlyFee,
      period: 'Mac 2026',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'unpaid',
    };

    storeState = {
      ...storeState,
      students: [studentRecord, ...storeState.students],
      invoices: [newInvoice, ...storeState.invoices],
      activeStudentId: id,
    };

    sounds.playChime('arrival');
    notifyListeners(true);
    return id;
  },

  // Pay invoice via FPX (reconciliation)
  payInvoice(invoiceId: string, bankName: string) {
    const invoice = storeState.invoices.find((inv) => inv.id === invoiceId);
    if (!invoice) return;

    const fpxTransactionId = `FPX-MY-${Date.now().toString().slice(-8)}`;
    const receiptNumber = `BK-RCT-${Date.now().toString().slice(-8)}`;
    const paidAt = new Date().toLocaleString('ms-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const updatedInvoices = storeState.invoices.map((inv) =>
      inv.id === invoiceId
        ? {
            ...inv,
            status: 'paid' as const,
            paidAt,
            fpxTransactionId,
            bankName,
          }
        : inv
    );

    const newTransaction: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      invoiceId,
      fpxRef: fpxTransactionId,
      bankName,
      amount: invoice.amount,
      studentName: invoice.studentName,
      timestamp: paidAt,
      receiptNumber,
    };

    storeState = {
      ...storeState,
      invoices: updatedInvoices,
      transactions: [newTransaction, ...storeState.transactions],
    };

    sounds.playChime('success');
    notifyListeners(true);
    return newTransaction;
  },

  // Simulated 1st of month cron trigger: Generate new monthly subscription invoices
  runMonthlyInvoicingCron() {
    const period = 'April 2026';
    const issueDate = '2026-04-01';
    const dueDate = '2026-04-07';

    const newInvoices: Invoice[] = storeState.students.map((st, idx) => ({
      id: `inv-2026-04-${idx + 1}`,
      invoiceNo: `BK-INV-2026-040${idx + 1}`,
      studentId: st.id,
      studentName: st.name,
      guardianName: st.guardianName,
      guardianPhone: st.guardianPhone,
      tier: st.subscriptionTier,
      amount: st.monthlyFee,
      period,
      issueDate,
      dueDate,
      status: 'unpaid',
    }));

    storeState = {
      ...storeState,
      invoices: [...newInvoices, ...storeState.invoices],
    };

    sounds.playChime('arrival');
    sounds.speakAnnouncement('Sistem cron: Invois langganan bulanan bagi semua murid telah dijana.');
    notifyListeners(true);
  },

  // Add new circular from admin
  postCircular(notice: Omit<CircularNotice, 'id' | 'date'>) {
    const newNotice: CircularNotice = {
      ...notice,
      id: `circ-${Date.now()}`,
      date: 'Baru sebentar tadi',
    };

    storeState = {
      ...storeState,
      circulars: [newNotice, ...storeState.circulars],
    };

    sounds.playChime('alert');
    notifyListeners(true);
  },

  // Telematics tick calculation called by the simulator interval
  tickTelematics(deltaTimeMs: number) {
    if (!storeState.isSimulating) return;

    const route = storeState.routes.find((r) => r.id === 'route-tj-01');
    if (!route || route.waypoints.length < 2) return;

    const waypoints = route.waypoints;
    const speedFactor = storeState.simulationSpeed; // e.g. 1x, 2x, 5x
    // Move progress along waypoints
    const stepIncrement = (deltaTimeMs / 1000) * 0.08 * speedFactor;
    let nextProgress = storeState.simulationProgress + stepIncrement;

    if (nextProgress >= waypoints.length - 1) {
      nextProgress = 0; // Loop back or cycle
    }

    const currentIndex = Math.floor(nextProgress);
    const nextIndex = Math.min(currentIndex + 1, waypoints.length - 1);
    const fraction = nextProgress - currentIndex;

    const p1 = waypoints[currentIndex];
    const p2 = waypoints[nextIndex];

    const currentLng = p1[0] + (p2[0] - p1[0]) * fraction;
    const currentLat = p1[1] + (p2[1] - p1[1]) * fraction;
    const heading = calculateBearing(p1, p2);

    // Find nearest stop and calculate distance & ETA
    let closestStopIndex = 0;
    let minDistance = 999;
    route.stops.forEach((stop, index) => {
      const d = getDistanceKm(currentLat, currentLng, stop.lat, stop.lng);
      if (d < minDistance) {
        minDistance = d;
        closestStopIndex = index;
      }
    });

    // Mark previous stops as completed
    const updatedStops = route.stops.map((stop, idx) => ({
      ...stop,
      isCompleted: idx < closestStopIndex,
    }));

    const nextStop = route.stops[closestStopIndex];
    const distToNext = nextStop ? getDistanceKm(currentLat, currentLng, nextStop.lat, nextStop.lng) : 0;
    const buffer = nextStop?.waitBufferSeconds ? Math.ceil(nextStop.waitBufferSeconds / 60) : 0;
    const etaMinutes = Math.max(1, Math.round((distToNext / 35) * 60) + buffer);

    const updatedBuses = storeState.buses.map((bus) => {
      if (bus.id === 'bus-01') {
        return {
          ...bus,
          currentLat,
          currentLng,
          heading,
          speedKmH: Math.round(35 + Math.sin(nextProgress * 3) * 6),
          currentStopIndex: closestStopIndex,
          nextStopETA: distToNext < 0.15 ? 'Sedang menghampiri' : `${etaMinutes} minit`,
        };
      }
      return bus;
    });

    storeState = {
      ...storeState,
      simulationProgress: nextProgress,
      buses: updatedBuses,
      routes: storeState.routes.map((r) => (r.id === 'route-tj-01' ? { ...r, stops: updatedStops } : r)),
    };

    notifyListeners();
  },
};

// React hook to access state
export function useBusStore() {
  const [state, setState] = useState<BusStoreState>(storeState);

  useEffect(() => {
    const listener = () => setState({ ...storeState });
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    ...state,
    actions: busActions,
  };
}
