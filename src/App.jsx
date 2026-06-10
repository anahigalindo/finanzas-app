import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'

// Auth
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Pages
import Dashboard from './pages/dashboard/Dashboard'
import Accounts from './pages/accounts/Accounts'
import Transactions from './pages/transactions/Transactions'
import Categories from './pages/categories/Categories'
import Budgets from './pages/budgets/Budgets'

// Layout
import MainLayout from './components/layout/MainLayout'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/login" />
}

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  return !isAuthenticated ? children : <Navigate to="/" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="categories" element={<Categories />} />
        <Route path="budgets" element={<Budgets />} />
      </Route>
    </Routes>
  )
}