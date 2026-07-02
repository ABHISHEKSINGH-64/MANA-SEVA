import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, Search, X, SlidersHorizontal, ArrowLeft, LayoutGrid, List } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { ServiceCard } from '../components/ServiceCard';
import { EmptyState, ErrorState, Loader } from '../components/State';
import { useFetch } from '../hooks/useFetch';

export default function Services() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');
  const [sort, setSort] = useState('recommended');
  const [isGrid, setIsGrid] = useState(true);
  
  const qs = useMemo(() => {
    const next = new URLSearchParams();
    if (params.get('search')) next.set('search', params.get('search'));
    if (params.get('category')) next.set('category', params.get('category'));
    return next.toString();
  }, [params]);

  const { data, loading, error } = useFetch(`/services${qs ? `?${qs}` : ''}`, { services: [] });
  const { data: categoryData } = useFetch('/categories', { categories: [] });
  
  const activeCategory = params.get('category') || '';
  const activeSearch = params.get('search') || '';

  const services = useMemo(() => {
    const items = [...(data.services || [])];
    if (sort === 'name') return items.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'time') return items.sort((a, b) => (a.processing_time || '').localeCompare(b.processing_time || ''));
    return items.sort((a, b) => Number(b.is_popular) - Number(a.is_popular) || a.title.localeCompare(b.title));
  }, [data.services, sort]);

  const applySearch = (term = search) => {
    const next = new URLSearchParams(params);
    const clean = term.trim();
    if (clean) next.set('search', clean);
    else next.delete('search');
    setParams(next);
  };

  const applyCategory = (category) => {
    const next = new URLSearchParams(params);
    if (category) next.set('category', category);
    else next.delete('category');
    setParams(next);
  };

  return (
    <section className="page-shell space-y-8 animate-fade-in">
      {/* Top Section */}
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start border-b border-slate-200/60 pb-8">
        <div className="space-y-3">
          <p className="section-eyebrow">Service discovery</p>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Browse Citizen Services</h1>
          <p className="max-w-xl text-sm text-slate-500 leading-relaxed">
            Search by keyword, department, processing speed, or document checklist requirements. Discover step-by-step guides formatted for direct clarity.
          </p>
          <div className="pt-2">
            <SearchBar
              value={search}
              onChange={setSearch}
              onSubmit={(event) => {
                event.preventDefault();
                applySearch();
              }}
              onSuggestionSelect={applySearch}
              suggestions={['Aadhaar', 'PAN card', 'Scholarship', 'Hospital', 'Electricity bill']}
              compact
            />
          </div>
        </div>

        {/* Search Architecture Info */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
            <Filter size={14} className="text-primary-600" />
            <span>Search Filter Metrics</span>
          </div>
          <div className="grid gap-2 text-xs text-slate-600">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="font-medium text-slate-400">Search:</span>
              <span className="font-semibold text-slate-800">{activeSearch || 'All services'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="font-medium text-slate-400">Category:</span>
              <span className="font-semibold text-slate-800 uppercase tracking-tight">{activeCategory || 'All'}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="font-medium text-slate-400">Matched guides:</span>
              <span className="font-semibold text-slate-800 bg-primary-50 px-2 py-0.5 rounded-full text-primary-700">{services.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-[16rem_1fr] items-start">
        {/* Sidebar Departments Panel */}
        <aside className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Departments</h2>
            {(activeCategory || activeSearch) && (
              <button 
                className="text-xs font-bold text-primary-600 hover:text-primary-700 transition" 
                onClick={() => { setSearch(''); setParams({}); }}
              >
                Reset All
              </button>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <button 
              className={`w-full rounded-lg px-3 py-2 text-left text-xs font-semibold transition-all ${
                !activeCategory 
                  ? 'bg-primary-50 text-primary-700 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`} 
              onClick={() => applyCategory('')}
            >
              All Departments
            </button>
            {categoryData.categories.map((category) => (
              <button
                key={category.id}
                className={`w-full rounded-lg px-3 py-2 text-left text-xs font-semibold transition-all ${
                  activeCategory === category.slug 
                    ? 'bg-primary-50 text-primary-700 shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                onClick={() => applyCategory(category.slug)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Listings and Toolbars */}
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center shadow-soft">
            <div className="flex flex-wrap gap-2 items-center">
              {activeSearch && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">
                  Search: "{activeSearch}"
                  <button className="text-slate-400 hover:text-slate-600 transition" onClick={() => { setSearch(''); applySearch(''); }} aria-label="Remove search">
                    <X size={12} />
                  </button>
                </span>
              )}
              {activeCategory && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">
                  Dept: {activeCategory}
                  <button className="text-slate-400 hover:text-slate-600 transition" onClick={() => applyCategory('')} aria-label="Remove category">
                    <X size={12} />
                  </button>
                </span>
              )}
              {!activeSearch && !activeCategory && (
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Search size={14} className="text-primary-500" /> Showing all service guides
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {/* Grid / List Toggler */}
              <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-1 bg-slate-50 shrink-0">
                <button 
                  onClick={() => setIsGrid(true)} 
                  className={`p-1.5 rounded-md transition ${isGrid ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={13} />
                </button>
                <button 
                  onClick={() => setIsGrid(false)} 
                  className={`p-1.5 rounded-md transition ${!isGrid ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
                  aria-label="List view"
                >
                  <List size={13} />
                </button>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <SlidersHorizontal size={13} className="text-slate-400" />
                <select 
                  className="bg-transparent border border-slate-200 hover:border-slate-300 transition-colors text-xs font-semibold px-2 py-1 rounded-lg text-slate-700 cursor-pointer outline-none"
                  value={sort} 
                  onChange={(event) => setSort(event.target.value)} 
                  aria-label="Sort services list"
                >
                  <option value="recommended">Recommended</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="time">Processing time</option>
                </select>
              </div>
            </div>
          </div>

          <div><ErrorState message={error} /></div>
          
          {loading ? (
            <Loader />
          ) : services.length ? (
            <div className={isGrid ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3 animate-fade-in" : "flex flex-col gap-4 animate-fade-in"}>
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} layout={isGrid ? "grid" : "list"} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center space-y-4">
              <EmptyState title="No service guides found" text="Try checking your spelling or selecting 'All Departments' to clear your filters." />
              <Link className="btn-secondary h-9 text-xs inline-flex gap-1.5" to="/faq">
                <X size={14} /> Open FAQs support
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
