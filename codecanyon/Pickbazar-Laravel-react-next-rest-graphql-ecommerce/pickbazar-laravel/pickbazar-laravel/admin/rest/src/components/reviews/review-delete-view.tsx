import ConfirmationCard from "@components/common/confirmation-card";
import {
	useModalAction,
	useModalState,
} from "@components/ui/modal/modal.context";
import { useDeleteReviewMutation } from "@data/review/use-review-delete.mutation";

const ReviewDeleteView = () => {
	const { mutate: deleteCategory, isLoading: loading } =
		useDeleteReviewMutation();

	const { data } = useModalState();
	const { closeModal } = useModalAction();
	function handleDelete() {
		deleteCategory(data);
		closeModal();
	}
	return (
		<ConfirmationCard
			onCancel={closeModal}
			onDelete={handleDelete}
			deleteBtnLoading={loading}
		/>
	);
};

export default ReviewDeleteView;
