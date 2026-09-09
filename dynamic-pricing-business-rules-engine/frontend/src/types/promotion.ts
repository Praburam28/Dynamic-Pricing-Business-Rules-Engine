export interface Promotion {
  id: number;
  code: string;
  discount_type: string;
  discount_value: number;
  minimum_purchase: number | null;
  maximum_discount: number | null;
  start_date: string;
  expiry_date: string;
  usage_limit: number | null;
  usage_count: number;
  is_active: boolean;
}

export interface PromotionListResponse {
  items: Promotion[];
  total: number;
  skip: number;
  limit: number;
}

export interface PromotionCreateRequest {
  code: string;
  discount_type: string;
  discount_value: number;
  minimum_purchase?: number | null;
  maximum_discount?: number | null;
  start_date: string;
  expiry_date: string;
  usage_limit?: number | null;
  is_active?: boolean;
}

export interface PromotionUpdateRequest {
  code?: string;
  discount_type?: string;
  discount_value?: number;
  minimum_purchase?: number | null;
  maximum_discount?: number | null;
  start_date?: string;
  expiry_date?: string;
  usage_limit?: number | null;
}