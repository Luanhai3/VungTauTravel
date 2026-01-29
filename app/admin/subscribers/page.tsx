"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { deleteSubscriber, sendQuickEmail } from "@/app/admin/actions";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
  Download,
  Trash2,
  Loader2,
  Send,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);


  const supabase = createClient();
  const router = useRouter();

  /* ====== AUTH CHECK ====== */
  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (
        profile?.role !== "admin" &&
        user.email !== "hoangthienluan17@gmail.com"
      ) {
        router.push("/forbidden");
      }
    };

    checkAdmin();
  }, [router, supabase]);

  /* ====== FETCH DATA ====== */
  const fetchSubscribers = async () => {
    let query = supabase
      .from("subscribers")
      .select("*", { count: "exact" });

    if (searchQuery) {
      query = query.ilike("email", `%${searchQuery}%`);
    }

    const from = (currentPage - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching subscribers:", error);
      // Có thể thêm thông báo lỗi UI ở đây nếu cần
    }
    
    if (data) {
      setSubscribers(data);
      setTotalCount(count || 0);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchSubscribers, 300);
    return () => clearTimeout(timer);
  }, [currentPage, searchQuery, supabase]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  /* ====== EXPORT CSV ====== */
  const handleExportCSV = async () => {
    const { data } = await supabase
      .from("subscribers")
      .select("email,created_at")
      .order("created_at", { ascending: false });

    if (!data) return;

    const headers = ["Email", "Ngày đăng ký"];
    const csvContent = [
      headers.join(","),
      ...data.map((sub) =>
        [
          sub.email,
          new Date(sub.created_at).toLocaleDateString("vi-VN"),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `subscribers_${new Date()
      .toISOString()
      .split("T")[0]}.csv`;
    link.click();
  };

  /* ====== DELETE SUBSCRIBER ====== */
  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa email này khỏi danh sách?")) return;
    
    setDeletingId(id);
    const result = await deleteSubscriber(id);
    
    if (result.success) {
      fetchSubscribers();
    } else {
      alert(result.message);
    }
    setDeletingId(null);
  };

  /* ====== SEND EMAIL ====== */
  const openEmailModal = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setEmailSubject("Thông báo từ Vũng Tàu Travel");
    setEmailContent("");
    setEmailModalOpen(true);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubscriber) return;

    setSendingEmail(true);
    const result = await sendQuickEmail(selectedSubscriber.email, emailSubject, emailContent);
    setSendingEmail(false);

    if (result.success) {
      alert(result.message);
      setEmailModalOpen(false);
    } else {
      alert("Lỗi gửi email: " + result.message);
    }
  };

  /* ====== UI ====== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-emerald-50 pt-28 pb-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="rounded-3xl p-6 bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white shadow-xl">
          <h1 className="text-3xl font-black flex items-center gap-3">
            🌊 Người đăng ký nhận tin
          </h1>
          <p className="text-white/90 mt-1">
            Danh sách email theo dõi thông tin và sự kiện tại Thành phố Vũng Tàu
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur rounded-3xl shadow-2xl border border-white overflow-hidden">

          {/* Toolbar */}
          <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 justify-between items-center border-b border-gray-100">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400" />
              <input
                type="text"
                placeholder="Tìm kiếm email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 rounded-full border border-sky-200 focus:ring-2 focus:ring-sky-400 outline-none"
              />
            </div>

            <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-4">
              <div className="text-sm text-gray-600">
                Tổng cộng{" "}
                <span className="font-black text-sky-600">
                  {totalCount}
                </span>
              </div>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold shadow hover:opacity-90"
              >
                <Download className="w-4 h-4" />
                Xuất CSV
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-sky-50 text-sky-700 uppercase text-xs">
                <tr>
                  <th className="px-4 md:px-6 py-4">Email</th>
                  <th className="px-4 md:px-6 py-4 hidden md:table-cell">Ngày đăng ký</th>
                  <th className="px-4 md:px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.length > 0 ? (
                  subscribers.map((sub) => (
                    <tr
                      key={sub.id}
                      className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-sky-50 hover:to-emerald-50 transition"
                    >
                      <td className="px-4 md:px-6 py-4 font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                          <span className="p-2 rounded-full bg-sky-100 text-sky-600">
                            <Mail className="w-4 h-4" />
                          </span>
                          <span className="truncate">{sub.email}</span>
                        </div>
                        <div className="md:hidden mt-2 ml-11 text-xs text-gray-500 flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(sub.created_at).toLocaleDateString("vi-VN")}</div>
                      </td>
                      <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-xs">
                          <Calendar className="w-4 h-4" />
                          {new Date(sub.created_at).toLocaleDateString("vi-VN")}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEmailModal(sub)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                            title="Gửi email nhanh"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button
                          onClick={() => handleDelete(sub.id)}
                          disabled={deletingId === sub.id}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                          title="Xóa"
                        >
                          {deletingId === sub.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 md:px-6 py-10 text-center text-gray-500"
                    >
                      🌴 Chưa có người đăng ký nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-sky-50/50">
              <div className="text-sm text-gray-600">
                Trang {currentPage} / {totalPages}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-full bg-white shadow hover:bg-sky-100 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(totalPages, p + 1)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full bg-white shadow hover:bg-sky-100 disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Modal */}
      {emailModalOpen && selectedSubscriber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary-600" />
                Gửi email đến {selectedSubscriber.email}
              </h3>
              <button
                onClick={() => setEmailModalOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSendEmail} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                <textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  placeholder="Nhập nội dung email..."
                  required
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70 shadow-lg shadow-primary-600/20"
                >
                  {sendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {sendingEmail ? "Đang gửi..." : "Gửi ngay"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
