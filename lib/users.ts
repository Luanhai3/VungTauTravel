export type Role = "admin" | "editor" | "user";

export interface User {
  id: string;
  username: string;
  password: string; // Trong thực tế nên mã hóa mật khẩu
  name: string;
  role: Role;
  avatarUrl?: string;
  favorites?: string[];
}

// Dữ liệu mẫu - tài khoản admin mặc định
let users: User[] = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    name: "Administrator",
    role: "admin",
  },
];

const STORAGE_KEY = "vungtau_users";

// Khởi tạo localStorage nếu đang ở trình duyệt
if (typeof window !== "undefined") {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      users = JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored users", e);
    }
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }
}

export const getUsers = (): User[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return users;
      }
    }
  }
  return users;
};

export const addUser = (user: Omit<User, "id">): User => {
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
  };
  const allUsers = getUsers();
  const updated = [...allUsers, newUser];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return newUser;
};

export const deleteUser = (id: string): void => {
  const allUsers = getUsers();
  const updated = allUsers.filter((u) => u.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};

export const toggleFavorite = (username: string, placeId: string): boolean => {
  const allUsers = getUsers();
  const userIndex = allUsers.findIndex((u) => u.username === username);
  
  if (userIndex === -1) return false;
  
  const user = allUsers[userIndex];
  const favorites = user.favorites || [];
  const isFavorite = favorites.includes(placeId);
  
  let newFavorites;
  if (isFavorite) {
    newFavorites = favorites.filter((id) => id !== placeId);
  } else {
    newFavorites = [...favorites, placeId];
  }
  
  const updatedUser = { ...user, favorites: newFavorites };
  allUsers[userIndex] = updatedUser;
  
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allUsers));
  }
  return !isFavorite;
};

export const authenticate = (username: string, password: string): boolean => {
  const allUsers = getUsers();
  return allUsers.some((u) => u.username === username && u.password === password);
};

export const getUserByUsername = (username: string): User | undefined => {
  const allUsers = getUsers();
  return allUsers.find((u) => u.username === username);
};

export const updateUser = (id: string, updates: Partial<User>): void => {
  const allUsers = getUsers();
  const updated = allUsers.map((u) => (u.id === id ? { ...u, ...updates } : u));
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};