import { useApp } from '@/contexts/AppContext';
import { StageBadge } from '@/components/StageBadge';
import { DeveloperNotes } from '@/components/DeveloperNotes';
import { Button } from '@/components/ui/button';
import { Truck, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export default function Distribution() {
  const { distributionRows } = useApp();

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold">Distribution & Fleet Status</h2>
        <p className="text-sm text-muted-foreground">Patch distribution across the fleet</p>
      </div>

      {/* Distribution table */}
      <div className="bg-card border border-border rounded-lg overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left p-3 font-medium">Patch ID</th>
              <th className="text-left p-3 font-medium">Stage</th>
              <th className="text-left p-3 font-medium">Target Zones</th>
              <th className="text-left p-3 font-medium">Fleet %</th>
              <th className="text-left p-3 font-medium">Distributed At</th>
              <th className="text-left p-3 font-medium">Success Rate</th>
              <th className="text-left p-3 font-medium">Avg Latency</th>
            </tr>
          </thead>
          <tbody>
            {distributionRows.map(d => (
              <tr key={d.patchId} className="border-b border-border/50">
                <td className="p-3 font-mono font-semibold text-primary">{d.patchId}</td>
                <td className="p-3"><StageBadge stage={d.stage} /></td>
                <td className="p-3 font-mono">{d.targetZones.join(', ')}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${d.percentFleet}%` }} />
                    </div>
                    <span className="font-mono">{d.percentFleet}%</span>
                  </div>
                </td>
                <td className="p-3 font-mono text-muted-foreground">{d.distributedAt === '-' ? '—' : new Date(d.distributedAt).toLocaleString()}</td>
                <td className="p-3 font-mono">{d.successRate > 0 ? `${d.successRate}%` : '—'}</td>
                <td className="p-3 font-mono">{d.avgLatencyMs > 0 ? `${d.avgLatencyMs}ms` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fleet segmentation */}
      <div className="kpi-card">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Fleet Segmentation Control</h4>
        <div className="flex gap-2">
          {[10, 25, 50, 100].map(pct => (
            <Button key={pct} variant="outline" size="sm" className="text-xs font-mono">{pct}%</Button>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">Staged rollout steps for patch distribution</p>
      </div>

      {/* Vehicle status */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <h4 className="text-xs font-semibold">Online Fleet Distribution</h4>
          </div>
          <div className="text-2xl font-bold font-mono">99.9%</div>
          <p className="text-[10px] text-muted-foreground">Success rate target met</p>
        </div>
        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-accent" />
            <h4 className="text-xs font-semibold">Offline Vehicles</h4>
          </div>
          <div className="text-2xl font-bold font-mono">12</div>
          <p className="text-[10px] text-muted-foreground">Will receive patches upon reconnection</p>
        </div>
      </div>

      {/* Fallback info */}
      <div className="kpi-card flex items-start gap-3">
        <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
        <div className="text-xs">
          <span className="font-semibold">Fallback Behavior:</span>
          <span className="text-muted-foreground ml-1">If a patch is invalid or expired, vehicles automatically fall back to the canonical map. No driver/rider action required.</span>
        </div>
      </div>

      <DeveloperNotes>
        <p><strong>API:</strong> GET /api/v1/distribution?patch_id=&stage=</p>
        <p><strong>Distribution service:</strong> Delta payloads (not full map tiles). Client-side validation before applying.</p>
        <p><strong>Staged rollout:</strong> fleet_percent field on distribution record. Controlled via /api/v1/distribution/&#123;id&#125;/rollout.</p>
        <p><strong>Client validation:</strong> Vehicles verify patch signature + TTL before applying. Invalid → canonical fallback.</p>
      </DeveloperNotes>
    </div>
  );
}
