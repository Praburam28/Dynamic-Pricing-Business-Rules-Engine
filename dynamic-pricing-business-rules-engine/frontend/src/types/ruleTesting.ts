export interface RuleTestRequest {
  rule_id: number;
  customer_type?: string | null;
  customer_category?: string | null;
  location?: string | null;
  quantity: number;
  category_id: number;
  product_id: number;
  base_price: number;
}

export interface RuleTestResponse {
  rule_id: number;
  rule_name: string;
  matched: boolean;
  execution_type: string;
  message: string;
  discount_amount: number;
}