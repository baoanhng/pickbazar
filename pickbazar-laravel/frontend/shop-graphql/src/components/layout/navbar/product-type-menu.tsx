import { Fragment } from "react";
import { useRouter } from "next/router";
import { Menu, Transition } from "@headlessui/react";
import cn from "classnames";
import { CaretDown } from "@components/icons/caret-down";
import { useTypesQuery } from "@graphql/types.graphql";
import ErrorMessage from "@components/ui/error-message";
import DropdownLoader from "@components/ui/loaders/dropdown-loader";
import * as typeIcon from "@components/icons/type";
import { getIcon } from "@utils/get-icon";
import Scrollbar from "@components/ui/scrollbar";

type Props = {
  className?: string;
  btnClassName?: string;
};

const ProductTypeMenu: React.FC<Props> = ({
  className,
  btnClassName = "border border-border-200 text-accent rounded min-w-150 px-4",
}) => {
  const { data, loading, error } = useTypesQuery();

  const router = useRouter();

  if (error) return <ErrorMessage message={error.message} />;

  const selectedMenu = data?.types?.find((type: any) =>
    router.asPath.includes(type.slug)
  );

  function handleClick(path: string) {
    router.push(path);
  }

  return (
    <div className={className}>
      {loading ? (
        <DropdownLoader uniqueKey="product-type-menu" />
      ) : (
        <>
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button
              className={cn(
                "flex items-center flex-shrink-0 bg-light text-sm md:text-base font-semibold h-10 focus:outline-none",
                btnClassName
              )}
            >
              {selectedMenu?.icon && (
                <span className="flex w-5 h-5 me-2 items-center justify-center">
                  {getIcon({
                    iconList: typeIcon,
                    iconName: selectedMenu?.icon,
                    className: "max-h-full max-w-full",
                  })}
                </span>
              )}
              {selectedMenu?.name}
              <span className="flex ps-2.5 pt-1 ms-auto">
                <CaretDown />
              </span>
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
                className="absolute right-0 mt-2 origin-top-right py-2 w-48 h-56 min-h-40 max-h-56 sm:max-h-72 bg-light rounded shadow-700 focus:outline-none"
              >
                <Scrollbar
                  className="w-full h-full"
                  options={{
                    scrollbars: {
                      autoHide: "never",
                    },
                  }}
                >
                  {data?.types?.map(({ id, name, slug, icon }) => (
                    <Menu.Item key={id}>
                      {({ active }) => (
                        <button
                          onClick={() => handleClick(`/${slug}`)}
                          className={cn(
                            "flex space-s-4 items-center w-full px-5 py-2.5 text-sm font-semibold capitalize  transition duration-200 hover:text-accent focus:outline-none",
                            active ? "text-accent" : "text-body-dark"
                          )}
                        >
                          {icon && (
                            <span className="flex w-5 h-5 items-center justify-center">
                              {getIcon({
                                iconList: typeIcon,
                                iconName: icon,
                                className: "max-h-full max-w-full",
                              })}
                            </span>
                          )}
                          <span>{name}</span>
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </Scrollbar>
              </Menu.Items>
            </Transition>
          </Menu>
        </>
      )}
    </div>
  );
};

export default ProductTypeMenu;
