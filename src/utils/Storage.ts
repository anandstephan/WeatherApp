import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherModel } from '../models/WeatherModel';

const STORAGE_KEY = '@last_weather_data';

export const Storage = {
  async save(data: WeatherModel): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  async load(): Promise<WeatherModel | null> {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : null;
  },
};
