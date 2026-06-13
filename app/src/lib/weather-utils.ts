import type { TempUnit } from '@/types/weather';

export function toFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

export function formatTemp(value: number, unit: TempUnit): string {
  const temp = unit === 'F' ? toFahrenheit(value) : value;
  return `${temp}°`;
}

export function getFullTemp(value: number, unit: TempUnit): string {
  const temp = unit === 'F' ? toFahrenheit(value) : value;
  return `${temp}`;
}

export function getWeekTempRange(daily: { high: number; low: number }[]): { min: number; max: number } {
  const allTemps = daily.flatMap((d) => [d.low, d.high]);
  return {
    min: Math.min(...allTemps),
    max: Math.max(...allTemps),
  };
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}
