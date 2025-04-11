export function capitalize(value: string): string {
  return value
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function parseInitials(value: string | undefined | null) {
  return (
    value
      ?.match(/(^\S\S?|\b\S)?/g)
      ?.join("")
      .match(/(^\S|\S$)?/g)
      ?.join("")
      .toUpperCase() ?? ""
  );
}
