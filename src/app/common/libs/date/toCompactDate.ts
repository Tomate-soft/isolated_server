export function toCompactDate(date: Date | string | number = new Date()): string {
  const d: Date = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }

  const pad = (n: number): string => String(n).padStart(2, '0');

  const day: string = pad(d.getDate()); // 12
  const month: string = pad(d.getMonth() + 1); // 09
  const year: string = String(d.getFullYear()).slice(-2); // 25

  return `${day}${month}${year}`;
}
