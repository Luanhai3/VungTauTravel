"use client";

import { useState } from "react";
import { deleteComment } from "./actions";
import { Trash2, Loader2, MapPin, Calendar, User, MessageSquare } from "lucide-react";
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  user_name: string;
  created_at: string;
  place_id: string;
  place_name: string;
}

export default function CommentTable({ comments }: { comments: Comment[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác.")) return;
    
    setDeletingId(id);
    await deleteComment(id);
    setDeletingId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Người dùng</th>
              <th className="px-6 py-3">Nội dung</th>
              <th className="px-6 py-3">Địa điểm</th>
              <th className="px-6 py-3">Thời gian</th>
              <th className="px-6 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="truncate max-w-[150px]" title={comment.user_name}>{comment.user_name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 max-w-xs truncate" title={comment.content}>
                  {comment.content}
                </td>
                <td className="px-6 py-4">
                  <Link href={`/places/${comment.place_id}`} target="_blank" className="flex items-center gap-1 text-blue-600 hover:underline">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-[150px]">{comment.place_name}</span>
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(comment.created_at).toLocaleDateString('vi-VN')}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(comment.id)}
                    disabled={deletingId === comment.id}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors p-2 hover:bg-red-50 rounded-full"
                    title="Xóa bình luận"
                  >
                    {deletingId === comment.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
            {comments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <MessageSquare className="w-8 h-8 text-gray-300" />
                    <p>Chưa có bình luận nào trong hệ thống.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}