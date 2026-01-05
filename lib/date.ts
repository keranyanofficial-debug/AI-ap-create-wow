export function getTodayString(timeZone: string) {
  return getDateStringForTimezone(new Date(), timeZone);
}

export function getDateStringForTimezone(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  return formatter.format(date);
}
