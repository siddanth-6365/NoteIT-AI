import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/lib/api/notes'

export const useNotes = () =>
  useQuery({ queryKey: ['notes'], queryFn: api.getNotes })

export const useSaveNote = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.upsertNote,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  })
}

export const useDeleteNote = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.deleteNote,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  })
}

export const useNote = (id: string) =>
    useQuery({
      queryKey: ['note', id],
      queryFn: () => api.getNote(id),
      enabled: !!id,
    })