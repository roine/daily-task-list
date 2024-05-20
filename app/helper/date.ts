import dayjs from "dayjs";

export const isBeforeToday = (date: Date) => {
  return dayjs(date).isBefore(dayjs(), "day");
};

export const isBeforeThisWeek = (date: Date) => {
  return dayjs(date).isBefore(dayjs().subtract(1, "week"), "day");
};

export const isBeforeThisMonth = (date: Date) => {
  return dayjs(date).isBefore(dayjs().subtract(1, "month"), "day");
};

export const isBeforeThisYear = (date: Date) => {
  return dayjs(date).isBefore(dayjs().subtract(1, "year"), "day");
};

export const isToday = (date: Date) => {
  return dayjs(date).isSame(dayjs(), "day");
};
