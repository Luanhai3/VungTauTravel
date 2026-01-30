"use client";

import { useEffect, useState } from "react";
import { Star, User, Send, Trash2 } from "lucide-react";
import { Comment, getCommentsByPlace, addComment, deleteComment } from "@/lib/comments";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";

export default function Comments({ placeId }: { placeId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
    loadComments();
  }, [placeId]);

  const loadComments = async () => {
    const data = await getCommentsByPlace(placeId);
    setComments(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      await addComment(placeId, content, rating);
      setContent("");
      setRating(5);
      loadComments();
    } catch (error) {
      console.error(error);
      alert("Lỗi khi gửi bình luận");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (confirm("Bạn có chắc muốn xóa bình luận này?")) {
      try {
        await deleteComment(commentId);
        loadComments();
      } catch (error) {
        alert("Lỗi khi xóa bình luận");
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-8 py-8 border-t border-slate-200 mt-12">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-900">Bình luận & Đánh giá</h3>
        <div className="flex items-center gap-1">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <span className="font-bold text-lg text-slate-900">
            {comments.length > 0 
              ? (comments.reduce((acc, c) => acc + c.rating, 0) / comments.length).toFixed(1) 
              : "0.0"}
          </span>
          <span className="text-slate-500 text-sm">({comments.length} đánh giá)</span>
        </div>
      </div>

      {/* Form thêm bình luận */}
      {user ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-500 mb-2">Đánh giá của bạn</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-500 mb-2">Nội dung</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg focus:border-teal-500 outline-none resize-none bg-slate-50 text-slate-900 placeholder-slate-400"
              rows={3}
              placeholder="Chia sẻ trải nghiệm của bạn về địa điểm này..."
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              <Send className="w-4 h-4" />
              {submitting ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
          <p className="text-slate-500 mb-4 text-lg">Bạn cần đăng nhập để viết bình luận.</p>
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Đăng nhập ngay
          </Link>
        </div>
      )}

      {/* Danh sách bình luận */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500 mx-auto mb-2"></div>
            <p className="text-slate-500">Đang tải bình luận...</p>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                    {comment.profiles?.avatar_url ? (
                      <Image
                        src={comment.profiles.avatar_url}
                        alt={`Ảnh đại diện của ${comment.profiles.name || "người dùng"}`}
                        title={comment.profiles.name || "Người dùng"}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      {comment.profiles?.name || comment.profiles?.email?.split('@')[0] || "Người dùng"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {formatDate(comment.created_at)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-slate-700">{comment.rating}</span>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed">{comment.content}</p>
              
              {/* Nút xóa cho chính chủ hoặc admin */}
              {(user?.id === comment.user_id || user?.email === 'hoangthienluan17@gmail.com') && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-sm text-red-500 hover:text-red-400 flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Xóa bình luận
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="text-slate-300 mb-2">
              <Star className="w-12 h-12 mx-auto opacity-20" />
            </div>
            <p className="text-slate-500">Chưa có bình luận nào. Hãy là người đầu tiên đánh giá!</p>
          </div>
        )}
      </div>
    </div>
  );
}