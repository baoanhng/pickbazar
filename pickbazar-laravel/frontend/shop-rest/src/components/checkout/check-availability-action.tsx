import { formatOrderedProduct } from "@utils/format-ordered-product";
import { useState } from "react";
import ValidationError from "@components/ui/validation-error";
import { useAtom } from "jotai";
import {
  billingAddressAtom,
  shippingAddressAtom,
  verifiedResponseAtom,
} from "@jotai/checkout";
import Button from "@components/ui/button";
import { useCart } from "@contexts/quick-cart/cart.context";
import { useVerifyCheckoutMutation } from "@data/order/use-checkout-verify.mutation";

export const CheckAvailabilityAction: React.FC = (props) => {
  const [billing_address] = useAtom(billingAddressAtom);
  const [shipping_address] = useAtom(shippingAddressAtom);
  const [_, setVerifiedResponse] = useAtom(verifiedResponseAtom);

  const [errorMessage, setError] = useState("");
  const { items, total, isEmpty } = useCart();

  const { mutate: verifyCheckout, isLoading: loading } =
    useVerifyCheckoutMutation();

  function handleVerifyCheckout() {
    if (billing_address && shipping_address) {
      verifyCheckout(
        {
          amount: total,
          products: items?.map((item) => formatOrderedProduct(item)),
          billing_address: {
            ...(billing_address?.address && billing_address.address),
          },
          shipping_address: {
            ...(shipping_address?.address && shipping_address.address),
          },
        },
        {
          onSuccess: (data) => {
            console.log(data, "data");

            setVerifiedResponse(data);
          },
          onError: (error: any) => {
            setError(error?.response?.data?.message);
          },
        }
      );
    } else {
      setError("error-add-both-address");
    }
  }

  return (
    <>
      <Button
        loading={loading}
        className="w-full mt-5"
        onClick={handleVerifyCheckout}
        disabled={isEmpty}
        {...props}
      />
      {errorMessage && (
        <div className="mt-3">
          <ValidationError message={errorMessage} />
        </div>
      )}
    </>
  );
};
