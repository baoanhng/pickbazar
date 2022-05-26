import { Type } from "@ts-types/custom.types";
import { CoreApi } from "@utils/api/core.api";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { useQuery } from "react-query";

const TypeService = new CoreApi(API_ENDPOINTS.TYPE);
export const fetchType = async (slug: string) => {
  const { data } = await TypeService.findOne(slug);
  return { type: data as Type };
};
export const useTypeQuery = (slug: string) => {
  return useQuery<{ type: Type }, Error>([API_ENDPOINTS.TYPE, slug], () =>
    fetchType(slug)
  );
};
