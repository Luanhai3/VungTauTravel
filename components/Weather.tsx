"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer, CloudLightning, CloudSnow, CloudFog } from "lucide-react";

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
}

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Vung Tau coordinates: 10.3460° N, 107.0843° E
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=10.346&longitude=107.0843&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto"
        );
        const data = await response.json();
        setWeather({
          temperature: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          weatherCode: data.current.weather_code,
        });
      } catch (error) {
        console.error("Failed to fetch weather", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-10 h-10 text-yellow-500" />;
    if (code <= 3) return <Cloud className="w-10 h-10 text-gray-400" />;
    if (code <= 48) return <CloudFog className="w-10 h-10 text-gray-400" />;
    if (code <= 67) return <CloudRain className="w-10 h-10 text-blue-400" />;
    if (code <= 77) return <CloudSnow className="w-10 h-10 text-blue-200" />;
    if (code <= 82) return <CloudRain className="w-10 h-10 text-blue-500" />;
    if (code <= 99) return <CloudLightning className="w-10 h-10 text-purple-500" />;
    return <Sun className="w-10 h-10 text-yellow-500" />;
  };

  const getWeatherDescription = (code: number) => {
    if (code === 0) return "Trời quang đãng";
    if (code <= 3) return "Có mây";
    if (code <= 48) return "Sương mù";
    if (code <= 67) return "Mưa nhỏ";
    if (code <= 82) return "Mưa rào";
    if (code <= 99) return "Giông bão";
    return "Nắng đẹp";
  };

  return (
    <section className="relative z-20 -mt-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-12">
      <div className="bg-white/60 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-8 md:p-10 border border-white/60 transform hover:-translate-y-1 transition-transform duration-500">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Main Weather Info */}
          <div className="flex items-center gap-6 w-full md:w-auto justify-center md:justify-start">
            <div className="p-5 bg-teal-50 rounded-2xl shadow-sm text-teal-500">
              {loading ? (
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              ) : (
                weather ? getWeatherIcon(weather.weatherCode) : <Sun className="w-10 h-10 text-yellow-500" />
              )}
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Thời tiết Vũng Tàu</h3>
              <div className="flex items-baseline gap-3">
                {loading ? (
                  <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <>
                    <span className="text-5xl font-light text-slate-800 tracking-tighter">
                      {weather ? Math.round(weather.temperature) : "--"}°
                    </span>
                    <span className="text-lg text-slate-500 font-medium">
                      {weather ? getWeatherDescription(weather.weatherCode) : "--"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-16 bg-slate-200" />
          <div className="md:hidden w-full h-px bg-slate-200" />

          {/* Details */}
          <div className="grid grid-cols-3 gap-8 w-full md:w-auto">
            <div className="text-center group">
              <div className="flex items-center justify-center gap-2 text-slate-400 mb-2 group-hover:text-teal-500 transition-colors">
                <Droplets className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Độ ẩm</span>
              </div>
              <span className="text-xl font-medium text-slate-700">
                {loading ? "..." : (weather ? `${weather.humidity}%` : "--")}
              </span>
            </div>
            <div className="text-center group">
              <div className="flex items-center justify-center gap-2 text-slate-400 mb-2 group-hover:text-teal-500 transition-colors">
                <Wind className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Gió</span>
              </div>
              <span className="text-xl font-medium text-slate-700">
                {loading ? "..." : (weather ? `${weather.windSpeed} km/h` : "--")}
              </span>
            </div>
            <div className="text-center group">
              <div className="flex items-center justify-center gap-2 text-slate-400 mb-2 group-hover:text-teal-500 transition-colors">
                <Thermometer className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Cảm giác</span>
              </div>
              <span className="text-xl font-medium text-slate-700">
                {loading ? "..." : (weather ? `${Math.round(weather.temperature + 2)}°` : "--")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}