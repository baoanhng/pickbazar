import { verifiedResponseAtom } from "@jotai/checkout";
import { useAtom } from "jotai";
import dynamic from "next/dynamic";
const UnverifiedItemList = dynamic(
  () => import("@components/checkout/item/unverified-item-list")
);
const VerifiedItemList = dynamic(
  () => import("@components/checkout/item/verified-item-list")
);

export const RightSideView = () => {
  const [verifiedResponseJsonString] = useAtom(verifiedResponseAtom);
  if (!verifiedResponseJsonString) {
    return <UnverifiedItemList />;
  }
  return <VerifiedItemList />;
};

export default RightSideView;
