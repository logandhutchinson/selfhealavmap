import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  requirePhrase?: string;
}

export function ConfirmModal({ open, onClose, onConfirm, title, description, confirmLabel = 'Confirm', destructive = false, requirePhrase }: Props) {
  const [typed, setTyped] = useState('');

  const canConfirm = requirePhrase ? typed === requirePhrase : true;

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className={destructive ? 'text-destructive' : ''}>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{description}</p>
        {requirePhrase && (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-1">Type <code className="text-destructive font-mono">{requirePhrase}</code> to confirm:</p>
            <Input value={typed} onChange={e => setTyped(e.target.value)} className="font-mono" />
          </div>
        )}
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant={destructive ? 'destructive' : 'default'} disabled={!canConfirm} onClick={() => { onConfirm(); onClose(); setTyped(''); }}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
