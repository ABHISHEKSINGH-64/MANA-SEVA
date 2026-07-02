import { useState } from 'react';
import { ErrorState } from '../components/State';
import { useAuth } from '../hooks/useAuth';
import { apiMessage } from '../services/api';
import { User, Mail, Phone, Globe, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '', preferredLanguage: user.preferred_language || 'en' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await updateProfile(form);
      setMessage('Your profile has been successfully updated!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(apiMessage(err));
    }
  };

  return (
    <section className="page-shell max-w-2xl space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200/60 pb-5 space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Citizen Profile</p>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-xs text-slate-500">Manage your identity credentials, language defaults, and emergency contacts.</p>
      </div>

      {/* Form Card */}
      <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft space-y-5">
        <ErrorState message={error} />
        {message && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-100 px-4 py-3 text-xs text-emerald-700 font-semibold animate-fade-in">
            <CheckCircle2 size={14} />
            <span>{message}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label htmlFor="name-input" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                id="name-input"
                className="input pl-9 text-xs" 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                placeholder="Full Name"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label htmlFor="email-input" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address (Primary)</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                id="email-input"
                className="input pl-9 text-xs bg-slate-50/70 border-slate-200/60 text-slate-400 cursor-not-allowed" 
                value={user.email} 
                disabled 
              />
            </div>
            <p className="text-[9px] text-slate-400 leading-normal">Email address matches your primary credential. To request modifications, contact helpdesk.</p>
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label htmlFor="phone-input" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Contact</label>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                id="phone-input"
                className="input pl-9 text-xs" 
                placeholder="e.g. +91 9999999999" 
                value={form.phone} 
                onChange={(e) => setForm({ ...form, phone: e.target.value })} 
              />
            </div>
          </div>

          {/* Preferred Language */}
          <div className="space-y-1">
            <label htmlFor="language-select" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Language Default</label>
            <div className="relative">
              <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select 
                id="language-select"
                className="input pl-9 text-xs font-semibold cursor-pointer" 
                value={form.preferredLanguage} 
                onChange={(e) => setForm({ ...form, preferredLanguage: e.target.value })}
              >
                <option value="en">English</option>
                <option value="te">తెలుగు</option>
                <option value="hi">हिंदी</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100">
          <button type="submit" className="btn-primary h-10 w-full text-xs font-semibold gap-1.5">
            <ShieldCheck size={14} />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </section>
  );
}
