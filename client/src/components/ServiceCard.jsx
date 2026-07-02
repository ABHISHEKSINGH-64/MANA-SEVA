import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Coins, Star } from 'lucide-react';

export function ServiceCard({ service, layout = 'grid' }) {
  const isList = layout === 'list';
  
  return (
    <article 
      className={`group relative flex border border-slate-200/85 bg-white p-5 shadow-soft transition-all duration-200 hover:border-primary-200 hover:shadow-md rounded-xl ${
        isList 
          ? 'flex-col sm:flex-row sm:items-center justify-between gap-5' 
          : 'flex-col justify-between hover:-translate-y-1'
      }`}
    >
      <div className="space-y-3 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[9px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-full">
            {service.category_name || service.category_slug}
          </span>
          {service.is_popular && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-100 bg-amber-50/70 px-2 py-0.5 text-[9px] font-bold text-amber-700">
              <Star size={10} className="fill-amber-400 text-amber-400" /> Popular
            </span>
          )}
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 leading-tight group-hover:text-primary-600 transition-colors">
            {service.title}
          </h3>
          <p className="mt-1.5 text-xs text-slate-500 leading-relaxed line-clamp-2">
            {service.short_description}
          </p>
        </div>
      </div>

      <div 
        className={`flex items-center justify-between gap-4 shrink-0 ${
          isList 
            ? 'sm:border-l sm:border-slate-100 sm:pl-5 flex-row sm:flex-col items-center sm:items-end gap-3 justify-between sm:justify-center' 
            : 'mt-5 pt-4 border-t border-slate-100'
        }`}
      >
        <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 font-medium">
          {service.processing_time && (
            <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
              <Clock size={11} className="text-slate-400" /> {service.processing_time}
            </span>
          )}
          {service.fee && (
            <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
              <Coins size={11} className="text-slate-400" /> {service.fee}
            </span>
          )}
        </div>
        
        <Link 
          to={`/services/${service.slug || service.id}`} 
          className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700 transition"
        >
          <span>Guide</span>
          <ArrowRight size={12} className="transform group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
