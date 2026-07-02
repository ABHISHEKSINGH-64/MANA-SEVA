import { Link, useSearchParams } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { EmptyState, ErrorState, Loader } from '../components/State';
import { useFetch } from '../hooks/useFetch';

export default function Categories() {
  const [params] = useSearchParams();
  const { data, loading, error } = useFetch('/categories', { categories: [] });

  return (
    <section className="page-shell">
      <p className="section-eyebrow">Departments</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-950">Service Categories</h1>
      <p className="mt-2 max-w-3xl text-slate-600">Browse documents, education, banking, travel, certificates, utilities, health, farmer support, and government schemes.</p>
      <div className="mt-6"><ErrorState message={error} /></div>
      {loading ? <Loader /> : data.categories.length ? (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {data.categories.map((category) => (
            <Link
              key={category.id}
              to={`/services?category=${category.slug}`}
              className={`panel p-5 transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-soft ${params.get('type') === category.slug ? 'border-primary-500' : ''}`}
            >
              <p className="section-eyebrow">{category.slug.replaceAll('-', ' ')}</p>
              <h2 className="mt-2 text-lg font-bold">{category.name}</h2>
              <p className="mt-2 text-sm text-slate-600">{category.description}</p>
              <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary-700">{category.service_count} services <FaArrowRight /></p>
            </Link>
          ))}
        </div>
      ) : <EmptyState />}
    </section>
  );
}
