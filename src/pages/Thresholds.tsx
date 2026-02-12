import { useApp } from '@/contexts/AppContext';
import { canPerform } from '@/data/mockData';
import { DeveloperNotes } from '@/components/DeveloperNotes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Settings } from 'lucide-react';

const thresholdDefaults = [
  { label: 'N distinct vehicles', key: 'vehicles', value: 15 },
  { label: 'M passes', key: 'passes', value: 40 },
  { label: 'Time spread (days)', key: 'time_spread', value: 2 },
  { label: 'Sensor agreement threshold', key: 'sensor_agreement', value: 0.85 },
];

const allowedTypes = [
  { type: 'Lane Geometry', allowed: true },
  { type: 'Turn Restriction (w/ perception verification)', allowed: true },
  { type: 'Speed Advisory', allowed: true },
  { type: 'Traffic Lights', allowed: false },
  { type: 'Stop Signs', allowed: false },
  { type: 'Topology Changes', allowed: false },
  { type: 'Drivable Area Expansion', allowed: false },
];

const ttlDefaults = [
  { type: 'Lane Geometry', ttl: 14 },
  { type: 'Turn Restriction', ttl: 14 },
  { type: 'Speed Advisory', ttl: 7 },
];

export default function Thresholds() {
  const { role } = useApp();
  const canEdit = role ? canPerform(role, 'change_thresholds') : false;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold">Thresholds & Policy</h2>
        <p className="text-sm text-muted-foreground">Zone-specific configuration and patch type allowlist</p>
      </div>

      {/* Evidence thresholds */}
      <div className="kpi-card">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Settings className="h-4 w-4 text-primary" />
          Evidence Thresholds (Zone Default)
        </h3>
        <div className="space-y-3">
          {thresholdDefaults.map(t => (
            <div key={t.key} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{t.label}</span>
              <Input defaultValue={t.value} className="w-24 h-8 text-xs font-mono text-right" disabled={!canEdit} />
            </div>
          ))}
        </div>
        {canEdit && <Button size="sm" className="text-xs mt-4">Save Thresholds</Button>}
        {!canEdit && <p className="text-[10px] text-muted-foreground mt-3">Only Safety Engineer or Admin can modify thresholds.</p>}
      </div>

      {/* Patch type allowlist */}
      <div className="kpi-card">
        <h3 className="text-sm font-semibold mb-3">Patch Type Allowlist (v1)</h3>
        <div className="space-y-2">
          {allowedTypes.map(t => (
            <div key={t.type} className="flex items-center gap-2 text-xs">
              {t.allowed ? <CheckCircle className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-destructive" />}
              <span className={t.allowed ? '' : 'text-muted-foreground line-through'}>{t.type}</span>
              <span className={`ml-auto font-mono text-[10px] ${t.allowed ? 'text-success' : 'text-destructive'}`}>{t.allowed ? 'ALLOWED' : 'BLOCKED'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TTL defaults */}
      <div className="kpi-card">
        <h3 className="text-sm font-semibold mb-3">TTL Defaults by Patch Type</h3>
        <div className="space-y-2">
          {ttlDefaults.map(t => (
            <div key={t.type} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{t.type}</span>
              <span className="font-mono">{t.ttl} days</span>
            </div>
          ))}
        </div>
      </div>

      <DeveloperNotes>
        <p><strong>API:</strong> GET/PUT /api/v1/config/thresholds?zone=</p>
        <p><strong>Config service:</strong> Policy versioning enabled. All changes create a new version with diff.</p>
        <p><strong>Change audit:</strong> All threshold changes logged to immutable audit trail.</p>
        <p><strong>RBAC:</strong> Only safety + admin roles can modify. All roles can view.</p>
      </DeveloperNotes>
    </div>
  );
}
