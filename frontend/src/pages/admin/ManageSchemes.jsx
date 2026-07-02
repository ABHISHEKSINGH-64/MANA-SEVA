import { AdminCrud } from './AdminCrud';

export default function ManageSchemes() {
  return (
    <AdminCrud
      title="Manage Government Schemes"
      endpoint="/schemes"
      listKey="schemes"
      defaults={{ title: '', state: 'All India', description: '', min_age: '', max_age: '', max_income: '', beneficiary_type: 'student', application_url: '' }}
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'state', label: 'State' },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'min_age', label: 'Minimum age', type: 'number' },
        { name: 'max_age', label: 'Maximum age', type: 'number' },
        { name: 'max_income', label: 'Maximum income', type: 'number' },
        { name: 'beneficiary_type', label: 'Beneficiary type', required: true },
        { name: 'application_url', label: 'Application URL' }
      ]}
    />
  );
}
