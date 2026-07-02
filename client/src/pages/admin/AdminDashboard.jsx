import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { 
  FileText, 
  FolderOpen, 
  HelpCircle, 
  Sparkles, 
  ChevronRight,
  Shield,
  LayoutGrid
} from 'lucide-react';

export default function AdminDashboard() {
  const services = useFetch('/services', { services: [] });
  const categories = useFetch('/categories', { categories: [] });
  const faqs = useFetch('/faqs', { faqs: [] });
  const schemes = useFetch('/schemes', { schemes: [] });
  
  const cards = [
    { label: 'Manage Services', to: '/admin/services', count: services.data.services.length, icon: FileText, desc: 'Add or modify citizen guides & steps', color: 'text-blue-500 bg-blue-50 border-blue-100' },
    { label: 'Manage Categories', to: '/admin/categories', count: categories.data.categories.length, icon: FolderOpen, desc: 'Organise guidance categories', color: 'text-indigo-500 bg-indigo-50 border-indigo-100' },
    { label: 'Manage FAQs', to: '/admin/faqs', count: faqs.data.faqs.length, icon: HelpCircle, desc: 'Update general help questions', color: 'text-amber-500 bg-amber-50 border-amber-100' },
    { label: 'Manage Schemes', to: '/admin/schemes', count: schemes.data.schemes.length, icon: Sparkles, desc: 'Configure search criteria finder', color: 'text-emerald-500 bg-emerald-50 border-emerald-100' }
  ];

  return (
    <section className="page-shell space-y-8">
      {/* Title */}
      <div className="border-b border-slate-200/60 pb-6 space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Shield size={12} className="text-primary-600" />
          <span>System Administration Console</span>
        </p>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-slate-500">Edit active registry data, public FAQs, and category structures dynamically.</p>
      </div>

      {/* Grid of cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link 
              key={card.label} 
              to={card.to} 
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-soft hover:shadow-md hover:border-primary-200 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <span className={`grid h-10 w-10 place-items-center rounded-lg border ${card.color}`}>
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{card.count}</p>
                  <p className="text-sm font-bold text-slate-800 pt-1">{card.label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">{card.desc}</p>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-primary-600 group-hover:text-primary-700 transition">
                <span>Manage Console</span>
                <ChevronRight size={12} className="transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
