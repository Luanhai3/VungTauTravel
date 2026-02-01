"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminForm({ place }: { place?: any }) {
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState(place?.title || "");
  const [description, setDescription] = useState(place?.description || "");
  const [image, setImage] = useState(place?.image || "");
  const [categories, setCategories] = useState<string[]>([]);


  const handleSubmit = async () => {
    if (!title || !image) {
      alert("Thiếu title hoặc image");
      return;
    }

    if (place) {
      await supabase
        .from("places")
        .update({ title, description, image, categories })
        .eq("id", place.id);
    } else {
		await supabase.from("places").insert({
			title,
			description,
			image,
			categories,
			slug: title.toLowerCase().replace(/\s+/g, "-"),
			order: 0,
			featured: false,
		  });
		  
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen p-10 text-white bg-gradient-to-br from-sky-900 via-blue-900 to-emerald-900">
      <div className="max-w-xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">
          {place ? "✏️ Chỉnh sửa địa điểm" : "➕ Thêm địa điểm"}
        </h1>

        <input
          className="w-full p-2 rounded text-black"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="w-full p-2 rounded text-black"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <textarea
          className="w-full p-2 rounded text-black"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

<select
  className="w-full p-2 rounded text-black"
  value={categories}
  onChange={(e) =>
    setCategories(
      Array.from(e.target.selectedOptions, (option) => option.value)
    )
  }
  multiple
>
  <option value="food">Food</option>
  <option value="checkin">Check-in</option>
  <option value="stay">Stay</option>
</select>


        <button
          onClick={handleSubmit}
          className="bg-white text-black w-full py-2 rounded font-semibold"
        >
          Lưu
        </button>
      </div>
    </div>
  );
}
