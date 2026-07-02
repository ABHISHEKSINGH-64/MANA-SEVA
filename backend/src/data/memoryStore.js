import bcrypt from 'bcrypt';

const now = () => new Date().toISOString();

export const categories = [
  { id: 1, name: 'Education Services', slug: 'education', description: 'Scholarships, education loans, admissions, exams, internships, and student checklists.', icon: 'FaGraduationCap', created_at: now() },
  { id: 2, name: 'Government Document Services', slug: 'documents', description: 'Aadhaar, PAN, voter ID, passport, certificates, driving license, ration card, and identity services.', icon: 'FaIdCard', created_at: now() },
  { id: 3, name: 'Jobs & Career Services', slug: 'jobs-career', description: 'Government jobs, resume support, skill roadmaps, apprenticeships, internships, and career guidance.', icon: 'FaBriefcase', created_at: now() },
  { id: 4, name: 'Travel Services', slug: 'travel', description: 'Train, bus, flight, metro, travel documents, ticket FAQs, and tourist information.', icon: 'FaTrain', created_at: now() },
  { id: 5, name: 'Banking & Finance', slug: 'banking-finance', description: 'Banking guides, credit basics, subsidies, insurance, pension schemes, and financial education.', icon: 'FaUniversity', created_at: now() },
  { id: 6, name: 'Health Services', slug: 'health', description: 'Health schemes, hospitals, blood banks, vaccination, emergency numbers, and ambulance services.', icon: 'FaHospital', created_at: now() },
  { id: 7, name: 'Farmer Services', slug: 'farmer-services', description: 'Crop information, farmer schemes, market prices, weather, fertilizer, and agriculture resources.', icon: 'FaSeedling', created_at: now() },
  { id: 8, name: 'Citizen Utility Services', slug: 'utilities', description: 'Electricity, water, gas, property tax, complaint registration, municipal services, and utility FAQs.', icon: 'FaBolt', created_at: now() }
];

