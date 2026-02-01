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
  title: "Check-in & Photo Spots",
  description:
    "Best check-in and photo spots in Vũng Tàu: lighthouse, Stairway to Heaven, viewpoints, and Instagram-worthy locations.",
  openGraph: {
    title: "Check-in & Photo Spots | VungTauTravel",
    description:
      "Best check-in and photo spots in Vũng Tàu: lighthouse, viewpoints, Instagram spots.",
    url: `${baseUrl}/checkin`,
  },
};

export default async function CheckinPage() {
  const places = (await getPlacesAsync("checkin")) as Place[];

  return (
    <>
      <Hero
        title="Check-in & Photo Spots"
        subtitle="Iconic viewpoints and Instagram-worthy locations."
        image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920"
        priority
      />

      <Section title="Photo spots" subtitle="Capture your trip">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((place, i) => (
            <PlaceCard key={place.id} place={place} index={i} />
          ))}
        </div>
      </Section>
    </>
  );
}
