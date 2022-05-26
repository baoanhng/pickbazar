import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { siteSettings } from "@settings/site.settings";
import Avatar from "@components/ui/avatar";
import { useCustomerQuery } from "@data/customer/use-customer.query";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import cn from "classnames";

export default function AuthorizedMenu() {
  const { data } = useCustomerQuery();
  const router = useRouter();
  const { t } = useTranslation("common");

  function handleClick(path: string) {
    router.push(path);
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center focus:outline-none">
        <Avatar
          src={
            data?.me?.profile?.avatar?.thumbnail ?? "/avatar-placeholder.svg"
          }
          title="user name"
        />
        <span className="sr-only">{t("user-avatar")}</span>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          as="ul"
          className="absolute right-0 w-48 py-4 mt-1 origin-top-right bg-white rounded shadow-700 focus:outline-none"
        >
          {siteSettings.authorizedLinks.map(({ href, label }) => (
            <Menu.Item key={`${href}${label}`}>
              {({ active }) => (
                <li>
                  <button
                    onClick={() => handleClick(href)}
                    className={cn(
                      "block w-full py-2.5 px-6 text-sm text-start font-semibold capitalize text-heading transition duration-200 hover:text-accent focus:outline-none",
                      active ? "text-accent" : "text-heading"
                    )}
                  >
                    {t(label)}
                  </button>
                </li>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
