import { useState } from 'react';
import { api, apiMessage } from '../../services/api';
import { EmptyState, ErrorState, Loader } from '../../components/State';
import { useFetch } from '../../hooks/useFetch';
import { Edit2, Trash2, CheckCircle2, PlusCircle, XCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminCrud({ title, endpoint, listKey, fields, defaults, renderTitle }) {
  const { data, setData, loading, error } = useFetch(endpoint, { [listKey]: [] });
  const [form, setForm] = useState(defaults);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');
  const items = data[listKey] || [];

  const submit = async (event) => {
    event.preventDefault();
    setFormError('');
    setMessage('');
    try {
      const response = editingId
        ? await api.put(`${endpoint}/${editingId}`, form)
        : await api.post(endpoint, form);
      const key = endpoint.split('/').filter(Boolean).pop().replace(/s$/, '');
      const saved = response.data[key] || Object.values(response.data)[0];
      setData({
        [listKey]: editingId
          ? items.map((item) => item.id === editingId ? { ...item, ...saved } : item)
          : [saved, ...items]
      });
      setForm(defaults);
      setEditingId(null);
      setMessage(editingId ? 'Item updated successfully!' : 'New item registered successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setFormError(apiMessage(err));
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`${endpoint}/${id}`);
      setData({ [listKey]: items.filter((item) => item.id !== id) });
      setMessage('Item removed successfully');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setFormError('Failed to remove item');
    }
  };

  if (loading) return <Loader />;

  return (
    <section className="page-shell space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200/60 pb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <Link className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary-600 transition mb-1" to="/admin">
            <ArrowLeft size={12} /> Back to dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-start">
        {/* Editor Form */}
        <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft space-y-5">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
            {editingId ? 'Modify Record' : 'Register New Item'}
          </h2>
          <ErrorState message={formError || error} />
          
          {message && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-100 px-4 py-3 text-xs text-emerald-700 font-semibold animate-fade-in">
              <CheckCircle2 size={14} />
              <span>{message}</span>
            </div>
          )}

          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.name} className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea 
                    className="input min-h-[100px] py-3 text-xs leading-relaxed resize-none" 
                    placeholder={field.label} 
                    value={form[field.name] ?? ''} 
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })} 
                    required={field.required} 
                  />
                ) : (
                  <input 
                    className="input text-xs" 
                    type={field.type || 'text'} 
                    placeholder={field.label} 
                    value={form[field.name] ?? ''} 
                    onChange={(e) => setForm({ ...form, [field.name]: field.type === 'number' ? Number(e.target.value) || '' : e.target.value })} 
                    required={field.required} 
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2.5 pt-3 border-t border-slate-100">
            <button type="submit" className="btn-primary h-9 px-4 text-xs gap-1.5 font-semibold">
              <PlusCircle size={14} />
              <span>{editingId ? 'Save Changes' : 'Create Record'}</span>
            </button>
            {editingId && (
              <button 
                type="button" 
                className="btn-secondary h-9 px-4 text-xs gap-1.5 font-semibold text-slate-500" 
                onClick={() => { setEditingId(null); setForm(defaults); }}
              >
                <XCircle size={14} />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </form>

        {/* List of Registry Items */}
        <div className="grid gap-3 max-h-[600px] overflow-y-auto pr-1">
          {items.map((item) => (
            <article 
              key={item.id} 
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-soft hover:shadow-md hover:border-primary-200 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                    {renderTitle ? renderTitle(item) : item.title || item.name || item.question}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description || item.short_description || item.answer || item.slug}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-50 flex justify-end gap-2">
                <button 
                  className="btn-secondary h-8 px-3 text-xs gap-1 font-semibold" 
                  onClick={() => { setEditingId(item.id); setForm({ ...defaults, ...item }); }}
                >
                  <Edit2 size={12} />
                  <span>Edit</span>
                </button>
                <button 
                  className="inline-flex h-8 items-center justify-center rounded-lg border border-red-100 bg-red-50 px-3 text-xs font-semibold text-red-600 hover:bg-red-100/70 transition-all active:scale-[0.98] gap-1"
                  onClick={() => remove(item.id)}
                >
                  <Trash2 size={12} />
                  <span>Delete</span>
                </button>
              </div>
            </article>
          ))}
          {!items.length && (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <EmptyState title="No items registered yet" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
