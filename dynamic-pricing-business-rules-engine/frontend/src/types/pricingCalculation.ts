export interface PricingCalculationRequest {
  product_id: number;
  customer_id: number;
  quantity: number;
  location?: string | null;
  promotional_code?: string | null;
  tax_rate: number;
}

export interface AppliedRule {
  rule_id: number;
  rule_name: string;
  discount_amount: number;
}

export interface PricingCalculationResponse {
  calculation_id: number | null;
  product_id: number;
  customer_id: number;
  quantity: number;
  base_price: number;
  original_price: number;
  discount_amount: number;
  promotion_discount: number;
  tax_rate: number;
  tax_amount: number;
  final_price: number;
  promotional_code: string | null;
  applied_rules: AppliedRule[];
}