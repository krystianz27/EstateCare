export function formatViewCount(count: number | undefined) {
  if (count === undefined) {
    return "No Views";
  }
  return `${count} ${count === 1 ? "View" : "Views"}`;
}
