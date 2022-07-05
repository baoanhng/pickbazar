import { useMutation, useQueryClient } from "react-query";
import Review from "@repositories/review";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const useDeleteReviewMutation = () => {
	const queryClient = useQueryClient();

	return useMutation(
		(id: string) => Review.delete(`${API_ENDPOINTS.REVIEWS}/${id}`),
		{
			// Always refetch after error or success:
			onSettled: () => {
				queryClient.invalidateQueries(API_ENDPOINTS.REVIEWS);
			},
		}
	);
};
