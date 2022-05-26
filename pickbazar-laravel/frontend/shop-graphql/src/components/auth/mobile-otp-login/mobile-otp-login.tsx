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

import {
  useOtpLoginMutation,
  useSendOtpCodeMutation,
  useUpdateContactMutation,
  useVerifyOtpCodeMutation,
} from "@graphql/auth.graphql";

import "react-phone-input-2/lib/bootstrap.css";

export enum OtpType {
  LOGIN = "LOGIN",
  UPDATE = "UPDATE",
  VERIFY = "VERIFY",
}

type Props = {
  type: OtpType;
  className?: string;
  onVerify?: (number: string) => any;
  userId?: string;
};

const MobileOtpLogin: React.FC<Props> = ({
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

  const [sendOtpCode, { loading }] = useSendOtpCodeMutation({
    onCompleted: (data) => {
      if (data?.sendOtpCode?.success) {
        setShowOtpInput(true);
        setIsContactExist(
          type !== OtpType.LOGIN ? true : data?.sendOtpCode?.is_contact_exist!
        );
        setOtpId(data?.sendOtpCode?.id!);
      }
      if (!data?.sendOtpCode?.success) {
        console.log(t("text-otp-send-failed"));
        setOtpSendError(true);
      }
    },
    onError: (error) => {
      console.log(error.message);
      setOtpSendError(true);
    },
  });
  const [otpLogin, { loading: otpLoginLoading }] = useOtpLoginMutation({
    onCompleted: (data) => {
      if (data?.otpLogin?.token && data?.otpLogin?.permissions?.length) {
        Cookies.set("auth_token", data?.otpLogin?.token);
        Cookies.set("auth_permissions", data?.otpLogin?.permissions);
        authorize();
        closeModal();
        return;
      } else {
        setOtp("");
        setOtpVerifyError(true);
      }
    },
    onError: (error) => {
      console.log(error.message);
      setOtpSendError(true);
    },
  });

  const [updateContact, { loading: updateContactLoading }] =
    useUpdateContactMutation({
      onCompleted: (data) => {
        if (data?.updateContact?.success) {
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
    });

  const [verifyOtpCode, { loading: otpVerifyLoading }] =
    useVerifyOtpCodeMutation({
      onCompleted: (data) => {
        if (data?.verifyOtpCode?.success) {
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
    });

  function onSendCodeSubmission() {
    sendOtpCode({
      variables: { phoneNumber: number },
    });
  }

  function onOtpLoginSubmission() {
    if (!isContactExist && !email) setEmailError("error-email-required");
    if (!isContactExist && !name) setNameError("error-name-required");
    if (otp && number) {
      if ((!isContactExist && name && email) || isContactExist) {
        otpLogin({
          variables: {
            phoneNumber: number,
            code: otp,
            otpId: otpId,
            ...(name ? { name } : {}),
            ...(email ? { email } : {}),
          },
        });
      }
    }
  }

  function onUpdateContactSubmission() {
    updateContact({
      variables: {
        phoneNumber: number,
        code: otp,
        otpId: otpId,
        userId: userId!,
      },
    });
  }

  function onVerifyCodeSubmission() {
    verifyOtpCode({
      variables: {
        phoneNumber: number,
        code: otp,
        otpId: otpId,
      },
    });
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
              message={t("text-otp-send-failed")}
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
                message={t("text-otp-verify-failed")}
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
              loading={
                otpLoginLoading || updateContactLoading || otpVerifyLoading
              }
              disabled={
                updateContactLoading ||
                otpLoginLoading ||
                otpVerifyLoading ||
                !otp
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
