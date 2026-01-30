"use client";

import { useEffect, useState } from "react";
import { Star, User as UserIcon, Send, Trash2, Flag, AlertTriangle, X, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Comment, getCommentsByPlace, addComment, deleteComment, reportComment, getAverageRating, toggleLikeComment } from "@/lib/comments";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

interface UserWithRole extends User {
  role?: string;
}

export default function Comments({ placeId }: { placeId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportCommentId, setReportCommentId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const ITEMS_PER_PAGE = 5;
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        setUser({ ...user, role: profile?.role });
      }
    };
    fetchUser();
    loadComments();
  }, [placeId, page]);

  const loadComments = async () => {
    const { data, count } = await getCommentsByPlace(placeId, page, ITEMS_PER_PAGE);
    setComments(data);
    setTotalCount(count);
    
    const avg = await getAverageRating(placeId);
    setAverageRating(avg || 0);
    
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    // Chống Spam: Giới hạn 60 giây giữa các lần bình luận
    const COOLDOWN_TIME = 60000; // 60 giây
    const timeSinceLastSubmit = Date.now() - lastSubmitTime;
    if (timeSinceLastSubmit < COOLDOWN_TIME) {
      alert(`Bạn thao tác quá nhanh. Vui lòng đợi ${Math.ceil((COOLDOWN_TIME - timeSinceLastSubmit) / 1000)} giây nữa.`);
      return;
    }

    setSubmitting(true);
    try {
      await addComment(placeId, content, rating);
      setContent("");
      setRating(5);
      setLastSubmitTime(Date.now());
      
      if (page !== 1) {
        setPage(1); // Quay về trang 1 để thấy bình luận mới
      } else {
        loadComments();
      }
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Lỗi khi gửi bình luận");
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

  const openReportModal = (commentId: string) => {
    setReportCommentId(commentId);
    setReportModalOpen(true);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportCommentId || !reportReason.trim()) return;
    
    try {
      await reportComment(reportCommentId, reportReason);
      alert("Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét vi phạm này.");
      setReportModalOpen(false);
      setReportReason("");
      setReportCommentId(null);
    } catch (error) {
      alert("Lỗi khi gửi báo cáo: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  const handleLike = async (commentId: string) => {
    if (!user) {
      alert("Vui lòng đăng nhập để thích bình luận.");
      return;
    }

    // Optimistic update (Cập nhật giao diện ngay lập tức)
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          user_has_liked: !c.user_has_liked,
          likes_count: (c.likes_count || 0) + (c.user_has_liked ? -1 : 1)
        };
      }
      return c;
    }));

    try {
      await toggleLikeComment(commentId);
    } catch (error) {
      console.error("Lỗi like:", error);
      // Revert nếu lỗi (có thể thêm logic revert ở đây nếu cần thiết)
      loadComments(); 
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
            {averageRating.toFixed(1)}
          </span>
          <span className="text-slate-500 text-sm">({totalCount} đánh giá)</span>
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
                        <UserIcon className="w-6 h-6" />
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
              
              <div className="mt-4 flex justify-end gap-3">
                {/* Nút Like */}
                <button
                  onClick={() => handleLike(comment.id)}
                  className={`text-sm flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                    comment.user_has_liked ? "text-red-500 bg-red-50" : "text-slate-400 hover:text-red-500 hover:bg-red-50"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${comment.user_has_liked ? "fill-current" : ""}`} />
                  <span>{comment.likes_count || 0}</span>
                </button>

                {/* Nút báo cáo cho người khác */}
                {user && user.id !== comment.user_id && (
                  <button
                    onClick={() => openReportModal(comment.id)}
                    className="text-sm text-slate-400 hover:text-orange-500 flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-orange-50 transition-colors"
                    title="Báo cáo vi phạm"
                  >
                    <Flag className="w-4 h-4" /> <span className="hidden sm:inline">Báo cáo</span>
                  </button>
                )}

                {/* Nút xóa cho chính chủ hoặc admin */}
                {(user?.id === comment.user_id || user?.role === 'admin') && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-sm text-red-500 hover:text-red-400 flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Xóa</span>
                  </button>
                )}
              </div>
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

      {/* Pagination */}
      {Math.ceil(totalCount / ITEMS_PER_PAGE) > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-slate-100">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-slate-600">
            Trang {page} / {Math.ceil(totalCount / ITEMS_PER_PAGE)}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(Math.ceil(totalCount / ITEMS_PER_PAGE), p + 1))}
            disabled={page === Math.ceil(totalCount / ITEMS_PER_PAGE)}
            className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Modal Báo cáo */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Báo cáo vi phạm
              </h3>
              <button 
                onClick={() => setReportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleReportSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Lý do báo cáo</label>
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none resize-none bg-slate-50 text-slate-900"
                  rows={4}
                  placeholder="Vui lòng cho chúng tôi biết lý do (Spam, ngôn từ đả kích, thông tin sai lệch...)"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-orange-500/20"
                >
                  Gửi báo cáo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}