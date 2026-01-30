import { Place } from "@/lib/data";
import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import FeaturedPlacesList from "./FeaturedPlacesList";

const getFeaturedPlaces = unstable_cache(
  async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data } = await supabase
      .from('places')
      .select('id, name, category, image_url, description, address, google_maps_url, is_featured, created_at')
      .eq('is_featured', true)
      .order('created_at', { ascending: false });

    if (!data) return [];

    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      imageUrl: p.image_url,
      description: p.description,
      address: p.address,
      googleMapsUrl: p.google_maps_url,
      isFeatured: p.is_featured
    }));
  },
  ['featured-places'], // Key định danh cho cache
  { 
    revalidate: 3600, // Cache trong 1 giờ (3600 giây)
    tags: ['places']  // Tag để có thể revalidate thủ công khi cần
  }
);

export default async function FeaturedPlaces() {
  const places = await getFeaturedPlaces();

  return <FeaturedPlacesList initialPlaces={places} />;
}
