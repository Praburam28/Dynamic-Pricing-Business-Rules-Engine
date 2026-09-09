import api from "../api/axios";
import type {
  Category,
  CategoryListResponse,
} from "../types/category";

export interface CategoryCreateRequest {
  name: string;
  description?: string | null;
}

export interface CategoryUpdateRequest {
  name?: string;
  description?: string | null;
}

export const getCategories = async (
  skip = 0,
  limit = 10,
  search = "",
): Promise<CategoryListResponse> => {
  const response = await api.get<CategoryListResponse>("/categories", {
    params: {
      skip,
      limit,
      search: search || undefined,
    },
  });

  return response.data;
};

export const getCategory = async (
  categoryId: number,
): Promise<Category> => {
  const response = await api.get<Category>(
    `/categories/${categoryId}`,
  );

  return response.data;
};

export const createCategory = async (
  data: CategoryCreateRequest,
): Promise<Category> => {
  const response = await api.post<Category>("/categories", data);

  return response.data;
};

export const updateCategory = async (
  categoryId: number,
  data: CategoryUpdateRequest,
): Promise<Category> => {
  const response = await api.patch<Category>(
    `/categories/${categoryId}`,
    data,
  );

  return response.data;
};

export const activateCategory = async (
  categoryId: number,
): Promise<void> => {
  await api.patch(`/categories/${categoryId}/activate`);
};

export const deactivateCategory = async (
  categoryId: number,
): Promise<void> => {
  await api.patch(`/categories/${categoryId}/deactivate`);
};
