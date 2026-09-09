import api from "../api/axios";
import type {
  RuleTestRequest,
  RuleTestResponse,
} from "../types/ruleTesting";

export const testPricingRule = async (
  data: RuleTestRequest,
): Promise<RuleTestResponse> => {
  const response = await api.post<RuleTestResponse>(
    "/rule-testing",
    data,
  );

  return response.data;
};