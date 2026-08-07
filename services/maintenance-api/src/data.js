'use strict';

// Maintenance schedules and service tickets keyed by the same device ids
// exposed by devices-api (poc-0001..poc-0008).
const schedules = [
  {
    deviceId: 'poc-0001',
    nextFilterReplacement: '2026-09-01',
    nextSieveBedService: '2027-01-15',
    lastServicedAt: '2026-03-01',
    intervalDays: 180,
  },
  {
    deviceId: 'poc-0002',
    nextFilterReplacement: '2026-10-12',
    nextSieveBedService: '2027-04-02',
    lastServicedAt: '2026-04-12',
    intervalDays: 180,
  },
  {
    deviceId: 'poc-0003',
    nextFilterReplacement: '2026-08-10',
    nextSieveBedService: '2026-08-25',
    lastServicedAt: '2026-02-10',
    intervalDays: 180,
  },
  {
    deviceId: 'poc-0004',
    nextFilterReplacement: '2026-11-05',
    nextSieveBedService: '2027-05-05',
    lastServicedAt: '2026-05-05',
    intervalDays: 180,
  },
  {
    deviceId: 'poc-0005',
    nextFilterReplacement: '2026-08-15',
    nextSieveBedService: '2026-09-20',
    lastServicedAt: '2026-02-15',
    intervalDays: 180,
  },
  {
    deviceId: 'poc-0006',
    nextFilterReplacement: '2026-12-01',
    nextSieveBedService: '2027-06-01',
    lastServicedAt: '2026-06-01',
    intervalDays: 180,
  },
  {
    deviceId: 'poc-0007',
    nextFilterReplacement: '2025-09-01',
    nextSieveBedService: '2025-12-01',
    lastServicedAt: '2025-03-01',
    intervalDays: 180,
  },
  {
    deviceId: 'poc-0008',
    nextFilterReplacement: '2026-08-20',
    nextSieveBedService: '2026-10-30',
    lastServicedAt: '2026-02-20',
    intervalDays: 180,
  },
];

const tickets = [
  {
    id: 'tkt-1001',
    deviceId: 'poc-0003',
    type: 'filter',
    priority: 'medium',
    status: 'open',
    openedAt: '2026-07-28',
    assignee: 'tech-mreyes',
  },
  {
    id: 'tkt-1002',
    deviceId: 'poc-0003',
    type: 'sieve-bed',
    priority: 'high',
    status: 'in-progress',
    openedAt: '2026-07-30',
    assignee: 'tech-jchen',
  },
  {
    id: 'tkt-1003',
    deviceId: 'poc-0005',
    type: 'battery',
    priority: 'high',
    status: 'open',
    openedAt: '2026-08-01',
    assignee: 'tech-mreyes',
  },
  {
    id: 'tkt-1004',
    deviceId: 'poc-0005',
    type: 'filter',
    priority: 'medium',
    status: 'open',
    openedAt: '2026-08-02',
    assignee: 'tech-adubois',
  },
  {
    id: 'tkt-1005',
    deviceId: 'poc-0008',
    type: 'inspection',
    priority: 'low',
    status: 'open',
    openedAt: '2026-08-03',
    assignee: 'tech-jchen',
  },
  {
    id: 'tkt-1006',
    deviceId: 'poc-0001',
    type: 'inspection',
    priority: 'low',
    status: 'closed',
    openedAt: '2026-06-15',
    assignee: 'tech-adubois',
  },
  {
    id: 'tkt-1007',
    deviceId: 'poc-0007',
    type: 'battery',
    priority: 'high',
    status: 'closed',
    openedAt: '2025-08-10',
    assignee: 'tech-mreyes',
  },
];

module.exports = { schedules, tickets };
