// import SectionWithCardGroup from "@components/common/section-with-card-group";
// import { useCheckout } from "@contexts/checkout.context";
import { siteSettings } from "@settings/site.settings";
// import { useEffect } from "react";

import { RadioGroup } from "@headlessui/react";
import { useAtom } from "jotai";
import ScheduleCard from "./schedule-card";
import { deliveryTimeAtom } from "@jotai/checkout";
import { useEffect } from "react";
import { useSettings } from "@contexts/settings.context";
import { useTranslation } from "next-i18next";

interface ScheduleProps {
  // count: number;
  label: string;
  className?: string;
  count?: number;
}

// const Schedule = ({ count }: Props) => {
//   const { updateDeliveryTime } = useCheckout();
//   useEffect(() => {
//     updateDeliveryTime(siteSettings.deliverySchedule[0]);
//   }, []);

//   function handleSelect(item: any) {
//     updateDeliveryTime(item);
//   }
//   return (
//     <SectionWithCardGroup
//       count={count}
//       heading="text-delivery-schedule"
//       items={siteSettings.deliverySchedule}
//       onSelect={handleSelect}
//     />
//   );
// };

// export default Schedule;
// const schedules = siteSettings.deliverySchedule;
export const ScheduleGrid: React.FC<ScheduleProps> = ({
  label,
  className,
  count,
}) => {
  const { t } = useTranslation("common");
  const { deliveryTime: schedules } = useSettings();
  // console.log(settings, "settings");

  const [selectedSchedule, setSchedule] = useAtom(deliveryTimeAtom);
  useEffect(() => {
    if (schedules?.length) {
      if (selectedSchedule?.id) {
        const index = schedules.findIndex(
          (a: any) => a.title === selectedSchedule.title
        );
        setSchedule(schedules[index]);
      } else {
        setSchedule(schedules[0]);
      }
    }
  }, [schedules?.length]);
  //TODO: no address found
  //TODO: dynamic import
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

      {schedules && schedules?.length ? (
        <RadioGroup value={selectedSchedule} onChange={setSchedule}>
          <RadioGroup.Label className="sr-only">{label}</RadioGroup.Label>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {schedules?.map((schedule, index) => (
              <RadioGroup.Option value={schedule} key={index}>
                {({ checked }) => (
                  <ScheduleCard checked={checked} schedule={schedule} />
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <span className="relative px-5 py-6 text-base text-center bg-gray-100 rounded border border-border-200">
            {t("text-no-delivery-time-found")}
          </span>
        </div>
      )}
    </div>
  );
};
export default ScheduleGrid;
