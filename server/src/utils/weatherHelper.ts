import axios from 'axios';

interface WeatherData {
  description: string;
  minTemp: number;
  maxTemp: number;
  sunrise: string;
  sunset: string;
  precipitationSum: number;
  precipitationHours: number;
  maxPrecipitationProbability: number;
  maxWindSpeed: number;
  code: number;
}

const getWeatherDescription = (code: number): string => {
  const codes: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };

  if (code === null || code === undefined) return 'Variable weather';
  return codes[code] || 'Variable weather';
};

export const getForecast = async (
  lat: number,
  lng: number,
  date: Date
): Promise<WeatherData | null> => {
  try {
    const dateStr = date.toISOString().split('T')[0];
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_hours,wind_speed_10m_max,precipitation_sum,precipitation_probability_max&timezone=auto&start_date=${dateStr}&end_date=${dateStr}`;

    const response = await axios.get(url);
    const daily = response.data.daily;

    if (
      !daily ||
      daily.weathercode === undefined ||
      daily.weathercode[0] === null
    ) {
      console.warn(`Weather API returned null data for date: ${dateStr}`);
      return null;
    }

    return {
      description: getWeatherDescription(daily.weathercode[0]),
      minTemp: daily.temperature_2m_min[0],
      maxTemp: daily.temperature_2m_max[0],
      sunrise: daily.sunrise[0],
      sunset: daily.sunset[0],
      precipitationSum: daily.precipitation_sum[0],
      precipitationHours: daily.precipitation_hours[0],
      maxPrecipitationProbability: daily.precipitation_probability_max
        ? daily.precipitation_probability_max[0]
        : 0,
      maxWindSpeed: daily.wind_speed_10m_max[0],
      code: daily.weathercode[0],
    };
  } catch (error) {
    console.error('Weather API Helper Error:', error);
    return null;
  }
};
