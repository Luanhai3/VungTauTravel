export type Category = "Ăn uống" | "Hẹn hò" | "Check-in" | "Du lịch" | "Tham quan" | "Di tích" | "Thiên nhiên";

export interface Place {
  id: string;
  name: string;
  category: Category;
  imageUrl: string;
  description: string;
  address: string;
  googleMapsUrl: string;
  isFeatured?: boolean;
}
