export interface Customer {
  id: number;
  name: string;
  email: string;
  customer_type: string;
  customer_category: string | null;
  location: string | null;
  account_status: string;
  is_active: boolean;
}

export interface CustomerListResponse {
  items: Customer[];
  total: number;
  skip: number;
  limit: number;
}

export interface CustomerCreateRequest {
  name: string;
  email: string;
  customer_type: string;
  customer_category?: string | null;
  location?: string | null;
  account_status?: string;
}

export interface CustomerUpdateRequest {
  name?: string;
  email?: string;
  customer_type?: string;
  customer_category?: string | null;
  location?: string | null;
  account_status?: string;
}
