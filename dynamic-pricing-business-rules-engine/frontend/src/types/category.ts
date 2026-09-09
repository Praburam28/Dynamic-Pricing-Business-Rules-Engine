export interface Category {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
}

export interface CategoryListResponse {
  items: Category[];
  total: number;
  skip: number;
  limit: number;
}
