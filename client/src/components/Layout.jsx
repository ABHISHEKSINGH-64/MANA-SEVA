import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu as MenuIcon, 
  X, 
  ShieldAlert, 
  User, 
  LogOut, 
  Globe, 
  Compass,
  LayoutDashboard,
  Search,
  FolderClosed,
  Sparkles,
  GraduationCap,
  Bot,
  ClipboardCheck,
  Heart,
  Settings,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Home,
  UserCheck
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navGroups = [
    {
      title: 'Portal',
      links: [
        { to: '/', label: t('home'), icon: Home },
        { to: '/dashboard', label: t('dashboard'), icon: LayoutDashboard, authRequired: true }
      ]
    },
    {
      title: 'Discover',
      links: [
        { to: '/services', label: t('services'), icon: Search },
        { to: '/categories', label: 'Departments', icon: FolderClosed },
        { to: '/schemes', label: t('schemes'), icon: Sparkles },
        { to: '/directory/scholarships', label: 'Scholarships', icon: GraduationCap }
      ]
    },
    {
      title: 'Workspace',
      links: [
        { to: '/assistant', label: 'AI Assistant', icon: Bot },
        { to: '/checklist', label: 'Documents', icon: ClipboardCheck, authRequired: true },
        { to: '/favorites', label: 'Saved Guides', icon: Heart, authRequired: true },
        { to: '/profile', label: 'Profile', icon: Settings, authRequired: true }
      ]
    }
  ];

  const getActiveTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Overview';
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/services') return 'Services Search';
    if (path === '/categories') return 'Departments Catalog';
    if (path === '/schemes') return 'Benefits Finder';
    if (path.startsWith('/directory/')) return 'Citizen Directory';
    if (path === '/assistant') return 'AI Citizen Guidance';
    if (path === '/checklist') return 'Checklists';
    if (path === '/favorites') return 'Saved Guides';
    if (path === '/profile') return 'Account Settings';
    if (path.startsWith('/admin')) return 'Administration Console';
    return 'Mana Seva';
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-150 relative group ${
      isActive 
        ? 'bg-primary-600 text-white shadow-sm' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-6">
        {/* App Title */}
        <div className={`flex items-center gap-2.5 px-3 py-2 ${collapsed ? 'justify-center' : ''}`}>
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-600 text-white shadow-md shadow-primary-600/10">
            <Compass size={18} />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <span className="block font-bold tracking-tight text-slate-900 text-sm">Mana Seva</span>
              <span className="block text-[9px] font-semibold text-slate-400">Citizen Platform</span>
            </div>
          )}
        </div>

        {/* Navigation Groups */}
        <div className="space-y-4">
          {navGroups.map((group) => {
            const filteredLinks = group.links.filter(l => !l.authRequired || user);
            if (filteredLinks.length === 0) return null;

            return (
              <div key={group.title} className="space-y-1">
                {!collapsed && (
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {group.title}
                  </p>
                )}
                <div className="space-y-0.5">
                  {filteredLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <NavLink 
                        key={link.to} 
                        to={link.to} 
                        className={linkClass}
                        onClick={() => setMobileOpen(false)}
                      >
                        <Icon size={16} className="shrink-0" />
                        {!collapsed && <span>{link.label}</span>}
                        {collapsed && (
                          <div className="absolute left-full ml-3 px-2 py-1 rounded bg-slate-950 text-white text-[10px] font-semibold opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition duration-150 z-50 whitespace-nowrap shadow-md">
                            {link.label}
                          </div>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Admin Section */}
          {isAdmin && (
            <div className="space-y-1 pt-2 border-t border-slate-100">
              {!collapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Management
                </p>
              )}
              <NavLink 
                to="/admin" 
                className={linkClass}
                onClick={() => setMobileOpen(false)}
              >
                <UserCheck size={16} className="shrink-0" />
                {!collapsed && <span>Admin Panel</span>}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2 py-1 rounded bg-slate-950 text-white text-[10px] font-semibold opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition duration-150 z-50 whitespace-nowrap shadow-md">
                    Admin Panel
                  </div>
                )}
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Footer User controls */}
      {user && !collapsed && (
        <div className="border-t border-slate-100 pt-4 px-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              <User size={14} />
            </span>
            <div className="leading-tight truncate">
              <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
              <p className="text-[9px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center justify-center gap-1.5 w-full rounded-lg border border-slate-200 bg-white py-1.5 text-[10px] font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-950 transition"
          >
            <LogOut size={12} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Desktop Sidebar (Left) */}
      <aside 
        className={`hidden md:block shrink-0 border-r border-slate-200 bg-white p-4 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-60'
        }`}
      >
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-950/20 backdrop-blur-sm animate-fade-in">
          <div className="w-60 bg-white p-4 border-r border-slate-200 flex flex-col justify-between h-full relative animate-in slide-in-from-left duration-200">
            <button 
              className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              onClick={() => setMobileOpen(false)}
            >
              <X size={16} />
            </button>
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
          <div className="flex items-center gap-4">
            {/* Collapse toggle (Desktop) */}
            <button 
              className="hidden md:grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              onClick={() => setCollapsed(!collapsed)}
              aria-label="Toggle sidebar collapse"
            >
              {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>

            {/* Mobile menu trigger */}
            <button 
              className="grid md:hidden h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              onClick={() => setMobileOpen(true)}
              aria-label="Open mobile menu"
            >
              <MenuIcon size={16} />
            </button>

            {/* Active Header Title */}
            <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">{getActiveTitle()}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 text-slate-500 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg px-2 py-1 transition cursor-pointer">
              <Globe size={13} className="text-slate-400" />
              <select 
                className="bg-transparent text-[10px] font-bold outline-none cursor-pointer text-slate-600" 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                aria-label="System Language selector"
              >
                <option value="en">EN</option>
                <option value="te">తెలుగు</option>
                <option value="hi">हिंदी</option>
              </select>
            </div>

            {/* Notification Badge Alert */}
            <Link to="/dashboard" className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-600 relative">
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary-600" />
              <ShieldAlert size={14} />
            </Link>

            {/* Auth Actions (Header right) */}
            {user ? (
              <Link to="/profile" className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold py-1 px-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100">
                <User size={12} className="text-slate-400" />
                <span className="max-w-[70px] truncate">{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <div className="flex gap-1.5 text-xs font-semibold">
                <Link to="/login" className="btn-secondary h-8 px-3 text-[10px] font-bold">Login</Link>
                <Link to="/register" className="btn-primary h-8 px-3 text-[10px] font-bold">Register</Link>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Inner Outlet Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
