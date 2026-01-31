import { getSupabaseBrowser } from "@/utils/supabase/client";

export type Comment = {
  id: string;
  place_id: string;
  user_id: string;
  content: string;
  rating: number;
  created_at: string;
  profiles?: {
    email: string;
    name?: string;
    avatar_url?: string;
  };
  likes_count?: number;
  user_has_liked?: boolean;
};

const supabase = getSupabaseBrowser();

// Lấy danh sách bình luận của một địa điểm
export async function getCommentsByPlace(placeId: string, page: number = 1, limit: number = 5) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error, count } = await supabase
    .from("comments")
    .select("*, comment_likes(count)", { count: "exact" })
    .eq("place_id", placeId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching comments:", error);
    return { data: [], count: 0 };
  }

  if (data && data.length > 0) {
    // Filter for valid UUIDs to avoid 400 Bad Request from Postgres
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const userIds = Array.from(new Set(data.map((c) => c.user_id)))
      .filter((id) => typeof id === 'string' && uuidRegex.test(id));
    
    if (userIds.length === 0) return { data: data as Comment[], count: count || 0 };

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, email, name, avatar_url")
      .in("id", userIds);

    const profilesMap = (profiles || []).reduce((acc, profile) => {
      acc[profile.id] = profile;
      return acc;
    }, {} as Record<string, any>);

    // Kiểm tra xem user hiện tại đã like những comment nào chưa
    let likedCommentIds = new Set<string>();
    if (user) {
      const commentIds = data.map(c => c.id);
      const { data: likes } = await supabase
        .from("comment_likes")
        .select("comment_id")
        .eq("user_id", user.id)
        .in("comment_id", commentIds);
      
      if (likes) {
        likes.forEach((l: any) => likedCommentIds.add(l.comment_id));
      }
    }

    const result = data.map((comment) => ({
      ...comment,
      profiles: profilesMap[comment.user_id] || {
        email: "Người dùng ẩn danh",
        name: "Người dùng ẩn danh"
      },
      likes_count: comment.comment_likes ? (comment.comment_likes[0] as any)?.count : 0,
      user_has_liked: likedCommentIds.has(comment.id)
    })) as Comment[];

    return { data: result, count: count || 0 };
  }

  return { data: [], count: 0 };
}

// Thêm bình luận mới
export async function addComment(placeId: string, content: string, rating: number) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Bạn cần đăng nhập để bình luận");

  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        place_id: placeId,
        user_id: user.id,
        content,
        // rating,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Xóa bình luận
export async function deleteComment(commentId: string) {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) throw error;
  return true;
}

// Báo cáo bình luận
export async function reportComment(commentId: string, reason: string) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Bạn cần đăng nhập để báo cáo");

  const { error } = await supabase
    .from("reports")
    .insert({
      comment_id: commentId,
      user_id: user.id,
      reason: reason
    });

  if (error) throw error;
  return true;
}

// Thích/Bỏ thích bình luận
export async function toggleLikeComment(commentId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Bạn cần đăng nhập để thích bình luận");

  // Kiểm tra xem đã like chưa
  const { data } = await supabase
    .from("comment_likes")
    .select("*")
    .eq("comment_id", commentId)
    .eq("user_id", user.id)
    .single();

  if (data) {
    await supabase.from("comment_likes").delete().eq("comment_id", commentId).eq("user_id", user.id);
  } else {
    await supabase.from("comment_likes").insert({ comment_id: commentId, user_id: user.id });
  }
}

// Tính điểm đánh giá trung bình
export function calculateAverageRating(comments: Comment[]) {
  if (!comments.length) return 0;
  const sum = comments.reduce((acc, comment) => acc + comment.rating, 0);
  return (sum / comments.length).toFixed(1);
}

// Lấy điểm đánh giá trung bình từ database
export async function getAverageRating(placeId: string) {
  const { data, error } = await supabase
    .from("comments")
    .select("rating")
    .eq("place_id", placeId);

  if (error || !data || data.length === 0) return 0;

  const sum = data.reduce((acc, curr) => acc + (curr.rating || 0), 0);
  return Number((sum / data.length).toFixed(1));
}