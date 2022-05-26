import Layout from "@components/layout/layout";
import { useEffect } from "react";
import { useUI } from "@contexts/ui.context";
import { useCustomerQuery } from "@data/customer/use-customer.query";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Spinner from "@components/ui/loaders/spinner/spinner";
import LoginForm from "@components/auth/login";
import ContactGrid from "@components/checkout/contact/contact-grid";
import { billingAddressAtom, shippingAddressAtom } from "@jotai/checkout";
import ScheduleGrid from "@components/checkout/schedule/schedule-grid";
import RightSideView from "@components/checkout/right-side-view";
import { useTranslation } from "next-i18next";
import AddressGrid from "@components/checkout/address-grid";

export default function CheckoutPage() {
  const { data, isLoading: loading, refetch } = useCustomerQuery();
  const { isAuthorize } = useUI();
  const { t } = useTranslation();

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
              (address: any) => address?.type === "billing"
            )}
            atom={billingAddressAtom}
            type="billing"
          />
          <AddressGrid
            userId={data?.me?.id!}
            className="shadow-700 bg-light p-5 md:p-8"
            label={t("text-shipping-address")}
            count={3}
            //@ts-ignore
            addresses={data?.me?.address?.filter(
              (address: any) => address?.type === "shipping"
            )}
            atom={shippingAddressAtom}
            type="shipping"
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

export const getStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};
