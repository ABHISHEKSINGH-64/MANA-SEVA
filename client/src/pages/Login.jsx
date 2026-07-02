import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorState } from '../components/State';
import { useAuth } from '../hooks/useAuth';
import { apiMessage } from '../services/api';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, Landmark, Compass } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(apiMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to save service guides, verify eligibility checklists, and track paperwork guidelines.">
      <form onSubmit={submit} className="space-y-4">
        <ErrorState message={error} />
        
        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="login-email" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
          <div className="relative">
            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              id="login-email"
              className="input pl-10 text-xs" 
              type="email" 
              required 
              placeholder="e.g. citizen@manaseva.in" 
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label htmlFor="login-password" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Password</label>
          <div className="relative">
            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              id="login-password"
              className="input pl-10 pr-10 text-xs" 
              type={showPassword ? 'text' : 'password'} 
              required 
              placeholder="••••••••" 
              value={form.password} 
              onChange={(e) => setForm({ ...form, password: e.target.value })} 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <button 
          type="submit"
          className="btn-primary h-10 w-full text-xs font-semibold gap-1.5 pt-0.5" 
          disabled={loading}
        >
          {loading ? (
            <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />
          ) : (
            <ShieldCheck size={14} />
          )}
          <span>{loading ? 'Logging in...' : 'Login'}</span>
        </button>

        <p className="text-xs text-slate-500 text-center pt-2 border-t border-slate-100">
          New here?{' '}
          <Link className="font-bold text-primary-600 hover:text-primary-700 transition" to="/register">
            Create an account
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <section className="mx-auto grid max-w-5xl gap-12 px-4 py-16 md:grid-cols-[0.9fr_1.1fr] md:items-center lg:px-8">
      {/* Description Side */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-600 text-white shadow-md shadow-primary-600/10">
            <Compass size={18} />
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-900">Mana Seva Portal</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight sm:text-4xl">{title}</h1>
          <p className="text-sm text-slate-500 leading-relaxed">{subtitle}</p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-200">
          {[
            'Bookmark frequently referenced public guides.',
            'Maintain interactive checklist tables for physical dossiers.',
            'Query the AI Assistant for fast eligibility answers.'
          ].map((text) => (
            <div key={text} className="flex gap-2.5 items-start text-xs text-slate-500">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <p className="leading-normal">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Forms Box Side */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-premium w-full max-w-md mx-auto">
        {children}
      </div>
    </section>
  );
}
