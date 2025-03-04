interface TimeRange {
  start: string;
  end: string;
}

export function  formatTimeDate (dateTime: Date): string  {

  return dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

export function isTimeInRange(
  timeIs: number,
  startTime: number,
  endTime: number,
): boolean {
  const isPlayedOverNight: boolean = endTime < startTime;
  let isCurrentTimeInRange: boolean;

  if (isPlayedOverNight) {
    isCurrentTimeInRange = timeIs >= startTime || timeIs < endTime;
  } else {
    isCurrentTimeInRange = timeIs >= startTime && timeIs < endTime;
  }
  return isCurrentTimeInRange;
}

export function calculateDelay(
  activeTime: string,
  activeRange: TimeRange,
): number {
  const currentTime = convertTimeToMinutes(activeTime);

  const startTime = convertTimeToMinutes(activeRange?.start);
  const endTime = convertTimeToMinutes(activeRange?.end);

  const isCurrentTimeInRange = isTimeInRange(currentTime, startTime, endTime);

  if (isCurrentTimeInRange) {
    const inRangeCalculation =
      endTime >= currentTime
        ? endTime - currentTime
        : 1440 - currentTime + endTime;

    return toMilliseconds(inRangeCalculation);
  } else {
    const elseRange =
      startTime >= currentTime
        ? startTime - currentTime
        : 1440 - currentTime + startTime;

    return toMilliseconds(elseRange);
  }
}

export const toMilliseconds = (calculatedMins: number): number => {
  const minuteFix = parseFloat((calculatedMins / 60).toPrecision(4));
  return minuteFix * 60 * 60000;
};

export const convertTimeToMinutes = (slotTime: string): number => {
  const [hour, min, secs] = slotTime.split(":").map(Number);
  const numberHour =hour;
  const numberMin = min % 60;
  const numberSec = secs % 60;

  return 60 * numberHour + numberMin;
};

export function timeFromMilliseconds (theTime: string, millisec: number): string  {
  const [hr,min,sec]= theTime.split(":").map(Number)
  const workingDate = new Date()
  workingDate.setHours(hr,min,sec, 0)
  workingDate.setMilliseconds(workingDate.getMilliseconds() + millisec)
  return formatTimeDate(workingDate)
};

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  // calculateDelay("7:50", { start: "17:00", end: "6:00" });
  timeFromMilliseconds("10:10:10", 3600000)
}
