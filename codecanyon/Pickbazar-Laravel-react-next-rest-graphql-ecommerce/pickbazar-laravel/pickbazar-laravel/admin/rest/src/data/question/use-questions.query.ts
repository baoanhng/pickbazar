import {
  QueryParamsType,
  QuestionsQueryOptionsType,
} from "@ts-types/custom.types";
import { mapPaginatorData, stringifySearchQuery } from "@utils/data-mappers";
import { useQuery } from "react-query";
import Question from "@repositories/question";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { QuestionPaginator } from "@ts-types/generated";

const fetchQuestions = async ({
  queryKey,
}: QueryParamsType): Promise<{ questions: QuestionPaginator }> => {
  const [_key, params] = queryKey;

  const {
    page,
    text,
    limit = 15,
    orderBy = "created_at",
    sortedBy = "desc",
    shop_id,
    product_id,
    answer,
  } = params as QuestionsQueryOptionsType;

  const searchString = stringifySearchQuery({
    question: text,
    shop_id,
    product_id,
  });
  // @ts-ignore
  const queryParams = new URLSearchParams({
    searchJoin: "and",
    orderBy,
    answer,
    with: "product;user",
    sortedBy,
    limit: limit.toString(),
    ...(page && { page: page.toString() }),
    ...(Boolean(searchString) && { search: searchString }),
  });
  const url = `${API_ENDPOINTS.QUESTIONS}?${queryParams.toString()}`;
  const {
    data: { data, ...rest },
  } = await Question.all(url);
  return {
    questions: {
      data,
      paginatorInfo: mapPaginatorData({ ...rest }),
    },
  };
};

const useQuestionsQuery = (options: QuestionsQueryOptionsType) => {
  return useQuery<{ questions: QuestionPaginator }, Error>(
    [API_ENDPOINTS.QUESTIONS, options],
    fetchQuestions,
    {
      keepPreviousData: true,
    }
  );
};

export { useQuestionsQuery, fetchQuestions };
