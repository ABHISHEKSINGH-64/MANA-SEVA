import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorState } from '../components/State';
import { useAuth } from '../hooks/useAuth';
import { apiMessage } from '../services/api';
import { AuthShell } from './Login';
import { User, Mail, Phone, Globe, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', preferredLanguage: 'en' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = useMemo(() => getPasswordStrength(form.password), [form.password]);

  const strengthLabel = () => {
    if (strength === 0) return '';
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    return 'Strong';
  };

  const strengthColor = () => {
    if (strength === 1) return 'bg-red-500';
    if (strength === 2) return 'bg-amber-500';
    if (strength === 3) return 'bg-blue-500';
    if (strength === 4) return 'bg-emerald-500';
    return 'bg-slate-200';
  };

  const submit = async (event) => {
    event.preventDefault();
    if (form.password.length < 8) return setError('Password must be at least 8 characters');
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(apiMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Save favorite services and maintain document checklists.">
      <form onSubmit={submit} className="space-y-4">
        <ErrorState message={error} />
        
        {/* Full Name */}
        <div className="space-y-1">
          <label htmlFor="reg-name" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
          <div className="relative">
            <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              id="reg-name"
              className="input pl-10 text-xs" 
              required 
              placeholder="e.g. John Doe" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <label htmlFor="reg-email" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
          <div className="relative">
            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              id="reg-email"
              className="input pl-10 text-xs" 
              type="email" 
              required 
              placeholder="e.g. email@domain.com" 
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
            />
          </div>
        </div>

        {/* Phone Contact */}
        <div className="space-y-1">
          <label htmlFor="reg-phone" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Contact</label>
          <div className="relative">
            <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              id="reg-phone"
              className="input pl-10 text-xs" 
              placeholder="e.g. +91 9999999999" 
              value={form.phone} 
              onChange={(e) => setForm({ ...form, phone: e.target.value })} 
            />
          </div>
        </div>

        {/* Preferred Language */}
        <div className="space-y-1">
          <label htmlFor="reg-lang" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Language Default</label>
          <div className="relative">
            <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select 
              id="reg-lang"
              className="input pl-10 text-xs font-semibold cursor-pointer" 
              value={form.preferredLanguage} 
              onChange={(e) => setForm({ ...form, preferredLanguage: e.target.value })}
            >
              <option value="en">English</option>
              <option value="te">తెలుగు</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label htmlFor="reg-pass" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Password</label>
          <div className="relative">
            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              id="reg-pass"
              className="input pl-10 pr-10 text-xs" 
              type={showPassword ? 'text' : 'password'} 
              required 
              placeholder="Min. 8 characters" 
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

          {/* Live Strength Meter */}
          {form.password && (
            <div className="pt-1.5 space-y-1 animate-fade-in">
              <div className="h-1 w-full rounded-full bg-slate-100 overflow-hidden flex">
                <div 
                  className={`h-full transition-all duration-300 ${strengthColor()}`}
                  style={{ width: `${(strength / 4) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-bold tracking-tight text-slate-400 uppercase">
                <span>Password Strength</span>
                <span className={strength === 4 ? 'text-emerald-500' : 'text-slate-500'}>{strengthLabel()}</span>
              </div>
            </div>
          )}
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
          <span>{loading ? 'Creating Account...' : 'Register'}</span>
        </button>

        <p className="text-xs text-slate-500 text-center pt-2 border-t border-slate-100">
          Already registered?{' '}
          <Link className="font-bold text-primary-600 hover:text-primary-700 transition" to="/login">
            Login
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
