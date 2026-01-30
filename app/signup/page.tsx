"use client";

import Link from "next/link";
import { signup } from "@/app/auth/actions";
import { SubmitButton } from "./submit-button";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";

export default function Signup({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden
      bg-[#F5FAFF] px-4 py-12"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative max-w-md w-full
        bg-white/60 backdrop-blur-2xl
        border border-white/60
        p-6 sm:p-8 rounded-3xl shadow-2xl shadow-teal-900/5"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="mx-auto w-16 h-16 rounded-full flex items-center justify-center
            bg-teal-50 mb-4 border border-teal-100"
          >
            <UserPlus className="w-6 h-6 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Join the Cosmos
          </h2>
          <p className="mt-2 text-slate-500 text-sm">
            Tạo tài khoản để lưu giữ những khoảnh khắc bên biển
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" action={signup}>
          <div className="space-y-4">
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Địa chỉ Email"
              className="input"
            />

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Mật khẩu"
              className="input"
            />
          </div>

          <SubmitButton />

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/"
              className="text-slate-500 font-medium hover:text-teal-600 transition-colors"
            >
              ← Quay lại trang chủ
            </Link>
            <Link
              href="/admin/login"
              className="text-slate-500 font-medium hover:text-teal-600 transition-colors"
            >
              Đã có tài khoản?
            </Link>
          </div>

          {searchParams?.message && (
            <div className="p-4 bg-red-100 text-red-600 text-sm rounded-xl text-center">
              {searchParams.message}
            </div>
          )}
        </form>
      </motion.div>

      {/* Global styles */}
      <style jsx global>{`
        .input {
          width: 100%;
          padding: 0.75rem 1.25rem;
          border-radius: 0.75rem;
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(203, 213, 225, 0.5);
          color: #0f172a;
          outline: none;
          transition: all 0.3s ease;
        }

        .input::placeholder {
          color: #94a3b8;
        }

        .input:focus {
          border-color: #14b8a6;
          background: white;
        }
      `}</style>
    </div>
  );
}
