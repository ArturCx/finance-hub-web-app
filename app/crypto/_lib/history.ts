export type SeriesPoint = [timestamp: number, value: number];

export const DAY_MS = 24 * 60 * 60 * 1000;
export const HISTORY_DAYS = 366;

const utcDay = (timestamp: number) => Math.floor(timestamp / DAY_MS);

export const toSeries = (value: unknown): SeriesPoint[] =>
  Array.isArray(value)
    ? (value as unknown[]).filter(
        (point): point is SeriesPoint =>
          Array.isArray(point) && typeof point[0] === "number" && typeof point[1] === "number",
      )
    : [];

export const mergeDailyPoint = (
  series: SeriesPoint[],
  timestamp: number,
  value: number,
): SeriesPoint[] => {
  const next = [...series];
  const last = next[next.length - 1];
  if (last && utcDay(last[0]) === utcDay(timestamp)) {
    next[next.length - 1] = [timestamp, value];
  } else {
    next.push([timestamp, value]);
  }
  const cutoff = timestamp - HISTORY_DAYS * DAY_MS;
  return next.filter(([time]) => time >= cutoff);
};

export const isStale = (series: SeriesPoint[], now: number, maxAgeDays = 3) => {
  const last = series[series.length - 1];
  return !last || now - last[0] > maxAgeDays * DAY_MS;
};
