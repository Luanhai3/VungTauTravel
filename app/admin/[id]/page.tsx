import { createClient } from "@/lib/supabase/server";
import AdminForm from "../AdminForm";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPlacePage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: place } = await supabase
    .from("places")
    .select("*")
    .eq("id", id)
    .single();

  if (!place) return notFound();

  return <AdminForm place={place} />;
}
