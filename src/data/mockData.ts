export type Role = 'mapping' | 'autonomy' | 'safety' | 'fleet_ops' | 'admin';

export const ROLE_LABELS: Record<Role, string> = {
  mapping: 'Mapping On-call',
  autonomy: 'Autonomy Engineer',
  safety: 'Safety Engineer',
  fleet_ops: 'Fleet Ops Manager',
  admin: 'Admin',
};

export type PatchStage = 'Candidate' | 'Shadow' | 'Silent' | 'Active' | 'Rolled Back' | 'Expired';
export type PatchType = 'Lane Geometry' | 'Turn Restriction' | 'Speed Advisory';
export type ClusterStatus = 'New' | 'In Review' | 'Ready for Promotion' | 'Blocked';

export interface Zone {
  id: number;
  name: string;
  mismatchVolume: number;
  activePatchCount: number;
  currentTTM: number;
  lastRollbackDate: string;
}

export interface MismatchCluster {
  id: string;
  zone: number;
  lat: number;
  lng: number;
  locationLabel: string;
  patchType: PatchType;
  confidence: number;
  evidenceVehicles: number;
  evidencePasses: number;
  timeSpreadDays: number;
  suggestedStage: PatchStage;
  lastSeen: string;
  status: ClusterStatus;
  needsReview: boolean;
}

export interface EvidenceItem {
  vehicleId: string;
  timestamp: string;
  passId: string;
  sensorAgreement: number;
  residualMagnitude: number;
}

export interface AuditEvent {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  reason: string;
  artifactHash?: string;
}

export interface Patch {
  id: string;
  clusterId: string;
  type: PatchType;
  zone: number;
  locationLabel: string;
  lat: number;
  lng: number;
  geoFenceRadius: number;
  stage: PatchStage;
  ttlDays: number;
  expirationDate: string;
  confidence: number;
  confidenceFactors: {
    sensorAgreement: number;
    routeDiversity: number;
    timeDiversity: number;
    recency: number;
    localizationResidualTrend: number;
  };
  evidenceVehicles: number;
  evidencePasses: number;
  timeSpreadDays: number;
  sensorAgreementPct: number;
  evidenceItems: EvidenceItem[];
  auditLog: AuditEvent[];
  safetyGates: {
    patchTypeAllowlist: boolean;
    deltaMagnitudeInBounds: boolean;
    evidenceThresholdsMet: boolean;
    timeDiversityMet: boolean;
    sensorAgreementMet: boolean;
    rollbackTriggersConfigured: boolean;
  };
  geometryDelta: string;
  distributionPct: number;
  distributedAt?: string;
  successRate?: number;
  createdAt: string;
}

export interface DistributionRow {
  patchId: string;
  stage: PatchStage;
  targetZones: number[];
  percentFleet: number;
  distributedAt: string;
  successRate: number;
  avgLatencyMs: number;
}

export const zones: Zone[] = [
  { id: 12, name: 'Zone 12 – Downtown Core', mismatchVolume: 142, activePatchCount: 8, currentTTM: 52, lastRollbackDate: '2025-01-28' },
  { id: 7, name: 'Zone 7 – Highway Corridor', mismatchVolume: 67, activePatchCount: 3, currentTTM: 38, lastRollbackDate: '2025-01-15' },
  { id: 19, name: 'Zone 19 – Airport Loop', mismatchVolume: 89, activePatchCount: 5, currentTTM: 44, lastRollbackDate: '2025-02-02' },
];

