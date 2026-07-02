import { Search, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

const defaultSuggestions = ['Aadhaar', 'Scholarship', 'Passport', 'Voter ID'];

export function SearchBar({ value, onChange, onSubmit, suggestions = defaultSuggestions, onSuggestionSelect, placeholder, compact = false }) {
  const { t } = useLanguage();
  const selectSuggestion = (suggestion) => {
    onChange(suggestion);
    onSuggestionSelect?.(suggestion);
  };

  return (
    <div className="w-full max-w-3xl">
      <form 
        onSubmit={onSubmit} 
        className={`flex w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition-all duration-200 focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-100 ${
          compact ? 'max-w-2xl' : ''
        }`}
      >
        <div className="flex flex-1 items-center gap-3 px-4">
          <Search size={18} className="shrink-0 text-slate-400" />
          <input
            className="w-full py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 bg-transparent"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || t('searchPlaceholder')}
            aria-label="Search services"
          />
          {value && (
            <button 
              type="button" 
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition" 
              onClick={() => onChange('')} 
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button 
          type="submit"
          className="bg-primary-600 px-5 text-sm font-semibold text-white transition hover:bg-primary-700 active:bg-primary-800 flex items-center gap-1.5"
        >
          <span className="hidden sm:inline">Search</span>
          <ArrowRight size={16} />
        </button>
      </form>
      <div className="mt-3.5 flex flex-wrap gap-2 items-center">
        <span className="text-xs text-slate-400 font-medium">Popular:</span>
        {suggestions.map((suggestion) => (
          <button
            type="button"
            key={suggestion}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600"
            onClick={() => selectSuggestion(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
