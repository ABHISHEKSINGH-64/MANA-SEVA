import { AdminCrud } from './AdminCrud';

export default function ManageCategories() {
  return (
    <AdminCrud
      title="Manage Categories"
      endpoint="/categories"
      listKey="categories"
      defaults={{ name: '', slug: '', description: '', icon: '' }}
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'slug', label: 'Slug', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'icon', label: 'React icon name' }
      ]}
    />
  );
}