export const services = [
  ['education', 'Scholarship Finder', 'scholarship-finder', 'Discover scholarships by state, income, category, course level, and deadline.', 'https://scholarships.gov.in/', '1-3 months', 'Free', true],
  ['education', 'Education Loan Guide', 'education-loan-guide', 'Compare eligibility, collateral, moratorium, interest subsidy, and application documents.', 'https://www.vidyalakshmi.co.in/', '2-4 weeks', 'Bank dependent', true],
  ['education', 'Entrance Exam Calendar', 'entrance-exam-calendar', 'Track major entrance exams, documents, preparation resources, and application windows.', 'https://nta.ac.in/', 'Varies', 'Exam dependent', false],
  ['documents', 'Aadhaar Services', 'aadhaar-services', 'Understand Aadhaar enrolment, demographic updates, biometric updates, and status tracking.', 'https://uidai.gov.in/', '7-30 days', 'As per UIDAI rules', true],
  ['documents', 'PAN Card', 'pan-card', 'Guidance for new PAN, corrections, reprint, e-PAN, and Aadhaar linking.', 'https://www.incometax.gov.in/', '7-15 days', 'Varies by mode', true],
  ['documents', 'Voter ID', 'voter-id', 'Apply for new voter registration, corrections, shifting, and electoral roll services.', 'https://voters.eci.gov.in/', '2-6 weeks', 'Free', true],
  ['documents', 'Passport', 'passport', 'Prepare for fresh passport, reissue, renewal, police verification, and appointments.', 'https://www.passportindia.gov.in/', '2-8 weeks', 'As per passport type', true],
  ['jobs-career', 'Government Job Notifications', 'government-job-notifications', 'Find public sector openings, eligibility rules, documents, and important dates.', 'https://www.ncs.gov.in/', 'Ongoing', 'Free', true],
  ['jobs-career', 'Resume Builder', 'resume-builder', 'Create a clean resume structure for students, freshers, and experienced applicants.', null, 'Instant', 'Free', false],
  ['travel', 'Train Booking Guide', 'train-booking-guide', 'Learn IRCTC booking, cancellation, quota rules, boarding point changes, and refunds.', 'https://www.irctc.co.in/', 'Instant', 'Ticket fare plus charges', true],
  ['travel', 'Travel Document Checklist', 'travel-document-checklist', 'Prepare documents for domestic travel, passports, student travel, and senior citizens.', null, 'Instant', 'Free', false],
  ['banking-finance', 'Savings Account Guide', 'savings-account-guide', 'Understand account types, KYC, minimum balance, debit cards, and digital banking.', null, '1-7 days', 'Bank dependent', false],
  ['banking-finance', 'Credit Score Basics', 'credit-score-basics', 'Learn how credit scores work, what affects them, and how to improve responsibly.', null, 'Instant', 'Free', false],
  ['health', 'Government Hospital Locator', 'government-hospital-locator', 'Find public hospitals, departments, contact details, and emergency support routes.', null, 'Instant', 'Free', true],
  ['health', 'Blood Bank Directory', 'blood-bank-directory', 'Locate blood banks and understand donor eligibility, contact, and emergency preparation.', null, 'Instant', 'Free', true],
  ['farmer-services', 'Farmer Schemes', 'farmer-schemes', 'Discover subsidy, income support, insurance, crop, and equipment schemes for farmers.', 'https://pmkisan.gov.in/', 'Varies', 'Free', true],
  ['farmer-services', 'Market Price Information', 'market-price-information', 'Use market price resources to compare mandi rates and plan crop sales.', 'https://agmarknet.gov.in/', 'Daily', 'Free', false],
  ['utilities', 'Electricity Bill Guide', 'electricity-bill-guide', 'Learn bill payment, connection transfer, meter complaints, and subsidy documents.', null, 'Instant-30 days', 'Provider dependent', true],
  ['utilities', 'Complaint Registration Guide', 'complaint-registration-guide', 'Prepare complaints for municipal, utility, consumer, and citizen grievance portals.', 'https://pgportal.gov.in/', 'Varies', 'Free', false]
].map(([categorySlug, title, slug, short_description, official_url, processing_time, fee, is_popular], index) => {
  const category = categories.find((item) => item.slug === categorySlug);
  return {
    id: index + 1,
    category_id: category.id,
    category_name: category.name,
    category_slug: category.slug,
    title,
    slug,
    short_description,
    official_url,
    processing_time,
    fee,
    languages: ['en', 'te', 'hi'],
    is_popular,
    created_at: now(),
    updated_at: now()
  };
});

const guideDefaults = {
  eligibility: ['Applicant meets official service rules', 'Valid identity and contact details are available'],
  required_documents: ['Proof of identity', 'Proof of address', 'Recent photo where applicable', 'Mobile number and email'],
  process_steps: ['Read the official guideline', 'Check eligibility', 'Collect documents', 'Fill the official form carefully', 'Submit through the official portal or service center', 'Save acknowledgement details'],
  important_notes: ['Mana Seva provides guidance only and does not submit applications', 'Verify final fee, deadline, and rules on official portals'],
  common_mistakes: ['Uploading unclear documents', 'Using mismatched names across proofs', 'Missing deadline or verification notice']
};

export const guides = services.map((service) => ({
  id: service.id,
  service_id: service.id,
  overview: `${service.title} helps citizens prepare requirements, understand eligibility, and avoid common application errors.`,
  ...guideDefaults,
  required_documents: service.title.toLowerCase().includes('scholarship')
    ? ['Student ID or admission proof', 'Marksheets', 'Income certificate', 'Bank account details', 'Aadhaar where required']
    : guideDefaults.required_documents,
  created_at: now(),
  updated_at: now()
}));

