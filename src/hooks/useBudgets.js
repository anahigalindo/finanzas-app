import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/axios'

export const useBudgets = () => {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: () => api.get('/budgets').then(r => r.data),
  })
}

export const useBudgetsStatus = () => {
  return useQuery({
    queryKey: ['budgets-status'],
    queryFn: () => api.get('/budgets-status').then(r => r.data),
  })
}

export const useCreateBudget = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/budgets', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['budgets-status'] })
    },
  })
}

export const useDeleteBudget = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/budgets/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['budgets-status'] })
    },
  })
}