import dayjs from "dayjs";

export function formatDate(date: string, format = "MMM D, YYYY"): string {
  return dayjs(date).format(format);
}

export function formatDateRange(start: string, end?: string | null): string {
  if (!end) return dayjs(start).format("MMM YYYY");
  const startDay = dayjs(start);
  const endDay = dayjs(end);

  if (startDay.isSame(endDay, "month")) {
    return `${startDay.format("MMM D")} – ${endDay.format("D, YYYY")}`;
  }
  if (startDay.isSame(endDay, "year")) {
    return `${startDay.format("MMM D")} – ${endDay.format("MMM D, YYYY")}`;
  }
  return `${startDay.format("MMM D, YYYY")} – ${endDay.format("MMM D, YYYY")}`;
}

export function formatCurrency(
  amount: number,
  currency = "USD",
  compact = false
): string {
  if (compact && amount >= 1000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getTripDuration(start: string, end?: string | null): number {
  if (!end) return 1;
  return dayjs(end).diff(dayjs(start), "day") + 1;
}

export function getDisplayName(
  firstName?: string | null,
  lastName?: string | null,
  username?: string | null
): string {
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  if (username) return `@${username}`;
  return "Traveler";
}
