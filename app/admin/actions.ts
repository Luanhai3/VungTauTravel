"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  if (user.email === 'hoangthienluan17@gmail.com' || user.email === 'hoangthienluan17@gmal.com') {
    return true;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error("Not authorized");
  }
  return true;
}

export async function deleteUser(userId: string) {
  await verifyAdmin();

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase service role key.");
  }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) return { success: false, message: error.message };

  revalidatePath("/admin");
  return { success: true, message: "Xóa người dùng thành công." };
}

export async function updateUserRole(userId: string, newRole: string) {
  await verifyAdmin();

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase service role key.");
  }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId);

  if (error) return { success: false, message: error.message };

  revalidatePath("/admin");
  return { success: true, message: "Cập nhật vai trò thành công." };
}

export async function deleteComment(commentId: string) {
  await verifyAdmin();

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase service role key.");
  }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { error } = await supabaseAdmin
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/comments");
  return { success: true, message: "Xóa bình luận thành công." };
}

export async function createPlace(formData: FormData) {
  await verifyAdmin();

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const placeData = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    address: formData.get("address") as string,
    category: formData.get("category") as string,
    image_url: formData.get("image_url") as string,
    google_maps_url: formData.get("google_maps_url") as string,
    is_featured: formData.get("is_featured") === "on",
  };

  const { error } = await supabaseAdmin.from("places").insert(placeData);

  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/places");
  return { success: true, message: "Thêm địa điểm thành công." };
}

export async function updatePlace(id: string, formData: FormData) {
  await verifyAdmin();

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const placeData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    address: formData.get("address") as string,
    category: formData.get("category") as string,
    image_url: formData.get("image_url") as string,
    google_maps_url: formData.get("google_maps_url") as string,
    is_featured: formData.get("is_featured") === "on",
  };

  const { error } = await supabaseAdmin.from("places").update(placeData).eq("id", id);

  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/places");
  return { success: true, message: "Cập nhật địa điểm thành công." };
}

export async function deletePlace(id: string) {
  await verifyAdmin();
  const supabaseAdmin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { error } = await supabaseAdmin.from("places").delete().eq("id", id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin/places");
  return { success: true, message: "Xóa địa điểm thành công." };
}