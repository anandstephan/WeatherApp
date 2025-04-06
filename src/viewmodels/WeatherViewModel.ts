import { WeatherModel } from '../models/WeatherModel';
import { WeatherService } from '../services/WeatherService';
import { Storage } from '../utils/Storage';

export class WeatherViewModel {
  async getWeather(city: string): Promise<WeatherModel> {
    const data = await WeatherService.fetchWeather(city);
    await Storage.save(data);
    return data;
  }

  async getLastCachedWeather(): Promise<WeatherModel | null> {
    return await Storage.load();
  }
}
