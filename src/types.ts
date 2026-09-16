export interface Location {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

export interface GeocodingData {
  results?: Location[];
}

export interface WeatherData {
  current: {
    temperature_2m: number;
  };

  daily: {
    temperature_2m_min: number[];
    temperature_2m_max: number[];
  };
}

export interface Post {
  title: string;
}

export interface NewsData {
  posts: Post[];
}