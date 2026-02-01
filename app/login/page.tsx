"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Login() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) router.push("/admin");
    else alert(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 w-80">
        <input
          className="border p-2 w-full"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border p-2 w-full"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={login}
          className="bg-black text-white p-2 w-full"
        >
          Login
        </button>
      </div>
    </div>
  );
}
