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
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/50 transform hover:-translate-y-1 transition-transform duration-300">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Main Weather Info */}
          <div className="flex items-center gap-6 w-full md:w-auto justify-center md:justify-start">
            <div className="p-4 bg-blue-50 rounded-2xl shadow-inner">
              {loading ? (
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              ) : (
                weather ? getWeatherIcon(weather.weatherCode) : <Sun className="w-10 h-10 text-yellow-500" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Thời tiết Vũng Tàu</h3>
              <div className="flex items-baseline gap-3">
                {loading ? (
                  <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <>
                    <span className="text-4xl font-black text-gray-900">
                      {weather ? Math.round(weather.temperature) : "--"}°
                    </span>
                    <span className="text-lg text-gray-600 font-medium">
                      {weather ? getWeatherDescription(weather.weatherCode) : "--"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
          <div className="md:hidden w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* Details */}
          <div className="grid grid-cols-3 gap-8 w-full md:w-auto">
            <div className="text-center group">
              <div className="flex items-center justify-center gap-2 text-gray-400 mb-2 group-hover:text-blue-500 transition-colors">
                <Droplets className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Độ ẩm</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                {loading ? "..." : (weather ? `${weather.humidity}%` : "--")}
              </span>
            </div>
            <div className="text-center group">
              <div className="flex items-center justify-center gap-2 text-gray-400 mb-2 group-hover:text-blue-500 transition-colors">
                <Wind className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Gió</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                {loading ? "..." : (weather ? `${weather.windSpeed} km/h` : "--")}
              </span>
            </div>
            <div className="text-center group">
              <div className="flex items-center justify-center gap-2 text-gray-400 mb-2 group-hover:text-blue-500 transition-colors">
                <Thermometer className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Cảm giác</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                {loading ? "..." : (weather ? `${Math.round(weather.temperature + 2)}°` : "--")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}