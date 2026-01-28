"use client";

import { useState } from "react";
import { deleteUser, updateUserRole } from "./actions";
import { User } from "@supabase/supabase-js";
import { Trash2, Loader2, ShieldAlert } from "lucide-react";

export interface UserProfile extends User {
  profile_role: string;
}

export default function UserTable({ users, adminUserId }: { users: UserProfile[], adminUserId: string }) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.")) {
      return;
    }
    setDeletingId(userId);
    setError(null);
    const result = await deleteUser(userId);
    if (!result.success) {
      setError(result.message);
    }
    setDeletingId(null);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    setError(null);
    const result = await updateUserRole(userId, newRole);
    if (!result.success) {
      setError(result.message);
    }
    setUpdatingId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100">
      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Vai trò</th>
              <th scope="col" className="px-6 py-3">Ngày tham gia</th>
              <th scope="col" className="px-6 py-3"><span className="sr-only">Hành động</span></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {user.email}
                </th>
                <td className="px-6 py-4">
                  {user.id === adminUserId ? (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.profile_role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.profile_role}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <select
                        value={user.profile_role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={updatingId === user.id}
                        className={`block p-2 text-xs border rounded-lg focus:ring-blue-500 focus:border-blue-500 cursor-pointer ${
                          user.profile_role === 'admin' 
                          ? 'bg-red-50 border-red-200 text-red-800' 
                          : 'bg-blue-50 border-blue-200 text-blue-800'
                        }`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      {updatingId === user.id && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {new Date(user.created_at).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4 text-right">
                  {user.id === adminUserId ? (
                     <span className="font-medium text-gray-400 cursor-not-allowed">Không thể xóa</span>
                  ) : (
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingId === user.id}
                      className="font-medium text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-wait flex items-center gap-1"
                    >
                      {deletingId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      {deletingId === user.id ? 'Đang xóa...' : 'Xóa'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 flex items-center gap-2 border-t border-red-200">
            <ShieldAlert className="w-5 h-5" />
            <strong>Lỗi:</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
}