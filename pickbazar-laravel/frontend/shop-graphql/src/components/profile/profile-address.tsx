import { useModalAction } from "@components/ui/modal/modal.context";
import { Address } from "@graphql/auth.graphql";
import AddressCard from "@components/address/address-card";
import { AddressHeader } from "@components/address/address-header";

interface AddressesProps {
  addresses: Address[] | undefined;
  label: string;
  className?: string;
  userId: string;
}

export const ProfileAddressGrid: React.FC<AddressesProps> = ({
  addresses,
  label,
  className,
  userId,
}) => {
  const { openModal } = useModalAction();

  //TODO: no address found
  function onAdd() {
    openModal("ADD_OR_UPDATE_ADDRESS", { customerId: userId, type: "BILLING" });
  }
  return (
    <div className={className}>
      <AddressHeader onAdd={onAdd} count={false} label={label} />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {addresses?.map((address) => (
          <AddressCard checked={false} address={address} userId={userId} />
        ))}
      </div>
    </div>
  );
};
export default ProfileAddressGrid;