export const mismatchClusters: MismatchCluster[] = [
  { id: 'CL-19-0042', zone: 19, lat: 33.9425, lng: -118.4081, locationLabel: 'Airport Loop – Terminal 4 Merge', patchType: 'Lane Geometry', confidence: 87, evidenceVehicles: 10, evidencePasses: 40, timeSpreadDays: 3, suggestedStage: 'Shadow', lastSeen: '2025-02-10T14:23:00Z', status: 'Ready for Promotion', needsReview: false },
  { id: 'CL-12-0108', zone: 12, lat: 34.0522, lng: -118.2437, locationLabel: 'Main St & 5th Ave – Construction', patchType: 'Lane Geometry', confidence: 42, evidenceVehicles: 6, evidencePasses: 14, timeSpreadDays: 1, suggestedStage: 'Candidate', lastSeen: '2025-02-11T09:15:00Z', status: 'New', needsReview: true },
  { id: 'CL-12-0109', zone: 12, lat: 34.0530, lng: -118.2450, locationLabel: 'Main St & 7th Ave – Construction', patchType: 'Speed Advisory', confidence: 38, evidenceVehicles: 4, evidencePasses: 10, timeSpreadDays: 1, suggestedStage: 'Candidate', lastSeen: '2025-02-11T10:02:00Z', status: 'New', needsReview: true },
  { id: 'CL-12-0110', zone: 12, lat: 34.0518, lng: -118.2460, locationLabel: 'Broadway & 6th – Lane Closure', patchType: 'Lane Geometry', confidence: 55, evidenceVehicles: 8, evidencePasses: 22, timeSpreadDays: 2, suggestedStage: 'Shadow', lastSeen: '2025-02-10T22:45:00Z', status: 'In Review', needsReview: false },
  { id: 'CL-07-0023', zone: 7, lat: 34.1000, lng: -118.3000, locationLabel: 'Hwy 101 Exit 12B – Re-striping', patchType: 'Lane Geometry', confidence: 72, evidenceVehicles: 12, evidencePasses: 35, timeSpreadDays: 4, suggestedStage: 'Shadow', lastSeen: '2025-02-09T18:30:00Z', status: 'In Review', needsReview: false },
  { id: 'CL-07-0024', zone: 7, lat: 34.1020, lng: -118.3050, locationLabel: 'Hwy 101 Exit 13 – Lane Shift', patchType: 'Lane Geometry', confidence: 68, evidenceVehicles: 9, evidencePasses: 28, timeSpreadDays: 3, suggestedStage: 'Shadow', lastSeen: '2025-02-10T06:12:00Z', status: 'New', needsReview: true },
  { id: 'CL-19-0043', zone: 19, lat: 33.9430, lng: -118.4090, locationLabel: 'Airport Loop – Departures Curve', patchType: 'Turn Restriction', confidence: 91, evidenceVehicles: 15, evidencePasses: 52, timeSpreadDays: 5, suggestedStage: 'Silent', lastSeen: '2025-02-11T12:00:00Z', status: 'Ready for Promotion', needsReview: false },
  { id: 'CL-12-0111', zone: 12, lat: 34.0540, lng: -118.2480, locationLabel: 'Spring St Detour', patchType: 'Speed Advisory', confidence: 30, evidenceVehicles: 3, evidencePasses: 7, timeSpreadDays: 1, suggestedStage: 'Candidate', lastSeen: '2025-02-11T11:30:00Z', status: 'Blocked', needsReview: true },
];

function makeAuditLog(patchId: string, stage: PatchStage): AuditEvent[] {
  const base: AuditEvent[] = [
    { id: `${patchId}-e1`, action: 'created', actor: 'system', timestamp: '2025-02-07T08:00:00Z', reason: 'Auto-generated from cluster detection', artifactHash: 'sha256:a1b2c3d4' },
  ];
  if (stage !== 'Candidate') {
    base.push({ id: `${patchId}-e2`, action: 'promoted_to_shadow', actor: 'alice@atlas.dev', timestamp: '2025-02-08T10:30:00Z', reason: 'Evidence threshold met', artifactHash: 'sha256:e5f6g7h8' });
  }
  if (stage === 'Silent' || stage === 'Active') {
    base.push({ id: `${patchId}-e3`, action: 'promoted_to_silent', actor: 'bob@atlas.dev', timestamp: '2025-02-09T14:00:00Z', reason: 'Shadow validation passed', artifactHash: 'sha256:i9j0k1l2' });
  }
  if (stage === 'Active') {
    base.push({ id: `${patchId}-e4`, action: 'promoted_to_active', actor: 'admin@atlas.dev', timestamp: '2025-02-10T09:00:00Z', reason: 'Safety review complete', artifactHash: 'sha256:m3n4o5p6' });
  }
  return base;
}

