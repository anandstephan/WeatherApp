import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { WeatherViewModel } from '../viewmodels/WeatherViewModel';
import { WeatherModel } from '../models/WeatherModel';

const MainScreen = () => {
  const viewModel = new WeatherViewModel();

  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherModel | null>(null);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false); // 🔄 Manual dark mode toggle

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
    }, 1000);
  };

  const onRefresh = async () => {
    if (!city) return;
    setRefreshing(true);
    try {
      await fetchWeather(city);
    } finally {
      setRefreshing(false);
    }
  };

  const loadCachedData = async () => {
    const cached = await viewModel.getLastCachedWeather();
    if (cached) {
      setWeatherData(cached);
    }
  };

  useEffect(() => {
    loadCachedData();
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  return (
    <ScrollView
      contentContainerStyle={[styles.container, themeStyles.container]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={isDarkMode ? '#fff' : '#000'}
        />
      }
    >
      <Text style={[styles.title, themeStyles.text]}>Weather App</Text>
      <TextInput
        placeholder="Enter city name"
        placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
        value={city}
        onChangeText={handleCityChange}
        style={[styles.input, themeStyles.input]}
      />
      <Button title="Search" onPress={() => fetchWeather(city)} />

      <View style={{ marginVertical: 10 }}>
        <Button
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          onPress={() => setIsDarkMode(prev => !prev)}
        />
      </View>

      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
      {error !== '' && <Text style={[styles.error, themeStyles.text]}>{error}</Text>}

      {weatherData && (
        <View style={[styles.card, themeStyles.card]}>
          <Text style={[styles.city, themeStyles.text]}>{weatherData.city}</Text>
          <Text style={themeStyles.text}>Temperature: {weatherData.temp}°C</Text>
          <Text style={themeStyles.text}>Humidity: {weatherData.humidity}%</Text>
          <Text style={themeStyles.text}>Wind Speed: {weatherData.windSpeed} km/h</Text>
          <Text style={themeStyles.text}>Condition: {weatherData.condition}</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  card: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
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

const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  text: {
    color: '#000',
  },
  input: {
    borderColor: '#aaa',
    backgroundColor: '#fff',
    color: '#000',
  },
  card: {
    backgroundColor: '#f2f2f2',
  },
});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
  },
  text: {
    color: '#fff',
  },
  input: {
    borderColor: '#555',
    backgroundColor: '#1e1e1e',
    color: '#fff',
  },
  card: {
    backgroundColor: '#2a2a2a',
  },
});
