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
    opening_hours: formData.get("opening_hours") as string,
    best_time: formData.get("best_time") as string,
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
    opening_hours: formData.get("opening_hours") as string,
    best_time: formData.get("best_time") as string,
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

export async function deleteSubscriber(id: string) {
  await verifyAdmin();
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin.from("subscribers").delete().eq("id", id);

  if (error) return { success: false, message: error.message };
  return { success: true, message: "Xóa người đăng ký thành công." };
}

export async function sendQuickEmail(email: string, subject: string, content: string) {
  await verifyAdmin();

  if (!process.env.RESEND_API_KEY) {
    return { success: false, message: "Chưa cấu hình Resend API Key." };
  }

  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { render } = await import("@react-email/render");
  const { NotificationEmail } = await import("../../components/emails/NotificationEmail");

  const emailHtml = await render(
    NotificationEmail({ subject, content })
  );

  try {
    await resend.emails.send({
      from: 'Vung Tau Travel <newsletter@yourdomain.com>', // Thay bằng domain đã verify của bạn
      to: email,
      subject: subject,
      html: emailHtml,
    });
    return { success: true, message: `Đã gửi email đến ${email}` };
  } catch (error: any) {
    console.error("Resend Error:", error);
    return { success: false, message: "Lỗi khi gửi email: " + error.toString() };
  }
}

export async function sendNewsletter(subject: string, content: string) {
  await verifyAdmin();

  if (!process.env.RESEND_API_KEY) {
    return { success: false, message: "Chưa cấu hình Resend API Key." };
  }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: subscribers, error: dbError } = await supabaseAdmin
    .from("subscribers")
    .select("email");

  if (dbError || !subscribers || subscribers.length === 0) {
    return { success: false, message: "Không có người đăng ký nào hoặc lỗi khi lấy danh sách." };
  }

  const emails = subscribers.map(s => s.email);

  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { render } = await import("@react-email/render");
  const { NotificationEmail } = await import("../../components/emails/NotificationEmail");
  const emailHtml = await render(NotificationEmail({ subject, content }));

  try {
    // Sử dụng Batch API để gửi nhiều email cùng lúc (tối đa 100 email/batch)
    // Lưu ý: Với tài khoản Resend chưa verify domain, bạn chỉ có thể gửi đến chính email đăng ký Resend.
    const emailBatches = emails.map(email => ({
      from: 'Vung Tau Travel <newsletter@yourdomain.com>', // Thay bằng domain đã verify của bạn
      to: email,
      subject: subject,
      html: emailHtml,
    }));

    // Demo gửi 100 email đầu tiên (do giới hạn batch)
    const batchToSend = emailBatches.slice(0, 100);
    await resend.batch.send(batchToSend);

  } catch (error: any) {
    console.error("Resend Error:", error);
    return { success: false, message: "Lỗi khi gửi newsletter: " + error.toString() };
  }

  return { success: true, message: `Newsletter đã được gửi đến ${emails.length} người đăng ký.` };
}

export async function scheduleNewsletter(subject: string, content: string, scheduledAt: string) {
  await verifyAdmin();

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin.from("newsletters").insert({
    subject,
    content,
    scheduled_at: scheduledAt,
    status: 'pending'
  });

  if (error) return { success: false, message: "Lỗi khi lên lịch: " + error.message };
  return { success: true, message: "Đã lên lịch gửi newsletter thành công." };
}

export async function cancelNewsletter(id: string) {
  await verifyAdmin();

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin.from("newsletters").delete().eq("id", id).eq("status", "pending");
  if (error) return { success: false, message: "Lỗi khi hủy lịch: " + error.message };
  return { success: true, message: "Đã hủy lịch gửi newsletter." };
}

export async function resendNewsletter(newsletterId: string) {
  await verifyAdmin();

  if (!process.env.RESEND_API_KEY) {
    return { success: false, message: "Chưa cấu hình Resend API Key." };
  }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Lấy thông tin newsletter
  const { data: newsletter, error: newsletterError } = await supabaseAdmin.from("newsletters").select("subject, content").eq("id", newsletterId).single();
  if (newsletterError || !newsletter) return { success: false, message: "Không tìm thấy newsletter." };

  // Lấy danh sách người đăng ký
  const { data: subscribers, error: dbError } = await supabaseAdmin.from("subscribers").select("email");
  if (dbError || !subscribers || subscribers.length === 0) return { success: false, message: "Không có người đăng ký." };

  const emails = subscribers.map(s => s.email);

  // Gửi email
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { render } = await import("@react-email/render");
  const { NotificationEmail } = await import("../../components/emails/NotificationEmail");
  const emailHtml = await render(NotificationEmail(newsletter));

  const emailBatches = emails.map(email => ({
    from: 'Vung Tau Travel <newsletter@yourdomain.com>', // Thay bằng domain đã verify của bạn
    to: email,
    subject: newsletter.subject,
    html: emailHtml,
  }));

  await resend.batch.send(emailBatches.slice(0, 100));

  // Cập nhật trạng thái newsletter
  await supabaseAdmin.from("newsletters").update({ status: 'sent', scheduled_at: new Date().toISOString() }).eq("id", newsletterId);

  revalidatePath("/admin/newsletter/list");
  return { success: true, message: `Đã gửi lại newsletter đến ${emails.length} người.` };
}