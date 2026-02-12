import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { canPerform, PatchType, PatchStage, ClusterStatus } from '@/data/mockData';
import { StageBadge, StatusBadge } from '@/components/StageBadge';
import { DeveloperNotes } from '@/components/DeveloperNotes';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Filter, Plus, Copy, Eye } from 'lucide-react';

export default function MismatchFeed() {
  const { role, clusters, selectedZone, patches } = useApp();
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return clusters.filter(c => {
      if (selectedZone && c.zone !== selectedZone) return false;
      if (typeFilter !== 'all' && c.patchType !== typeFilter) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (search && !c.id.toLowerCase().includes(search.toLowerCase()) && !c.locationLabel.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [clusters, selectedZone, typeFilter, statusFilter, search]);

  const handleRowClick = (clusterId: string) => {
    const patch = patches.find(p => p.clusterId === clusterId);
    if (patch) {
      navigate(`/patch/${patch.id}`);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Mismatch Feed</h2>
          <p className="text-sm text-muted-foreground">{filtered.length} clusters</p>
        </div>
        <div className="flex gap-2">
          {role && canPerform(role, 'create_draft') && (
            <Button size="sm" className="text-xs"><Plus className="h-3 w-3 mr-1" /> Create Patch Draft</Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search ID or location…" value={search} onChange={e => setSearch(e.target.value)} className="w-48 h-8 text-xs" />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="Patch Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Lane Geometry">Lane Geometry</SelectItem>
            <SelectItem value="Turn Restriction">Turn Restriction</SelectItem>
            <SelectItem value="Speed Advisory">Speed Advisory</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="In Review">In Review</SelectItem>
            <SelectItem value="Ready for Promotion">Ready</SelectItem>
            <SelectItem value="Blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left p-3 font-medium">Cluster ID</th>
              <th className="text-left p-3 font-medium">Zone</th>
              <th className="text-left p-3 font-medium">Location</th>
              <th className="text-left p-3 font-medium">Type</th>
              <th className="text-left p-3 font-medium">Confidence</th>
              <th className="text-left p-3 font-medium">Evidence</th>
              <th className="text-left p-3 font-medium">Stage</th>
              <th className="text-left p-3 font-medium">Last Seen</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/30 cursor-pointer transition-colors" onClick={() => handleRowClick(c.id)}>
                <td className="p-3 font-mono font-semibold text-primary">{c.id}</td>
                <td className="p-3">{c.zone}</td>
                <td className="p-3 max-w-[180px] truncate">{c.locationLabel}</td>
                <td className="p-3">{c.patchType}</td>
                <td className="p-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${c.confidence >= 80 ? 'bg-success' : c.confidence >= 60 ? 'bg-accent' : 'bg-destructive'}`} style={{ width: `${c.confidence}%` }} />
                    </div>
                    <span className="font-mono">{c.confidence}</span>
                  </div>
                </td>
                <td className="p-3 font-mono">{c.evidenceVehicles}v / {c.evidencePasses}p / {c.timeSpreadDays}d</td>
                <td className="p-3"><StageBadge stage={c.suggestedStage} /></td>
                <td className="p-3 text-muted-foreground">{new Date(c.lastSeen).toLocaleDateString()}</td>
                <td className="p-3"><StatusBadge status={c.status} /></td>
                <td className="p-3" onClick={e => e.stopPropagation()}>
                  <div className="flex gap-1">
                    {role && canPerform(role, 'mark_duplicate') && (
                      <Button variant="ghost" size="sm" className="h-6 px-1.5 text-[10px]"><Copy className="h-3 w-3" /></Button>
                    )}
                    {role && canPerform(role, 'request_evidence') && (
                      <Button variant="ghost" size="sm" className="h-6 px-1.5 text-[10px]"><Eye className="h-3 w-3" /></Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeveloperNotes>
        <p><strong>API:</strong> GET /api/v1/clusters?zone=&type=&status=&confidence_min=&confidence_max=</p>
        <p><strong>Cluster model:</strong> cluster_id, zone, centroid(lat,lng), patch_type_candidate, confidence, evidence_bundle_id, status, last_seen</p>
        <p><strong>Dedupe:</strong> Clusters within 50m radius merged. Async evidence aggregation via worker queue.</p>
      </DeveloperNotes>
    </div>
  );
}
