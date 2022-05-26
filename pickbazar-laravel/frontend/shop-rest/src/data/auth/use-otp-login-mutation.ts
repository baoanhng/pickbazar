import { useMutation } from "react-query";
import { AuthService, OtpLoginInputType } from "./auth.service";

export const useOtpLoginMutation = () => {
	return useMutation((input: OtpLoginInputType) => AuthService.otpLogin(input));
};
