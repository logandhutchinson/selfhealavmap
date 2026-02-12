import { DeveloperNotes } from '@/components/DeveloperNotes';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AlertTriangle, Bell } from 'lucide-react';

const ttmData = [
  { zone: 'Z12', median: 52, p90: 130 },
  { zone: 'Z7', median: 38, p90: 95 },
  { zone: 'Z19', median: 44, p90: 110 },
];

const interventionData = [
  { week: 'W1', pre: 85, post: 42 },
  { week: 'W2', pre: 78, post: 38 },
  { week: 'W3', pre: 92, post: 35 },
  { week: 'W4', pre: 88, post: 30 },
];

const conservativeData = [
  { day: 'Mon', pct: 11 },
  { day: 'Tue', pct: 10.5 },
  { day: 'Wed', pct: 9.8 },
  { day: 'Thu', pct: 9.2 },
  { day: 'Fri', pct: 8.8 },
  { day: 'Sat', pct: 8.5 },
  { day: 'Sun', pct: 8.2 },
];

const clutterData = [
  { zone: 'Z12', patches: 8 },
  { zone: 'Z7', patches: 3 },
  { zone: 'Z19', patches: 5 },
];

const alerts = [
  { id: 1, level: 'error', msg: 'Residual spike detected post-patch SHM-12-0095 in Zone 12', time: '12 min ago' },
  { id: 2, level: 'warning', msg: 'Planner divergence increased 15% in Zone 7 after SHM-07-0023 shadow deployment', time: '2 hrs ago' },
  { id: 3, level: 'info', msg: 'Weekly audit sampling completed — 3/3 patches reviewed, all compliant', time: '1 day ago' },
];

const chartStyle = { fontSize: 10, fill: 'hsl(215 15% 55%)' };

export default function Observability() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-xl font-bold">Observability</h2>
        <p className="text-sm text-muted-foreground">Metrics, trends, and alerts</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* TTM by Zone */}
        <div className="kpi-card">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">TTM by Zone (hrs)</h4>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ttmData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" />
              <XAxis dataKey="zone" tick={chartStyle} />
              <YAxis tick={chartStyle} />
              <Tooltip contentStyle={{ background: 'hsl(220 18% 11%)', border: '1px solid hsl(220 15% 18%)', borderRadius: 6, fontSize: 11 }} />
              <Bar dataKey="median" fill="hsl(210 100% 55%)" radius={[4, 4, 0, 0]} name="Median" />
              <Bar dataKey="p90" fill="hsl(210 100% 55% / 0.4)" radius={[4, 4, 0, 0]} name="p90" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Interventions pre/post */}
        <div className="kpi-card">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Interventions Pre/Post Patch</h4>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={interventionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" />
              <XAxis dataKey="week" tick={chartStyle} />
              <YAxis tick={chartStyle} />
              <Tooltip contentStyle={{ background: 'hsl(220 18% 11%)', border: '1px solid hsl(220 15% 18%)', borderRadius: 6, fontSize: 11 }} />
              <Line type="monotone" dataKey="pre" stroke="hsl(0 80% 55%)" strokeWidth={2} dot={false} name="Pre-patch" />
              <Line type="monotone" dataKey="post" stroke="hsl(150 70% 42%)" strokeWidth={2} dot={false} name="Post-patch" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Conservative mode trend */}
        <div className="kpi-card">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Conservative Mode Time (%)</h4>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={conservativeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" />
              <XAxis dataKey="day" tick={chartStyle} />
              <YAxis tick={chartStyle} />
              <Tooltip contentStyle={{ background: 'hsl(220 18% 11%)', border: '1px solid hsl(220 15% 18%)', borderRadius: 6, fontSize: 11 }} />
              <Line type="monotone" dataKey="pct" stroke="hsl(38 92% 50%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Patch clutter index */}
        <div className="kpi-card">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Patch Clutter Index</h4>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={clutterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" />
              <XAxis dataKey="zone" tick={chartStyle} />
              <YAxis tick={chartStyle} />
              <Tooltip contentStyle={{ background: 'hsl(220 18% 11%)', border: '1px solid hsl(220 15% 18%)', borderRadius: 6, fontSize: 11 }} />
              <Bar dataKey="patches" fill="hsl(260 60% 55%)" radius={[4, 4, 0, 0]} name="Active Patches" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts */}
      <div className="kpi-card">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Bell className="h-4 w-4 text-accent" />
          Alerts
        </h3>
        <div className="space-y-2">
          {alerts.map(a => (
            <div key={a.id} className={`flex items-start gap-3 p-2 rounded-md text-xs ${a.level === 'error' ? 'bg-destructive/10' : a.level === 'warning' ? 'bg-accent/10' : 'bg-primary/10'}`}>
              <AlertTriangle className={`h-3 w-3 mt-0.5 flex-shrink-0 ${a.level === 'error' ? 'text-destructive' : a.level === 'warning' ? 'text-accent' : 'text-primary'}`} />
              <div className="flex-1">
                <p>{a.msg}</p>
                <p className="text-muted-foreground mt-0.5">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DeveloperNotes>
        <p><strong>API:</strong> GET /api/v1/metrics/observability?zone=&range=</p>
        <p><strong>Metrics ingestion:</strong> 30s intervals from fleet telemetry service.</p>
        <p><strong>Alerting:</strong> Configurable thresholds via /api/v1/config/alerts. Notifications via PagerDuty / Slack.</p>
        <p><strong>Sampling audits:</strong> Weekly random sample of 3 active patches reviewed by Safety team.</p>
      </DeveloperNotes>
    </div>
  );
}
