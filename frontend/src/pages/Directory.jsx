import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, ExternalLink, ShieldCheck, CornerDownRight } from 'lucide-react';
import { EmptyState, ErrorState, Loader } from '../components/State';
import { useFetch } from '../hooks/useFetch';

const directories = {
  scholarships: { title: 'Scholarship Finder', endpoint: '/scholarships', key: 'scholarships', hint: 'Filter scholarships by provider, state, qualification level, income, and deadline.' },
  loans: { title: 'Loan Comparison', endpoint: '/loans', key: 'loans', hint: 'Compare student and development loan terms before approaching local banking partners.' },
  banks: { title: 'Bank Directory', endpoint: '/banks', key: 'banks', hint: 'Banking institutions and branch resources supporting citizen account registrations.' },
  hospitals: { title: 'Government Hospitals', endpoint: '/hospitals', key: 'hospitals', hint: 'Public hospital listings with emergency contacts, blood bank metrics, and location services.' },
  'blood-banks': { title: 'Blood Banks', endpoint: '/blood-banks', key: 'bloodBanks', hint: 'Emergency blood banks directory, contact numbers, and storage details.' },
  jobs: { title: 'Government Job Notifications', endpoint: '/jobs', key: 'jobs', hint: 'Public employment openings, eligibility requirements, and direct application guides.' },
  internships: { title: 'Citizen Internships', endpoint: '/internships', key: 'internships', hint: 'Skill learning opportunities and government student apprenticeships.' },
  utilities: { title: 'Utility Services', endpoint: '/utilities', key: 'utilities', hint: 'Municipal boards, gas, power, water billing desks, and complaint desks.' },
  'emergency-contacts': { title: 'Emergency Hotlines', endpoint: '/emergency-contacts', key: 'emergencyContacts', hint: 'Rapid response contacts for medical, fire, national safety, and security desks.' }
};

const preferredFields = ['title', 'name', 'provider', 'organization', 'bank', 'state', 'city', 'district', 'qualification', 'level', 'status', 'deadline', 'number', 'phone', 'support_hint'];

export default function Directory() {
  const { type = 'scholarships' } = useParams();
  const config = directories[type] || directories.scholarships;
  const [search, setSearch] = useState('');
  const { data, loading, error } = useFetch(`${config.endpoint}${search ? `?search=${encodeURIComponent(search)}` : ''}`, { [config.key]: [] });
  const items = data[config.key] || [];

  const visibleFields = useMemo(() => preferredFields, []);

  return (
    <section className="page-shell space-y-8">
      {/* Header and Search Area */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end justify-between border-b border-slate-200/60 pb-8">
        <div className="space-y-3">
          <p className="section-eyebrow">Citizen directories</p>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{config.title}</h1>
          <p className="max-w-xl text-sm text-slate-500 leading-relaxed">{config.hint}</p>
        </div>
        
        {/* Modern Search Field */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            className="input pl-10 text-xs shadow-sm hover:border-slate-300" 
            placeholder="Search directory..." 
            value={search} 
            onChange={(event) => setSearch(event.target.value)} 
          />
        </div>
      </div>

      {/* Error state */}
      <div><ErrorState message={error} /></div>

      {/* Grid of Results */}
      {loading ? (
        <Loader />
      ) : items.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article 
              key={item.id} 
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-soft hover:shadow-md hover:border-primary-200 transition-all duration-200 animate-fade-in"
            >
              <div className="space-y-4">
                <h2 className="text-base font-bold text-slate-900 leading-tight group-hover:text-primary-600 transition-colors">
                  {item.title || item.name}
                </h2>
                
                {/* Dynamically list additional properties */}
                <div className="grid gap-2 border-t border-slate-50 pt-3 text-[11px] text-slate-500">
                  {visibleFields.map((field) => 
                    item[field] && field !== 'title' && field !== 'name' ? (
                      <div key={field} className="flex items-start gap-1">
                        <CornerDownRight size={10} className="text-slate-300 shrink-0 mt-1" />
                        <p className="leading-relaxed">
                          <span className="font-semibold capitalize text-slate-700">{field.replaceAll('_', ' ')}: </span>
                          <span className="text-slate-600 font-medium">
                            {Array.isArray(item[field]) ? item[field].join(', ') : item[field]}
                          </span>
                        </p>
                      </div>
                    ) : null
                  )}
                </div>
              </div>

              {/* Action Button */}
              {(item.url || item.website) && (
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <a 
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700 transition" 
                    href={item.url || item.website} 
                    target="_blank" 
                    rel="noreferrer"
                  >
                    <span>Official Details</span>
                    <ExternalLink size={11} className="text-slate-400 group-hover:text-primary-500" />
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <EmptyState />
        </div>
      )}
    </section>
  );
}
