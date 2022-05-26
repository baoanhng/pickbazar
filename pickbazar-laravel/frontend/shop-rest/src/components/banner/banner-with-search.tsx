import Search from "@components/common/search";
import { useUI } from "@contexts/ui.context";
import classNames from "classnames";
import { Waypoint } from "react-waypoint";
import { Swiper, SwiperSlide } from "@components/ui/slider";
import placeholder from "@assets/placeholder/product.svg";
import Image from "next/image";
import ErrorMessage from "@components/ui/error-message";
import { useTypeQuery } from "@data/type/use-type.query";
interface BannerProps {
  type: string | undefined;
  className?: string;
}

const BannerWithSearch: React.FC<BannerProps> = ({ type, className }) => {
  const { showHeaderSearch, hideHeaderSearch } = useUI();
  const { data, error } = useTypeQuery(type as string);

  const onWaypointPositionChange = ({
    currentPosition,
  }: Waypoint.CallbackArgs) => {
    if (!currentPosition || currentPosition === "above") {
      showHeaderSearch();
    }
  };

  if (error) return <ErrorMessage message={error.message} />;

  const { banners } = data?.type ?? {};

  return (
    <div className={classNames("hidden lg:block relative", className)}>
      {!banners?.length ? (
        <div className="min-h-140 overflow-hidden -z-1 flex items-center justify-center">
          <Image src={placeholder} layout="fill" objectFit="cover" />
          <div className="p-5 mt-8 absolute inset-0 w-full flex flex-col items-center justify-center text-center">
            <div className="max-w-3xl w-full">
              <Search label="search" />
            </div>
            <Waypoint
              onLeave={showHeaderSearch}
              onEnter={hideHeaderSearch}
              onPositionChange={onWaypointPositionChange}
            />
          </div>
        </div>
      ) : (
        <div className="overflow-hidden -z-1">
          <div className="relative">
            <Swiper
              id="banner"
              loop={true}
              resizeObserver={true}
              allowTouchMove={false}
              slidesPerView={1}
              autoplay={false}
            >
              {banners?.map((banner, idx) => (
                <SwiperSlide key={idx} className="max-h-screen">
                  <img
                    className="w-full h-full min-h-140 object-cover"
                    src={banner!.image?.original ?? "/product-placeholder.svg"}
                    alt={banner!.title ?? ""}
                  />
                  {/* <div className="w-full h-full absolute top-0 left-0 bg-light bg-opacity-20" /> */}
                  <div className="p-5 mt-8 absolute inset-0 w-full flex flex-col items-center justify-center text-center  md:px-20">
                    <h1 className="text-4xl xl:text-5xl tracking-tight text-heading font-bold mb-5 xl:mb-8">
                      {banner?.title}
                    </h1>
                    <p className="text-base xl:text-lg text-heading mb-10 xl:mb-14">
                      {banner?.description}
                    </p>
                    <div className="max-w-3xl w-full">
                      <Search label="search" />
                    </div>
                    <Waypoint
                      onLeave={showHeaderSearch}
                      onEnter={hideHeaderSearch}
                      onPositionChange={onWaypointPositionChange}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerWithSearch;
