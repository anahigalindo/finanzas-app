import { useState } from 'react'
import { useTransactions, useCreateTransaction, useDeleteTransaction } from '../../hooks/useTransactions'
import { useAccounts } from '../../hooks/useAccounts'
import { useCategories } from '../../hooks/useCategories'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  account_id:  z.coerce.number().min(1, 'Selecciona una cuenta'),
  category_id: z.coerce.number().min(1, 'Selecciona una categoría'),
  type:        z.enum(['income', 'expense', 'transfer']),
  amount:      z.coerce.number().min(0.01, 'El monto debe ser mayor a 0'),
  description: z.string().optional(),
  date:        z.string().min(1, 'La fecha es obligatoria'),
  destination_account_id: z.coerce.number().optional(),
})

const typeLabels = { income: 'Ingreso', expense: 'Gasto', transfer: 'Transferencia' }
const typeColors = {
  income:   'bg-green-100 text-green-700',
  expense:  'bg-red-100 text-red-700',
  transfer: 'bg-blue-100 text-blue-700',
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function TransactionForm({ onSubmit, isLoading }) {
  const { data: accounts }   = useAccounts()
  const { data: categories } = useCategories()

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { date: new Date().toISOString().split('T')[0] },
  })

  const type = watch('type')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
        <select {...register('type')} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="expense">Gasto</option>
          <option value="income">Ingreso</option>
          <option value="transfer">Transferencia</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cuenta</label>
        <select {...register('account_id')} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Selecciona una cuenta</option>
          {accounts?.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        {errors.account_id && <p className="text-red-500 text-sm mt-1">{errors.account_id.message}</p>}
      </div>

      {type === 'transfer' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cuenta destino</label>
          <select {...register('destination_account_id')} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Selecciona cuenta destino</option>
            {accounts?.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
        <select {...register('category_id')} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Selecciona una categoría</option>
          {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
        <input
          {...register('date')}
          type="date"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <input
          {...register('description')}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Opcional"
        />
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

export default function Transactions() {
  const [showCreate, setShowCreate] = useState(false)
  const [filters, setFilters]       = useState({})

  const { data, isLoading }    = useTransactions(filters)
  const createTransaction      = useCreateTransaction()
  const deleteTransaction      = useDeleteTransaction()

  const handleCreate = (data) => {
    createTransaction.mutate(data, { onSuccess: () => setShowCreate(false) })
  }

  const handleDelete = (id) => {
    if (confirm('¿Eliminar esta transacción?')) deleteTransaction.mutate(id)
  }

  const transactions = data?.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transacciones</h1>
          <p className="text-gray-500 text-sm mt-1">Historial de movimientos</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          + Nueva transacción
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl p-4 shadow-sm flex gap-4">
        <select
          onChange={e => setFilters(f => ({ ...f, type: e.target.value || undefined }))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Todos los tipos</option>
          <option value="income">Ingresos</option>
          <option value="expense">Gastos</option>
          <option value="transfer">Transferencias</option>
        </select>

        <input
          type="date"
          onChange={e => setFilters(f => ({ ...f, from: e.target.value || undefined }))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="date"
          onChange={e => setFilters(f => ({ ...f, to: e.target.value || undefined }))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Lista */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse bg-gray-100 rounded-lg" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-gray-400">Sin transacciones</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Fecha</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Descripción</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Categoría</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Cuenta</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Tipo</th>
                <th className="text-right text-xs font-medium text-gray-500 px-6 py-3">Monto</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(t.date).toLocaleDateString('es-MX')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">{t.description || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{t.category?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{t.account?.name}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeColors[t.type]}`}>
                      {typeLabels[t.type]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-right">
                    <span className={t.type === 'income' ? 'text-green-600' : 'text-red-500'}>
                      {t.type === 'income' ? '+' : '-'}${Number(t.amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showCreate && (
        <Modal title="Nueva transacción" onClose={() => setShowCreate(false)}>
          <TransactionForm onSubmit={handleCreate} isLoading={createTransaction.isPending} />
        </Modal>
      )}
    </div>
  )
}