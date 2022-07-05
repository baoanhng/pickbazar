import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { QueryOptionsType, QueryParamsType } from "@ts-types/custom.types";
import http from "@utils/api/http";

const fetchExportOrder = async ({ queryKey }: QueryParamsType) => {
  const [_key, params] = queryKey;
  const { shop_id } = params as QueryOptionsType;

  const url = shop_id
    ? `${API_ENDPOINTS.EXPORT_ORDER}/${shop_id}`
    : API_ENDPOINTS.EXPORT_ORDER;

  const { data } = await http.get(url);

  return data;
};

const useExportOrder = (params: { shop_id?: string }, options: any = {}) => {
  return useQuery<string, Error>(
    [API_ENDPOINTS.EXPORT_ORDER, params],
    fetchExportOrder,
    {
      ...options,
    }
  );
};

export { useExportOrder };
