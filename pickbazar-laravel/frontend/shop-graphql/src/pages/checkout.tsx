import Layout from "@components/layout/layout";
import { useCustomerQuery } from "@graphql/auth.graphql";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { billingAddressAtom, shippingAddressAtom } from "@jotai/checkout";
import Spinner from "@components/ui/loaders/spinner/spinner";
import dynamic from "next/dynamic";
import { addApolloState, initializeApollo } from "@utils/apollo";
import { SettingsDocument } from "@graphql/settings.graphql";
import { useUI } from "@contexts/ui.context";
import { useEffect } from "react";
const LoginForm = dynamic(() => import("@components/auth/login"));
const ScheduleGrid = dynamic(
  () => import("@components/checkout/schedule/schedule-grid")
);
const AddressGrid = dynamic(() => import("@components/checkout/address-grid"));
const ContactGrid = dynamic(
  () => import("@components/checkout/contact/contact-grid")
);
const RightSideView = dynamic(
  () => import("@components/checkout/right-side-view")
);

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const apolloClient = initializeApollo();
  await apolloClient.query({
    query: SettingsDocument,
  });
  return addApolloState(apolloClient, {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  });
};

export default function CheckoutPage() {
  const { data, loading, refetch } = useCustomerQuery({ onError: () => {} });
  const { t } = useTranslation();
  const { isAuthorize } = useUI();
  useEffect(() => {
    if (isAuthorize) {
      refetch();
    }
  }, [isAuthorize]);
  //TODO: set types as constant
  if (loading) return <Spinner showText={false} />;
  if (!loading && !isAuthorize) {
    return (
      <div className="flex w-full justify-center md:py-8">
        <LoginForm />
      </div>
    );
  }
  return (
    <div className="py-8 px-4 lg:py-10 lg:px-8 xl:py-14 xl:px-16 2xl:px-20">
      <div className="flex flex-col lg:flex-row items-center lg:items-start m-auto lg:space-s-8 w-full max-w-5xl">
        <div className="lg:max-w-2xl w-full space-y-6">
          <ContactGrid
            className="shadow-700 bg-light p-5 md:p-8"
            //@ts-ignore
            contact={data?.me?.profile?.contact}
            label={t("text-contact-number")}
            count={1}
          />

          <AddressGrid
            userId={data?.me?.id!}
            className="shadow-700 bg-light p-5 md:p-8"
            label={t("text-billing-address")}
            count={2}
            //@ts-ignore
            addresses={data?.me?.address?.filter(
              (address) => address?.type === "BILLING"
            )}
            atom={billingAddressAtom}
            type="BILLING"
          />
          <AddressGrid
            userId={data?.me?.id!}
            className="shadow-700 bg-light p-5 md:p-8"
            label={t("text-shipping-address")}
            count={3}
            //@ts-ignore
            addresses={data?.me?.address?.filter(
              (address) => address?.type === "SHIPPING"
            )}
            atom={shippingAddressAtom}
            type="SHIPPING"
          />
          <ScheduleGrid
            className="shadow-700 bg-light p-5 md:p-8"
            label={t("text-delivery-schedule")}
            count={4}
          />
        </div>
        <div className="w-full lg:w-96 mb-10 sm:mb-12 lg:mb-0 mt-10">
          <RightSideView />
        </div>
      </div>
    </div>
  );
}
CheckoutPage.Layout = Layout;
