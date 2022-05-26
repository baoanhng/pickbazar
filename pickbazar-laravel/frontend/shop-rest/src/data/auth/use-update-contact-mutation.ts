import { useMutation } from "react-query";
import { AuthService, UpdateContactInput } from "./auth.service";

export const useUpdateContactMutation = () => {
	return useMutation((input: UpdateContactInput) =>
		AuthService.updateContact(input)
	);
};
