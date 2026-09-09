import api from "../api/axios";
import type {
  Product,
  ProductCreateRequest,
  ProductListResponse,
  ProductUpdateRequest,
} from "../types/product";

export const getProducts = async (
  skip = 0,
  limit = 10,
  search = "",
  categoryId?: number,
  isActive?: boolean,
  sortBy = "id",
  sortOrder = "asc",
): Promise<ProductListResponse> => {
  const response = await api.get<ProductListResponse>(
    "/products",
    {
      params: {
        skip,
        limit,
        search: search || undefined,
        category_id: categoryId || undefined,
        is_active: isActive,
        sort_by: sortBy,
        sort_order: sortOrder,
      },
    },
  );

  return response.data;
};

export const getProduct = async (
  productId: number,
): Promise<Product> => {
  const response = await api.get<Product>(
    `/products/${productId}`,
  );

  return response.data;
};

export const createProduct = async (
  data: ProductCreateRequest,
): Promise<Product> => {
  const response = await api.post<Product>(
    "/products",
    data,
  );

  return response.data;
};

export const updateProduct = async (
  productId: number,
  data: ProductUpdateRequest,
): Promise<Product> => {
  const response = await api.patch<Product>(
    `/products/${productId}`,
    data,
  );

  return response.data;
};

export const activateProduct = async (
  productId: number,
): Promise<void> => {
  await api.patch(`/products/${productId}/activate`);
};

export const deactivateProduct = async (
  productId: number,
): Promise<void> => {
  await api.patch(`/products/${productId}/deactivate`);
};
