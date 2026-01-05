import { format } from "date-fns";

export function getTodayString() {
  return format(new Date(), "yyyy-MM-dd");
}
