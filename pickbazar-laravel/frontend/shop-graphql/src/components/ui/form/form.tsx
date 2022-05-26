import {
  useForm,
  UseFormReturn,
  SubmitHandler,
  UseFormProps,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

type FormProps<TFormValues> = {
  onSubmit: SubmitHandler<TFormValues>;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  options?: UseFormProps<TFormValues>;
  validationSchema?: any; // don't worry it's not important for this case
  [key: string]: unknown;
};

export const Form = <
  TFormValues extends Record<string, any> = Record<string, any>
>({
  onSubmit,
  children,
  options,
  validationSchema,
  ...props
}: FormProps<TFormValues>) => {
  const methods = useForm<TFormValues>({
    ...(!!validationSchema && { resolver: yupResolver(validationSchema) }),
    ...(!!options && options),
  });
  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className="space-y-3" //grid gap-3, flex flex-col space-y-3
      noValidate
      {...props}
    >
      {children(methods)}
    </form>
  );
};