export const faqs = [
  ['Aadhaar Services', 'Can I update my mobile number online?', 'Mobile number updates usually require an Aadhaar enrolment or update center visit.'],
  ['PAN Card', 'Should I apply for a second PAN if details are wrong?', 'No. Use the PAN correction process instead of creating a duplicate PAN.'],
  ['Voter ID', 'Can I apply for voter ID online?', 'Yes. Use the official voter services portal and save the reference number.'],
  ['Passport', 'Is police verification always required?', 'It depends on the service type, applicant profile, and passport office decision.'],
  ['Scholarship Finder', 'Can I apply for multiple scholarships?', 'Sometimes, but many schemes restrict duplicate benefits. Check each guideline.'],
  ['Train Booking Guide', 'Do I need a printed train ticket?', 'A digital ticket with accepted identity proof is generally sufficient for e-tickets.'],
  ['Blood Bank Directory', 'Can Mana Seva request blood for me?', 'No. Mana Seva helps you find contact information and preparation guidance.']
].map(([serviceTitle, question, answer], index) => {
  const service = services.find((item) => item.title === serviceTitle);
  return { id: index + 1, service_id: service?.id, category_id: service?.category_id, question, answer, created_at: now() };
});

export const schemes = [
  { id: 1, title: 'National Scholarship Portal Schemes', state: 'All India', description: 'Central and state scholarships for eligible students.', min_age: 10, max_age: 35, max_income: 250000, beneficiary_type: 'student', application_url: 'https://scholarships.gov.in/' },
  { id: 2, title: 'PM-KISAN', state: 'All India', description: 'Income support for eligible farmer families subject to scheme rules.', min_age: 18, max_age: null, max_income: null, beneficiary_type: 'farmer', application_url: 'https://pmkisan.gov.in/' },
  { id: 3, title: 'PM SVANidhi', state: 'All India', description: 'Working capital support for eligible street vendors.', min_age: 18, max_age: null, max_income: null, beneficiary_type: 'employee', application_url: 'https://pmsvanidhi.mohua.gov.in/' },
  { id: 4, title: 'Telangana Post Matric Scholarship', state: 'Telangana', description: 'Scholarship support for eligible students in Telangana.', min_age: 16, max_age: 35, max_income: 200000, beneficiary_type: 'student', application_url: 'https://telanganaepass.cgg.gov.in/' },
  { id: 5, title: 'Andhra Pradesh Jagananna Vidya Deevena', state: 'Andhra Pradesh', description: 'Fee reimbursement support for eligible students in Andhra Pradesh.', min_age: 16, max_age: 35, max_income: 250000, beneficiary_type: 'student', application_url: 'https://jnanabhumi.ap.gov.in/' },
  { id: 6, title: 'Atal Pension Yojana', state: 'All India', description: 'Pension scheme for eligible workers with age-based contribution.', min_age: 18, max_age: 40, max_income: null, beneficiary_type: 'employee', application_url: 'https://www.npscra.nsdl.co.in/' }
].map((item) => ({ ...item, created_at: now() }));

