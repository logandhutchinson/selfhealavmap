import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { canPerform } from '@/data/mockData';
import { StageBadge } from '@/components/StageBadge';
import { DeveloperNotes } from '@/components/DeveloperNotes';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowUp, RotateCcw, Ban, FileText, CheckCircle, XCircle, MapPin, Clock, Shield } from 'lucide-react';

export default function PatchDetail() {
  const { patchId } = useParams<{ patchId: string }>();
  const { role, patches, promotePatch, rollbackPatch } = useApp();
  const navigate = useNavigate();
  const patch = patches.find(p => p.id === patchId);
  const [confirmAction, setConfirmAction] = useState<{ action: string; stage?: string } | null>(null);
  const [rollbackReason, setRollbackReason] = useState('');
  const [evidenceModal, setEvidenceModal] = useState<number | null>(null);

  if (!patch) return <div className="text-center py-20 text-muted-foreground">Patch not found. <Button variant="link" onClick={() => navigate('/feed')}>Back to Feed</Button></div>;

  const actor = role ? `${role}@atlas.dev` : 'unknown';

  const handlePromote = (stage: string) => {
    promotePatch(patch.id, stage as any, actor);
    setConfirmAction(null);
  };

  const handleRollback = () => {
    rollbackPatch(patch.id, rollbackReason || 'Manual rollback', actor);
    setConfirmAction(null);
    setRollbackReason('');
  };

  const cf = patch.confidenceFactors;
  const sg = patch.safetyGates;

  return (
    <div className="space-y-4 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold font-mono">{patch.id}</h2>
            <StageBadge stage={patch.stage} />
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{patch.type} · {patch.locationLabel}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {role && canPerform(role, 'promote_shadow') && patch.stage === 'Candidate' && (
            <Button size="sm" className="text-xs" onClick={() => setConfirmAction({ action: 'promote', stage: 'Shadow' })}>
              <ArrowUp className="h-3 w-3 mr-1" /> Promote to Shadow
            </Button>
          )}
          {role && canPerform(role, 'promote_silent') && patch.stage === 'Shadow' && (
            <Button size="sm" className="text-xs" onClick={() => setConfirmAction({ action: 'promote', stage: 'Silent' })}>
              <ArrowUp className="h-3 w-3 mr-1" /> Promote to Silent
            </Button>
          )}
          {role && canPerform(role, 'promote_active') && patch.stage === 'Silent' && (
            <Button size="sm" className="text-xs" onClick={() => setConfirmAction({ action: 'promote', stage: 'Active' })}>
              <ArrowUp className="h-3 w-3 mr-1" /> Promote to Active
            </Button>
          )}
          {role && canPerform(role, 'rollback') && patch.stage !== 'Rolled Back' && patch.stage !== 'Candidate' && (
            <Button size="sm" variant="destructive" className="text-xs" onClick={() => setConfirmAction({ action: 'rollback' })}>
              <RotateCcw className="h-3 w-3 mr-1" /> Rollback
            </Button>
          )}
          {role && canPerform(role, 'block') && (
            <Button size="sm" variant="outline" className="text-xs">
              <Ban className="h-3 w-3 mr-1" /> Block
            </Button>
          )}
          {role && canPerform(role, 'create_safety_note') && (
            <Button size="sm" variant="outline" className="text-xs">
              <FileText className="h-3 w-3 mr-1" /> Safety Note
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="summary">
        <TabsList className="bg-secondary">
          <TabsTrigger value="summary" className="text-xs">Summary</TabsTrigger>
          <TabsTrigger value="map" className="text-xs">Map Delta</TabsTrigger>
          <TabsTrigger value="evidence" className="text-xs">Evidence</TabsTrigger>
          <TabsTrigger value="audit" className="text-xs">Audit Log</TabsTrigger>
          <TabsTrigger value="safety" className="text-xs">Safety Gates</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="kpi-card space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Patch Info</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">ID:</span> <span className="font-mono">{patch.id}</span></div>
                <div><span className="text-muted-foreground">Type:</span> {patch.type}</div>
                <div><span className="text-muted-foreground">Zone:</span> {patch.zone}</div>
                <div><span className="text-muted-foreground">Geo-fence:</span> <span className="font-mono">{patch.geoFenceRadius}m</span></div>
                <div><span className="text-muted-foreground">TTL:</span> <span className="font-mono">{patch.ttlDays} days</span></div>
                <div><span className="text-muted-foreground">Expires:</span> <span className="font-mono">{patch.expirationDate}</span></div>
                <div><span className="text-muted-foreground">Delta:</span> {patch.geometryDelta}</div>
                <div><span className="text-muted-foreground">Created:</span> <span className="font-mono">{patch.createdAt}</span></div>
              </div>
            </div>

            <div className="kpi-card space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Confidence: <span className="text-foreground font-mono">{patch.confidence}</span></h4>
              {Object.entries(cf).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground w-40 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${val >= 0.85 ? 'bg-success' : val >= 0.7 ? 'bg-accent' : 'bg-destructive'}`} style={{ width: `${val * 100}%` }} />
                  </div>
                  <span className="font-mono w-10 text-right">{(val * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="kpi-card">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Evidence Bundle Summary</h4>
            <div className="flex gap-6 text-xs">
              <div><span className="text-muted-foreground">Distinct vehicles:</span> <span className="font-mono font-semibold">{patch.evidenceVehicles}</span></div>
              <div><span className="text-muted-foreground">Passes:</span> <span className="font-mono font-semibold">{patch.evidencePasses}</span></div>
              <div><span className="text-muted-foreground">Time spread:</span> <span className="font-mono font-semibold">{patch.timeSpreadDays} days</span></div>
              <div><span className="text-muted-foreground">Sensor agreement:</span> <span className="font-mono font-semibold">{patch.sensorAgreementPct}%</span></div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="map" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="kpi-card">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Canonical Map</h4>
              <div className="bg-muted rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(45deg, hsl(var(--muted-foreground)) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-muted-foreground/50" />
                <div className="absolute top-[45%] left-1/4 right-1/4 h-0.5 bg-muted-foreground/50" />
                <div className="absolute bottom-4 left-4 text-[10px] font-mono text-muted-foreground">Zone {patch.zone} · {patch.lat.toFixed(4)}, {patch.lng.toFixed(4)}</div>
              </div>
            </div>
            <div className="kpi-card glow-blue">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Patched Overlay</h4>
              <div className="bg-muted rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(45deg, hsl(var(--muted-foreground)) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-muted-foreground/50" />
                <div className="absolute top-[42%] left-1/4 right-1/4 h-0.5 bg-primary border border-primary/50" />
                <div className="absolute top-[42%] left-[30%] text-[9px] font-mono text-primary bg-primary/10 px-1 rounded">↑ 1.2m shift</div>
                <div className="absolute inset-[15%] border-2 border-dashed border-accent/40 rounded-lg" />
                <div className="absolute bottom-4 left-4 text-[10px] font-mono text-primary">Geo-fence: {patch.geoFenceRadius}m radius</div>
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            <span className="text-accent">⚠</span> Adjacency check: No warnings for this patch.
          </div>
        </TabsContent>

        <TabsContent value="evidence" className="mt-4">
          <div className="bg-card border border-border rounded-lg overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left p-3 font-medium">Vehicle</th>
                  <th className="text-left p-3 font-medium">Timestamp</th>
                  <th className="text-left p-3 font-medium">Pass ID</th>
                  <th className="text-left p-3 font-medium">Sensor Agreement</th>
                  <th className="text-left p-3 font-medium">Residual</th>
                  <th className="text-left p-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {patch.evidenceItems.map((e, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="p-3 font-mono">{e.vehicleId}</td>
                    <td className="p-3 font-mono text-muted-foreground">{new Date(e.timestamp).toLocaleString()}</td>
                    <td className="p-3 font-mono">{e.passId}</td>
                    <td className="p-3 font-mono">{(e.sensorAgreement * 100).toFixed(1)}%</td>
                    <td className="p-3 font-mono">{e.residualMagnitude.toFixed(2)}m</td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] text-primary" onClick={() => setEvidenceModal(i)}>View Snapshot</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <div className="space-y-0 relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            {patch.auditLog.map((e, i) => (
              <div key={e.id} className="flex gap-4 pb-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${e.action.includes('rollback') ? 'bg-destructive/20' : e.action.includes('promoted') ? 'bg-success/20' : 'bg-primary/20'}`}>
                  {e.action.includes('rollback') ? <RotateCcw className="h-3 w-3 text-destructive" /> :
                   e.action.includes('promoted') ? <ArrowUp className="h-3 w-3 text-success" /> :
                   <Clock className="h-3 w-3 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold capitalize">{e.action.replace(/_/g, ' ')}</span>
                    <span className="text-muted-foreground text-xs">by {e.actor}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{e.reason}</p>
                  <div className="flex gap-3 mt-1 text-[10px] text-muted-foreground font-mono">
                    <span>{new Date(e.timestamp).toLocaleString()}</span>
                    {e.artifactHash && <span className="text-primary/60">{e.artifactHash}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="safety" className="mt-4 space-y-4">
          <div className="kpi-card space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Safety Gate Checklist</h4>
            {[
              { label: 'Patch type allowlist check', pass: sg.patchTypeAllowlist },
              { label: 'Delta magnitude within bounds', pass: sg.deltaMagnitudeInBounds },
              { label: 'Evidence thresholds met (N/M)', pass: sg.evidenceThresholdsMet },
              { label: 'Time diversity met', pass: sg.timeDiversityMet },
              { label: 'Sensor agreement threshold met', pass: sg.sensorAgreementMet },
              { label: 'Rollback triggers configured', pass: sg.rollbackTriggersConfigured },
            ].map(g => (
              <div key={g.label} className="flex items-center gap-2 text-xs">
                {g.pass ? <CheckCircle className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-destructive" />}
                <span className={g.pass ? '' : 'text-muted-foreground'}>{g.label}</span>
                <span className={`ml-auto font-mono text-[10px] ${g.pass ? 'text-success' : 'text-destructive'}`}>{g.pass ? 'PASS' : 'FAIL'}</span>
              </div>
            ))}
          </div>
          {Object.values(sg).every(Boolean) && (
            <div className="flex items-center gap-2 text-xs text-success">
              <Shield className="h-4 w-4" />
              <span className="font-semibold">Auto sign-off: PASS</span>
              <span className="text-muted-foreground ml-2">Weekly audit sampling applies.</span>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Promote confirm */}
      <ConfirmModal
        open={confirmAction?.action === 'promote'}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => handlePromote(confirmAction?.stage ?? '')}
        title={`Promote to ${confirmAction?.stage}`}
        description={`This will move patch ${patch.id} to ${confirmAction?.stage} stage. Distribution will begin for target zones.`}
        confirmLabel="Promote"
      />

      {/* Rollback confirm */}
      <ConfirmModal
        open={confirmAction?.action === 'rollback'}
        onClose={() => { setConfirmAction(null); setRollbackReason(''); }}
        onConfirm={handleRollback}
        title="Rollback Patch"
        description={`Rolling back patch ${patch.id} will revert all vehicles to the canonical map for this geo-fence.`}
        confirmLabel="Rollback"
        destructive
      />

      {/* Evidence snapshot modal */}
      <Dialog open={evidenceModal !== null} onOpenChange={() => setEvidenceModal(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-sm">Evidence Snapshot</DialogTitle>
          </DialogHeader>
          {evidenceModal !== null && patch.evidenceItems[evidenceModal] && (
            <div className="space-y-3">
              <div className="bg-muted rounded-lg h-48 flex items-center justify-center text-xs text-muted-foreground">
                [Sensor snapshot placeholder — LiDAR + camera fusion view]
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">Vehicle:</span> <span className="font-mono">{patch.evidenceItems[evidenceModal].vehicleId}</span></div>
                <div><span className="text-muted-foreground">Pass:</span> <span className="font-mono">{patch.evidenceItems[evidenceModal].passId}</span></div>
                <div><span className="text-muted-foreground">Agreement:</span> <span className="font-mono">{(patch.evidenceItems[evidenceModal].sensorAgreement * 100).toFixed(1)}%</span></div>
                <div><span className="text-muted-foreground">Residual:</span> <span className="font-mono">{patch.evidenceItems[evidenceModal].residualMagnitude.toFixed(2)}m</span></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DeveloperNotes>
        <p><strong>Patch schema:</strong> patch_id, type, geometry_delta, confidence, evidence_bundle_id, created_at, TTL, stage, version, superseded_by</p>
        <p><strong>Stage state machine:</strong> Candidate → Shadow → Silent → Active. Any stage can → Rolled Back. Active can → Expired (TTL). Expired/Rolled Back → Superseded (new patch created).</p>
        <p><strong>RBAC:</strong></p>
        <ul className="list-disc list-inside ml-2">
          <li>Safety: block, approve, rollback, change thresholds</li>
          <li>Mapping: create drafts, promote Shadow→Silent, propose Active</li>
          <li>Admin: activate, kill switch</li>
        </ul>
        <p><strong>Signature verification:</strong> All patch artifacts require sha256 signature before distribution.</p>
        <p><strong>API:</strong> GET/PATCH /api/v1/patches/&#123;id&#125;, POST /api/v1/patches/&#123;id&#125;/promote, POST /api/v1/patches/&#123;id&#125;/rollback</p>
      </DeveloperNotes>
    </div>
  );
}
