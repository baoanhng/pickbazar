import Input from "@components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import Button from "@components/ui/button";
import {
  useUpdateSettingsMutation,
  SettingsOptions,
  Shipping,
  Tax,
} from "@graphql/settings.graphql";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import Label from "@components/ui/label";
import { getErrorMessage } from "@utils/form-error";
import { CURRENCY } from "./currency";
import { siteSettings } from "@settings/site.settings";
import ValidationError from "@components/ui/form-validation-error";
import { toast } from "react-toastify";
import { useSettings } from "@contexts/settings.context";
import { useTranslation } from "next-i18next";
import FileInput from "@components/ui/file-input";
import SelectInput from "@components/ui/select-input";
import { yupResolver } from "@hookform/resolvers/yup";
import { settingsValidationSchema } from "./settings-validation-schema";
import TextArea from "@components/ui/text-area";
import { getFormattedImage } from "@utils/get-formatted-image";
import Alert from "@components/ui/alert";

type FormValues = {
  siteTitle: string;
  siteSubtitle: string;
  currency: any;
  minimumOrderAmount: number;
  logo: any;
  taxClass: Tax;
  deliveryTime: {
    title: string;
    description: string;
  };
  shippingClass: Shipping;
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: any;
    twitterHandle: string;
    twitterCardType: string;
    metaTags: string;
    canonicalUrl: string;
  };
  google: {
    isEnable: boolean;
    tagManagerId: string;
  };
  facebook: {
    isEnable: boolean;
    appId: string;
    pageId: string;
  };
};

type IProps = {
  settings: SettingsOptions | undefined | null;
  taxClasses: Tax[] | undefined | null;
  shippingClasses: Shipping[] | undefined | null;
};

