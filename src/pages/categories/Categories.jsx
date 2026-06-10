import { useState } from 'react'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../../hooks/useCategories'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  name:  z.string().min(1, 'El nombre es obligatorio'),
  type:  z.enum(['income', 'expense']),
  color: z.string().optional(),
  icon:  z.string().optional(),
})

const typeLabels = { income: 'Ingreso', expense: 'Gasto' }
const typeColors = { income: 'bg-green-100 text-green-700', expense: 'bg-red-100 text-red-700' }

function CategoryForm({ defaultValues, onSubmit, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          {...register('name')}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Ej. Comida"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
        <select {...register('type')} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="expense">Gasto</option>
          <option value="income">Ingreso</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ícono</label>
        <input
          {...register('icon')}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Ej. utensils, car, briefcase"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
        <input {...register('color')} type="color" defaultValue="#6366f1" className="h-10 w-full rounded-lg cursor-pointer border border-gray-300" />
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

export default function Categories() {
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing]       = useState(null)

  const { data: categories, isLoading } = useCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const handleCreate = (data) => {
    createCategory.mutate(data, { onSuccess: () => setShowCreate(false) })
  }

  const handleUpdate = (data) => {
    updateCategory.mutate({ id: editing.id, ...data }, { onSuccess: () => setEditing(null) })
  }

  const handleDelete = (id) => {
    if (confirm('¿Eliminar esta categoría?')) deleteCategory.mutate(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categorías</h1>
          <p className="text-gray-500 text-sm mt-1">Organiza tus ingresos y gastos</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          + Nueva categoría
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {categories?.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                  <span className="font-semibold text-gray-800">{category.name}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeColors[category.type]}`}>
                  {typeLabels[category.type]}
                </span>
              </div>
              <p className="text-gray-400 text-sm">{category.icon}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setEditing(category)}
                  className="flex-1 text-sm text-indigo-600 border border-indigo-200 rounded-lg py-1.5 hover:bg-indigo-50 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="flex-1 text-sm text-red-500 border border-red-200 rounded-lg py-1.5 hover:bg-red-50 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <Modal title="Nueva categoría" onClose={() => setShowCreate(false)}>
          <CategoryForm onSubmit={handleCreate} isLoading={createCategory.isPending} />
        </Modal>
      )}

      {editing && (
        <Modal title="Editar categoría" onClose={() => setEditing(null)}>
          <CategoryForm defaultValues={editing} onSubmit={handleUpdate} isLoading={updateCategory.isPending} />
        </Modal>
      )}
    </div>
  )
}