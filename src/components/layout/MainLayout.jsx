import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import api from '../../api/axios'
import useAuthStore from '../../store/authStore'

const navItems = [
  { to: '/',             label: 'Dashboard',     icon: '📊' },
  { to: '/accounts',     label: 'Cuentas',       icon: '🏦' },
  { to: '/transactions', label: 'Transacciones', icon: '💸' },
  { to: '/categories',   label: 'Categorías',    icon: '🏷️' },
  { to: '/budgets',      label: 'Presupuestos',  icon: '🎯' },
]

export default function MainLayout() {
  const navigate  = useNavigate()
  const { logout } = useAuthStore()

  const mutation = useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      logout()
      navigate('/login')
    },
  })

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-indigo-600">💰 Finanzas</h1>
          <p className="text-xs text-gray-400 mt-1">Control personal</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => mutation.mutate()}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition"
          >
            <span>🚪</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}