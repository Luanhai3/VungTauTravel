import { createClient } from "@/lib/supabase/server";
import AdminList from "./AdminList";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: places } = await supabase
    .from("places")
    .select("*")
    .order("created_at", { ascending: false });

  return <AdminList places={places || []} />;
}
