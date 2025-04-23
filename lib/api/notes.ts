import { supabase } from "@/lib/supabase";

// GET all notes for the logged‑in user
export async function getNotes() {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data;
}

// GET one note by id (null if not found / not owner)
export async function getNote(id: string) {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();
  if (error?.code === "PGRST116") return null; // not found
  if (error) throw error;
  return data;
}

// INSERT or UPDATE (PostgREST upsert)
export async function upsertNote(note: {
  id?: string;
  title: string;
  body: string;
  tags: string[];
}) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw authError || new Error("Not authenticated");

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("notes")
    .upsert(
      {
        ...note,
        user_id: user.id,
        updated_at: now, // ← explicitly set it
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteNote(id: string) {
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw error;
}
