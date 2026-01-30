"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-slate-900 hover:bg-slate-800 focus:outline-none transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-slate-900/20"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Đang đăng ký...
        </span>
      ) : (
        "Đăng ký"
      )}
    </button>
  );
}