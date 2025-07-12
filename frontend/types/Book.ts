export interface Book {
  id: number;
  title: string;
  author: string;
  genre?: string;
  category?: string;
  publicationYear?: number;
  numPages?: number;
  description?: string;
  tags?: string[];
  coverImage?: string;
  previewImages?: string[];
  isFavorite?: boolean;
  status?: string;
  readStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}
