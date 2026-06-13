import { create } from 'zustand';
import type { TempUnit, WeatherData } from '@/types/weather';
import { sanFranciscoWeather } from '@/data/weatherData';
import { fetchWeather } from '@/lib/weather-api';

interface WeatherStore {
  unit: TempUnit;
  weatherData: WeatherData;
  loading: boolean;
  error: string | null;
  location: string;
  setUnit: (unit: TempUnit) => void;
  setWeatherData: (data: WeatherData) => void;
  setLoading: (loading: boolean) => void;
  setLocation: (location: string) => void;
  /** Fetch real weather data from the Python backend and update the store. */
  fetchAndSetWeather: (city: string) => Promise<void>;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  unit: 'C',
  weatherData: sanFranciscoWeather,
  loading: false,
  error: null,
  location: 'Manila',

  setUnit: (unit) => set({ unit }),
  setWeatherData: (data) => set({ weatherData: data }),
  setLoading: (loading) => set({ loading }),
  setLocation: (location) => set({ location }),

  fetchAndSetWeather: async (city: string) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchWeather(city);
      set({ weatherData: data, location: city, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch weather data';
      set({ error: message, loading: false });
    }
  },
}));
