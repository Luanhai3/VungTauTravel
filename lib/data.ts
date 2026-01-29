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
  openingHours?: string;
  bestTime?: string;
  galleryImages?: string[];
}

// Dummy function to prevent build error if imported somewhere
export const getPlaceById = (id: string): Place | undefined => {
  return undefined;
};
