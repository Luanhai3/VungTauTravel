import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import PlaceDetailPage from "@/components/page";
import { redirect } from "next/navigation";

type Props = {
  params: { id: string };
};

const generateSlug = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = decodeURIComponent(params.id);
  const supabase = await createClient();
  
  let { data: place } = await supabase
    .from("places")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!place) {
    const slugId = generateSlug(id);
    const { data: placeSlug } = await supabase.from("places").select("*").eq("id", slugId).maybeSingle();
    place = placeSlug;
  }

  if (!place) {
    return {
      title: "Không tìm thấy địa điểm | Vũng Tàu Travel",
      description: "Địa điểm không tồn tại hoặc đã bị xóa.",
    };
  }

  const title = `${place.name} - ${place.category} | Vũng Tàu Travel`;
  const description = place.description?.slice(0, 160) || `Khám phá ${place.name} tại ${place.address}`;
  const imageUrl = place.image_url || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200";
  const keywords = [`Vũng Tàu`, `Du lịch Vũng Tàu`, place.category, place.name, `Địa điểm ${place.category}`, `Review ${place.name}`, `Check-in Vũng Tàu`];

  return {
    title,
    description,
    keywords: keywords.join(", "),
    openGraph: {
      title,
      description,
      url: `/places/${id}`,
      siteName: "Vũng Tàu Travel",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: place.name,
        },
      ],
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function Page({ params }: Props) {
  const id = decodeURIComponent(params.id);
  const supabase = await createClient();
  const slugId = generateSlug(id);
  
  let { data: place } = await supabase
    .from("places")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  // Nếu không tìm thấy bằng ID gốc, thử tìm bằng slug
  if (!place) {
    const { data: placeSlug } = await supabase.from("places").select("*").eq("id", slugId).maybeSingle();
    place = placeSlug;
    
    // Nếu tìm thấy bằng slug, redirect 301 sang URL chuẩn
    if (place) {
      redirect(`/places/${slugId}`);
    }
  }

  const jsonLd = place ? {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: place.name,
    description: place.description,
    image: place.image_url ? [place.image_url] : [],
    address: {
      "@type": "PostalAddress",
      streetAddress: place.address,
      addressLocality: "Vũng Tàu",
      addressRegion: "Bà Rịa - Vũng Tàu",
      addressCountry: "VN",
    },
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <PlaceDetailPage />
    </>
  );
}