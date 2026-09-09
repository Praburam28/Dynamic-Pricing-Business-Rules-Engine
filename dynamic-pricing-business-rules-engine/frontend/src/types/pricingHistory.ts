export interface PricingHistoryRule {
  rule_id: number;
  rule_name: string;
  action_type: string;
  discount_amount: number;
}

export interface PricingHistory {
  calculation_id: number;
  product_id: number;
  customer_id: number;
  quantity: number;
  location: string | null;
  promotional_code: string | null;
  original_price: number;
  discount_amount: number;
  tax_amount: number;
  final_price: number;
  calculated_at: string;
  applied_rules: PricingHistoryRule[];
}

export interface PricingHistoryListResponse {
  items: PricingHistory[];
  total: number;
  skip: number;
  limit: number;
}