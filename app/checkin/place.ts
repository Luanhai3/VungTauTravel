export interface Place {
  id: number | string;
  slug: string;
  name: string;
  description: string;
  address?: string;
  featured?: boolean;
  categories?: {
    name: string;
  } | null;
  images?: {
    image_url: string;
  }[] | null;
}