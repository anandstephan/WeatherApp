import { WeatherModel } from '../models/WeatherModel';

const API_KEY = 'F5DK3Y5XQYVRULWVYJMME5ACG'; // 🔑 Replace with your actual API key

export const WeatherService = {
  async fetchWeather(city: string): Promise<WeatherModel> {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${API_KEY}&contentType=json`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('City not found');
    }

    const data = await response.json();
    const today = data.days[0];

    return {
      city: data.resolvedAddress,
      temp: today.temp,
      humidity: today.humidity,
      windSpeed: today.windspeed,
      condition: today.conditions,
    };
  },
};
