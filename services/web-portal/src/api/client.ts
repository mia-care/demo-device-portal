// Typed client for the BFF. Base URL comes from a runtime-injected global so
// the same static bundle works across environments; defaults to "/api" which
// nginx proxies to the BFF.
declare global {
  interface Window {
    __ENV__?: { BFF_BASE_URL?: string };
  }
}

const BASE_URL = window.__ENV__?.BFF_BASE_URL || '/api';

export type DeviceStatus = 'in-service' | 'maintenance-due' | 'decommissioned';

export interface Schedule {
  deviceId: string;
  nextFilterReplacement: string;
  nextSieveBedService: string;
  lastServicedAt: string;
  intervalDays: number;
}

export interface Ticket {
  id: string;
  deviceId: string;
  type: 'filter' | 'sieve-bed' | 'battery' | 'inspection';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'closed';
  openedAt: string;
  assignee: string;
}

export interface Device {
  id: string;
  serial: string;
  model: string;
  firmware: string;
  status: DeviceStatus;
  patientRef: string;
  region: string;
  purchaseDate: string;
  batteryHealthPct: number;
  sieveBedHours: number;
}

export interface FleetDevice extends Device {
  schedule: Schedule | null;
  openTicketCount: number;
}

export interface DeviceDetail extends Device {
  schedule: Schedule | null;
  tickets: Ticket[];
}

export interface Summary {
  totalDevices: number;
  maintenanceDue: number;
  openTickets: number;
  avgBatteryHealthPct: number;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export const api = {
  summary: () => get<Summary>('/summary'),
  fleet: () => get<FleetDevice[]>('/fleet'),
  device: (id: string) => get<DeviceDetail>(`/devices/${encodeURIComponent(id)}`),
  tickets: () => get<Ticket[]>('/tickets'),
};
