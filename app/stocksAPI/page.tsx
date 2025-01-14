"use client";

import { useState } from 'react';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, BarElement, TimeScale, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, BarElement, TimeScale, Tooltip, Legend);

const StockDashboard = () => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [lineChartData, setLineChartData] = useState<any>(null);
  const [barChartData, setBarChartData] = useState<any>(null);
  const [keyMetrics, setKeyMetrics] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('1d'); // Default time range

  const fetchStockData = async (symbol: string, range: string) => {
    const API_KEY = '2S5XVTL0BDH3VAC1'; // Replace with your valid API key
    let functionType = 'TIME_SERIES_INTRADAY';
    let interval = '5min';

    if (range === '1w' || range === '1m' || range === '1y') {
      functionType = range === '1w' ? 'TIME_SERIES_DAILY' : range === '1m' ? 'TIME_SERIES_WEEKLY' : 'TIME_SERIES_MONTHLY';
      interval = '';
    }

    const url = `https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&${interval && `interval=${interval}&`}apikey=${API_KEY}`;

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

    const API_KEY = '2S5XVTL0BDH3VAC1'; // Replace with your valid API key
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`;

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
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Stock Dashboard</h1>
      <div>
        <input
          type="text"
          placeholder="Search stock symbol..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
        />
        {suggestions.length > 0 && (
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0, border: '1px solid #ccc' }}>
            {suggestions.map((suggestion) => (
              <li
                key={suggestion}
                onClick={() => handleSearch(suggestion)}
                style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="timeRange">Select Time Range: </label>
        <select
          id="timeRange"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          style={{ padding: '5px', marginLeft: '10px' }}
        >
          <option value="1d">1 Day</option>
          <option value="1w">1 Week</option>
          <option value="1m">1 Month</option>
          <option value="1y">1 Year</option>
        </select>
        <button
          onClick={() => fetchStockData(search, timeRange)}
          style={{ marginLeft: '10px', padding: '5px 10px' }}
        >
          Apply
        </button>
      </div>

      {keyMetrics && (
        <div style={{ marginBottom: '20px' }}>
          <h2>{keyMetrics.symbol} Metrics</h2>
          <p>Current Price: ${keyMetrics.currentPrice}</p>
          <p>High: ${keyMetrics.high}</p>
          <p>Low: ${keyMetrics.low}</p>
          <p>Volume: {keyMetrics.volume}</p>
        </div>
      )}
      {lineChartData && (
        <div style={{ marginBottom: '20px' }}>
          <Line data={lineChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
      )}
      {barChartData && (
        <div>
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              plugins: { legend: { position: 'top' } },
              scales: {
                x: { type: 'category' },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default StockDashboard;