function makeEvidence(n: number, m: number): EvidenceItem[] {
  const items: EvidenceItem[] = [];
  for (let i = 0; i < Math.min(m, 8); i++) {
    items.push({
      vehicleId: `AV-${String(100 + (i % n)).padStart(3, '0')}`,
      timestamp: `2025-02-${String(7 + Math.floor(i / 3)).padStart(2, '0')}T${String(8 + i).padStart(2, '0')}:${String(15 + i * 3).padStart(2, '0')}:00Z`,
      passId: `PASS-${String(1000 + i)}`,
      sensorAgreement: 0.82 + Math.random() * 0.15,
      residualMagnitude: 0.3 + Math.random() * 1.5,
    });
  }
  return items;
}

export const patches: Patch[] = [
  {
    id: 'SHM-19-0042',
    clusterId: 'CL-19-0042',
    type: 'Lane Geometry',
    zone: 19,
    locationLabel: 'Airport Loop – Terminal 4 Merge',
    lat: 33.9425, lng: -118.4081,
    geoFenceRadius: 150,
    stage: 'Shadow',
    ttlDays: 14,
    expirationDate: '2025-02-21',
    confidence: 87,
    confidenceFactors: { sensorAgreement: 0.92, routeDiversity: 0.85, timeDiversity: 0.88, recency: 0.95, localizationResidualTrend: 0.78 },
    evidenceVehicles: 10, evidencePasses: 40, timeSpreadDays: 3, sensorAgreementPct: 92,
    evidenceItems: makeEvidence(10, 40),
    auditLog: makeAuditLog('SHM-19-0042', 'Shadow'),
    safetyGates: { patchTypeAllowlist: true, deltaMagnitudeInBounds: true, evidenceThresholdsMet: true, timeDiversityMet: true, sensorAgreementMet: true, rollbackTriggersConfigured: true },
    geometryDelta: 'Lane boundary shift ~1.2m westward',
    distributionPct: 0, createdAt: '2025-02-07',
  },
  {
    id: 'SHM-07-0023',
    clusterId: 'CL-07-0023',
    type: 'Lane Geometry',
    zone: 7,
    locationLabel: 'Hwy 101 Exit 12B – Re-striping',
    lat: 34.1000, lng: -118.3000,
    geoFenceRadius: 200,
    stage: 'Candidate',
    ttlDays: 14,
    expirationDate: '2025-02-23',
    confidence: 72,
    confidenceFactors: { sensorAgreement: 0.86, routeDiversity: 0.72, timeDiversity: 0.80, recency: 0.88, localizationResidualTrend: 0.65 },
    evidenceVehicles: 12, evidencePasses: 35, timeSpreadDays: 4, sensorAgreementPct: 86,
    evidenceItems: makeEvidence(12, 35),
    auditLog: makeAuditLog('SHM-07-0023', 'Candidate'),
    safetyGates: { patchTypeAllowlist: true, deltaMagnitudeInBounds: true, evidenceThresholdsMet: true, timeDiversityMet: true, sensorAgreementMet: true, rollbackTriggersConfigured: false },
    geometryDelta: 'Lane re-striping ~0.8m offset',
    distributionPct: 0, createdAt: '2025-02-05',
  },
  {
    id: 'SHM-19-0043',
    clusterId: 'CL-19-0043',
    type: 'Turn Restriction',
    zone: 19,
    locationLabel: 'Airport Loop – Departures Curve',
    lat: 33.9430, lng: -118.4090,
    geoFenceRadius: 100,
    stage: 'Silent',
    ttlDays: 14,
    expirationDate: '2025-02-23',
    confidence: 91,
    confidenceFactors: { sensorAgreement: 0.95, routeDiversity: 0.90, timeDiversity: 0.92, recency: 0.97, localizationResidualTrend: 0.88 },
    evidenceVehicles: 15, evidencePasses: 52, timeSpreadDays: 5, sensorAgreementPct: 95,
    evidenceItems: makeEvidence(15, 52),
    auditLog: makeAuditLog('SHM-19-0043', 'Silent'),
    safetyGates: { patchTypeAllowlist: true, deltaMagnitudeInBounds: true, evidenceThresholdsMet: true, timeDiversityMet: true, sensorAgreementMet: true, rollbackTriggersConfigured: true },
    geometryDelta: 'Turn restriction added – no left turn',
    distributionPct: 10, distributedAt: '2025-02-10T12:00:00Z', successRate: 99.8, createdAt: '2025-02-04',
  },
  {
    id: 'SHM-12-0108',
    clusterId: 'CL-12-0108',
    type: 'Lane Geometry',
    zone: 12,
    locationLabel: 'Main St & 5th Ave – Construction',
    lat: 34.0522, lng: -118.2437,
    geoFenceRadius: 120,
    stage: 'Candidate',
    ttlDays: 14,
    expirationDate: '2025-02-25',
    confidence: 42,
    confidenceFactors: { sensorAgreement: 0.68, routeDiversity: 0.45, timeDiversity: 0.35, recency: 0.90, localizationResidualTrend: 0.55 },
    evidenceVehicles: 6, evidencePasses: 14, timeSpreadDays: 1, sensorAgreementPct: 68,
    evidenceItems: makeEvidence(6, 14),
    auditLog: makeAuditLog('SHM-12-0108', 'Candidate'),
    safetyGates: { patchTypeAllowlist: true, deltaMagnitudeInBounds: true, evidenceThresholdsMet: false, timeDiversityMet: false, sensorAgreementMet: false, rollbackTriggersConfigured: false },
    geometryDelta: 'Lane shift ~2.1m (construction zone)',
    distributionPct: 0, createdAt: '2025-02-10',
  },
];

