import { createClient } from "@/lib/supabase/server";

export async function getPlacesAsync(category?: string) {
  const supabase = await createClient();

  let query = supabase.from("places").select("*");

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}
