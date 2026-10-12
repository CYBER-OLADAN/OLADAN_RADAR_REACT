export function formatPrice(n) {
  if (typeof n !== "number") return "₦0";
  return "₦" + n.toLocaleString();
}
export function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" });
}