export const distributionRows: DistributionRow[] = [
  { patchId: 'SHM-19-0043', stage: 'Silent', targetZones: [19], percentFleet: 10, distributedAt: '2025-02-10T12:00:00Z', successRate: 99.8, avgLatencyMs: 340 },
  { patchId: 'SHM-19-0042', stage: 'Shadow', targetZones: [19], percentFleet: 0, distributedAt: '-', successRate: 0, avgLatencyMs: 0 },
];

export const pipelineFunnel = {
  candidates: 18,
  shadow: 6,
  silent: 3,
  active: 5,
  rolledBack: 2,
  expired: 4,
};

export const recentRollbacks = [
  { patchId: 'SHM-12-0095', zone: 12, reason: 'Localization residual spike detected post-deployment', date: '2025-01-28', actor: 'safety-bot' },
  { patchId: 'SHM-07-0018', zone: 7, reason: 'Planner divergence exceeded threshold', date: '2025-01-15', actor: 'admin@atlas.dev' },
];

// RBAC permissions
export const RBAC: Record<Role, string[]> = {
  mapping: ['create_draft', 'mark_duplicate', 'request_evidence', 'promote_shadow', 'promote_silent_propose'],
  autonomy: ['create_draft', 'request_evidence', 'promote_shadow'],
  safety: ['block', 'approve', 'rollback', 'change_thresholds', 'create_safety_note', 'promote_shadow', 'promote_silent'],
  fleet_ops: ['view_distribution', 'rollback'],
  admin: ['create_draft', 'promote_shadow', 'promote_silent', 'promote_active', 'rollback', 'kill_switch', 'change_thresholds', 'block', 'approve'],
};

export function canPerform(role: Role, action: string): boolean {
  return RBAC[role]?.includes(action) ?? false;
}
