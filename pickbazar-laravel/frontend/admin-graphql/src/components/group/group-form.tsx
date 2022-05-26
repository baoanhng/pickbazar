import { useState } from "react";
import Input from "@components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import Button from "@components/ui/button";
import {
  useCreateTypeMutation,
  useUpdateTypeMutation,
  Type,
} from "@graphql/type.graphql";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import { useRouter } from "next/router";
import { getErrorMessage } from "@utils/form-error";
import { getIcon } from "@utils/get-icon";
import Label from "@components/ui/label";

import * as typeIcons from "@components/icons/type";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";

import SelectInput from "@components/ui/select-input";
import { yupResolver } from "@hookform/resolvers/yup";
import { groupValidationSchema } from "./group-validation-schema";
import { ROUTES } from "@utils/routes";
import { AttachmentInput } from "@graphql/products.graphql";
import FileInput from "@components/ui/file-input";
import Title from "@components/ui/title";
import TextArea from "@components/ui/text-area";
import { Error } from "@components/ui/error-message";
import Alert from "@components/ui/alert";
const typeIcon = [
  {
    value: "FruitsVegetable",
    label: "Fruits and Vegetable",
  },
  {
    value: "FacialCare",
    label: "Facial Care",
  },
  {
    value: "Handbag",
    label: "Hand Bag",
  },
  {
    value: "DressIcon",
    label: "Dress Icon",
  },
  {
    value: "FurnitureIcon",
    label: "Furniture Icon",
  },
  {
    value: "BookIcon",
    label: "Book Icon",
  },
  {
    value: "MedicineIcon",
    label: "Medicine Icon",
  },
  {
    value: "Restaurant",
    label: "Restaurant",
  },
  {
    value: "Bakery",
    label: "Bakery",
  },
];

export const updatedIcons = typeIcon.map((item: any) => {
  item.label = (
    <div className="flex space-s-5 items-center">
      <span className="flex w-5 h-5 items-center justify-center">
        {getIcon({
          iconList: typeIcons,
          iconName: item.value,
          className: "max-h-full max-w-full",
        })}
      </span>
      <span>{item.label}</span>
    </div>
  );
  return item;
});

type BannerInput = {
  title: string;
  description: string;
  image: AttachmentInput;
};

type FormValues = {
  name?: string | null;
  icon?: any;
  gallery: AttachmentInput[];
  banners: BannerInput[];
};

type IProps = {
  initialValues?: Type | null;
};
export default function CreateOrUpdateGroupForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,

    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(groupValidationSchema),
    // @ts-ignore
    defaultValues: {
      ...initialValues,
      // name: initialValues?.name ?? "",
      icon: initialValues?.icon
        ? typeIcon.find(
            (singleIcon) => singleIcon.value === initialValues?.icon!
          )
        : "",
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "banners",
  });
  const [createType, { loading: creating }] = useCreateTypeMutation();
  const [updateType, { loading: updating }] = useUpdateTypeMutation();
  const onSubmit = async (values: FormValues) => {
    try {
      const input = {
        name: values.name!,
        icon: values.icon?.value,
        // gallery: values.gallery?.map(({ thumbnail, original, id }: any) => ({
        //   thumbnail,
        //   original,
        //   id,
        // })),
        banners: values?.banners?.map(({ title, description, image }) => ({
          title,
          description,
          image: {
            id: image?.id,
            thumbnail: image?.thumbnail,
            original: image?.original,
          },
        })),
      };
      if (!initialValues) {
        await createType({
          variables: {
            input,
          },
        });
        router.push(ROUTES.GROUPS);
      } else {
        const { data } = await updateType({
          variables: {
            id: initialValues.id!,
            input,
          },
        });

        if (data) {
          toast.success(t("common:successfully-updated"));
        }
      }
    } catch (error) {
      getErrorMessage(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
        <Description
          title={t("form:item-description")}
          details={`${
            initialValues
              ? t("form:item-description-update")
              : t("form:item-description-add")
          } ${t("form:group-description-help-text")}`}
          className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t("form:input-label-name")}
            {...register("name")}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          />

          <div className="mb-5">
            <Label>{t("form:input-label-select-icon")}</Label>
            <SelectInput
              name="icon"
              control={control}
              options={updatedIcons}
              isClearable={true}
            />
          </div>
        </Card>
      </div>
      {/* <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
        <Description
          title={t("form:promotional-slider")}
          details={t("form:promotional-slider-help-text")}
          className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="gallery" control={control} />
        </Card>
      </div> */}

      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title={t("common:text-banner")}
          details={t("form:banner-slider-help-text")}
          className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div>
            {fields.map((item: any & { id: string }, index: number) => (
              <div
                className="border-b border-dashed border-border-200 last:border-0 py-5 md:py-8 first:pt-0"
                key={item.id}
              >
                <div className="flex items-center justify-between mb-5">
                  <Title className="mb-0">
                    {t("common:text-banner")} {index + 1}
                  </Title>
                  <button
                    onClick={() => {
                      remove(index);
                    }}
                    type="button"
                    className="text-sm text-red-500 hover:text-red-700 transition-colors duration-200 focus:outline-none"
                  >
                    {t("form:button-label-remove")}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <Input
                    label={t("form:input-title")}
                    variant="outline"
                    {...register(`banners.${index}.title` as const)}
                    defaultValue={item?.title!} // make sure to set up defaultValue
                    error={t(errors.banners?.[index]?.title?.message)}
                  />

                  <TextArea
                    label={t("form:input-description")}
                    variant="outline"
                    {...register(`banners.${index}.description` as const)}
                    defaultValue={item.description!}
                    // make sure to set up defaultValue
                  />
                </div>

                <div className="w-full mt-5">
                  <Title>{t("form:input-gallery")}</Title>
                  <FileInput
                    {...register(`banners.${index}.image` as const)}
                    control={control}
                    multiple={false}
                  />
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            onClick={() => append({ title: "", description: "", image: {} })}
            className="w-full sm:w-auto"
          >
            {t("form:button-label-add-banner")}
          </Button>

          {errors?.banners?.message ? (
            <Alert
              message={t(errors?.banners?.message)}
              variant="error"
              className="mt-5"
            />
          ) : null}
        </Card>
      </div>

      <div className="mb-4 text-end">
        {initialValues && (
          <Button
            variant="outline"
            onClick={router.back}
            className="me-4"
            type="button"
          >
            {t("form:button-label-back")}
          </Button>
        )}

        <Button loading={creating || updating}>
          {initialValues
            ? t("form:button-label-update-group")
            : t("form:button-label-add-group")}
        </Button>
      </div>
    </form>
  );
}
