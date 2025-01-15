'use client';

import { useState } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  TimeScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, BarElement, TimeScale, Tooltip, Legend);

interface StockDashboardProps {
  isDarkMode: boolean;
}

const StockDashboard: React.FC<StockDashboardProps> = ({ isDarkMode }) => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [lineChartData, setLineChartData] = useState<any>(null);
  const [barChartData, setBarChartData] = useState<any>(null);
  const [keyMetrics, setKeyMetrics] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('1d'); // Default time range

  const fetchStockData = async (symbol: string, range: string) => {
    const STOCK_API_KEY = '2S5XVTL0BDH3VAC1'; // Replace with your valid API key
    let functionType = 'TIME_SERIES_INTRADAY';
    let interval = '5min';

    if (range === '1w' || range === '1m' || range === '1y') {
      functionType =
        range === '1w' ? 'TIME_SERIES_DAILY' : range === '1m' ? 'TIME_SERIES_WEEKLY' : 'TIME_SERIES_MONTHLY';
      interval = '';
    }

    const url = `https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&${interval && `interval=${interval}&`}apikey=${STOCK_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      let timeSeriesKey = '';
      if (range === '1d') timeSeriesKey = 'Time Series (5min)';
      else if (range === '1w' || range === '1m') timeSeriesKey = 'Time Series (Daily)';
      else if (range === '1y') timeSeriesKey = 'Monthly Time Series';

      if (data[timeSeriesKey]) {
        const timeSeries = data[timeSeriesKey];
        const labels = Object.keys(timeSeries).sort();
        const prices = labels.map((time) => parseFloat(timeSeries[time]['4. close']));
        const volumes = labels.map((time) => parseFloat(timeSeries[time]['5. volume'] || 0));

        setLineChartData({
          labels,
          datasets: [
            {
              label: `${symbol} Stock Price`,
              data: prices,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
            },
          ],
        });

        setBarChartData({
          labels,
          datasets: [
            {
              label: `${symbol} Volume`,
              data: volumes,
              backgroundColor: 'rgba(153, 102, 255, 0.6)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          ],
        });

        const latestTime = labels[labels.length - 1];
        setKeyMetrics({
          symbol,
          currentPrice: timeSeries[latestTime]['4. close'],
          high: timeSeries[latestTime]['2. high'],
          low: timeSeries[latestTime]['3. low'],
          volume: timeSeries[latestTime]['5. volume'] || 0,
        });
      } else {
        console.log(data);
        alert('Invalid symbol or data unavailable');
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const STOCK_API_KEY = process.env.NEXT_PUBLIC_STOCK_API_KEY; 
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${STOCK_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.bestMatches) {
        setSuggestions(
          data.bestMatches.map((match: any) => match['1. symbol'])
        );
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSearch = (symbol: string) => {
    setSearch(symbol);
    setSuggestions([]);
    fetchStockData(symbol, timeRange);
  };

  return (
    <div
      className={`min-h-screen p-6 max-w-4xl mx-auto ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
      }`}
    >
      <h1 className="text-3xl font-bold mb-6">Stock Dashboard</h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search stock symbol..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          className={`p-3 rounded-lg w-full md:w-1/2 ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          }`}
        />
        <select
          id="timeRange"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className={`p-2 rounded-lg ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          }`}
        >
          <option value="1d">1 Day</option>
          <option value="1w">1 Week</option>
          <option value="1m">1 Month</option>
          <option value="1y">1 Year</option>
        </select>
        <button
          onClick={() => fetchStockData(search, timeRange)}
          className={`px-4 py-2 rounded-lg ${
            isDarkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white'
          }`}
        >
          Apply
        </button>
      </div>

      {keyMetrics && (
        <div className="mb-6 grid grid-cols-2 gap-4">
          {Object.entries(keyMetrics).map(([key, value]) => (
            <div
              key={key}
              className={`p-4 rounded-lg shadow-md ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
              }`}
            >
              <h2 className="font-bold capitalize">{key}</h2>
              <p>{String(value)}</p>
            </div>
          ))}
        </div>
      )}

      {lineChartData && (
        <div className="mb-6">
          <Line data={lineChartData} options={{ responsive: true }} />
        </div>
      )}

      {barChartData && (
        <div>
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              plugins: { legend: { position: 'top' } },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default StockDashboard;
