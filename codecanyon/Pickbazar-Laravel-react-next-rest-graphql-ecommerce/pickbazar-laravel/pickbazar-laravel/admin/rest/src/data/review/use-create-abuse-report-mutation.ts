import { QueryClient, useMutation, useQueryClient } from "react-query";
import Review, { CreateAbuseReportInput } from "@repositories/review";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { useTranslation } from "next-i18next";
import { useModalAction } from "@components/ui/modal/modal.context";
import { toast } from "react-toastify";

export function useCreateAbuseReport() {
  const { t } = useTranslation("common");
  const { closeModal } = useModalAction();
  const queryClient = useQueryClient();
  const { mutate: createAbuseReport, isLoading } = useMutation(
    (input: CreateAbuseReportInput) =>
      Review.reportAbuse(API_ENDPOINTS.ABUSIVE_REPORTS, input),
    {
      onSuccess: () => {
        queryClient.refetchQueries(API_ENDPOINTS.REVIEWS);
        toast.success(t("text-abuse-report-submitted"));
      },
      onSettled: () => {
        closeModal();
      },
    }
  );
  return {
    createAbuseReport,
    isLoading,
  };
}
