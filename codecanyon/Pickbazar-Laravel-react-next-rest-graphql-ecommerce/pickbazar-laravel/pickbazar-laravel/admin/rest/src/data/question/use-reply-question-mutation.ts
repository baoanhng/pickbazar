import { ReplyQuestion } from "@ts-types/generated";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import Question from "@repositories/question";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { useTranslation } from "next-i18next";
export interface IQuestionUpdateVariables {
  variables: {
    id: string;
    input: ReplyQuestion;
  };
}

export const useReplyQuestionMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(
    ({ variables: { id, input } }: IQuestionUpdateVariables) =>
      Question.update(`${API_ENDPOINTS.QUESTIONS}/${id}`, input),
    {
      onSuccess: () => {
        toast.success(t("common:successfully-updated"));
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.QUESTIONS);
      },
    }
  );
};
