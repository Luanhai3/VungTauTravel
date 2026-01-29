"use client";

import { useState } from "react";
import { sendNewsletter } from "@/app/admin/actions";
import { Loader2, Send, Mail } from "lucide-react";

export default function NewsletterPage() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !content) {
      setMessage({ type: "error", text: "Vui lòng nhập đầy đủ tiêu đề và nội dung." });
      return;
    }

    setIsSending(true);
    setMessage({ type: "", text: "" });

    try {
      const result = await sendNewsletter(subject, content);
      if (result.success) {
        setMessage({ type: "success", text: result.message });
        setSubject("");
        setContent("");
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: "Đã có lỗi xảy ra: " + error.message });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Soạn & Gửi Newsletter</h1>
          <p className="text-gray-600 mt-1">Gửi thông tin cập nhật đến tất cả người đăng ký.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {message.text && (
              <div
                className={`p-4 rounded-lg text-sm ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề Email
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Ví dụ: Khám phá Vũng Tàu tuần này!"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-y"
                placeholder="Nhập nội dung chính của email..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Nội dung sẽ được định dạng theo template email đã tạo.
              </p>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSending}
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors disabled:opacity-70 shadow-lg shadow-primary-600/20"
              >
                {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {isSending ? "Đang gửi..." : "Gửi cho tất cả"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
