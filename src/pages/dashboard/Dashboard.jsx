import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useSummary, useTimeline, useByCategory } from '../../hooks/useReports'

const StatCard = ({ label, value, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className={`text-2xl font-bold ${color}`}>
      ${Number(value || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
    </p>
  </div>
)

export default function Dashboard() {
  const now = new Date()
  const [month] = useState(now.getMonth() + 1)
  const [year]  = useState(now.getFullYear())

  const { data: summary,    isLoading: loadingSummary    } = useSummary(month, year)
  const { data: timeline,   isLoading: loadingTimeline   } = useTimeline(6)
  const { data: byCategory, isLoading: loadingByCategory } = useByCategory(month, year)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Resumen de mayo 2026</p>
      </div>

      {/* Tarjetas de resumen */}
      {loadingSummary ? (
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Balance total"  value={summary?.balance} color="text-gray-800" />
          <StatCard label="Ingresos"       value={summary?.income}  color="text-green-600" />
          <StatCard label="Gastos"         value={summary?.expense} color="text-red-500" />
          <StatCard label="Ahorrado"       value={summary?.saved}   color="text-indigo-600" />
        </div>
      )}

      {/* Gráficas */}
      <div className="grid grid-cols-2 gap-6">
        {/* Timeline */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Ingresos vs Gastos</h2>
          {loadingTimeline ? (
            <div className="h-48 animate-pulse bg-gray-100 rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `$${Number(v).toLocaleString('es-MX')}`} />
                <Line type="monotone" dataKey="income"  stroke="#22c55e" strokeWidth={2} dot={false} name="Ingresos" />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} dot={false} name="Gastos" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Por categoría */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Gastos por categoría</h2>
          {loadingByCategory ? (
            <div className="h-48 animate-pulse bg-gray-100 rounded-lg" />
          ) : byCategory?.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              Sin gastos este mes
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={byCategory} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={80}>
                  {byCategory?.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `$${Number(v).toLocaleString('es-MX')}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}