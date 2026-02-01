import { createClient } from "@/lib/supabase/server";

export async function getPlaces() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("places")
    .select(`
      id,
      title,
      slug,
      description,
      created_at,
      place_categories(
        categories (
          name,
          slug
        )
      ),
      images (
        url
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
