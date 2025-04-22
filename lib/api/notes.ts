// This file would contain the actual API calls to Supabase
// For now, we'll use mock data and functions

import { z } from "zod"

export const noteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()).optional().default([]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  user_id: z.string(),
})

export type Note = z.infer<typeof noteSchema>

export async function getNotes(userId: string): Promise<Note[]> {
  // This would be replaced with actual Supabase query
  console.log("Getting notes for user:", userId)

  // Mock data
  return [
    {
      id: "1",
      title: "Meeting Notes",
      content: "Discussed project timeline and deliverables with the team.",
      tags: ["work", "project"],
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      user_id: userId,
    },
    {
      id: "2",
      title: "Ideas for New Feature",
      content: "Brainstorming session for the upcoming product release.",
      tags: ["product", "feature"],
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      user_id: userId,
    },
  ]
}

export async function getNote(id: string): Promise<Note | null> {
  // This would be replaced with actual Supabase query
  console.log("Getting note:", id)

  // Mock data
  return {
    id,
    title: "Meeting Notes",
    content: "Discussed project timeline and deliverables with the team.",
    tags: ["work", "project"],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    user_id: "user123",
  }
}

export async function createNote(note: Omit<Note, "id" | "created_at" | "updated_at">): Promise<Note> {
  // This would be replaced with actual Supabase query
  console.log("Creating note:", note)

  // Mock data
  return {
    ...note,
    id: Math.random().toString(36).substring(2, 9),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export async function updateNote(
  id: string,
  note: Partial<Omit<Note, "id" | "created_at" | "updated_at">>,
): Promise<Note> {
  // This would be replaced with actual Supabase query
  console.log("Updating note:", id, note)

  // Mock data
  return {
    id,
    title: note.title || "Meeting Notes",
    content: note.content || "Discussed project timeline and deliverables with the team.",
    tags: note.tags || ["work", "project"],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    updated_at: new Date().toISOString(),
    user_id: "user123",
  }
}

export async function deleteNote(id: string): Promise<void> {
  // This would be replaced with actual Supabase query
  console.log("Deleting note:", id)
}
