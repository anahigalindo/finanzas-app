import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/axios'

export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => api.get('/accounts').then(r => r.data),
  })
}

export const useCreateAccount = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/accounts', data),
    onSuccess: () => queryClient.invalidateQueries(['accounts']),
  })
}

export const useUpdateAccount = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) => api.put(`/accounts/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(['accounts']),
  })
}

export const useDeleteAccount = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/accounts/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['accounts']),
  })
}