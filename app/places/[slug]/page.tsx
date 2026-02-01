import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PlacePage({ params }: Props) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: place } = await supabase
    .from("places")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!place) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="relative w-full h-96 mb-8">
        <Image
          src={place.image}
          alt={place.title}
          fill
          className="object-cover rounded-xl"
          sizes="100vw"
        />
      </div>

      <h1 className="text-4xl font-bold mb-4">{place.title}</h1>
      <p className="text-lg text-gray-600">{place.description}</p>
    </div>
  );
}
