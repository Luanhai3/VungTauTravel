import { createClient } from "@/lib/supabase/server";
import AdminForm from "../AdminForm";

export default async function EditPlacePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: place } = await supabase
    .from("places")
    .select("*")
    .eq("id", params.id)
    .single();

  return <AdminForm place={place} />;
}
