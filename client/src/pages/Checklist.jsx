import { useState } from 'react';
import { api } from '../services/api';
import { EmptyState, ErrorState, Loader } from '../components/State';
import { useFetch } from '../hooks/useFetch';
import { CheckSquare, Square, ClipboardCheck, Sparkles } from 'lucide-react';

export default function Checklist() {
  const { data, setData, loading, error } = useFetch('/checklist', { checklist: [] });
  const [saving, setSaving] = useState('');

  const toggle = async (item) => {
    setSaving(item.id);
    const { data: response } = await api.post('/checklist', {
      serviceId: item.service_id,
      documentName: item.document_name,
      isCompleted: !item.is_completed
    });
    setData({ 
      checklist: data.checklist.map((current) => 
        current.id === item.id 
          ? { ...current, is_completed: response.item.is_completed } 
          : current
      ) 
    });
    setSaving('');
  };

  if (loading) return <Loader />;

  return (
    <section className="page-shell max-w-4xl space-y-6">
      {/* Title block */}
      <div className="border-b border-slate-200/60 pb-5 space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Citizen Files</p>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Your Document Checklist</h1>
        <p className="text-xs text-slate-500">Review, print, and check off identity certificates and proof documents required for your saved guides.</p>
      </div>

      <div className="mt-5"><ErrorState message={error} /></div>

      <div className="grid gap-3">
        {data.checklist.map((item) => {
          const isDone = item.is_completed;
          return (
            <div 
              key={item.id} 
              onClick={() => saving !== item.id && toggle(item)}
              className={`flex items-center justify-between gap-4 rounded-xl border p-4 cursor-pointer transition duration-150 ${
                isDone 
                  ? 'bg-emerald-50/40 border-emerald-100' 
                  : 'bg-white border-slate-200 hover:border-primary-200 hover:shadow-soft'
              }`}
            >
              <div className="space-y-1">
                <span className={`block text-xs font-bold transition-all ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                  {item.document_name}
                </span>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-tight">
                  {item.service_title}
                </span>
              </div>

              <div className="shrink-0">
                {saving === item.id ? (
                  <span className="h-4 w-4 rounded-full border-2 border-primary-500 border-t-transparent animate-spin inline-block" />
                ) : isDone ? (
                  <CheckSquare className="text-emerald-500 transition-transform scale-105" size={18} />
                ) : (
                  <Square className="text-slate-300 hover:text-slate-400" size={18} />
                )}
              </div>
            </div>
          );
        })}

        {!data.checklist.length && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <EmptyState title="No checklist documents saved yet" text="Open any service guide, read the required documents section, and select the files to add them to your clipboard." />
          </div>
        )}
      </div>
    </section>
  );
}
