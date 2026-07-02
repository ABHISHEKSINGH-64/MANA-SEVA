import { AdminCrud } from './AdminCrud';

export default function ManageServices() {
  return (
    <AdminCrud
      title="Manage Services"
      endpoint="/services"
      listKey="services"
      defaults={{ category_id: '', title: '', slug: '', short_description: '', official_url: '', processing_time: '', fee: '', is_popular: false }}
      fields={[
        { name: 'category_id', label: 'Category ID', type: 'number', required: true },
        { name: 'title', label: 'Title', required: true },
        { name: 'slug', label: 'Slug', required: true },
        { name: 'short_description', label: 'Short description', type: 'textarea', required: true },
        { name: 'official_url', label: 'Official URL' },
        { name: 'processing_time', label: 'Processing time' },
        { name: 'fee', label: 'Fee' }
      ]}
    />
  );
}
