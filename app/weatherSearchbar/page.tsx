"use client";

import { useState, useEffect } from "react";

const Home = () => {
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [searchState, setSearchState] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const API_KEY = "NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==";
  const API_URL = "https://api.countrystatecity.in/v1";

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${API_URL}/countries`, {
          headers: { "X-CSCAPI-KEY": API_KEY },
        });
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;

    const fetchStates = async () => {
      setLoadingStates(true);
      setStates([]);
      setCities([]);
      setSelectedState("");
      setSelectedCity("");
      try {
        const response = await fetch(
          `${API_URL}/countries/${selectedCountry}/states`,
          { headers: { "X-CSCAPI-KEY": API_KEY } }
        );
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error("Error fetching states:", error);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedState) return;

    const fetchCities = async () => {
      setLoadingCities(true);
      setCities([]);
      setSelectedCity("");
      try {
        const response = await fetch(
          `${API_URL}/countries/${selectedCountry}/states/${selectedState}/cities`,
          { headers: { "X-CSCAPI-KEY": API_KEY } }
        );
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [selectedState]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Country, State, and City Selector</h1>

      <div className="flex space-x-4">
        {/* Country Input with Dropdown */}
        <div className="flex-1">
          <label htmlFor="country" className="block text-gray-700">Country:</label>
          <div className="relative">
            <input
              id="country"
              type="text"
              value={searchCountry}
              onChange={(e) => setSearchCountry(e.target.value)}
              onFocus={() => setSearchCountry("")} // Clear input field when focused
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Start typing a country"
            />
            {searchCountry && !selectedCountry && (
              <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {countries
                  .filter(country => country.name.toLowerCase().includes(searchCountry.toLowerCase()))
                  .map(country => (
                    <div
                      key={country.iso2}
                      onClick={() => {
                        setSelectedCountry(country.iso2);
                        setSearchCountry(country.name);
                      }}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    >
                      {country.name}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* State Input with Dropdown */}
        {selectedCountry && (
          <div className="flex-1">
            <label htmlFor="state" className="block text-gray-700">State:</label>
            <div className="relative">
              <input
                id="state"
                type="text"
                value={searchState}
                onChange={(e) => setSearchState(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Start typing a state"
              />
              {searchState && !selectedState && (
                <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  {states
                    .filter(state => state.name.toLowerCase().includes(searchState.toLowerCase()))
                    .map(state => (
                      <div
                        key={state.iso2}
                        onClick={() => {
                          setSelectedState(state.iso2);
                          setSearchState(state.name);
                        }}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {state.name}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* City Input with Dropdown */}
        {selectedState && (
          <div className="flex-1">
            <label htmlFor="city" className="block text-gray-700">City:</label>
            <div className="relative">
              <input
                id="city"
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Start typing a city"
              />
              {searchCity && !selectedCity && (
                <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  {cities
                    .filter(city => city.name.toLowerCase().includes(searchCity.toLowerCase()))
                    .map(city => (
                      <div
                        key={city.name}
                        onClick={() => {
                          setSelectedCity(city.name);
                          setSearchCity(city.name);
                        }}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {city.name}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected Values */}
      <div className="mt-6">
        <h2>Selected Values:</h2>
        <p>Country: {selectedCountry}</p>
        <p>State: {selectedState}</p>
        <p>City: {selectedCity}</p>
      </div>
    </div>
  );
};

export default Home;
