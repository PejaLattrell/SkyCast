import WeeklyOverview from '@/sections/WeeklyOverview';
import TemperatureTrendChart from '@/sections/TemperatureTrendChart';
import PrecipitationForecast from '@/sections/PrecipitationForecast';
import WindUvPanel from '@/sections/WindUvPanel';
import MoonPhase from '@/sections/MoonPhase';

export default function Forecast() {
  return (
    <main className="pt-16">
      <WeeklyOverview />
      <TemperatureTrendChart />
      <PrecipitationForecast />
      <WindUvPanel />
      <MoonPhase />
    </main>
  );
}
