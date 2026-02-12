import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { canPerform, zones, recentRollbacks } from '@/data/mockData';
import { ConfirmModal } from '@/components/ConfirmModal';
import { DeveloperNotes } from '@/components/DeveloperNotes';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { AlertTriangle, Power, MapPin, RotateCcw, Shield } from 'lucide-react';

export default function KillSwitch() {
  const { role, shmEnabled, setShmEnabled, zoneKills, toggleZoneKill, patches, rollbackPatch } = useApp();
  const [globalConfirm, setGlobalConfirm] = useState(false);
  const [zoneConfirm, setZoneConfirm] = useState<number | null>(null);
  const [rollbackPatchId, setRollbackPatchId] = useState<string>('');
  const [rollbackConfirm, setRollbackConfirm] = useState(false);

  const isAdmin = role === 'admin';
  const canRollback = role ? canPerform(role, 'rollback') : false;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Safety header */}
      <div className="safety-critical-header glow-red">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <div>
          <h2 className="text-lg font-bold text-destructive">Safety Critical Controls</h2>
          <p className="text-xs text-muted-foreground">Actions on this page affect live fleet operations. All actions are audited.</p>
        </div>
      </div>

      {/* Global kill switch */}
      <div className="kpi-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Power className={`h-5 w-5 ${shmEnabled ? 'text-success' : 'text-destructive'}`} />
            <div>
              <h3 className="font-semibold text-sm">Global SHM Kill Switch</h3>
              <p className="text-xs text-muted-foreground">
                {shmEnabled ? 'SHM is currently ENABLED. All patches are operational.' : 'SHM is DISABLED. All vehicles using canonical map.'}
              </p>
            </div>
          </div>
          <Button
            variant={shmEnabled ? 'destructive' : 'default'}
            size="sm"
            className="text-xs"
            disabled={!isAdmin}
            onClick={() => {
              if (shmEnabled) setGlobalConfirm(true);
              else setShmEnabled(true);
            }}
          >
            {shmEnabled ? 'Disable SHM' : 'Enable SHM'}
          </Button>
        </div>
        {!isAdmin && <p className="text-[10px] text-muted-foreground mt-2">Only Admin role can toggle the global kill switch.</p>}
      </div>

      {/* Geo-fence kill switch */}
      <div className="kpi-card">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-accent" />
          Geo-fence Kill Switch
        </h3>
        <div className="space-y-2">
          {zones.map(z => (
            <div key={z.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div>
                <span className="text-sm">{z.name}</span>
                {zoneKills.includes(z.id) && <span className="ml-2 text-[10px] font-mono text-destructive">DISABLED</span>}
              </div>
              <Button
                variant={zoneKills.includes(z.id) ? 'default' : 'destructive'}
                size="sm"
                className="text-xs"
                disabled={!isAdmin}
                onClick={() => {
                  if (!zoneKills.includes(z.id)) setZoneConfirm(z.id);
                  else toggleZoneKill(z.id);
                }}
              >
                {zoneKills.includes(z.id) ? 'Re-enable' : 'Disable Zone'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Rollback patch */}
      <div className="kpi-card">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <RotateCcw className="h-4 w-4 text-accent" />
          Rollback Patch
        </h3>
        <div className="flex gap-2 items-end">
          <Select value={rollbackPatchId} onValueChange={setRollbackPatchId}>
            <SelectTrigger className="w-48 h-8 text-xs"><SelectValue placeholder="Select patch…" /></SelectTrigger>
            <SelectContent>
              {patches.filter(p => p.stage !== 'Rolled Back' && p.stage !== 'Candidate').map(p => (
                <SelectItem key={p.id} value={p.id}>{p.id} ({p.stage})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" variant="destructive" className="text-xs" disabled={!canRollback || !rollbackPatchId} onClick={() => setRollbackConfirm(true)}>
            Rollback
          </Button>
        </div>
      </div>

      {/* Auto-rollback triggers */}
      <div className="kpi-card">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          Auto-Rollback Triggers
        </h3>
        <div className="space-y-4">
          {[
            { label: 'Localization residual spike', value: 0.15, unit: 'm' },
            { label: 'Planner divergence threshold', value: 0.20, unit: '' },
            { label: 'Safety proxy regression', value: 0.05, unit: '%' },
          ].map(t => (
            <div key={t.label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{t.label}</span>
                <span className="font-mono">{t.value}{t.unit}</span>
              </div>
              <Slider defaultValue={[t.value * 100]} max={100} step={1} className="w-full" disabled={!isAdmin} />
            </div>
          ))}
        </div>
      </div>

      {/* Recent rollbacks */}
      <div className="kpi-card">
        <h3 className="font-semibold text-sm mb-3">Recent Rollbacks</h3>
        <div className="space-y-2">
          {recentRollbacks.map(r => (
            <div key={r.patchId} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0 text-xs">
              <RotateCcw className="h-3 w-3 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-mono font-semibold text-primary">{r.patchId}</span>
                <span className="text-muted-foreground ml-2">Zone {r.zone} · {r.date} · by {r.actor}</span>
                <p className="text-muted-foreground mt-0.5">{r.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal
        open={globalConfirm}
        onClose={() => setGlobalConfirm(false)}
        onConfirm={() => setShmEnabled(false)}
        title="Disable Global SHM"
        description="This will immediately revert ALL vehicles to the canonical map. All active patches will be suspended."
        confirmLabel="Disable SHM"
        destructive
        requirePhrase="DISABLE SHM"
      />
      <ConfirmModal
        open={zoneConfirm !== null}
        onClose={() => setZoneConfirm(null)}
        onConfirm={() => { if (zoneConfirm !== null) toggleZoneKill(zoneConfirm); }}
        title={`Disable Zone ${zoneConfirm}`}
        description="This will disable all SHM patches in this zone. Vehicles will fall back to canonical map."
        confirmLabel="Disable Zone"
        destructive
      />
      <ConfirmModal
        open={rollbackConfirm}
        onClose={() => setRollbackConfirm(false)}
        onConfirm={() => { rollbackPatch(rollbackPatchId, 'Manual rollback from Kill Switch center', role ? `${role}@atlas.dev` : 'unknown'); setRollbackPatchId(''); }}
        title="Confirm Rollback"
        description={`Rolling back ${rollbackPatchId}. This will revert affected vehicles to the canonical map.`}
        confirmLabel="Rollback"
        destructive
      />

      <DeveloperNotes>
        <p><strong>CRITICAL:</strong> These actions must be server-side authoritative. Real system requires MFA / elevated permissions.</p>
        <p><strong>API:</strong> POST /api/v1/shm/kill-switch (global), POST /api/v1/zones/&#123;id&#125;/kill-switch, POST /api/v1/patches/&#123;id&#125;/rollback</p>
        <p><strong>All actions write to immutable audit log.</strong> Audit entries cannot be deleted or modified.</p>
        <p><strong>Auto-rollback:</strong> Configured via /api/v1/config/rollback-triggers. Evaluated by monitoring service every 30s.</p>
      </DeveloperNotes>
    </div>
  );
}
