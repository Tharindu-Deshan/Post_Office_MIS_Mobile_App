import { GOOGLE_MAPS_API_KEY } from '@env';

describe('Google Maps API Key Test', () => {
  it('should load correct Google Maps API Key from environment variables', () => {
    expect(GOOGLE_MAPS_API_KEY).toBe('AIzaSyCd_5naVx6MeeUG3SmBohA04jzOvmAIDgo');
  });
});
