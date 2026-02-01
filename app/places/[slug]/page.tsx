import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

export default async function PlaceDetail({ params }: Props) {
  const supabase = await createClient();

  const { data: place } = await supabase
    .from("places")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!place) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <img
        src={place.image}
        alt={place.name}
        className="w-full h-96 object-cover rounded-xl mb-8"
      />
      <h1 className="text-4xl font-bold mb-4">{place.name}</h1>
      <p className="text-lg text-gray-600">{place.description}</p>
    </div>
  );
}
