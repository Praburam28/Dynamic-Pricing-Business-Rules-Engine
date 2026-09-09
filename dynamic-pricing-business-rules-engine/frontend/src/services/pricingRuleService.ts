import api from "../api/axios";

import type {
  PricingRule,
  PricingRuleCreateRequest,
  PricingRuleListResponse,
  PricingRuleUpdateRequest,
} from "../types/pricingRule";

export const getPricingRules = async (
  skip = 0,
  limit = 10,
  search?: string,
  isActive?: boolean,
): Promise<PricingRuleListResponse> => {
  const response = await api.get<PricingRuleListResponse>(
    "/pricing-rules",
    {
      params: {
        skip,
        limit,
        search: search || undefined,
        is_active: isActive,
      },
    },
  );

  return response.data;
};

export const getPricingRule = async (
  ruleId: number,
): Promise<PricingRule> => {
  const response = await api.get<PricingRule>(
    `/pricing-rules/${ruleId}`,
  );

  return response.data;
};

export const createPricingRule = async (
  data: PricingRuleCreateRequest,
): Promise<PricingRule> => {
  const response = await api.post<PricingRule>(
    "/pricing-rules",
    data,
  );

  return response.data;
};

export const updatePricingRule = async (
  ruleId: number,
  data: PricingRuleUpdateRequest,
): Promise<PricingRule> => {
  const response = await api.patch<PricingRule>(
    `/pricing-rules/${ruleId}`,
    data,
  );

  return response.data;
};

export const activatePricingRule = async (
  ruleId: number,
): Promise<PricingRule> => {
  const response = await api.patch<PricingRule>(
    `/pricing-rules/${ruleId}/activate`,
  );

  return response.data;
};

export const deactivatePricingRule = async (
  ruleId: number,
): Promise<PricingRule> => {
  const response = await api.patch<PricingRule>(
    `/pricing-rules/${ruleId}/deactivate`,
  );

  return response.data;
};