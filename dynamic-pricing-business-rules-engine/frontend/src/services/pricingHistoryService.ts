import api from "../api/axios";
import type {
  PricingHistory,
  PricingHistoryListResponse,
} from "../types/pricingHistory";

export const getPricingHistory = async (
  skip = 0,
  limit = 10,
  productId?: number,
  customerId?: number,
): Promise<PricingHistoryListResponse> => {
  const response = await api.get<PricingHistoryListResponse>(
    "/pricing-history",
    {
      params: {
        skip,
        limit,
        product_id: productId,
        customer_id: customerId,
      },
    },
  );

  return response.data;
};

export const getPricingHistoryById = async (
  calculationId: number,
): Promise<PricingHistory> => {
  const response = await api.get<PricingHistory>(
    `/pricing-history/${calculationId}`,
  );

  return response.data;
};