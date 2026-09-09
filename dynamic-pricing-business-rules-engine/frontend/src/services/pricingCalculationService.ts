import api from "../api/axios";

import type {
  PricingCalculationRequest,
  PricingCalculationResponse,
} from "../types/pricingCalculation";

export const calculatePricing = async (
  data: PricingCalculationRequest,
): Promise<PricingCalculationResponse> => {
  const response =
    await api.post<PricingCalculationResponse>(
      "/pricing/calculate",
      data,
    );

  return response.data;
};