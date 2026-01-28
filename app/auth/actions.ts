"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const next = formData.get("next") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const redirectUrl = `/login?message=Đăng nhập thất bại: ${error.message}`;
    return redirect(next ? `${redirectUrl}&next=${next}` : redirectUrl);
  }

  revalidatePath("/", "layout");
  const target = next || "/";
  const separator = target.includes("?") ? "&" : "?";
  redirect(`${target}${separator}success=Đăng nhập thành công`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return redirect("/signup?message=Đăng ký thất bại: " + error.message);
  }

  revalidatePath("/", "layout");
  redirect("/");

}
