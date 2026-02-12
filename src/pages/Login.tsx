import { useApp } from '@/contexts/AppContext';
import { Role, ROLE_LABELS } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Shield, ChevronRight } from 'lucide-react';

const roles: Role[] = ['mapping', 'autonomy', 'safety', 'fleet_ops', 'admin'];
const roleIcons: Record<Role, string> = {
  mapping: '🗺️',
  autonomy: '🤖',
  safety: '🛡️',
  fleet_ops: '🚗',
  admin: '⚙️',
};
const roleDescriptions: Record<Role, string> = {
  mapping: 'Create patch drafts, promote Shadow→Silent',
  autonomy: 'Review evidence, promote to Shadow',
  safety: 'Block, approve, rollback, set thresholds',
  fleet_ops: 'Monitor distribution, trigger rollbacks',
  admin: 'Full access including kill switch',
};

export default function Login() {
  const { setRole } = useApp();
  const navigate = useNavigate();

  const handleLogin = (role: Role) => {
    setRole(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-4 glow-blue">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Atlas L5</h1>
          <p className="text-sm text-muted-foreground mt-1">Self-Healing Map Console</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-1 space-y-1">
          <p className="text-xs text-muted-foreground px-3 pt-2 pb-1 font-semibold uppercase tracking-wider">Select Role</p>
          {roles.map(role => (
            <button key={role} onClick={() => handleLogin(role)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary transition-colors text-left group">
              <span className="text-xl">{roleIcons[role]}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{ROLE_LABELS[role]}</div>
                <div className="text-xs text-muted-foreground">{roleDescriptions[role]}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>

        <div className="mt-6 bg-card border border-dashed border-muted-foreground/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span className="font-semibold">Developer Note</span>
          </div>
          <p className="text-xs font-mono text-muted-foreground mt-1.5 leading-relaxed">
            RBAC will gate actions per role. Real implementation uses SSO + MFA. This demo uses local state role switching.
          </p>
        </div>
      </div>
    </div>
  );
}
