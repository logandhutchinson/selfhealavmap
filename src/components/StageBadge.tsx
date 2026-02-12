import { PatchStage, ClusterStatus } from '@/data/mockData';

const stageClassMap: Record<PatchStage, string> = {
  'Candidate': 'stage-badge stage-candidate',
  'Shadow': 'stage-badge stage-shadow',
  'Silent': 'stage-badge stage-silent',
  'Active': 'stage-badge stage-active',
  'Rolled Back': 'stage-badge stage-rolledback',
  'Expired': 'stage-badge stage-expired',
};

const statusClassMap: Record<ClusterStatus, string> = {
  'New': 'stage-badge status-new',
  'In Review': 'stage-badge status-review',
  'Ready for Promotion': 'stage-badge status-ready',
  'Blocked': 'stage-badge status-blocked',
};

export function StageBadge({ stage }: { stage: PatchStage }) {
  return <span className={stageClassMap[stage]}>{stage}</span>;
}

export function StatusBadge({ status }: { status: ClusterStatus }) {
  return <span className={statusClassMap[status]}>{status}</span>;
}
