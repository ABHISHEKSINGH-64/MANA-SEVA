import { AlertCircle, HelpCircle, Loader2 } from 'lucide-react';

export function Loader({ label = 'Loading information' }) {
  return (
    <div className="mx-auto flex min-h-[30vh] max-w-7xl items-center justify-center px-4 animate-pulse">
      <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-xs font-semibold text-slate-600 shadow-soft">
        <Loader2 className="animate-spin text-primary-500" size={14} />
        <span>{label}...</span>
      </div>
    </div>
  );
}

export function ErrorState({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50/70 px-4 py-3 text-xs text-red-700 font-medium animate-fade-in">
      <AlertCircle size={14} className="shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}

export function EmptyState({ title = 'No files or records here', text = 'Try adjusting your filters or coming back later.' }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/30 p-8 text-center max-w-md mx-auto space-y-2">
      <HelpCircle className="mx-auto text-slate-300" size={24} />
      <div className="space-y-1">
        <p className="text-xs font-bold text-slate-800 tracking-tight">{title}</p>
        {text && <p className="text-[11px] text-slate-400 leading-relaxed">{text}</p>}
      </div>
    </div>
  );
}
