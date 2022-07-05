import Review from "@repositories/review";
import { useQuery } from "react-query";
// import { Review as TReview } from "@ts-types/generated";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const fetchReview = async (id: string) => {
  const { data } = await Review.find(
    `${API_ENDPOINTS.REVIEWS}/${id}?with=abusive_reports.user;product;user`
  );
  return data;
};

export const useReviewQuery = (id: string) => {
  return useQuery<any, Error>([API_ENDPOINTS.REVIEWS, id], () =>
    fetchReview(id)
  );
};
