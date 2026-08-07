import type { DeviceStatus } from '../api/client';

const LABELS: Record<DeviceStatus, string> = {
  'in-service': 'In service',
  'maintenance-due': 'Maintenance due',
  decommissioned: 'Decommissioned',
};

export default function StatusBadge({ status }: { status: DeviceStatus }) {
  return <span className={`badge ${status}`}>{LABELS[status]}</span>;
}
