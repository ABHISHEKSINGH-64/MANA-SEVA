import { useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { EmptyState, ErrorState, Loader } from '../components/State';
import { useFetch } from '../hooks/useFetch';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [search, setSearch] = useState('');
  const [term, setTerm] = useState('');
  const { data, loading, error } = useFetch(`/faqs${term ? `?search=${encodeURIComponent(term)}` : ''}`, { faqs: [] });

  return (
    <section className="page-shell max-w-4xl space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200/60 pb-5 space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Citizen Support</p>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h1>
        <p className="text-xs text-slate-500">Quick answers to common queries regarding document matching, residency rules, and application channels.</p>
      </div>

      {/* Search area */}
      <div className="pt-2">
        <SearchBar 
          value={search} 
          onChange={setSearch} 
          onSubmit={(e) => { e.preventDefault(); setTerm(search); }} 
        />
      </div>

      <div className="mt-5"><ErrorState message={error} /></div>

      {loading ? (
        <Loader />
      ) : data.faqs.length ? (
        <div className="grid gap-3 pt-2">
          {data.faqs.map((faq) => (
            <details 
              key={faq.id} 
              className="group rounded-xl border border-slate-200 bg-white p-4 shadow-soft transition-all duration-200 open:ring-1 open:ring-primary-100 open:border-primary-200 cursor-pointer"
            >
              <summary className="flex items-center justify-between gap-4 font-semibold text-xs text-slate-800 list-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-2">
                  <HelpCircle size={14} className="text-slate-400 group-open:text-primary-600 transition-colors" />
                  {faq.question}
                </span>
                <ChevronDown size={14} className="text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="mt-3.5 pt-3 border-t border-slate-50 text-xs text-slate-500 leading-relaxed pl-6">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <EmptyState title="No FAQs found matching search" />
        </div>
      )}
    </section>
  );
}
