import api from "../api/axios";

import type {
  Promotion,
  PromotionCreateRequest,
  PromotionListResponse,
  PromotionUpdateRequest,
} from "../types/promotion";

export const getPromotions = async (
  skip = 0,
  limit = 10,
  search?: string,
  isActive?: boolean,
): Promise<PromotionListResponse> => {
  const response = await api.get<PromotionListResponse>(
    "/promotions",
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

export const getPromotion = async (
  promotionId: number,
): Promise<Promotion> => {
  const response = await api.get<Promotion>(
    `/promotions/${promotionId}`,
  );

  return response.data;
};

export const createPromotion = async (
  data: PromotionCreateRequest,
): Promise<Promotion> => {
  const response = await api.post<Promotion>(
    "/promotions",
    data,
  );

  return response.data;
};

export const updatePromotion = async (
  promotionId: number,
  data: PromotionUpdateRequest,
): Promise<Promotion> => {
  const response = await api.patch<Promotion>(
    `/promotions/${promotionId}`,
    data,
  );

  return response.data;
};

export const activatePromotion = async (
  promotionId: number,
): Promise<Promotion> => {
  const response = await api.patch<Promotion>(
    `/promotions/${promotionId}/activate`,
  );

  return response.data;
};

export const deactivatePromotion = async (
  promotionId: number,
): Promise<Promotion> => {
  const response = await api.patch<Promotion>(
    `/promotions/${promotionId}/deactivate`,
  );

  return response.data;
};

export interface PromotionValidationResponse {
  valid: boolean;
  code: string;
  discount_amount: number;
  message: string;
}

export const validatePromotion = async (
  code: string,
  purchaseAmount: number,
): Promise<PromotionValidationResponse> => {
  const response =
    await api.post<PromotionValidationResponse>(
      `/promotions/validate/${encodeURIComponent(code)}`,
      null,
      {
        params: {
          purchase_amount: purchaseAmount,
        },
      },
    );

  return response.data;
};