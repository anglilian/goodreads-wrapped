export function getGoodreadsYear(): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  const month = now.getMonth();

  // If in first of year, use previous year
  if (month < 6) {
    return currentYear - 1;
  }
  return currentYear;
}