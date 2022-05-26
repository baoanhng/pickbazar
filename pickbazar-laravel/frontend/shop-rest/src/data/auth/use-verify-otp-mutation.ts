import { useMutation } from "react-query";
import { AuthService, VerifyOtpInputType } from "./auth.service";

export const useVerifyOtpMutation = () => {
	return useMutation((input: VerifyOtpInputType) =>
		AuthService.verifyOtpCode(input)
	);
};
