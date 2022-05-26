import { ArrowNext, ArrowPrev } from "@components/icons";
import SwiperCore, { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import cn from "classnames";
import { useTranslation } from "next-i18next";
import { useTypeQuery } from "@graphql/types.graphql";
import ErrorMessage from "@components/ui/error-message";
import placeholder from "@assets/placeholder/product.svg";
import Image from "next/image";

interface BannerProps {
  type: string | undefined;
  className?: string;
}

SwiperCore.use([Navigation]);

const BannerShort: React.FC<BannerProps> = ({ type, className }) => {
  const { t } = useTranslation("common");

  const { data, error } = useTypeQuery({
    variables: {
      slug: type,
    },
  });

  if (error) return <ErrorMessage message={error.message} />;

  const { banners } = data?.type ?? {};

  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden -z-1">
        <div className="relative">
          {!banners?.length ? (
            <div className="w-full h-[260px] md:h-[350px] py-8">
              <Image
                src={placeholder}
                alt="banner"
                layout="fill"
                objectFit="cover"
              />
            </div>
          ) : (
            <>
              <Swiper
                id="banner"
                loop={true}
                resizeObserver={true}
                slidesPerView={1}
                navigation={{
                  nextEl: ".next",
                  prevEl: ".prev",
                }}
              >
                {banners?.map((banner: any, idx) => (
                  <SwiperSlide key={idx} className="max-h-[450px]">
                    <img
                      className="w-full h-auto"
                      src={banner.image?.original ?? "/product-placeholder.svg"}
                      alt={banner.title}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <div
                className="prev cursor-pointer absolute top-2/4 start-4 md:start-5 z-10 -mt-4 md:-mt-5 w-8 h-8 rounded-full bg-light shadow-200 border border-border-200 border-opacity-70 flex items-center justify-center text-heading transition-all duration-200"
                role="button"
              >
                <span className="sr-only">{t("text-previous")}</span>
                <ArrowPrev width={18} height={18} />
              </div>
              <div
                className="next cursor-pointer absolute top-2/4 end-4 md:end-5 z-10 -mt-4 md:-mt-5 w-8 h-8 rounded-full bg-light shadow-200 border border-border-200 border-opacity-70 flex items-center justify-center text-heading transition-all duration-200"
                role="button"
              >
                <span className="sr-only">{t("text-next")}</span>
                <ArrowNext width={18} height={18} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerShort;
