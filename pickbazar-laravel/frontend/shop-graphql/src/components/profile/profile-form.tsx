import { useState } from "react";
import Button from "@components/ui/button";
import Card from "@components/ui/card";
import FileInput from "@components/ui/file-input";
import Input from "@components/ui/input";
import { useUpdateCustomerMutation, User } from "@graphql/auth.graphql";
import { maskPhoneNumber } from "@utils/mask-phone-number";
import { useForm } from "react-hook-form";
import TextArea from "@components/ui/text-area";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import pick from "lodash/pick";
import Label from "@components/ui/label";
import MobileOtpLogin, {
  OtpType,
} from "@components/auth/mobile-otp-login/mobile-otp-login";

interface Props {
  user: User;
}

type UserFormValues = {
  name?: User["name"];
  profile?: User["profile"];
};

const ProfileForm = ({ user }: Props) => {
  const [otp, setOtp] = useState(false);
  const { t } = useTranslation("common");
  const { register, handleSubmit, setValue, control } = useForm<UserFormValues>(
    {
      defaultValues: {
        ...(user &&
          pick(user, [
            "name",
            "profile.bio",
            "profile.contact",
            "profile.avatar",
          ])),
      },
    }
  );
  const [updateProfile, { loading }] = useUpdateCustomerMutation();
  async function onSubmit(values: any) {
    const { data } = await updateProfile({
      variables: {
        input: {
          id: user.id!,
          name: values.name,
          profile: {
            upsert: {
              id: user?.profile?.id,
              ...values.profile,
              avatar: values.profile.avatar?.[0],
            },
          },
        },
      },
    });
    if (data?.updateUser?.id) {
      toast.success(t("profile-update-successful"));
    } else {
      toast.error(t("error-something-wrong"));
    }
  }

  function onContactUpdate(newPhoneNumber: string) {
    //@ts-ignore
    setValue("profile.contact", newPhoneNumber);
    toast.success(t("contact-update-successful"));
    setOtp(false);
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="flex mb-8">
        <Card className="w-full">
          <div className="mb-8">
            <FileInput control={control} name="profile.avatar" />
          </div>

          <div className="flex flex-row mb-6">
            <Input
              className="flex-1"
              label={t("text-name")}
              {...register("name")}
              variant="outline"
            />
          </div>

          <TextArea
            label={t("text-bio")}
            //@ts-ignore
            {...register("profile.bio")}
            variant="outline"
            className="mb-6"
          />

          <div className="flex">
            <Button className="ms-auto" loading={loading} disabled={loading}>
              {t("text-save")}
            </Button>
          </div>
        </Card>
      </div>

      <Card className="w-full flex flex-col sm:flex-row sm:space-s-4 sm:items-end">
        {!otp ? (
          <>
            <Input
              {...register("profile.contact")}
              disabled={true}
              label={t("text-contact-number")}
              className="flex-1 w-full"
              onChange={(e) => {
                const value = maskPhoneNumber(e.target.value);
                //@ts-ignore
                setValue("profile.contact", value);
              }}
              variant="outline"
            />
            <Button
              disabled={loading}
              onClick={() => setOtp(true)}
              className="flex-shrink-0"
            >
              {t("text-change-phone-number")}
            </Button>
          </>
        ) : (
          <div className="w-full">
            <Label>{t("text-contact-number")}</Label>
            <MobileOtpLogin
              type={OtpType.UPDATE}
              onVerify={onContactUpdate}
              userId={user?.id!}
              className="w-full"
            />
          </div>
        )}
      </Card>
    </form>
  );
};

export default ProfileForm;
