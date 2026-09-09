import api from "../api/axios";
import type {
  Customer,
  CustomerCreateRequest,
  CustomerListResponse,
  CustomerUpdateRequest,
} from "../types/customer";

export const getCustomers = async (
  skip = 0,
  limit = 10,
  search?: string,
  customerType?: string,
  location?: string,
  isActive?: boolean,
): Promise<CustomerListResponse> => {
  const response = await api.get<CustomerListResponse>(
    "/customers",
    {
      params: {
        skip,
        limit,
        search: search || undefined,
        customer_type: customerType || undefined,
        location: location || undefined,
        is_active: isActive,
      },
    },
  );

  return response.data;
};

export const getCustomer = async (
  customerId: number,
): Promise<Customer> => {
  const response = await api.get<Customer>(
    `/customers/${customerId}`,
  );

  return response.data;
};

export const createCustomer = async (
  data: CustomerCreateRequest,
): Promise<Customer> => {
  const response = await api.post<Customer>(
    "/customers",
    data,
  );

  return response.data;
};

export const updateCustomer = async (
  customerId: number,
  data: CustomerUpdateRequest,
): Promise<Customer> => {
  const response = await api.patch<Customer>(
    `/customers/${customerId}`,
    data,
  );

  return response.data;
};

export const activateCustomer = async (
  customerId: number,
): Promise<Customer> => {
  const response = await api.patch<Customer>(
    `/customers/${customerId}/activate`,
  );

  return response.data;
};

export const deactivateCustomer = async (
  customerId: number,
): Promise<Customer> => {
  const response = await api.patch<Customer>(
    `/customers/${customerId}/deactivate`,
  );

  return response.data;
};