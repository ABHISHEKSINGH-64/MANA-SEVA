import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Heart, CheckCircle2, ShieldAlert, Sparkles, Compass, Clock, Coins, CheckSquare, Square } from 'lucide-react';
import { api, apiMessage } from '../services/api';
import { ErrorState, Loader } from '../components/State';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';

export default function ServiceDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data, loading, error } = useFetch(`/services/${id}`, { service: null });
  const { data: listData } = useFetch('/services', { services: [] });
  const [message, setMessage] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const service = data.service;

  // Find related services by category
  const relatedServices = useMemo(() => {
    if (!service || !listData.services) return [];
    return listData.services
      .filter((s) => s.category_name === service.category_name && s.id !== service.id)
      .slice(0, 3);
  }, [service, listData.services]);

  if (loading) return <Loader />;
  
  if (error || !service) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <ErrorState message={error || 'Service not found'} />
        <div className="mt-6 text-center">
          <Link className="btn-secondary text-xs inline-flex items-center gap-1.5" to="/services">
            <ArrowLeft size={14} /> Back to listing
          </Link>
        </div>
      </section>
    );
  }

  const saveFavorite = async () => {
    try {
      await api.post('/favorites', { serviceId: service.id });
      setIsSaved(true);
      setMessage('Saved to favorites successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(apiMessage(err));
    }
  };

  const saveChecklist = async (documentName, isCompleted) => {
    try {
      await api.post('/checklist', { serviceId: service.id, documentName, isCompleted });
      setMessage('Document checklist status updated');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage(apiMessage(err));
    }
  };

  const sections = [
    { title: 'Overview', content: service.guide?.overview, type: 'text' },
    { title: 'Eligibility Rules', content: service.guide?.eligibility, type: 'list' },
    { title: 'Required Documents', content: service.guide?.required_documents, type: 'checklist' },
    { title: 'Step-by-Step Process', content: service.guide?.process_steps, type: 'process' },
    { title: 'Important Notes', content: service.guide?.important_notes, type: 'text' },
    { title: 'Common Mistakes to Avoid', content: service.guide?.common_mistakes, type: 'list' }
  ];

  return (
    <section className="page-shell max-w-5xl space-y-8 animate-fade-in">
      {/* Back button */}
      <div>
        <Link className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary-600 transition" to="/services">
          <ArrowLeft size={14} /> Back to services guides
        </Link>
      </div>

      {/* Hero Header panel */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[9px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-full">
            {service.category_name}
          </span>
          {service.is_popular && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-100 bg-amber-50/70 px-2 py-0.5 text-[9px] font-bold text-amber-700">
              Popular Guide
            </span>
          )}
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl">{service.title}</h1>
          <p className="text-xs text-slate-500 leading-relaxed max-w-4xl">{service.short_description}</p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2 text-[10px] text-slate-500 font-semibold">
          {service.processing_time && (
            <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
              <Clock size={11} className="text-slate-400" /> Processing: {service.processing_time}
            </span>
          )}
          {service.fee && (
            <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
              <Coins size={11} className="text-slate-400" /> Fee: {service.fee}
            </span>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2.5">
            {user ? (
              <button 
                className={`btn-primary h-9 px-4 text-xs gap-1.5 ${isSaved ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`} 
                onClick={saveFavorite}
              >
                <Heart size={14} className={isSaved ? 'fill-current text-white' : ''} /> 
                {isSaved ? 'Saved to Favorites' : 'Save Guide'}
              </button>
            ) : (
              <Link className="btn-primary h-9 px-4 text-xs gap-1.5" to="/login">
                <Heart size={14} /> Login to Save
              </Link>
            )}
            {service.official_url && (
              <a 
                className="btn-secondary h-9 px-4 text-xs gap-1.5" 
                href={service.official_url} 
                target="_blank" 
                rel="noreferrer"
              >
                <span>Visit Official Portal</span>
                <ExternalLink size={12} className="text-slate-400" />
              </a>
            )}
          </div>
          
          {message && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg">
              <Sparkles size={12} /> {message}
            </span>
          )}
        </div>
      </div>

      {/* Guide Content Accordion style layout */}
      <div className="grid gap-6 md:grid-cols-[1.8fr_1.2fr] items-start">
        {/* Main Content Sections */}
        <div className="space-y-6">
          {sections
            .filter(sec => sec.content && (!Array.isArray(sec.content) || sec.content.length > 0))
            .map((sec) => (
              <GuideSection 
                key={sec.title} 
                title={sec.title} 
                content={sec.content} 
                type={sec.type} 
                onCheck={sec.title === 'Required Documents' && user ? saveChecklist : null} 
              />
            ))}
        </div>

        {/* Side Portal Info / Safety Notice */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
              <ShieldAlert size={14} className="text-amber-500" />
              <span>Citizen Notice</span>
            </div>
            <div className="text-xs text-slate-500 space-y-3 leading-relaxed">
              <p>
                This guide summarizes the application process, documents, and rules required for obtaining the service.
              </p>
              <p className="font-semibold text-slate-700">
                Mana Seva is NOT an official application channel. We help you prepare files so you avoid mistakes.
              </p>
              <p>
                Ensure all spellings in your identity papers match exactly with secondary files before submitting.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <div className="pt-8 border-t border-slate-200 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Related Guides</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {relatedServices.map((item) => (
              <Link 
                key={item.id} 
                to={`/services/${item.slug}`}
                className="panel p-4 hover:border-primary-200 hover:shadow-soft transition-all flex flex-col justify-between bg-white border border-slate-200"
              >
                <div className="space-y-1">
                  <span className="text-[9px] font-semibold text-slate-400 uppercase">{item.category_name}</span>
                  <p className="text-xs font-bold text-slate-800 leading-snug">{item.title}</p>
                </div>
                <span className="text-[10px] text-primary-600 font-bold flex items-center gap-1 mt-4">
                  Read guide <ArrowLeft size={10} className="rotate-180" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function GuideSection({ title, content, type, onCheck }) {
  if (!content) return null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft space-y-4">
      <h2 className="text-base font-bold text-slate-950 tracking-tight border-b border-slate-100 pb-2.5">{title}</h2>
      
      {Array.isArray(content) ? (
        <div className="space-y-2">
          {content.map((item, index) => {
            if (type === 'checklist') {
              return (
                <label 
                  key={item} 
                  className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 p-3 text-xs text-slate-700 cursor-pointer transition"
                >
                  <input 
                    type="checkbox" 
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer" 
                    onChange={(e) => onCheck?.(item, e.target.checked)} 
                  />
                  <span className="leading-normal">{item}</span>
                </label>
              );
            }

            if (type === 'process') {
              return (
                <div key={item} className="flex gap-4 p-3 rounded-lg hover:bg-slate-50/50 transition">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-50 text-[11px] font-bold text-primary-700 border border-primary-100">
                    {index + 1}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{item}</p>
                </div>
              );
            }

            // Standard list styling
            return (
              <div key={item} className="flex gap-2.5 p-2 items-start text-xs text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                <p className="leading-relaxed">{item}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-slate-600 leading-relaxed">{content}</p>
      )}
    </section>
  );
}

import { useMemo } from 'react';
