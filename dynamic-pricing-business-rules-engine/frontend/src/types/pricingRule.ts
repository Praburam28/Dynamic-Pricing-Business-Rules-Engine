export interface RuleCondition {
  id?: number;
  field: string;
  operator: string;
  value: string;
  condition_group: number;
  logical_operator: string;
}

export interface RuleAction {
  id?: number;
  action_type: string;
  discount_type: string | null;
  value: number;
}

export interface PricingRule {
  id: number;
  name: string;
  description: string | null;
  priority: number;
  execution_type: string;
  maximum_discount: number | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  conditions: RuleCondition[];
  actions: RuleAction[];
}

export interface PricingRuleListResponse {
  items: PricingRule[];
  total: number;
  skip: number;
  limit: number;
}

export interface RuleConditionRequest {
  field: string;
  operator: string;
  value: string;
  condition_group: number;
  logical_operator: string;
}

export interface RuleActionRequest {
  action_type: string;
  discount_type?: string | null;
  value: number;
}

export interface PricingRuleCreateRequest {
  name: string;
  description?: string | null;
  priority: number;
  execution_type: string;
  maximum_discount?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  is_active?: boolean;
  conditions: RuleConditionRequest[];
  actions: RuleActionRequest[];
}

export interface PricingRuleUpdateRequest {
  name?: string;
  description?: string | null;
  priority?: number;
  execution_type?: string;
  maximum_discount?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  conditions?: RuleConditionRequest[];
  actions?: RuleActionRequest[];
}