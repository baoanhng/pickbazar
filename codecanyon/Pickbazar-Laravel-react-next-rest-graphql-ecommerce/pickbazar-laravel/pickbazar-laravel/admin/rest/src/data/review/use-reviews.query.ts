import {
  QueryParamsType,
  ReviewsQueryOptionsType,
} from "@ts-types/custom.types";
import { mapPaginatorData, stringifySearchQuery } from "@utils/data-mappers";
import { useQuery } from "react-query";
import Review from "@repositories/review";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { ReviewPaginator } from "@ts-types/generated";

const fetchReviews = async ({
  queryKey,
}: QueryParamsType): Promise<{ reviews: ReviewPaginator }> => {
  const [_key, params] = queryKey;

  const {
    page,
    text,
    type,
    limit = 15,
    orderBy = "created_at",
    sortedBy = "desc",
    shop_id,
    product_id,
  } = params as ReviewsQueryOptionsType;

  const searchString = stringifySearchQuery({
    name: text,
    type,
    shop_id,
    product_id,
  });
  // @ts-ignore
  const queryParams = new URLSearchParams({
    searchJoin: "and",
    orderBy,
    with: "product;user",
    sortedBy,
    limit: limit.toString(),
    ...(page && { page: page.toString() }),
    ...(Boolean(searchString) && { search: searchString }),
  });
  const url = `${API_ENDPOINTS.REVIEWS}?${queryParams.toString()}`;
  const {
    data: { data, ...rest },
  } = await Review.all(url);
  return {
    reviews: {
      data,
      paginatorInfo: mapPaginatorData({ ...rest }),
    },
  };
};

const useReviewsQuery = (options: ReviewsQueryOptionsType) => {
  return useQuery<{ reviews: ReviewPaginator }, Error>(
    [API_ENDPOINTS.REVIEWS, options],
    fetchReviews,
    {
      keepPreviousData: true,
    }
  );
};

export { useReviewsQuery, fetchReviews };