export const entityCollections = {
  scholarships: [
    { id: 1, title: 'National Means-cum-Merit Scholarship', provider: 'Department of School Education', state: 'All India', level: 'School', max_income: 350000, deadline: 'Check official portal', url: 'https://scholarships.gov.in/' },
    { id: 2, title: 'Post Matric Scholarship for SC Students', provider: 'Ministry of Social Justice', state: 'All India', level: 'Post Matric', max_income: 250000, deadline: 'State dependent', url: 'https://scholarships.gov.in/' }
  ],
  loans: [
    { id: 1, name: 'Vidya Lakshmi Education Loan', bank: 'Multi-bank', min_amount: 50000, max_amount: 7500000, interest_hint: 'Bank dependent', collateral_hint: 'Depends on amount and bank policy', url: 'https://www.vidyalakshmi.co.in/' },
    { id: 2, name: 'Skill Loan Scheme', bank: 'Participating banks', min_amount: 5000, max_amount: 150000, interest_hint: 'Bank dependent', collateral_hint: 'Generally simplified for approved courses', url: 'https://www.msde.gov.in/' }
  ],
  banks: [
    { id: 1, name: 'State Bank of India', type: 'Public Sector Bank', services: ['Savings account', 'Education loan', 'PM schemes'], logo_url: '/logos/sbi.svg', website: 'https://sbi.co.in/' },
    { id: 2, name: 'Union Bank of India', type: 'Public Sector Bank', services: ['Savings account', 'Loans', 'Digital banking'], logo_url: '/logos/union-bank.svg', website: 'https://www.unionbankofindia.co.in/' }
  ],
  hospitals: [
    { id: 1, name: 'Government General Hospital', state: 'Andhra Pradesh', district: 'Vijayawada', services: ['Emergency', 'General medicine', 'Surgery'], phone: '108', logo_url: '/logos/health.svg' },
    { id: 2, name: 'Gandhi Hospital', state: 'Telangana', district: 'Hyderabad', services: ['Emergency', 'Specialty care', 'Diagnostics'], phone: '108', logo_url: '/logos/health.svg' }
  ],
  bloodBanks: [
    { id: 1, name: 'Indian Red Cross Blood Bank', state: 'All India', city: 'Major cities', phone: '1910', blood_groups: ['A+', 'B+', 'O+', 'AB+'] },
    { id: 2, name: 'Government Hospital Blood Bank', state: 'Telangana', city: 'Hyderabad', phone: '104', blood_groups: ['A+', 'A-', 'B+', 'O-', 'AB+'] }
  ],
  jobs: [
    { id: 1, title: 'SSC Combined Graduate Level', organization: 'Staff Selection Commission', qualification: 'Graduation', age_limit: '18-32 depending on post', status: 'Check official calendar', url: 'https://ssc.gov.in/' },
    { id: 2, title: 'Railway Recruitment Board Notifications', organization: 'Indian Railways', qualification: 'Post dependent', age_limit: 'Post dependent', status: 'Check regional RRB sites', url: 'https://www.rrbcdg.gov.in/' }
  ],
  internships: [
    { id: 1, title: 'AICTE Internship Portal', provider: 'AICTE', eligibility: 'Students and freshers', mode: 'Online/Offline', url: 'https://internship.aicte-india.org/' },
    { id: 2, title: 'National Career Service Internships', provider: 'NCS', eligibility: 'Students and job seekers', mode: 'Varies', url: 'https://www.ncs.gov.in/' }
  ],
  utilities: [
    { id: 1, title: 'Electricity Bill Payment', provider_type: 'DISCOM', documents: ['Consumer number', 'Mobile number'], support_hint: 'Use your state electricity board portal.' },
    { id: 2, title: 'Water Bill Payment', provider_type: 'Municipal/Water board', documents: ['Connection number', 'Address proof for changes'], support_hint: 'Use your local municipal portal.' }
  ],
  emergencyContacts: [
    { id: 1, name: 'National Emergency Number', number: '112', category: 'Emergency' },
    { id: 2, name: 'Ambulance', number: '108', category: 'Health' },
    { id: 3, name: 'Women Helpline', number: '181', category: 'Safety' }
  ],
  notifications: [
    { id: 1, title: 'Scholarship deadlines change by state', type: 'info', message: 'Always verify the latest deadline on the official scholarship portal.', created_at: now() },
    { id: 2, title: 'Do not share OTPs', type: 'security', message: 'Government and banking services never need your OTP through unofficial helpers.', created_at: now() }
  ],
  logos: [
    { id: 1, name: 'Education Services Icon', entity_type: 'category', entity_id: 1, logo_url: '/icons/education.svg', alt_text: 'Education services' },
    { id: 2, name: 'Health Services Icon', entity_type: 'category', entity_id: 6, logo_url: '/icons/health.svg', alt_text: 'Health services' }
  ],
  aiChatHistory: []
};

const adminHash = bcrypt.hashSync('Admin@1234', 10);
export const users = [
  { id: '00000000-0000-4000-8000-000000000001', name: 'Admin User', email: 'admin@manaseva.in', password_hash: adminHash, phone: null, preferred_language: 'en', role: 'admin', created_at: now(), updated_at: now() }
];

export const favorites = [];
export const checklists = [];
export const recentlyViewed = [];
export const searchHistory = [];

export const nextId = (collection) => Math.max(0, ...collection.map((item) => Number(item.id) || 0)) + 1;
export const publicUser = ({ password_hash, ...user }) => user;
export const serviceWithGuide = (service) => ({ ...service, guide: guides.find((guide) => guide.service_id === service.id) || null });
