import ReviewList from "@components/reviews/review-list";
import Card from "@components/common/card";
import Layout from "@components/layouts/shop";
import { useState } from "react";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { SortOrder } from "@ts-types/generated";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useReviewsQuery } from "@data/review/use-reviews.query";
import { adminAndOwnerOnly } from "@utils/auth-utils";
import { useShopQuery } from "@data/shop/use-shop.query";
import { useRouter } from "next/router";

export default function Reviews() {
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState("created_at");
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const {
    query: { shop },
  } = useRouter();
  const { data: shopData } = useShopQuery(shop as string);
  const shopId = shopData?.shop?.id!;
  const {
    data,
    isLoading: loading,
    error,
  } = useReviewsQuery({
    limit: 15,
    shop_id: Number(shopId)!,
    page,
    orderBy,
    sortedBy,
  });

  if (loading) return <Loader text={t("common:text-loading")} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handlePagination(current: any) {
    setPage(current);
  }
  return (
    <>
      <Card className="flex flex-col mb-8">
        <div className="w-full flex flex-col md:flex-row items-center">
          <h1 className="text-xl font-semibold text-heading">
            {t("form:input-label-reviews")}
          </h1>
        </div>
      </Card>
      <ReviewList
        reviews={data?.reviews}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}
Reviews.authenticate = {
  permissions: adminAndOwnerOnly,
};
Reviews.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "common", "form"])),
  },
});
