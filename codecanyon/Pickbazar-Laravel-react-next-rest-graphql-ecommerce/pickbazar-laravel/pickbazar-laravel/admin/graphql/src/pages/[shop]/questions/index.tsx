import QuestionList from "@components/question/question-list";
import Card from "@components/common/card";
import Layout from "@components/layouts/shop";
import { useState } from "react";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { adminAndOwnerOnly } from "@utils/auth-utils";
import { useRouter } from "next/router";
import { SortOrder } from "__generated__/__types__";
import { useShopQuery } from "@graphql/shops.graphql";
import { useQuestionsQuery } from "@graphql/questions.graphql";

export default function Questions() {
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState("created_at");
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const {
    query: { shop },
  } = useRouter();
  const { data: shopData } = useShopQuery({
    variables: { slug: shop as string },
  });
  const shopId = shopData?.shop?.id!;
  const { data, loading, error } = useQuestionsQuery({
    variables: {
      first: 15,
      shop_id: shopId,
      page,
    },
  });

  if (loading) return <Loader text={t("common:text-loading")} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handlePagination(current: any) {
    setPage(current);
  }
  return (
    <>
      <Card className="flex flex-col mb-8">
        <div className="flex flex-col items-center w-full md:flex-row">
          <h1 className="text-xl font-semibold text-heading">
            {t("common:sidebar-nav-item-questions")}
          </h1>
        </div>
      </Card>
      <QuestionList
        questions={data?.questions}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

Questions.authenticate = {
  permissions: adminAndOwnerOnly,
};
Questions.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "common", "form"])),
  },
});
