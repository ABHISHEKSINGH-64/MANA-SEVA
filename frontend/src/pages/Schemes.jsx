import { useState } from 'react';
import { Search, ShieldAlert, ExternalLink, Sparkles, HelpCircle, MapPin, Calculator } from 'lucide-react';
import { api, apiMessage } from '../services/api';
import { EmptyState, ErrorState } from '../components/State';

export default function Schemes() {
  const [filters, setFilters] = useState({ state: '', age: '', income: '', beneficiaryType: 'student' });
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/schemes', { params: filters });
      setSchemes(data.schemes);
    } catch (err) {
      setError(apiMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-shell space-y-8">
      {/* Top Header */}
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start border-b border-slate-200/60 pb-8">
        <div className="space-y-3">
          <p className="section-eyebrow">Benefit discovery</p>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Government Scheme Finder</h1>
          <p className="max-w-xl text-sm text-slate-500 leading-relaxed">
            Match your profile criteria against available public benefit databases, then proceed to the official portal for final verification.
          </p>
        </div>
        
        {/* Safety Banner */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
            <ShieldAlert size={14} className="text-amber-500" />
            <span>Verify Eligibility</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Rules, income caps, and criteria undergo updates frequently. Treat results as preliminary guidance and verify requirements with the official portal.
          </p>
        </div>
      </div>

      {/* Filter Form Panel */}
      <form onSubmit={search} className="grid gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-soft md:grid-cols-5 items-end">
        <div className="grid gap-2">
          <label htmlFor="state" className="text-xs font-bold uppercase tracking-wider text-slate-500">
            State
          </label>
          <div className="relative">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              id="state"
              className="input pl-9 text-xs" 
              placeholder="e.g. Telangana, All India" 
              value={filters.state} 
              onChange={(e) => setFilters({ ...filters, state: e.target.value })} 
            />
          </div>
        </div>

        <div className="grid gap-2">
          <label htmlFor="age" className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Age
          </label>
          <div className="relative">
            <Calculator size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              id="age"
              className="input pl-9 text-xs" 
              placeholder="e.g. 18" 
              type="number" 
              value={filters.age} 
              onChange={(e) => setFilters({ ...filters, age: e.target.value })} 
            />
          </div>
        </div>

        <div className="grid gap-2">
          <label htmlFor="income" className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Annual Income
          </label>
          <div className="relative font-mono">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">₹</span>
            <input 
              id="income"
              className="input pl-8 text-xs font-sans" 
              placeholder="e.g. 250000" 
              type="number" 
              value={filters.income} 
              onChange={(e) => setFilters({ ...filters, income: e.target.value })} 
            />
          </div>
        </div>

        <div className="grid gap-2">
          <label htmlFor="beneficiary" className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Beneficiary
          </label>
          <select 
            id="beneficiary"
            className="input text-xs font-semibold cursor-pointer" 
            value={filters.beneficiaryType} 
            onChange={(e) => setFilters({ ...filters, beneficiaryType: e.target.value })}
          >
            <option value="student">Student</option>
            <option value="farmer">Farmer</option>
            <option value="employee">Employee</option>
          </select>
        </div>

        <button 
          type="submit"
          className="btn-primary w-full h-10 gap-1.5 text-xs font-semibold" 
          disabled={loading}
        >
          <Search size={14} />
          <span>{loading ? 'Searching...' : 'Find Schemes'}</span>
        </button>
      </form>

      {/* Error Output */}
      <div className="mt-5"><ErrorState message={error} /></div>

      {/* Scheme Result Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {schemes.map((scheme) => (
          <article 
            key={scheme.id} 
            className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-soft hover:shadow-md hover:border-primary-200 transition-all duration-200"
          >
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                {scheme.state || 'All India'} / {scheme.beneficiary_type}
              </span>
              <h2 className="mt-4 text-base font-bold text-slate-900 leading-snug group-hover:text-primary-600 transition-colors">
                {scheme.title}
              </h2>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-3">
                {scheme.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
              <div className="flex flex-wrap gap-2 text-[10px] text-slate-600 font-semibold">
                {scheme.max_income ? (
                  <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                    Income &le; ₹{scheme.max_income.toLocaleString('en-IN')}
                  </span>
                ) : (
                  <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                    Income varies
                  </span>
                )}
                <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                  Age {scheme.min_age || 'Any'}-{scheme.max_age || 'Any'}
                </span>
              </div>
              {scheme.application_url && (
                <a 
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700 transition" 
                  href={scheme.application_url} 
                  target="_blank" 
                  rel="noreferrer"
                >
                  <span>Official Details</span>
                  <ExternalLink size={11} className="text-slate-400 group-hover:text-primary-500" />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Empty Initial / Empty Result State */}
      {!schemes.length && !loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <EmptyState title="Find schemes matching your background" text="Adjust filters above to scan schemes for students, farmers, or professionals." />
        </div>
      )}
    </section>
  );
}
