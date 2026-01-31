"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, User as UserIcon, ChevronLeft, ChevronRight, Search, ArrowUpDown, ArrowUp, ArrowDown, BarChart3, Download, Loader2 } from "lucide-react";
import UserModal from "@/components/admin/UserModal";
import { getSupabaseBrowser } from "@/utils/supabase/client";
import { deleteUser, updateUserRole } from "@/app/admin/users/actions";

interface UserProfile {
  id: string;
  email: string;
  role: string;
  created_at: string;
  // Các trường khác từ bảng profiles hoặc metadata
}

function TableSkeleton() {
  return (
    <div className="animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between py-4 px-6 border-b border-gray-100">
          <div className="flex items-center gap-3 w-1/3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [chartData, setChartData] = useState<{ label: string; value: number }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof UserProfile; direction: "asc" | "desc" } | null>(null);
  const itemsPerPage = 5;
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = getSupabaseBrowser();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/admin/login");
        return;
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin' && user.email !== 'hoangthienluan17@gmail.com') {
        router.push("/forbidden");
        return;
      }
      setIsAuthChecked(true);
      setIsLoading(false);
    };
    checkUser();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSearching(false);
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (isAuthChecked) {
      loadUsers();
    }
  }, [isAuthChecked, currentPage, debouncedSearchQuery, sortConfig]);

  useEffect(() => {
    if (isAuthChecked) {
      loadChartData();
    }
  }, [isAuthChecked]);

  const loadUsers = async () => {
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' });

    if (debouncedSearchQuery) {
      query = query.ilike('email', `%${debouncedSearchQuery}%`);
    }

    if (sortConfig) {
      query = query.order(sortConfig.key, { ascending: sortConfig.direction === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const from = (currentPage - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    const { data, count } = await query.range(from, to);

    if (data) {
      setUsers(data as UserProfile[]);
      setTotalUsers(count || 0);
    }
  };

  const loadChartData = async () => {
    // Lấy dữ liệu created_at của tất cả user để vẽ biểu đồ
    // (Chỉ lấy cột created_at để tối ưu hiệu suất)
    const { data } = await supabase
      .from('profiles')
      .select('created_at');

    if (data) {
      const newChartData = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        const month = d.getMonth();
        const year = d.getFullYear();
        
        const count = data.filter((u: any) => {
          const uDate = u.created_at ? new Date(u.created_at) : null;
          return uDate && uDate.getMonth() === month && uDate.getFullYear() === year;
        }).length;

        return { label: `T${month + 1}`, value: count };
      });
      setChartData(newChartData);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      const result = await deleteUser(id);
      if (!result.success) {
        alert(result.message);
      } else {
        alert("Xóa thành công");
      }
      loadUsers();
      loadChartData();
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    const result = await updateUserRole(userId, newRole);
    if (!result.success) {
      alert(result.message);
    }
    setUpdatingId(null);
    loadUsers();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    loadUsers();
  };

  const handleSort = (key: keyof UserProfile) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleExportCSV = async () => {
    // Fetch toàn bộ dữ liệu theo filter hiện tại để export
    let query = supabase.from('profiles').select('*');

    if (debouncedSearchQuery) {
      query = query.ilike('email', `%${debouncedSearchQuery}%`);
    }

    if (sortConfig) {
      query = query.order(sortConfig.key, { ascending: sortConfig.direction === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data } = await query;
    if (!data) return;

    const headers = ["ID", "Email", "Vai trò", "Ngày tạo"];
    const csvContent = [
      headers.join(","),
      ...data.map((user: any) => [
        user.id,
        user.email,
        user.role,
        user.created_at
      ].join(","))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const maxChartValue = Math.max(...chartData.map(d => d.value), 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý người dùng</h1>
          <p className="text-gray-600">Thêm và xóa tài khoản quản trị</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
          >
            <Download className="w-5 h-5" />
            Xuất CSV
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Thêm người dùng
          </button>
        </div>
      </div>

      {/* Dashboard Stats & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-600" />
              Thống kê đăng ký mới
            </h3>
          </div>
          
          <div className="flex items-end justify-between h-48 gap-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                <div className="relative w-full flex justify-center items-end h-full bg-gray-50 rounded-t-lg overflow-hidden">
                  <div 
                    className="w-full max-w-[40px] bg-primary-500 hover:bg-primary-600 transition-all duration-500 rounded-t-md relative group-hover:shadow-lg"
                    style={{ height: `${(item.value / maxChartValue) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                      {item.value} người
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Tổng người dùng</h3>
            <p className="text-3xl font-black text-gray-900">{users.length}</p>
            <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
              <ArrowUp className="w-4 h-4" />
              <span>Đang hoạt động</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Vai trò Admin</h3>
            <p className="text-3xl font-black text-gray-900">{users.filter(u => u.role === 'admin').length}</p>
            <div className="mt-2 text-sm text-gray-500">
              Tài khoản quản trị
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 relative max-w-md">
        {isSearching ? (
          <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
        ) : (
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc username..."
          value={searchQuery}
          onChange={(e) => {
            setIsSearching(true);
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Email
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                  onClick={() => handleSort('role')}
                >
                  <div className="flex items-center gap-1">
                    Vai trò
                    {sortConfig?.key === 'role' ? (
                      sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4 text-primary-600" /> : <ArrowDown className="w-4 h-4 text-primary-600" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-0"><TableSkeleton /></td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-full">
                          <UserIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        <span className="font-medium text-gray-900">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={updatingId === user.id || user.email === "hoangthienluan17@gmail.com"}
                          className={`block p-2 text-xs border rounded-lg focus:ring-primary-500 focus:border-primary-500 cursor-pointer outline-none transition-colors ${
                            user.role === 'admin' 
                            ? 'bg-purple-50 border-purple-200 text-purple-800' 
                            : 'bg-blue-50 border-blue-200 text-blue-800'
                          } ${updatingId === user.id ? 'opacity-50 cursor-wait' : ''}`}
                        >
                          <option value="user">Người dùng</option>
                          <option value="editor">Biên tập viên</option>
                          <option value="admin">Quản trị viên</option>
                        </select>
                        {updatingId === user.id && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                      {new Date(user.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-700 p-2 transition-colors"
                        title="Xóa"
                        disabled={user.email === "hoangthienluan17@gmail.com"} // Prevent deleting default admin
                      >
                        <Trash2 className={`w-4 h-4 ${user.email === "hoangthienluan17@gmail.com" ? "opacity-50 cursor-not-allowed" : ""}`} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalUsers > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="text-sm text-gray-500">
              Hiển thị <span className="font-medium">{startIndex + 1}</span> đến{" "}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, totalUsers)}
              </span>{" "}
              trong số <span className="font-medium">{totalUsers}</span> người dùng
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="text-sm font-medium text-gray-700">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <UserModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleModalClose}
        />
      )}
    </div>
  );
}