import React, { createContext, useContext, useState, useCallback } from 'react';
import { Role, Patch, patches as initialPatches, AuditEvent, PatchStage, MismatchCluster, mismatchClusters as initialClusters, distributionRows as initialDistribution, DistributionRow } from '@/data/mockData';

interface AppState {
  role: Role | null;
  setRole: (r: Role) => void;
  logout: () => void;
  shmEnabled: boolean;
  setShmEnabled: (v: boolean) => void;
  zoneKills: number[];
  toggleZoneKill: (z: number) => void;
  patches: Patch[];
  clusters: MismatchCluster[];
  distributionRows: DistributionRow[];
  promotePatch: (patchId: string, toStage: PatchStage, actor: string) => void;
  rollbackPatch: (patchId: string, reason: string, actor: string) => void;
  updateClusterStatus: (clusterId: string, status: MismatchCluster['status']) => void;
  selectedZone: number | null;
  setSelectedZone: (z: number | null) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [shmEnabled, setShmEnabled] = useState(true);
  const [zoneKills, setZoneKills] = useState<number[]>([]);
  const [patchState, setPatchState] = useState<Patch[]>(initialPatches);
  const [clusterState, setClusterState] = useState<MismatchCluster[]>(initialClusters);
  const [distState, setDistState] = useState<DistributionRow[]>(initialDistribution);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);

  const logout = useCallback(() => setRole(null), []);

  const toggleZoneKill = useCallback((z: number) => {
    setZoneKills(prev => prev.includes(z) ? prev.filter(x => x !== z) : [...prev, z]);
  }, []);

  const promotePatch = useCallback((patchId: string, toStage: PatchStage, actor: string) => {
    setPatchState(prev => prev.map(p => {
      if (p.id !== patchId) return p;
      const event: AuditEvent = {
        id: `${patchId}-e${p.auditLog.length + 1}`,
        action: `promoted_to_${toStage.toLowerCase().replace(' ', '_')}`,
        actor,
        timestamp: new Date().toISOString(),
        reason: `Promoted to ${toStage}`,
        artifactHash: `sha256:${Math.random().toString(36).slice(2, 10)}`,
      };
      const updated = { ...p, stage: toStage, auditLog: [...p.auditLog, event] };
      if (toStage === 'Silent' || toStage === 'Active') {
        updated.distributionPct = toStage === 'Silent' ? 10 : 100;
        updated.distributedAt = new Date().toISOString();
        updated.successRate = 99.9;
      }
      return updated;
    }));
    // Update distribution
    setDistState(prev => {
      const exists = prev.find(d => d.patchId === patchId);
      if (exists) {
        return prev.map(d => d.patchId === patchId ? { ...d, stage: toStage, percentFleet: toStage === 'Active' ? 100 : 10, distributedAt: new Date().toISOString(), successRate: 99.9, avgLatencyMs: 280 } : d);
      }
      return [...prev, { patchId, stage: toStage, targetZones: [patchState.find(p => p.id === patchId)?.zone ?? 0], percentFleet: 10, distributedAt: new Date().toISOString(), successRate: 99.9, avgLatencyMs: 280 }];
    });
  }, [patchState]);

  const rollbackPatch = useCallback((patchId: string, reason: string, actor: string) => {
    setPatchState(prev => prev.map(p => {
      if (p.id !== patchId) return p;
      const event: AuditEvent = {
        id: `${patchId}-e${p.auditLog.length + 1}`,
        action: 'rollback',
        actor,
        timestamp: new Date().toISOString(),
        reason,
        artifactHash: `sha256:${Math.random().toString(36).slice(2, 10)}`,
      };
      return { ...p, stage: 'Rolled Back' as PatchStage, auditLog: [...p.auditLog, event], distributionPct: 0 };
    }));
  }, []);

  const updateClusterStatus = useCallback((clusterId: string, status: MismatchCluster['status']) => {
    setClusterState(prev => prev.map(c => c.id === clusterId ? { ...c, status } : c));
  }, []);

  return (
    <AppContext.Provider value={{
      role, setRole, logout, shmEnabled, setShmEnabled,
      zoneKills, toggleZoneKill, patches: patchState, clusters: clusterState,
      distributionRows: distState, promotePatch, rollbackPatch, updateClusterStatus,
      selectedZone, setSelectedZone,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
