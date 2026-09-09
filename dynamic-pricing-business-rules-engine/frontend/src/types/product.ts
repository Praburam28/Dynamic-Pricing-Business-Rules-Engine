export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string | null;
  base_price: number;
  category_id: number;
  is_active: boolean;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  skip: number;
  limit: number;
  sort_by: string;
  sort_order: string;
}

export interface ProductCreateRequest {
  name: string;
  sku: string;
  description?: string | null;
  base_price: number;
  category_id: number;
}

export interface ProductUpdateRequest {
  name?: string;
  sku?: string;
  description?: string | null;
  base_price?: number;
  category_id?: number;
}
