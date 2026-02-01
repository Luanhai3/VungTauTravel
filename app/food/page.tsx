import type { Metadata } from "next";
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

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://vungtautravel.vercel.app";

export const metadata: Metadata = {
  title: "Food & Coffee",
  description:
    "Best food and coffee in Vũng Tàu: bánh khọt, seafood, rooftop cafés, and local favorites.",
  openGraph: {
    title: "Food & Coffee | VungTauTravel",
    description:
      "Best food and coffee in Vũng Tàu: bánh khọt, seafood, rooftop cafés.",
    url: `${baseUrl}/food`,
  },
};

export default async function FoodPage() {
  const places = (await getPlacesAsync("food")) as Place[];

  return (
    <>
      <Hero
        title="Food & Coffee"
        subtitle="Local dishes, seafood, and cafés with a view."
        image="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920"
        priority
      />

      <Section title="Eat & Drink" subtitle="Street food to rooftop coffee">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((place, i) => (
            <PlaceCard key={place.id} place={place} index={i} />
          ))}
        </div>
      </Section>
    </>
  );
}
