import { getRequest } from "./apiServices";
import moment from "moment";

export const normalizeDate = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const isSameDay = (date1: Date, date2: Date) => {
  const normalizedDate1 = normalizeDate(date1);
  const normalizedDate2 = normalizeDate(date2);
  return normalizedDate1.getTime() === normalizedDate2.getTime();
};

export const calculateMinMaxTimes = (dateTimeString: string, is24Hour: any) => {
  const date = new Date(dateTimeString.replace(" ", "T") + "Z");

  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const isPM = hours >= 12;
  const period = isPM ? "PM" : "AM";

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return {
    minHour: hours,
    minMinute: formattedMinutes,
    period,
  };
};

export const getTimeZone = async (lat: number | null, lng: number | null) => {
  const response = await getRequest(`get-timezone-api?lat=${lat}&&lng=${lng}`);
  return response;
};

export const getLocalTime = (timeZone: string) => {
  return moment(timeZone).format("YYYY-MM-DD HH:mm:ss");
};

export function convertMinutesToHours(minutes: number): {
  hours: number;
  minutes: number;
} {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return { hours, minutes: remainingMinutes };
}

export function addBookingTimeToBase(
  baseTime: string,
  addHours: number,
  addMinutes: number
) {
  const [hours, minutes, seconds] = baseTime.split(":").map(Number);
  const baseDate = new Date();

  baseDate.setHours(hours);
  baseDate.setMinutes(minutes);
  baseDate.setSeconds(seconds || 0);

  baseDate.setHours(baseDate.getHours() + addHours);
  baseDate.setMinutes(baseDate.getMinutes() + addMinutes);

  const finalHours = String(baseDate.getHours()).padStart(2, "0");
  const finalMinutes = String(baseDate.getMinutes()).padStart(2, "0");
  const finalSeconds = String(baseDate.getSeconds()).padStart(2, "0");

  return `${finalHours}:${finalMinutes}:${finalSeconds}`;
}

export const DateTimeFormatter = (date: string, time: string) => {
  const combinedDateTime = `${date} ${time}`;

  const formattedDateTime = moment(combinedDateTime, "DD/MM/YYYY hh:mm A")
    .utc()
    .format("ddd, MMM DD, YYYY [at] hh:mm A [(GMT)]");

  return combinedDateTime;
};