export default function SettingsForm({
  settings,
  taxClasses,
  shippingClasses,
}: IProps) {
  const { t } = useTranslation();
  const [updateSettingsMutation, { loading }] = useUpdateSettingsMutation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    shouldUnregister: true,
    resolver: yupResolver(settingsValidationSchema),
    defaultValues: {
      ...settings,
      deliveryTime: settings?.deliveryTime ? settings?.deliveryTime : [],
      logo: settings?.logo ?? "",
      currency: settings?.currency
        ? CURRENCY.find((item) => item.code == settings?.currency)
        : "",
      // @ts-ignore
      taxClass: !!taxClasses?.length
        ? taxClasses?.find((tax: Tax) => tax.id == settings?.taxClass)
        : "",
      // @ts-ignore
      shippingClass: !!shippingClasses?.length
        ? shippingClasses?.find(
            (shipping: Shipping) => shipping.id == settings?.shippingClass
          )
        : "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "deliveryTime",
  });

  const { updateSettings } = useSettings();

  async function onSubmit(values: FormValues) {
    try {
      const { data } = await updateSettingsMutation({
        variables: {
          input: {
            // @ts-ignore
            options: {
              ...values,
              minimumOrderAmount: Number(values.minimumOrderAmount),
              currency: values.currency?.code,
              taxClass: values?.taxClass?.id,
              shippingClass: values?.shippingClass?.id,
              logo: getFormattedImage(values?.logo),
              seo: {
                ...values?.seo,
                ogImage: getFormattedImage(values?.seo?.ogImage),
              },
            },
          },
        },
      });

      if (data) {
        updateSettings(data?.updateSettings?.options);
        toast.success(t("common:successfully-updated"));
      }
    } catch (error) {
      getErrorMessage(error);
    }
  }

  const logoInformation = (
    <span>
      {t("form:logo-help-text")} <br />
      {t("form:logo-dimension-help-text")} &nbsp;
      <span className="font-bold">
        {siteSettings.logo.width}x{siteSettings.logo.height} {t("common:pixel")}
      </span>
    </span>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
        <Description
          title={t("form:input-label-logo")}
          details={logoInformation}
          className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="logo" control={control} multiple={false} />
        </Card>
      </div>

      <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
        <Description
          title={t("form:form-title-information")}
          details={t("form:site-info-help-text")}
          className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t("form:input-label-site-title")}
            {...register("siteTitle")}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t("form:input-label-site-subtitle")}
            {...register("siteSubtitle")}
            variant="outline"
            className="mb-5"
          />

          <div className="mb-5">
            <Label>{t("form:input-label-currency")}</Label>
            <SelectInput
              name="currency"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.code}
              options={CURRENCY}
            />
            <ValidationError message={t(errors.currency?.message!)} />
          </div>

          <Input
            label={`${t("form:input-label-min-order-amount")}`}
            {...register("minimumOrderAmount")}
            type="number"
            error={t(errors.minimumOrderAmount?.message!)}
            variant="outline"
            className="mb-5"
          />

          <div className="mb-5">
            <Label>{t("form:input-label-tax-class")}</Label>
            <SelectInput
              name="taxClass"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={taxClasses!}
            />
          </div>

          <div>
            <Label>{t("form:input-label-shipping-class")}</Label>
            <SelectInput
              name="shippingClass"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={shippingClasses!}
            />
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
        <Description
          title="SEO"
          details={t("form:tax-form-seo-info-help-text")}
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t("form:input-label-meta-title")}
            {...register("seo.metaTitle")}
            variant="outline"
            className="mb-5"
          />
          <TextArea
            label={t("form:input-label-meta-description")}
            {...register("seo.metaDescription")}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t("form:input-label-meta-tags")}
            {...register("seo.metaTags")}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t("form:input-label-canonical-url")}
            {...register("seo.canonicalUrl")}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t("form:input-label-og-title")}
            {...register("seo.ogTitle")}
            variant="outline"
            className="mb-5"
          />
          <TextArea
            label={t("form:input-label-og-description")}
            {...register("seo.ogDescription")}
            variant="outline"
            className="mb-5"
          />
          <div className="mb-5">
            <Label>{t("form:input-label-og-image")}</Label>
            <FileInput name="seo.ogImage" control={control} multiple={false} />
          </div>
          <Input
            label={t("form:input-label-twitter-handle")}
            {...register("seo.twitterHandle")}
            variant="outline"
            className="mb-5"
            placeholder="your twitter username (exp: @username)"
          />
          <Input
            label={t("form:input-label-twitter-card-type")}
            {...register("seo.twitterCardType")}
            variant="outline"
            className="mb-5"
            placeholder="one of summary, summary_large_image, app, or player"
          />
        </Card>
      </div>

      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title={t("form:text-delivery-schedule")}
          details={t("form:delivery-schedule-help-text")}
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div>
            {fields.map((item: any & { id: string }, index: number) => (
              <div
                className="border-b border-dashed border-border-200 last:border-0 py-5 md:py-8 first:pt-0"
                key={item.id}
              >
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-5">
                  <div className="grid grid-cols-1 gap-5 sm:col-span-4">
                    <Input
                      label={t("form:input-delivery-time-title")}
                      variant="outline"
                      {...register(`deliveryTime.${index}.title` as const)}
                      defaultValue={item?.title!} // make sure to set up defaultValue
                      error={t(errors.deliveryTime?.[index]?.title?.message)}
                    />
                    <TextArea
                      label={t("form:input-delivery-time-description")}
                      variant="outline"
                      {...register(
                        `deliveryTime.${index}.description` as const
                      )}
                      defaultValue={item.description!} // make sure to set up defaultValue
                    />
                  </div>
                  <button
                    onClick={() => {
                      remove(index);
                    }}
                    type="button"
                    className="text-sm text-red-500 hover:text-red-700 transition-colors duration-200 focus:outline-none sm:mt-4 sm:col-span-1"
                  >
                    {t("form:button-label-remove")}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Button
            type="button"
            onClick={() => append({ title: "", description: "" })}
            className="w-full sm:w-auto"
          >
            {t("form:button-label-add-delivery-time")}
          </Button>

          {errors?.deliveryTime?.message ? (
            <Alert
              message={t(errors?.deliveryTime?.message)}
              variant="error"
              className="mt-5"
            />
          ) : null}
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button loading={loading} disabled={loading}>
          {t("form:button-label-save-settings")}
        </Button>
      </div>
    </form>
  );
}
