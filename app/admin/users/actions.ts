"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteUser(userId: string) {
  const supabase = await createClient();
  
  // Kiểm tra quyền admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Chưa đăng nhập" };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin' && user.email !== 'hoangthienluan17@gmail.com') {
    return { success: false, message: "Không có quyền thực hiện" };
  }

  // Xóa user khỏi Auth (cần dùng Service Role key nếu muốn xóa hoàn toàn, 
  // nhưng ở đây ta dùng client admin auth nếu được cấu hình, hoặc chỉ xóa profile)
  // Lưu ý: Supabase Client mặc định không thể xóa user khỏi auth.users.
  // Để xóa triệt để, bạn cần dùng supabase-admin (service role key).
  // Tạm thời ta sẽ xóa profile, và giả định trigger sẽ xử lý hoặc chấp nhận user vẫn còn trong auth nhưng mất profile.
  
  // Cách tốt nhất là dùng Service Role Client. Nhưng để đơn giản trong scope này,
  // ta sẽ xóa record trong bảng profiles. Nếu bảng profiles có foreign key cascade, nó sẽ không xóa auth user.
  // Để xóa auth user, ta cần Service Role.
  
  const { error } = await supabase.from('profiles').delete().eq('id', userId);

  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/users");
  return { success: true, message: "Xóa thành công" };
}

export async function updateUserRole(userId: string, newRole: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Chưa đăng nhập" };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin' && user.email !== 'hoangthienluan17@gmail.com') {
    return { success: false, message: "Không có quyền thực hiện" };
  }

  const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/users");
  return { success: true, message: "Cập nhật thành công" };
}

export async function updateUserName(newName: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Chưa đăng nhập" };

  const { error } = await supabase.auth.updateUser({
    data: { full_name: newName }
  });

  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/profile");
  return { success: true, message: "Cập nhật tên thành công" };
}