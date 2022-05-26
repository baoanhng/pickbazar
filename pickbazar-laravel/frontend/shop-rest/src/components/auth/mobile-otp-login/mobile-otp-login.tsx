import React, { useState } from "react";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";
import MobileOtpInput from "react-otp-input";
import cn from "classnames";
import Button from "@components/ui/button";
import Input from "@components/ui/input";
import Alert from "@components/ui/alert";
import Label from "@components/ui/label";
import { useModalAction } from "@components/ui/modal/modal.context";
import { useUI } from "@contexts/ui.context";

import { useSendOtpCodeMutation } from "@data/auth/use-send-otp-mutation";
import { useVerifyOtpMutation } from "@data/auth/use-verify-otp-mutation";
import { useUpdateContactMutation } from "@data/auth/use-update-contact-mutation";

import "react-phone-input-2/lib/bootstrap.css";
import { useOtpLoginMutation } from "@data/auth/use-otp-login-mutation";

export enum OtpType {
  LOGIN = "LOGIN",
  UPDATE = "UPDATE",
  VERIFY = "VERIFY",
}

type IProps = {
  type: OtpType;
  className?: string;
  onVerify?: (number: string) => void;
  userId?: string;
};

const MobileOtpLogin: React.FC<IProps> = ({
  type,
  onVerify,
  userId,
  className,
}) => {
  const [number, setNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSendError, setOtpSendError] = useState(false);
  const [otpVerifyError, setOtpVerifyError] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isContactExist, setIsContactExist] = useState(false);
  const [otpId, setOtpId] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const { t } = useTranslation("common");

  const { authorize } = useUI();
  const { closeModal } = useModalAction();

  const { mutate: sendOtpCode, isLoading: loading } = useSendOtpCodeMutation();
  const { mutate: verifyOtpCode, isLoading: verifyLoading } =
    useVerifyOtpMutation();
  const { mutate: otpLogin, isLoading: otpLoginLoading } =
    useOtpLoginMutation();
  const { mutate: updateContact, isLoading: updateContactLoading } =
    useUpdateContactMutation();

  function onSendCodeSubmission() {
    sendOtpCode(
      {
        phone_number: number,
      },
      {
        onSuccess: (data) => {
          if (data?.success) {
            setShowOtpInput(true);
            setIsContactExist(
              type !== OtpType.LOGIN ? true : data?.is_contact_exist
            );
            setOtpId(data?.id);
          }
          if (!data?.success) {
            console.log("text-otp-failed");
            setOtpSendError(true);
          }
        },
        onError: (error: any) => {
          console.log(error.message);
          setOtpSendError(true);
        },
      }
    );
  }

  function onVerifyCodeSubmission() {
    verifyOtpCode(
      {
        phone_number: number,
        code: otp,
        otp_id: otpId,
      },
      {
        onSuccess: (data) => {
          if (data?.success) {
            onVerify && onVerify(number);
            setOtp("");
          } else {
            setOtp("");
            setOtpVerifyError(true);
          }
        },
        onError: (error: any) => {
          console.log(error.message);
          setOtp("");
          setOtpVerifyError(true);
        },
      }
    );
  }

  function onOtpLoginSubmission() {
    if (!isContactExist && !email) setEmailError("error-email-required");
    if (!isContactExist && !name) setNameError("error-name-required");

    if (otp && number) {
      if ((!isContactExist && name && email) || isContactExist) {
        otpLogin(
          {
            phone_number: number,
            code: otp,
            otp_id: otpId,
            ...(name ? { name } : {}),
            ...(email ? { email } : {}),
          },
          {
            onSuccess: (data) => {
              if (data?.token && data?.permissions?.length) {
                Cookies.set("auth_token", data.token);
                Cookies.set("auth_permissions", data.permissions);
                authorize();
                closeModal();
                return;
              } else {
                setOtp("");
                setOtpVerifyError(true);
              }
            },
            onError: (error: any) => {
              console.log(error.message);
              setOtp("");
              setOtpVerifyError(true);
            },
          }
        );
      }
    }
  }

  function onUpdateContactSubmission() {
    updateContact(
      {
        phone_number: number,
        code: otp,
        otp_id: otpId,
        user_id: userId!,
      },
      {
        onSuccess: (data) => {
          if (data?.success) {
            onVerify && onVerify(number);
            setOtp("");
          } else {
            setOtp("");
            setOtpVerifyError(true);
          }
        },
        onError: (error: any) => {
          console.log(error.message);
          setOtp("");
          setOtpVerifyError(true);
        },
      }
    );
  }

  function onSubmit() {
    switch (type) {
      case OtpType.LOGIN:
        onOtpLoginSubmission();
        break;
      case OtpType.UPDATE:
        onUpdateContactSubmission();
        break;
      case OtpType.VERIFY:
        onVerifyCodeSubmission();
        break;

      default:
        break;
    }
  }

  return (
    <div className={cn("mt-4", className)}>
      {!showOtpInput ? (
        <div>
          <div className="flex items-center">
            <PhoneInput
              country={"us"}
              value={number}
              onChange={(phone) => setNumber(`+${phone}`)}
              inputClass="!p-0 !pe-4 !ps-14 !flex !items-center !w-full !appearance-none !transition !duration-300 !ease-in-out !text-heading !text-sm focus:!outline-none focus:!ring-0 !border !border-border-base !border-e-0 !rounded !rounded-e-none focus:!border-accent !h-12"
              dropdownClass="focus:!ring-0 !border !border-border-base !shadow-350"
            />

            <Button
              loading={loading}
              disabled={loading}
              onClick={onSendCodeSubmission}
              className="!rounded-s-none"
            >
              {t("text-send-code")}
            </Button>
          </div>
          {otpSendError && (
            <Alert
              variant="error"
              message={"text-otp-send-failed"}
              className="mt-4"
              closeable={true}
              onClose={() => setOtpSendError(false)}
            />
          )}
        </div>
      ) : (
        <div className="space-y-5 border border-gray-200 rounded p-5">
          {!isContactExist ? (
            <div>
              <Input
                label={t("text-email")}
                name="email"
                type="email"
                onChange={(event) => setEmail(event.target.value)}
                variant="outline"
                className="mb-5"
                error={t(emailError)}
              />
              <Input
                label={t("text-name")}
                name="name"
                type="name"
                onChange={(event) => setName(event.target.value)}
                variant="outline"
                className="mb-5"
                error={t(nameError)}
              />
            </div>
          ) : null}

          <div>
            <Label>{t("text-otp-code")}</Label>

            <MobileOtpInput
              value={otp}
              onChange={(value: string) => setOtp(value)}
              numInputs={6}
              separator={
                <span className="hidden sm:inline-block sm:mx-2">-</span>
              }
              containerStyle="justify-center space-x-2 sm:space-x-0"
              inputStyle="flex items-center justify-center !w-full sm:!w-11 appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base rounded focus:border-accent h-12"
              disabledStyle="!bg-gray-100"
            />

            {otpVerifyError && (
              <Alert
                variant="error"
                message={"text-otp-verify-failed"}
                className="mb-6"
                closeable={true}
                onClose={() => setOtpVerifyError(false)}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Button
              variant="outline"
              onClick={() => {
                setShowOtpInput(false);
                setOtpVerifyError(false);
              }}
            >
              {t("text-back")}
            </Button>

            <Button
              loading={verifyLoading || updateContactLoading || otpLoginLoading}
              disabled={
                updateContactLoading || verifyLoading || otpLoginLoading || !otp
              }
              onClick={onSubmit}
            >
              {t("text-verify-code")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileOtpLogin;
