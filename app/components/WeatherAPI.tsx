
import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
);

interface City {
  name: string;
  sys: { country: string };
  state?: string;
}

interface WeatherData {
  main: { temp: number; humidity: number };
  weather: [{ description: string; icon: string }];
  wind: { speed: number };
}

interface ForecastData {
  date: Date;
  tempMax: number;
  tempMin: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

interface CitySearchProps {
  isDarkMode: boolean;
}

const CitySearch: React.FC<CitySearchProps> = ({ isDarkMode }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleShowWeather = async () => {
    if (!selectedCity) return;

    setIsLoading(true);

    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=edc1b6ac7beb8cc8b6fc14e2351a28d2&units=metric`
      );
      const weather = await weatherResponse.json();
      setWeatherData(weather);

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=edc1b6ac7beb8cc8b6fc14e2351a28d2&units=metric`
      );
      const forecast = await forecastResponse.json();

      const forecastList = forecast.list.slice(0, 5).map((item: any) => ({
        date: new Date(item.dt * 1000),
        tempMax: item.main.temp_max,
        tempMin: item.main.temp_min,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      }));

      setForecastData(forecastList);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (query.length > 2) {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/find?q=${query}&limit=5&appid=edc1b6ac7beb8cc8b6fc14e2351a28d2`
          );
          const data = await response.json();

          setSuggestions(
            data.list.map((city: City) => {
              const cityName = city.name;
              const stateName = city.state ? `${city.state}, ` : '';
              const countryName = city.sys.country;
              return `${cityName}, ${stateName}${countryName}`;
            })
          );
        } catch (error) {
          console.error('Error fetching data:', error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchData();
  }, [query]);

    const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        responsive: true
      },
    },
  };
  
  const temperatureData = {
    labels: forecastData.map((day) => day.date.toLocaleDateString()),
    datasets: [
      {
        label: 'Max Temperature (°C)',
        data: forecastData.map((day) => day.tempMax),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Min Temperature (°C)',
        data: forecastData.map((day) => day.tempMin),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const humidityData = {
    labels: forecastData.map((day) => day.date.toLocaleDateString()),
    datasets: [
      {
        label: 'Humidity (%)',
        data: forecastData.map((day) => day.humidity),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };
    const pieData = {
    labels: forecastData.map((day) => day.date.toDateString()),
    datasets: [
      {
        label: 'Wind Speed (m/s)',
        data: forecastData.map((day) => day.windSpeed),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };


  return (
    <div className={`relative w-full max-w-none mx-0 p-4 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
      }`}>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search for a city"
          value={query}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          }`}
        />
        <button
          onClick={handleShowWeather}
          className={`px-4 py-2 rounded-lg ${
            isDarkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white'
          }`}
        >
          Show
        </button>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <ul
          className={`absolute w-full mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                setSelectedCity(suggestion);
                setQuery(suggestion);
                setSuggestions([]);
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      {/* Display Weather Data */}
      {weatherData && !isLoading && (
        <div className={`space-y-6 mt-6 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
      }`}>
          <div className="bg-sky-500 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Current Weather</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold">{Math.round(weatherData.main.temp)}°C</p>
                <p className="text-gray-600">{weatherData.weather[0].description}</p>
                <p className="mt-2">Humidity: {weatherData.main.humidity}%</p>
                <p>Wind: {weatherData.wind.speed} m/s</p>
              </div>
              <img
                src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt="Weather icon"
                className="w-24 h-24"
              />
            </div>
          </div>

          {/* 5-Day Forecast */}
          {forecastData.length > 0 && (
            <div className="space-y-8">
              <div className={`p-1 rounded-lg shadow-lg ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
      }`}>
                <h3 className="text-lg font-semibold mb-2 text-center">5-Day Forecast</h3>
                <div className={`flex flex-wrap justify-between gap-2 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
      }`}>
                  {forecastData.map((day, index) => (
                    <div
                      key={index}
                      className="w-40 bg-sky-200 border border-gray-200 rounded-lg shadow-md overflow-hidden hover:scale-105 transform transition-all duration-300"
                    >
                      <div className="p-2 text-center">
                        <p className="text-lg font-semibold text-gray-700 mb-2">
                          {day.date.toDateString()}
                        </p>
                        <img
                          src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                          alt="Weather Icon"
                          className="mx-auto mb-4 w-20 h-20"
                        />
                        <p className="text-sm text-gray-600">
                          <strong>Max Temp:</strong> {day.tempMax}°C
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Min Temp:</strong> {day.tempMin}°C
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Humidity:</strong> {day.humidity}%
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Wind Speed:</strong> {day.windSpeed} m/s
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Description:</strong> {day.description}
                        </p>
                      </div>
                    </div>
                  ))}
                    <div className={`w-100  border border-gray-200 rounded-lg shadow-md overflow-hidden hover:scale-105 transform transition-all duration-300 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
      }`}
                    >
                        <h3 className="text-lg font-semibold mb-4 text-center">Wind Speed Distribution</h3>
                        <div className={`h-80 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
      }`}>
                         <Pie data={pieData} />
                        </div>
                    </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`rounded-lg shadow-lg p-6`}>
                  <h3 className="text-lg font-semibold mb-4 text-center">Temperature Forecast</h3>
                   <div className={`h-80 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
      }`}>
                     <Line options={chartOptions} data={temperatureData} />
                   </div>
                </div>
                <div className={`rounded-lg shadow-lg p-6${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
      }`}>
                    <h3 className="text-lg font-semibold mb-4 text-center">Humidity Forecast</h3>
                    <div className={`h-80 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
      }`}>
                    <Bar options={chartOptions } data={humidityData} />
                </div>
                </div>
            </div>
        </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CitySearch;

