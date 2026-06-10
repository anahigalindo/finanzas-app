import { useState } from 'react'
import { useBudgetsStatus, useCreateBudget, useDeleteBudget } from '../../hooks/useBudgets'
import { useCategories } from '../../hooks/useCategories'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  category_id: z.coerce.number().min(1, 'Selecciona una categoría'),
  amount:      z.coerce.number().min(0.01, 'El monto debe ser mayor a 0'),
  period:      z.enum(['weekly', 'monthly']),
  start_date:  z.string().min(1, 'La fecha es obligatoria'),
})

const periodLabels = { weekly: 'Semanal', monthly: 'Mensual' }

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function BudgetForm({ onSubmit, isLoading }) {
  const { data: categories } = useCategories()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { start_date: new Date().toISOString().split('T')[0] },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
        <select {...register('category_id')} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Selecciona una categoría</option>
          {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Monto límite</label>
        <input
          {...register('amount')}
          type="number"
          step="0.01"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="0.00"
        />
        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
        <select {...register('period')} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="monthly">Mensual</option>
          <option value="weekly">Semanal</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
        <input
          {...register('start_date')}
          type="date"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {isLoading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  )
}

export default function Budgets() {
  const [showCreate, setShowCreate] = useState(false)

  const { data: budgets, isLoading } = useBudgetsStatus()
  const createBudget = useCreateBudget()
  const deleteBudget = useDeleteBudget()

  const handleCreate = (data) => {
    createBudget.mutate(data, { onSuccess: () => setShowCreate(false) })
  }

  const handleDelete = (id) => {
    if (confirm('¿Eliminar este presupuesto?')) deleteBudget.mutate(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Presupuestos</h1>
          <p className="text-gray-500 text-sm mt-1">Controla cuánto gastas por categoría</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          + Nuevo presupuesto
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse h-28" />
          ))}
        </div>
      ) : budgets?.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center text-gray-400">
          Sin presupuestos
        </div>
      ) : (
        <div className="space-y-4">
          {budgets?.map(({ budget, spent, remaining, percentage, exceeded }) => (
            <div key={budget.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: budget.category?.color }} />
                    <span className="font-semibold text-gray-800">{budget.category?.name}</span>
                    <span className="text-xs text-gray-400">{periodLabels[budget.period]}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    ${Number(spent).toLocaleString('es-MX', { minimumFractionDigits: 2 })} de ${Number(budget.amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {exceeded && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                      ⚠️ Excedido
                    </span>
                  )}
                  <span className={`text-sm font-semibold ${exceeded ? 'text-red-500' : 'text-gray-700'}`}>
                    {percentage}%
                  </span>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${exceeded ? 'bg-red-500' : percentage > 75 ? 'bg-yellow-400' : 'bg-indigo-500'}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>

              <p className="text-xs text-gray-400 mt-2">
                Restante: ${Number(remaining).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <Modal title="Nuevo presupuesto" onClose={() => setShowCreate(false)}>
          <BudgetForm onSubmit={handleCreate} isLoading={createBudget.isPending} />
        </Modal>
      )}
    </div>
  )
}