// WM formats. Date: "May 1, 2016" (English, full month name). Numbers: a comma every 3 digits.

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const numberFormatter = new Intl.NumberFormat("en-US");

/** "2026-08-12" → "August 12, 2026". Parsed as UTC so the day never shifts by timezone. */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return dateFormatter.format(new Date(Date.UTC(year, month - 1, day)));
}

/** 105000 → "105,000" */
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** 105000 → "₹105,000" */
export function formatRupees(value: number): string {
  return `₹${formatNumber(value)}`;
}

/** "Aarav Sharma" → "AS" */
export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
