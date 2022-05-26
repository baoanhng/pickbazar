import { useEffect } from "react";
import { useAtom } from "jotai";
import { customerContactAtom } from "@jotai/checkout";
import { OTP } from "@components/otp/otp";

interface ContactProps {
  contact: string | undefined;
  label: string;
  count?: number;
  className?: string;
}

const ContactGrid = ({ contact, label, count, className }: ContactProps) => {
  const [_, setContactNumber] = useAtom(customerContactAtom);
  useEffect(() => {
    if (contact) {
      setContactNumber(contact);
    }
  }, []);
  function onContactUpdate(newPhoneNumber: string) {
    setContactNumber(newPhoneNumber);
  }
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-5 md:mb-8">
        <div className="flex items-center space-s-3 md:space-s-4">
          {count && (
            <span className="rounded-full w-8 h-8 bg-accent flex items-center justify-center text-base lg:text-xl text-light">
              {count}
            </span>
          )}
          <p className="text-lg lg:text-xl text-heading capitalize">{label}</p>
        </div>
      </div>
      <OTP defaultValue={contact} onVerify={onContactUpdate} />
    </div>
  );
};

export default ContactGrid;
