import ConfirmationCard from "@components/common/confirmation-card";
import {
  useModalAction,
  useModalState,
} from "@components/ui/modal/modal.context";
import { useDeleteReviewMutation } from "@data/review/use-review-delete.mutation";
import { useRouter } from "next/router";

const AcceptAbuseReportView = () => {
  const router = useRouter();
  const { mutate: deleteReview, isLoading: loading } =
    useDeleteReviewMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();
  function handleDelete() {
    deleteReview(data);
    closeModal();
    router.push(`/reviews`);
  }
  return (
    <ConfirmationCard
      title="text-accept"
      description="text-accept-report-modal-description"
      onCancel={closeModal}
      deleteBtnText="text-accept"
      onDelete={handleDelete}
      deleteBtnLoading={loading}
    />
  );
};

export default AcceptAbuseReportView;
