import type {TrackingPoint} from '../../features/tracking/types';

export type WeatherCondition =
  | 'clear'
  | 'clouds'
  | 'rain'
  | 'snow'
  | 'fog'
  | 'storm'
  | 'unknown';

export type CurrentWeather = {
  temperatureC: number;
  apparentTemperatureC: number | null;
  humidityPercent: number | null;
  precipitationMm: number | null;
  windSpeedKmh: number | null;
  weatherCode: number | null;
  condition: WeatherCondition;
  conditionLabel: string;
  fetchedAt: number;
};

function mapWeatherCode(code: number | null): {
  condition: WeatherCondition;
  label: string;
} {
  if (code === null || code === undefined) {
    return {condition: 'unknown', label: 'Clima no disponible'};
  }

  if (code === 0) {
    return {condition: 'clear', label: 'Despejado'};
  }

  if ([1, 2, 3].includes(code)) {
    return {condition: 'clouds', label: 'Nublado parcial'};
  }

  if ([45, 48].includes(code)) {
    return {condition: 'fog', label: 'Niebla'};
  }

  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return {condition: 'rain', label: 'Lluvia'};
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return {condition: 'snow', label: 'Nieve'};
  }

  if ([95, 96, 99].includes(code)) {
    return {condition: 'storm', label: 'Tormenta'};
  }

  return {condition: 'unknown', label: 'Clima variable'};
}

function toNullableNumber(value: unknown): number | null {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
}

export async function getCurrentWeatherByLocation(
  location: Pick<TrackingPoint, 'latitude' | 'longitude'>,
): Promise<CurrentWeather | null> {
  const latitude = Number(location.latitude);
  const longitude = Number(location.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
    timezone: 'auto',
    temperature_unit: 'celsius',
    wind_speed_unit: 'kmh',
    precipitation_unit: 'mm',
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const current = data?.current;

  if (!current) {
    return null;
  }

  const weatherCode = toNullableNumber(current.weather_code);
  const mapped = mapWeatherCode(weatherCode);

  const temperatureC = toNullableNumber(current.temperature_2m);

  if (temperatureC === null) {
    return null;
  }

  return {
    temperatureC,
    apparentTemperatureC: toNullableNumber(current.apparent_temperature),
    humidityPercent: toNullableNumber(current.relative_humidity_2m),
    precipitationMm: toNullableNumber(current.precipitation),
    windSpeedKmh: toNullableNumber(current.wind_speed_10m),
    weatherCode,
    condition: mapped.condition,
    conditionLabel: mapped.label,
    fetchedAt: Date.now(),
  };
}