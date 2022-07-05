import { useMutation, useQueryClient } from "react-query";
import Review from "@repositories/review";
import { API_ENDPOINTS } from "@utils/api/endpoints";

interface InputType {
  model_id: number;
  model_type: string;
}

export const useDeclineReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (variables: InputType) =>
      Review.decline(API_ENDPOINTS.ABUSIVE_REPORTS_DECLINE, variables),
    {
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.REVIEWS);
      },
    }
  );
};
