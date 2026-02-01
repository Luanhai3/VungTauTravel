import { createClient } from "@/lib/supabase/server";
import AdminForm from "../AdminForm";

type Props = {
	params: Promise<{ slug: string }>;
  };
  
  export default async function Page({ params }: Props) {
	const { slug } = await params;
  const supabase = await createClient();

  const { data: place } = await supabase
    .from("places")
    .select("*")
    .eq("id", slug)
    .single();

  return <AdminForm place={place} />;
}
