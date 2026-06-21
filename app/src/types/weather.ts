export type WeatherCondition =
  | 'sunny'
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'overcast'
  | 'rainy'
  | 'heavy-rain'
  | 'thunderstorm'
  | 'snowy'
  | 'foggy'
  | 'windy'
  | 'clear-night'
  | 'partly-cloudy-night'
  | 'hail'
  | 'sleet';

export interface HourlyData {
  time: string;
  temp: number;
  condition: WeatherCondition;
  precipitation: number;
}

export interface DailyData {
  day: string;
  shortDay: string;
  condition: WeatherCondition;
  conditionText: string;
  high: number;
  low: number;
  precipitation: number;
  hourly?: HourlyData[];
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  condition: WeatherCondition;
  conditionText: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  windDeg: number;
  uvIndex: number;
  visibility: number;
  pressure: number;
  dewPoint: number;
  sunrise: string;
  sunset: string;
  isNight: boolean;
  aqi: number;
  aqiLabel: string;
  pm25?: number;
  precipitation24h: number;
  alert?: {
    title: string;
    description: string;
  };
}

export interface MoonData {
  phase: string;
  illumination: number;
  moonrise: string;
  moonset: string;
}

export interface WeatherData {
  location: string;
  country: string;
  date: string;
  current: CurrentWeather;
  hourly: HourlyData[];
  daily: DailyData[];
  moon: MoonData;
}

export type TempUnit = 'C' | 'F';
