import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { WeatherViewModel } from '../viewmodels/WeatherViewModel';
import { WeatherModel } from '../models/WeatherModel';

const MainScreen = () => {
  const viewModel = new WeatherViewModel();

  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherModel | null>(null);
  const [error, setError] = useState('');

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchWeather = async (cityName: string) => {
    if (!cityName) return;
    setLoading(true);
    setError('');
    try {
      const data = await viewModel.getWeather(cityName);
      setWeatherData(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (text: string) => {
    setCity(text);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchWeather(text);
    }, 1000); // 1000ms = 1 sec debounce
  };

  const loadCachedData = async () => {
    const cached = await viewModel.getLastCachedWeather();
    if (cached) {
      setWeatherData(cached);
    }
  };

  useEffect(() => {
    loadCachedData();

    // Clean up timer on unmount
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather App</Text>
      <TextInput
        placeholder="Enter city name"
        value={city}
        onChangeText={handleCityChange}
        style={styles.input}
      />
      <Button title="Search" onPress={() => fetchWeather(city)} />

      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
      {error !== '' && <Text style={styles.error}>{error}</Text>}

      {weatherData && (
        <View style={styles.card}>
          <Text style={styles.city}>{weatherData.city}</Text>
          <Text>Temperature: {weatherData.temp}°C</Text>
          <Text>Humidity: {weatherData.humidity}%</Text>
          <Text>Wind Speed: {weatherData.windSpeed} km/h</Text>
          <Text>Condition: {weatherData.condition}</Text>
        </View>
      )}
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  card: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },
  city: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  error: {
    marginTop: 10,
    color: 'red',
  },
});
