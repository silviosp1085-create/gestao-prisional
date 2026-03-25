import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, UserPlus, UserMinus, Gavel, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/blitz', label: 'Blitz / Revistas', icon: ShieldAlert },
    { path: '/inclusoes', label: 'Inclusões', icon: UserPlus },
    { path: '/transferencias', label: 'Transferências', icon: UserMinus },
    { path: '/disciplina', label: 'Disciplina', icon: Gavel },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-slate-900 text-white transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {isSidebarOpen && <span className="font-bold text-lg truncate">Gestão Prisional</span>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-slate-800 focus:outline-none"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-3 rounded-md transition-colors ${
                      isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                    title={!isSidebarOpen ? item.label : undefined}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {isSidebarOpen && <span className="ml-3 truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-md transition-colors"
            title={!isSidebarOpen ? 'Sair' : undefined}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {isSidebarOpen && <span className="ml-3">Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">
            {navItems.find((item) => item.path === location.pathname)?.label || 'Sistema de Gestão'}
          </h1>
        </header>
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
