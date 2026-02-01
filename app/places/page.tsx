import Hero from "@/components/Hero";
import Section from "@/components/Section";
import PlaceCard from "@/components/PlaceCard";
import { getPlacesAsync } from "@/lib/supabase/places";

type Place = {
  id: string;
  name: string;
  description: string;
  image?: string | null;
  category: string;
  slug?: string | null;
};

export default async function PlacesPage() {
  const places = (await getPlacesAsync("place")) as Place[];

  return (
    <>
      <Hero
        title="Places to Visit"
        subtitle="Must-see spots in Vũng Tàu."
        image="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920"
        priority
      />

      <Section title="Explore" subtitle="Famous attractions">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((place, i) => (
            <PlaceCard key={place.id} place={place} index={i} />
          ))}
        </div>
      </Section>
    </>
  );
}
