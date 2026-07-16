import moment from "moment";

export function formatDate(dateString: string | null) {
  if (!dateString) return "-";
  return moment(dateString, "YYYY-MM-DD").format("MMMM Do, YYYY");
}
