import { useMutation } from "react-query";
import { AuthService, SendOtpCodeInputType } from "./auth.service";

export const useSendOtpCodeMutation = () => {
	return useMutation((input: SendOtpCodeInputType) =>
		AuthService.sendOtpCode(input)
	);
};
