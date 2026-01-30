"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [view, setView] = useState<"login" | "signup" | "forgot" | "mfa">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (view === "forgot") {
      if (!email) return setError("Vui lòng nhập email");
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/profile`,
      });
      return error
        ? setError(error.message)
        : setMessage("Đã gửi email khôi phục mật khẩu 🌊");
    }

    if (view === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password,
      });
      if (error) return setError(error.message);

      const { data: factors } = await supabase.auth.mfa.listFactors();
      if (factors?.totp?.[0]?.status === "verified") {
        return setView("mfa");
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      router.push(profile?.role === "admin" ? "/admin" : "/");
    }

    if (view === "mfa") {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const factor = factors?.totp?.[0];
      if (!factor) return setError("Không tìm thấy 2FA");

      const challenge = await supabase.auth.mfa.challenge({ factorId: factor.id });
      const verify = await supabase.auth.mfa.verify({
        factorId: factor.id,
        challengeId: challenge.data.id,
        code: mfaCode,
      });

      if (verify.error) return setError("Mã không hợp lệ");

      router.push("/admin");
    }

    if (view === "signup") {
      if (password !== confirmPassword) {
        return setError("Mật khẩu xác nhận không khớp");
      }

      const { error } = await supabase.auth.signUp({
        email: username,
        password,
        options: { data: { full_name: name } },
      });

      if (error) return setError(error.message);

      setView("login");
      setMessage("Đăng ký thành công! Kiểm tra email để xác thực 🌴");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden 
      bg-[#F5FAFF] px-4">

      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/60 backdrop-blur-2xl 
        border border-white/60 p-8 rounded-3xl shadow-2xl shadow-teal-900/5 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center
            bg-teal-50 mb-4 border border-teal-100">
            <Lock className="text-teal-600 w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome Back
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {view === "login" && "Đăng nhập để lưu điểm đến yêu thích"}
            {view === "signup" && "Tạo tài khoản cho hành trình biển"}
            {view === "forgot" && "Khôi phục mật khẩu"}
            {view === "mfa" && "Xác thực an toàn"}
          </p>
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.form
            key={view}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            {error && <div className="bg-red-100 text-red-600 p-3 rounded-xl text-sm">{error}</div>}
            {message && <div className="bg-green-100 text-green-600 p-3 rounded-xl text-sm">{message}</div>}

            {view === "signup" && (
              <input
                placeholder="Họ tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
              />
            )}

            {view === "forgot" ? (
              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            ) : view === "mfa" ? (
              <input
                placeholder="000000"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                className="input text-center tracking-widest text-lg"
              />
            ) : (
              <>
                <input
                  placeholder="Email đăng nhập"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input"
                />
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                />
              </>
            )}

            {view === "signup" && (
              <input
                type="password"
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
              />
            )}

            <button className="w-full py-3 rounded-xl text-white font-semibold
              bg-slate-900 hover:bg-slate-800
              transition-all shadow-lg shadow-slate-900/20">
              {view === "login" && "Đăng nhập"}
              {view === "signup" && "Đăng ký"}
              {view === "forgot" && "Gửi email"}
              {view === "mfa" && "Xác nhận"}
            </button>
          </motion.form>
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-500 space-y-2">
          {view === "login" && (
            <>
              <button onClick={() => setView("forgot")} className="link">Quên mật khẩu?</button>
              <button onClick={() => setView("signup")} className="link">Chưa có tài khoản?</button>
            </>
          )}
          {(view === "signup" || view === "forgot") && (
            <button onClick={() => setView("login")} className="link">
              Quay lại đăng nhập
            </button>
          )}
        </div>
      </motion.div>

      {/* Tailwind shortcut */}
      <style jsx global>{`
        .input {
          width: 100%;
          padding: 0.75rem 1.25rem;
          border-radius: 0.75rem;
          background: rgba(255,255,255,0.5);
          border: 1px solid rgba(203, 213, 225, 0.5);
          color: #0f172a;
          outline: none;
          transition: all .3s;
        }
        .input:focus {
          border-color: #14b8a6;
          background: white;
        }
        .link {
          color: #14b8a6;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
