"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";

export default function Toast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const successMessage = searchParams.get("success");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (successMessage) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Xóa tham số success khỏi URL để tránh hiện lại khi refresh
        const params = new URLSearchParams(searchParams.toString());
        params.delete("success");
        router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, router, pathname, searchParams]);

  if (!isVisible || !successMessage) return null;

  return (
    <div className="fixed top-24 right-4 z-[100] animate-in slide-in-from-right-5 fade-in duration-300">
      <div className="bg-white border-l-4 border-green-500 shadow-xl rounded-lg p-4 flex items-center gap-3 pr-12 relative min-w-[300px]">
        <div className="bg-green-100 p-2 rounded-full">
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm">Thành công!</h4>
          <p className="text-gray-600 text-sm">{successMessage}</p>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}