'use client';

import { useState, useEffect } from 'react';
import { Line, Bar,Pie } from 'react-chartjs-2';
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


interface Location {
  name: string;
  iso2: string;
}

interface Weather {
  main: {
    temp: number;
    humidity: number;
  };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
}

interface DayData {
  date: Date;
  tempMax: number;
  tempMin: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

export default function WeatherPage() {
  const [countries, setCountries] = useState<Location[]>([]);
  const [states, setStates] = useState<Location[]>([]);
  const [cities, setCities] = useState<Location[]>([]);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [countrySearch, setCountrySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  const [weatherData, setWeatherData] = useState<Weather | null>(null);
  const [forecastData, setForecastData] = useState<DayData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [showWeather, setShowWeather] = useState(false);
  const handleShowWeather = () => {
    setShowWeather(true);
  };

  const WEATHER_API_KEY = 'edc1b6ac7beb8cc8b6fc14e2351a28d2';
  const CITY_API_KEY = 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==';
  const CITY_API_URL = 'https://api.countrystatecity.in/v1';

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${CITY_API_URL}/countries`, {
          headers: { 'X-CSCAPI-KEY': CITY_API_KEY },
        });
        if (!response.ok) throw new Error('Failed to fetch countries');
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setError('Failed to load countries');
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (!selectedCountry) {
      setStates([]);
      setSelectedState('');
      setCities([]);
      setSelectedCity('');
      return;
    }

    const fetchStates = async () => {
      try {
        const response = await fetch(
          `${CITY_API_URL}/countries/${selectedCountry}/states`,
          { headers: { 'X-CSCAPI-KEY': CITY_API_KEY } }
        );
        if (!response.ok) throw new Error('Failed to fetch states');
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error('Error fetching states:', error);
        setError('Failed to load states');
      }
    };

    fetchStates();
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedCountry || !selectedState) {
      setCities([]);
      setSelectedCity('');
      return;
    }

    const fetchCities = async () => {
      try {
        const response = await fetch(
          `${CITY_API_URL}/countries/${selectedCountry}/states/${selectedState}/cities`,
          { headers: { 'X-CSCAPI-KEY': CITY_API_KEY } }
        );
        if (!response.ok) throw new Error('Failed to fetch cities');
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setError('Failed to load cities');
      }
    };

    fetchCities();
  }, [selectedCountry, selectedState]);

  useEffect(() => {
    if (!selectedCity) return;

    const fetchWeatherData = async () => {
      setIsLoading(true);
      setError('');

      try {
        const currentResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${WEATHER_API_KEY}&units=metric`
        );

        if (!currentResponse.ok) throw new Error('Failed to fetch weather data');
        const currentData = await currentResponse.json();
        setWeatherData(currentData);

        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity},${selectedState},${selectedCountry}&appid=${WEATHER_API_KEY}&units=metric`
        );

        if (!forecastResponse.ok) throw new Error('Failed to fetch forecast data');
        const forecastData = await forecastResponse.json();

        const processedData: DayData[] = [];
        let currentDate = '';

        forecastData.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000).toDateString();
          if (date !== currentDate && processedData.length < 5) {
            currentDate = date;
            processedData.push({
              date: new Date(item.dt * 1000),
              tempMax: item.main.temp_max,
              tempMin: item.main.temp_min,
              humidity: item.main.humidity,
              windSpeed: item.wind.speed,
              description: item.weather[0].description,
              icon: item.weather[0].icon,
            });
          }
        });

        setForecastData(processedData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError('Failed to fetch weather data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherData();
  }, [selectedCity, selectedState, selectedCountry]);

  const renderLocationSelector = (
    type: 'country' | 'state' | 'city',
    data: Location[],
    searchValue: string,
    setSearchValue: (value: string) => void,
    selectedValue: string,
    setSelectedValue: (value: string) => void,
    isDisabled: boolean
  ) => (
    <div className="relative">
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={`Search ${type}...`}
        disabled={isDisabled}
        className="w-full p-2 border rounded-md disabled:bg-gray-100"
      />
      {searchValue && !selectedValue && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {data
            .filter((item) =>
              item.name.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((item) => (
              <div
                key={item.iso2} // Using `iso2` as the unique key for country/state
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedValue(item.iso2);
                  setSearchValue(item.name);
                }}
              >
                {item.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );

  const renderCitySelector = () => (
    <div className="relative">
      <input
        type="text"
        value={citySearch}
        onChange={(e) => setCitySearch(e.target.value)}
        placeholder="Search cities..."
        className="w-full p-2 border rounded-md"
      />
      {citySearch && !selectedCity && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {cities
            .filter((item) =>
              item.name.toLowerCase().includes(citySearch.toLowerCase())
            )
            .map((item) => (
              <div
                key={`${item.name}-${selectedState}-${selectedCountry}`} // Unique key by combining name, state, and country
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedCity(item.name);
                  setCitySearch(item.name);
                }}
              >
                {item.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
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
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">Weather Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {renderLocationSelector(
              'country',
              countries,
              countrySearch,
              setCountrySearch,
              selectedCountry,
              setSelectedCountry,
              false
            )}

            {renderLocationSelector(
              'state',
              states,
              stateSearch,
              setStateSearch,
              selectedState,
              setSelectedState,
              !selectedCountry
            )}

            {renderCitySelector()} {/* Fixed city selector */}
          </div>
        </div>

        {isLoading && (
          <div className="text-center p-4">
            <div className="text-lg text-gray-600">Loading weather data...</div>
          </div>
        )}

        {error && (
          <div className="text-center p-4 bg-red-50 text-red-500 rounded-lg">
            {error}
          </div>
        )}

        {weatherData && !isLoading && (
          <div className="space-y-6">
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

            {forecastData.length > 0 && (
  <div className="space-y-8">
    {/* First Row: Line and Bar Chart */}
    {/* Second Row: 5-Day Forecast and Pie Chart */}
    <div className="grid grid-cols-1 gap-2">
      {/* 5-Day Forecast Section */}
      <div className="bg-gray-50 p-1 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-2 text-center">5-Day Forecast</h3>
        <div className="flex flex-wrap justify-between gap-2">
          {forecastData.slice(0, 5).map((day, index) => (
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
          <div className="w-100 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:scale-105 transform transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4 text-center">Wind Speed Distribution</h3>
            <div className="h-80">
              <Pie data={pieData} />
            </div>
          </div>
        </div>
      </div>

      {/* Pie Chart Section */}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Temperature Forecast</h3>
        <div className="h-80">
          <Line options={chartOptions} data={temperatureData} />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Humidity Forecast</h3>
        <div className="h-80">
          <Bar options={chartOptions} data={humidityData} />
        </div>
      </div>
    </div>

    
  </div>
)}
          </div>
        )}
      </div>
    </div>
  );
}
