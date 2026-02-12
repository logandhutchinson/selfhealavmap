import { useApp } from '@/contexts/AppContext';
import { zones, pipelineFunnel } from '@/data/mockData';
import { DeveloperNotes } from '@/components/DeveloperNotes';
import { StageBadge } from '@/components/StageBadge';
import { TrendingUp, TrendingDown, AlertTriangle, Clock, Users, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const kpis = [
  { label: 'Trips Completed', value: '420,000', sub: 'Last 30 days', icon: TrendingUp, trend: '+3.2%' },
  { label: 'Map Mismatches', value: '6.2%', sub: 'Of total trips', icon: AlertTriangle, trend: '+0.4%', negative: true },
  { label: 'Remote Assists', value: '1,980', sub: 'Avg 6.8 min', icon: Users, trend: '-12%' },
  { label: 'Mean TTM', value: '46 hrs', sub: 'p90: 120 hrs', icon: Clock, trend: '-8 hrs' },
  { label: 'Rider Complaints', value: '1,120', sub: '"slow/hesitant"', icon: TrendingDown, trend: '-5%' },
  { label: 'Conservative Mode', value: '+9%', sub: 'Construction zones', icon: AlertTriangle, trend: '+2%', negative: true },
];

export default function Dashboard() {
  const { selectedZone } = useApp();
  const navigate = useNavigate();
  const filteredZones = selectedZone ? zones.filter(z => z.id === selectedZone) : zones;

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h2 className="text-xl font-bold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Last 30 days overview</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="kpi-card">
            <div className="flex items-center justify-between mb-2">
              <k.icon className={`h-4 w-4 ${k.negative ? 'text-accent' : 'text-primary'}`} />
              <span className={`text-[10px] font-mono ${k.negative ? 'text-accent' : 'text-success'}`}>{k.trend}</span>
            </div>
            <div className="text-lg font-bold font-mono">{k.value}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{k.label}</div>
            <div className="text-[9px] text-muted-foreground">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Launch Zones */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Launch Zones</h3>
        <div className="grid md:grid-cols-3 gap-3">
          {filteredZones.map(z => (
            <div key={z.id} className="kpi-card cursor-pointer" onClick={() => navigate('/feed')}>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">{z.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">Mismatches:</span> <span className="font-mono">{z.mismatchVolume}</span></div>
                <div><span className="text-muted-foreground">Active Patches:</span> <span className="font-mono">{z.activePatchCount}</span></div>
                <div><span className="text-muted-foreground">TTM:</span> <span className="font-mono">{z.currentTTM} hrs</span></div>
                <div><span className="text-muted-foreground">Last Rollback:</span> <span className="font-mono">{z.lastRollbackDate}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patch Pipeline Funnel */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Patch Pipeline</h3>
        <div className="kpi-card">
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: 'Candidates', value: pipelineFunnel.candidates, stage: 'Candidate' as const },
              { label: 'Shadow', value: pipelineFunnel.shadow, stage: 'Shadow' as const },
              { label: 'Silent', value: pipelineFunnel.silent, stage: 'Silent' as const },
              { label: 'Active', value: pipelineFunnel.active, stage: 'Active' as const },
              { label: 'Rolled Back', value: pipelineFunnel.rolledBack, stage: 'Rolled Back' as const },
              { label: 'Expired', value: pipelineFunnel.expired, stage: 'Expired' as const },
            ].map((item, i, arr) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="text-center">
                  <div className="text-lg font-bold font-mono">{item.value}</div>
                  <StageBadge stage={item.stage} />
                </div>
                {i < arr.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground mx-1" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <DeveloperNotes>
        <p><strong>API:</strong> GET /api/v1/metrics/dashboard?range=30d</p>
        <p><strong>KPIs:</strong> Sourced from metrics service, aggregated hourly.</p>
        <p><strong>Zone rollups:</strong> GET /api/v1/zones/&#123;id&#125;/summary</p>
        <p><strong>Pipeline:</strong> GET /api/v1/patches/pipeline — counts by stage.</p>
      </DeveloperNotes>
    </div>
  );
}
