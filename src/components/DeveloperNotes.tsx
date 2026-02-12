import { useState } from 'react';
import { ChevronDown, ChevronRight, Code } from 'lucide-react';

interface Props {
  title?: string;
  children: React.ReactNode;
}

export function DeveloperNotes({ title = 'Developer Notes', children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="dev-notes">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 w-full text-left text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">
        <Code className="h-4 w-4" />
        <span className="font-semibold">{title}</span>
        {open ? <ChevronDown className="h-3 w-3 ml-auto" /> : <ChevronRight className="h-3 w-3 ml-auto" />}
      </button>
      {open && (
        <div className="mt-3 text-xs font-mono text-muted-foreground space-y-2 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}
