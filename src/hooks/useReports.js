import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'

export const useSummary = (month, year) => {
  return useQuery({
    queryKey: ['summary', month, year],
    queryFn: () => api.get('/reports/summary', { params: { month, year } }).then(r => r.data),
  })
}

export const useTimeline = (months = 6) => {
  return useQuery({
    queryKey: ['timeline', months],
    queryFn: () => api.get('/reports/timeline', { params: { months } }).then(r => r.data),
  })
}

export const useByCategory = (month, year) => {
  return useQuery({
    queryKey: ['by-category', month, year],
    queryFn: () => api.get('/reports/by-category', { params: { month, year } }).then(r => r.data),
  })
}