import { Link } from 'react-router-dom';
import { EmptyState, ErrorState, Loader } from '../components/State';
import { useFetch } from '../hooks/useFetch';
import { Heart, ChevronRight, FolderHeart } from 'lucide-react';

export default function Favorites() {
  const { data, loading, error } = useFetch('/favorites', { favorites: [] });
  
  if (loading) return <Loader />;

  return (
    <section className="page-shell max-w-4xl space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200/60 pb-5 space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Citizen Control Room</p>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Saved Service Guides</h1>
        <p className="text-xs text-slate-500">Quickly revisit and prepare files for your bookmarked public services.</p>
      </div>

      <div className="mt-5"><ErrorState message={error} /></div>

      <div className="grid gap-3">
        {data.favorites.map((item) => (
          <Link 
            key={item.favorite_id} 
            className="group flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-soft hover:shadow-md hover:border-primary-200 transition-all duration-200" 
            to={`/services/${item.slug}`}
          >
            <div className="space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                {item.category_name || 'Service Guide'}
              </span>
              <p className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors pt-1">
                {item.title}
              </p>
              <p className="text-xs text-slate-400 line-clamp-1 leading-normal">
                {item.short_description}
              </p>
            </div>
            
            <div className="shrink-0 flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-rose-50 text-rose-500 border border-rose-100">
                <Heart size={12} className="fill-rose-500 text-rose-500" />
              </span>
              <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}

        {!data.favorites.length && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <EmptyState title="No saved guides yet" text="Click 'Save Guide' on any citizen service page to store it here for easy self-preparation." />
          </div>
        )}
      </div>
    </section>
  );
}
