import { useState, useMemo, useRef } from 'react';
import { useWeatherStore } from '@/store/useWeatherStore';

export default function TemperatureTrendChart() {
  const { weatherData, unit } = useWeatherStore();
  const [hoveredPoint, setHoveredPoint] = useState<{ day: string; temp: number; x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const daily = weatherData.daily;
  const padding = { top: 20, right: 20, bottom: 40, left: 10 };
  const width = 900;
  const height = 260;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const allTemps = useMemo(() => {
    const highs = daily.map((d) => (unit === 'F' ? Math.round((d.high * 9) / 5 + 32) : d.high));
    const lows = daily.map((d) => (unit === 'F' ? Math.round((d.low * 9) / 5 + 32) : d.low));
    return { highs, lows, min: Math.min(...lows) - 2, max: Math.max(...highs) + 2 };
  }, [daily, unit]);

  const scaleY = (temp: number) => padding.top + chartH - ((temp - allTemps.min) / (allTemps.max - allTemps.min)) * chartH;
  const scaleX = (i: number) => padding.left + (i / (daily.length - 1)) * chartW;

  const makeSmoothPath = (temps: number[]) => {
    const points = temps.map((t, i) => [scaleX(i), scaleY(t)]);
    if (points.length < 2) return '';
    let d = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cp1x = p0[0] + (p1[0] - p0[0]) * 0.4;
      const cp1y = p0[1];
      const cp2x = p1[0] - (p1[0] - p0[0]) * 0.4;
      const cp2y = p1[1];
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1[0]} ${p1[1]}`;
    }
    return d;
  };

  const highPath = makeSmoothPath(allTemps.highs);
  const lowPath = makeSmoothPath(allTemps.lows);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const svgMouseX = (mouseX / rect.width) * width;

    let closestIndex = 0;
    let closestDist = Infinity;
    for (let i = 0; i < daily.length; i++) {
      const dist = Math.abs(scaleX(i) - svgMouseX);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    }

    if (closestDist < chartW / daily.length / 2) {
      const isHigh = Math.abs(scaleY(allTemps.highs[closestIndex]) - (e.clientY - rect.top) / rect.height * height) <
        Math.abs(scaleY(allTemps.lows[closestIndex]) - (e.clientY - rect.top) / rect.height * height);
      const temp = isHigh ? allTemps.highs[closestIndex] : allTemps.lows[closestIndex];
      setHoveredPoint({
        day: daily[closestIndex].shortDay,
        temp,
        x: scaleX(closestIndex),
        y: scaleY(temp),
      });
    } else {
      setHoveredPoint(null);
    }
  };

  return (
    <section className="bg-cream py-12 px-6">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-heading-medium text-charcoal mb-6">Temperature Trend</h2>
        <div className="glass-panel !p-4 md:!p-8">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-[200px] md:h-[300px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
              <line
                key={frac}
                x1={padding.left}
                y1={padding.top + chartH * frac}
                x2={width - padding.right}
                y2={padding.top + chartH * frac}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
              />
            ))}

            {/* Area fills */}
            <defs>
              <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C4957A" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#C4957A" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="lowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C49B8E" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#C49B8E" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {highPath && (
              <>
                <path d={`${highPath} L ${scaleX(daily.length - 1)} ${padding.top + chartH} L ${padding.left} ${padding.top + chartH} Z`} fill="url(#highGrad)" />
                <path d={highPath} fill="none" stroke="#C4957A" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
            {lowPath && (
              <>
                <path d={`${lowPath} L ${scaleX(daily.length - 1)} ${padding.top + chartH} L ${padding.left} ${padding.top + chartH} Z`} fill="url(#lowGrad)" />
                <path d={lowPath} fill="none" stroke="#C49B8E" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4" />
              </>
            )}

            {/* Data points */}
            {allTemps.highs.map((t, i) => (
              <circle key={`h${i}`} cx={scaleX(i)} cy={scaleY(t)} r="5" fill="rgba(255,255,255,0.8)" stroke="#C4957A" strokeWidth="2" />
            ))}
            {allTemps.lows.map((t, i) => (
              <circle key={`l${i}`} cx={scaleX(i)} cy={scaleY(t)} r="5" fill="rgba(255,255,255,0.8)" stroke="#C49B8E" strokeWidth="2" />
            ))}

            {/* X-axis labels */}
            {daily.map((d, i) => (
              <text key={d.shortDay} x={scaleX(i)} y={height - 10} textAnchor="middle" className="text-[10px]" fill="#A09A93" style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                {d.shortDay}
              </text>
            ))}

            {/* Hover tooltip */}
            {hoveredPoint && (
              <g>
                <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="7" fill="#C4957A" opacity="0.3" />
                <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="4" fill="#C4957A" />
                <rect x={hoveredPoint.x - 30} y={hoveredPoint.y - 36} width="60" height="26" rx="8" fill="rgba(255,255,255,0.9)" />
                <text x={hoveredPoint.x} y={hoveredPoint.y - 18} textAnchor="middle" fill="#2C2824" style={{ fontSize: '12px', fontWeight: 500 }}>
                  {hoveredPoint.day}: {hoveredPoint.temp}°
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>
    </section>
  );
}
