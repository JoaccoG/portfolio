export const getDate = (): {
  day: number;
  month: number;
  year: number;
  formatted: string;
  timestamp: number;
  iso: string;
} => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const formatted = `${day}/${month}/${year}`;
  const timestamp = date.getTime();
  const iso = date.toISOString();

  return { day, month, year, formatted, timestamp, iso };
};
