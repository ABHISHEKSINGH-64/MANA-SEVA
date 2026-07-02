import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Search, 
  HelpCircle, 
  GraduationCap, 
  Activity, 
  FileText, 
  ShieldCheck, 
  Landmark,
  Briefcase,
  Sprout,
  Award,
  BookOpen,
  HelpCircle as QuestionIcon,
  Bot,
  UserCheck,
  TrendingUp,
  Sparkles,
  Play,
  FileCheck,
  Globe2,
  BellRing
} from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { ServiceCard } from '../components/ServiceCard';
import { EmptyState, ErrorState, Loader } from '../components/State';
import { useLanguage } from '../hooks/useLanguage';
import { useFetch } from '../hooks/useFetch';

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { data, loading, error } = useFetch('/services?popular=true', { services: [] });
  const { data: latestData } = useFetch('/services', { services: [] });
  
  const submitSearch = (term = query) => {
    const next = term.trim();
    navigate(`/services${next ? `?search=${encodeURIComponent(next)}` : ''}`);
  };

  const categories = [
    { name: 'Documents', icon: FileText, to: '/services?category=documents', count: '10 Guides' },
    { name: 'Education', icon: GraduationCap, to: '/services?category=education', count: '6 Guides' },
    { name: 'Banking', icon: Landmark, to: '/directory/banks', count: '24 Banks' },
    { name: 'Jobs', icon: Briefcase, to: '/directory/jobs', count: 'Updates' },
    { name: 'Health', icon: Activity, to: '/directory/hospitals', count: '18 Hospitals' },
    { name: 'Farmers', icon: Sprout, to: '/services?category=farmer-services', count: '5 Guides' },
    { name: 'Certificates', icon: Award, to: '/services?search=certificate', count: '9 Guides' },
    { name: 'FAQs', icon: HelpCircle, to: '/faq', count: 'General' }
  ];

  const workflowSteps = [
    { title: 'Search Service Guide', desc: 'Find instructions and document lists for Aadhaar, passports, birth records, or college scholarships.', icon: Search },
    { title: 'Mark Required Files', desc: 'Check off identity credentials and photocopy templates. Add them to your live user dossier checklist.', icon: FileCheck },
    { title: 'Submit Without Errors', desc: 'Once your physical file is ready, click official direct links to apply without mid-step failures.', icon: ShieldCheck }
  ];

  const benefits = [
    { title: 'No Agent Intermediaries', desc: 'Skip local commission agents. Mana Seva gives you the exact blueprint for direct submission.', icon: UserCheck },
    { title: 'Multilingual Help', desc: 'Read guides and application steps in English, Telugu, and Hindi UI configurations.', icon: Globe2 },
    { title: 'AI Assistant Check', desc: 'Ask natural language queries and predict scheme eligibility rules instantly.', icon: Bot }
  ];

  const faqs = [
    { q: 'Is Mana Seva an official government application portal?', a: 'No. Mana Seva is an open citizen guidance site. We clarify instructions, requirements, and checkpoints to help you prepare. You must make final applications on official portals.' },
    { q: 'How does the Document Checklist help me?', a: 'When you open a service guide, check documents you own or need. They will sync to your dashboard so you can verify dossier completeness offline.' },
    { q: 'How do I search for state-specific schemes?', a: 'Open the Scheme Finder, select your home state, age, beneficiary type, and annual income to scan matching financial aids.' }
  ];

  return (
    <div className="space-y-20 pb-12 animate-fade-in">
      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center bg-white border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.05),transparent_50%)]" />
        <div className="relative max-w-4xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-100 bg-primary-50 px-3.5 py-1 text-xs font-bold text-primary-700">
            <Sparkles size={12} /> Citizen Guidance Platform 2026
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-6xl leading-[1.1]">
            Public Services. <br />
            <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Made Clear, Simple, and Fast.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base text-slate-500 leading-relaxed">
            Avoid confusion. Scan document checklists, eligibility guidelines, and application steps for all major citizen services in India.
          </p>

          <div className="pt-6 flex justify-center">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={(event) => {
                event.preventDefault();
                submitSearch();
              }}
              onSuggestionSelect={submitSearch}
              suggestions={['Aadhaar', 'Scholarship', 'Passport', 'Income certificate', 'Birth Certificate']}
            />
          </div>
        </div>
      </section>

      {/* Metric Stats Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
          {[
            ['19+', 'Service Guides Listed', TrendingUp],
            ['8', 'Citizen Categories', Landmark],
            ['3', 'Languages Enabled', Globe2],
            ['24/7', 'Self-Help Support', Bot]
          ].map(([value, label, Icon]) => (
            <div key={label} className="panel p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
              </div>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-50 text-slate-400 border border-slate-100 shrink-0">
                <Icon size={16} />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Step Stepper */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <p className="section-eyebrow">Interactive Workflow</p>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight sm:text-3xl">How Mana Seva Helps You</h2>
          <p className="text-xs text-slate-500">A clear preparation blueprint for error-free government applications.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3 relative">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="panel p-6 space-y-4 relative bg-white">
                <span className="absolute top-4 right-4 text-xs font-bold text-slate-200">0{idx + 1}</span>
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary-50 text-primary-600">
                  <Icon size={20} />
                </span>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-800">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="section-eyebrow">Most Visited</p>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Popular Service Guides</h2>
          </div>
          <Link className="btn-secondary h-9 text-xs gap-1.5" to="/services">
            <span>View All</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        <ErrorState message={error} />
        {loading ? (
          <Loader />
        ) : data.services.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.services.slice(0, 6).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>

      {/* Departments Slider list */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-1">
          <p className="section-eyebrow">Browse categories</p>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Browse by Citizen Department</h2>
        </div>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link 
                key={cat.name} 
                to={cat.to} 
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-soft hover:shadow-md hover:border-primary-200 transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-50 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    <Icon size={20} />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{cat.name}</p>
                    <p className="text-[9px] font-semibold text-slate-400">{cat.count}</p>
                  </div>
                </div>
                <ChevronRightIcon className="text-slate-300 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* AI Assistant Preview Module */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_20rem] items-center rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-indigo-700">
              <Bot size={11} /> AI citizen helper
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Ask the AI Guide</h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
              Type custom questions like "What do I need for a passport?" or "Verify state rules for housing". Receive instant matching answers.
            </p>
            <div className="pt-2">
              <Link className="btn-primary h-9 text-xs inline-flex gap-1.5" to="/assistant">
                <span>Start AI Chat</span>
                <Play size={10} className="fill-current text-white" />
              </Link>
            </div>
          </div>

          {/* Chat Mock Card */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-3 text-[11px] shadow-sm">
            <div className="flex gap-2 items-start justify-end">
              <div className="bg-primary-600 text-white rounded-lg p-2.5 max-w-[80%] shadow-sm">
                What does a student need for a scholarship?
              </div>
            </div>
            <div className="flex gap-2 items-start">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 shrink-0">
                <Bot size={12} />
              </span>
              <div className="bg-white border border-slate-200 rounded-lg p-2.5 max-w-[80%] text-slate-600 shadow-sm space-y-1">
                <p className="font-semibold text-slate-800">Mana Seva AI</p>
                <p className="leading-relaxed">You typically require: 1. Aadhaar Card, 2. Income certificate, 3. School marks sheet copy, 4. Bank account passbook.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <p className="section-eyebrow">Why use us</p>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight sm:text-3xl">Platform Benefits</h2>
          <p className="text-xs text-slate-500">Helping you prepare dossier paper sheets with maximum speed.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="panel p-5 space-y-4">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Icon size={20} />
                </span>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800">{benefit.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Latest Services list */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <p className="section-eyebrow">Updates</p>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recently Added Guides</h2>
        </div>
        {latestData.services.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {latestData.services.slice(-4).map((service) => (
              <Link 
                key={service.id} 
                to={`/services/${service.slug}`}
                className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white shadow-soft hover:shadow-md hover:border-primary-200 transition-all duration-200"
              >
                <div className="space-y-1 truncate pr-4">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-primary-600 transition-colors">{service.title}</p>
                  <p className="text-[10px] text-slate-400 truncate leading-normal">{service.short_description}</p>
                </div>
                <ChevronRightIcon className="text-slate-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>

      {/* Government Updates Bulletin */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
            <BellRing size={14} className="text-primary-600" />
            <span>Government Announcements Bulletin (Self-Check)</span>
          </div>
          <div className="grid gap-3 text-xs">
            <div className="flex justify-between items-start gap-4 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-700">PAN Card Linking Deadline:</span>
              <span className="text-[10px] text-slate-400 font-semibold text-right">Mandatory linking with Aadhaar to avoid card deactivation.</span>
            </div>
            <div className="flex justify-between items-start gap-4 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-700">Aadhaar Document Updates:</span>
              <span className="text-[10px] text-slate-400 font-semibold text-right">Free online document re-verification extended on myAadhaar dashboard.</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ list */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2">
          <p className="section-eyebrow">FAQ Help</p>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight sm:text-3xl font-extrabold">Citizen FAQs</h2>
        </div>
        <div className="grid gap-3">
          {faqs.map((f, idx) => (
            <details 
              key={idx} 
              className="group rounded-xl border border-slate-200 bg-white p-4 shadow-soft cursor-pointer transition-all duration-200 open:ring-1 open:ring-primary-100 open:border-primary-200"
            >
              <summary className="flex items-center justify-between gap-4 font-semibold text-xs text-slate-800 list-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-2">
                  <QuestionIcon size={14} className="text-slate-400 group-open:text-primary-600 transition-colors" />
                  {f.q}
                </span>
                <ChevronRightIcon size={12} className="text-slate-400 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="mt-3.5 pt-3 border-t border-slate-50 text-[11px] text-slate-500 leading-relaxed pl-6">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function ChevronRightIcon({ className, size = 14 }) {
  return <ArrowRight className={`transform ${className}`} size={size} />;
}
