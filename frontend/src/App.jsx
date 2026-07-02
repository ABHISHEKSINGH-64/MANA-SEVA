import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCategories from './pages/admin/ManageCategories';
import ManageFaqs from './pages/admin/ManageFaqs';
import ManageSchemes from './pages/admin/ManageSchemes';
import ManageServices from './pages/admin/ManageServices';
import Categories from './pages/Categories';
import Checklist from './pages/Checklist';
import Dashboard from './pages/Dashboard';
import Directory from './pages/Directory';
import FAQ from './pages/FAQ';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import AIAssistant from './pages/AIAssistant';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Schemes from './pages/Schemes';
import ServiceDetails from './pages/ServiceDetails';
import Services from './pages/Services';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:id" element={<ServiceDetails />} />
        <Route path="categories" element={<Categories />} />
        <Route path="schemes" element={<Schemes />} />
        <Route path="assistant" element={<AIAssistant />} />
        <Route path="directory/:type" element={<Directory />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="checklist" element={<Checklist />} />
        </Route>

        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/services" element={<ManageServices />} />
          <Route path="admin/categories" element={<ManageCategories />} />
          <Route path="admin/faqs" element={<ManageFaqs />} />
          <Route path="admin/schemes" element={<ManageSchemes />} />
        </Route>
      </Route>
    </Routes>
  );
}
