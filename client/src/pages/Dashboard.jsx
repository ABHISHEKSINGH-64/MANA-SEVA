import { Link } from 'react-router-dom';
import { EmptyState, ErrorState, Loader } from '../components/State';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { 
  Heart, 
  ListChecks, 
  CheckCircle2, 
  TrendingUp, 
  ChevronRight,
  FolderHeart,
  History,
  Search,
  Sparkles,
  Bot,
  Settings
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading, error } = useFetch('/dashboard', { stats: {}, favorites: [], checklist: [], recentlyViewed: [] });

  if (loading) return <Loader />;

  const statConfig = [
    { label: 'Saved Services', value: data.stats.favorites || 0, icon: Heart, color: 'text-rose-500 bg-rose-50 border-rose-100' },
    { label: 'Checklist Items', value: data.stats.checklistItems || 0, icon: ListChecks, color: 'text-blue-500 bg-blue-50 border-blue-100' },
    { label: 'Completed Files', value: data.stats.checklistCompleted || 0, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50 border-emerald-100' },
    { label: 'Average Progress', value: `${data.stats.progress || 0}%`, icon: TrendingUp, color: 'text-indigo-500 bg-indigo-50 border-indigo-100' }
  ];

  return (
    <section className="page-shell space-y-8 animate-fade-in">
      {/* Welcome Title */}
      <div className="border-b border-slate-200/60 pb-6 space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Citizen Control Room</p>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hello, {user.name}</h1>
        <p className="text-sm text-slate-500">Track and manage your eligibility folders, documentation prerequisites, and guidance steps.</p>
      </div>

      <div className="mt-5"><ErrorState message={error} /></div>

      {/* Metrics Cards */}
      <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
        {statConfig.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft hover:shadow-md transition duration-150 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <span className={`grid h-10 w-10 place-items-center rounded-lg border ${stat.color} shrink-0`}>
                <Icon size={18} />
              </span>
            </div>
          );
        })}
      </div>

      {/* Modules Panel Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel 
          title="Saved Services" 
          to="/favorites" 
          items={data.favorites} 
          icon={FolderHeart}
          color="text-rose-500 bg-rose-50 border-rose-100"
        />
        
        <Panel 
          title="Recently Viewed" 
          items={data.recentlyViewed} 
          icon={History}
          color="text-indigo-500 bg-indigo-50 border-indigo-100"
        />

        {/* Checklist Panel */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <ListChecks size={16} />
                </span>
                <h2 className="text-sm font-bold text-slate-900">Live Checklist</h2>
              </div>
              <Link className="text-xs font-bold text-primary-600 hover:text-primary-700 transition" to="/checklist">View Details</Link>
            </div>
            
            <div className="grid gap-2 max-h-[180px] overflow-y-auto pr-1">
              {data.checklist.slice(0, 6).map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50/50 border border-slate-100 animate-slide-in">
                  <span className="text-slate-600 font-medium truncate max-w-[160px]">{item.document_name}</span>
                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    item.is_completed 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    {item.is_completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
              ))}
              {!data.checklist.length && (
                <div className="py-4">
                  <EmptyState title="Empty checklist" text="Open any service guide to mark required files." />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft space-y-4">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Quick Actions</h2>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          <Link to="/services" className="panel p-4 hover:border-primary-200 transition text-center flex flex-col items-center justify-center gap-2 bg-slate-50/40 border border-slate-200">
            <Search size={18} className="text-primary-600" />
            <span className="text-xs font-semibold text-slate-800">Search Guides</span>
          </Link>
          <Link to="/schemes" className="panel p-4 hover:border-primary-200 transition text-center flex flex-col items-center justify-center gap-2 bg-slate-50/40 border border-slate-200">
            <Sparkles size={18} className="text-amber-500" />
            <span className="text-xs font-semibold text-slate-800">Finder Schemes</span>
          </Link>
          <Link to="/assistant" className="panel p-4 hover:border-primary-200 transition text-center flex flex-col items-center justify-center gap-2 bg-slate-50/40 border border-slate-200">
            <Bot size={18} className="text-indigo-600" />
            <span className="text-xs font-semibold text-slate-800">AI Chatbot</span>
          </Link>
          <Link to="/profile" className="panel p-4 hover:border-primary-200 transition text-center flex flex-col items-center justify-center gap-2 bg-slate-50/40 border border-slate-200">
            <Settings size={18} className="text-slate-500" />
            <span className="text-xs font-semibold text-slate-800">Settings</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Panel({ title, items, to, icon: Icon, color }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft flex flex-col justify-between">
      <div className="space-y-4 w-full">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className={`grid h-8 w-8 place-items-center rounded-lg border ${color}`}>
              <Icon size={16} />
            </span>
            <h2 className="text-sm font-bold text-slate-900">{title}</h2>
          </div>
          {to && <Link className="text-xs font-bold text-primary-600 hover:text-primary-700 transition" to={to}>Open All</Link>}
        </div>
        
        <div className="grid gap-2">
          {items.slice(0, 6).map((item) => (
            <Link 
              key={item.id || item.favorite_id} 
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50/50 text-xs font-medium text-slate-600 hover:text-slate-900 border border-transparent hover:border-slate-100 transition-all animate-slide-in"
              to={`/services/${item.slug}`}
            >
              <span className="truncate pr-4">{item.title}</span>
              <ChevronRight size={12} className="text-slate-400" />
            </Link>
          ))}
          {!items.length && (
            <div className="py-4">
              <EmptyState title="Nothing saved" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
