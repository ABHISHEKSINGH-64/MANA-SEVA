import { useState } from 'react';
import { api, apiMessage } from '../services/api';
import { ErrorState } from '../components/State';
import { MessageSquare, Cpu, UserCheck, Sparkles, Send, MapPin, Calculator, BookOpen } from 'lucide-react';

export default function AIAssistant() {
  const [message, setMessage] = useState('Which documents do I need for a scholarship?');
  const [profile, setProfile] = useState({ age: '', state: '', income: '', occupation: 'student', education: '' });
  const [chat, setChat] = useState(null);
  const [matches, setMatches] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');

  const quickQuestions = [
    'What do I need for a scholarship?',
    'Aadhaar card processing speed?',
    'Passport document checklist?'
  ];

  const ask = async (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    setLoading('chat');
    setError('');
    try {
      const { data } = await api.post('/ai/chat', { message });
      setChat(data);
    } catch (err) {
      setError(apiMessage(err));
    } finally {
      setLoading('');
    }
  };

  const checkEligibility = async (event) => {
    event.preventDefault();
    setLoading('eligibility');
    setError('');
    try {
      const { data } = await api.post('/ai/eligibility', profile);
      setMatches(data);
    } catch (err) {
      setError(apiMessage(err));
    } finally {
      setLoading('');
    }
  };

  return (
    <section className="page-shell space-y-8 animate-fade-in">
      {/* Top Title */}
      <div className="border-b border-slate-200/60 pb-6 space-y-2">
        <p className="section-eyebrow">AI citizen support</p>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mana Seva AI Assistant</h1>
        <p className="max-w-2xl text-sm text-slate-500 leading-relaxed">
          Ask questions, verify paperwork prerequisites, or run instant matches to find programs you qualify for.
        </p>
      </div>

      <div className="mt-6"><ErrorState message={error} /></div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column: Chat Assistant */}
        <form onSubmit={ask} className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-50 text-primary-600">
                <MessageSquare size={16} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Chat Guidance Assistant</h2>
                <p className="text-[10px] text-slate-400 font-medium">Ask general rules and document advice</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="ai-chat-input" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Your Question</label>
              <textarea 
                id="ai-chat-input"
                className="input min-h-[100px] py-3 text-xs leading-relaxed resize-none" 
                value={message} 
                onChange={(event) => setMessage(event.target.value)} 
                placeholder="Ask about passport procedures, scholarship rules, utility desk details..."
              />
            </div>

            {/* Quick replies */}
            <div className="flex flex-wrap gap-2 pt-1">
              {quickQuestions.map((q) => (
                <button
                  type="button"
                  key={q}
                  onClick={() => setMessage(q)}
                  className="rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1 text-[10px] font-semibold text-slate-500 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-3">
            <button 
              type="submit"
              className="btn-primary h-10 w-full gap-1.5 text-xs font-semibold" 
              disabled={loading === 'chat'}
            >
              <Send size={12} />
              <span>{loading === 'chat' ? 'Thinking...' : 'Ask Assistant'}</span>
            </button>

            {chat && (
              <div className="rounded-xl border border-primary-100 bg-primary-50/40 p-4 text-xs text-slate-700 space-y-2 animate-fade-in">
                <div className="flex items-center gap-1.5 font-bold text-primary-700">
                  <Sparkles size={13} />
                  <span>Assistant Answer</span>
                </div>
                <p className="leading-relaxed bg-white/60 p-3 rounded-lg border border-primary-50 text-slate-600">
                  {chat.answer}
                </p>
              </div>
            )}
          </div>
        </form>

        {/* Right Column: Eligibility Predictor */}
        <form onSubmit={checkEligibility} className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-50 text-primary-600">
                <UserCheck size={16} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Eligibility Auto-Checker</h2>
                <p className="text-[10px] text-slate-400 font-medium">Verify schemes matching your profile</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label htmlFor="ai-age-input" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Age</label>
                <div className="relative">
                  <Calculator size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    id="ai-age-input"
                    className="input pl-9 text-xs" 
                    placeholder="e.g. 18" 
                    type="number" 
                    value={profile.age} 
                    onChange={(event) => setProfile({ ...profile, age: event.target.value })} 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="ai-state-input" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">State</label>
                <div className="relative">
                  <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    id="ai-state-input"
                    className="input pl-9 text-xs" 
                    placeholder="e.g. Telangana" 
                    value={profile.state} 
                    onChange={(event) => setProfile({ ...profile, state: event.target.value })} 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="ai-income-input" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Annual Income</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">₹</span>
                  <input 
                    id="ai-income-input"
                    className="input pl-7 text-xs" 
                    placeholder="e.g. 250000" 
                    type="number" 
                    value={profile.income} 
                    onChange={(event) => setProfile({ ...profile, income: event.target.value })} 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="ai-occupation-select" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Occupation</label>
                <select 
                  id="ai-occupation-select"
                  className="input text-xs font-semibold cursor-pointer" 
                  value={profile.occupation} 
                  onChange={(event) => setProfile({ ...profile, occupation: event.target.value })}
                >
                  <option value="student">Student</option>
                  <option value="farmer">Farmer</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-3">
            <button 
              type="submit"
              className="btn-primary h-10 w-full gap-1.5 text-xs font-semibold" 
              disabled={loading === 'eligibility'}
            >
              <Cpu size={12} />
              <span>{loading === 'eligibility' ? 'Checking...' : 'Check Matches'}</span>
            </button>

            {matches && (
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-xs space-y-2 max-h-[160px] overflow-y-auto animate-fade-in">
                <p className="font-bold text-slate-700 flex items-center gap-1">
                  <BookOpen size={12} className="text-slate-400" />
                  <span>Eligible Matches ({matches.eligibleSchemes.length})</span>
                </p>
                <div className="grid gap-2">
                  {matches.eligibleSchemes.map((scheme) => (
                    <div key={scheme.id} className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm">
                      <p className="font-bold text-slate-900">{scheme.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{scheme.description}</p>
                    </div>
                  ))}
                  {!matches.eligibleSchemes.length && (
                    <p className="text-slate-400 text-center py-2">No matching schemes. Try expanding parameters.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
