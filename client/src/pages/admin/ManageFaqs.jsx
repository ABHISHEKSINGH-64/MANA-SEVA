import { AdminCrud } from './AdminCrud';

export default function ManageFaqs() {
  return (
    <AdminCrud
      title="Manage FAQs"
      endpoint="/faqs"
      listKey="faqs"
      defaults={{ service_id: '', category_id: '', question: '', answer: '' }}
      fields={[
        { name: 'service_id', label: 'Service ID', type: 'number' },
        { name: 'category_id', label: 'Category ID', type: 'number' },
        { name: 'question', label: 'Question', required: true },
        { name: 'answer', label: 'Answer', type: 'textarea', required: true }
      ]}
      renderTitle={(item) => item.question}
    />
  );
}
