import cron from 'node-cron';
import { Intention } from '../models/models.js';
import { getForecast } from '../utils/weatherHelper.js';
import { sendNotification } from '../utils/notificationHelper.js';

export const initWeatherJob = () => {
  cron.schedule(
    '0 6 * * *',
    async () => {
      console.log('[WeatherJob] Starting daily check...');

      const startWindow = new Date();
      startWindow.setDate(startWindow.getDate() + 1);
      startWindow.setHours(0, 0, 0, 0);

      const endWindow = new Date();
      endWindow.setDate(endWindow.getDate() + 3);
      endWindow.setHours(23, 59, 59, 999);

      try {
        const upcomingIntentions = await Intention.find({
          intentionDate: { $gte: startWindow, $lte: endWindow },
        }).populate('bivouac');

        console.log(
          `[WeatherJob] Checking ${upcomingIntentions.length} intentions between ${startWindow.toISOString()} and ${endWindow.toISOString()}`
        );

        for (const intention of upcomingIntentions) {
          const bivouac: any = intention.bivouac;

          const lat = bivouac.coords.latitude;
          const lng = bivouac.coords.longitude;

          const weather = await getForecast(lat, lng, intention.intentionDate);

          if (weather) {
            const message = `Forecast for ${bivouac.name} on ${intention.intentionDate.toISOString().split('T')[0]}: ${weather.description}, Min Temp: ${weather.minTemp}°C, Max Temp: ${weather.maxTemp}°C.\n
                    Precipitation: ${weather.precipitationSum}mm over ${weather.precipitationHours} hours. Max Wind Speed: ${weather.maxWindSpeed} km/h.\n
                    Sunrise: ${new Date(weather.sunrise).toLocaleTimeString()}, Sunset: ${new Date(weather.sunset).toLocaleTimeString()}.`;

            await sendNotification(
              intention.user.toString(),
              'weather_alert',
              'info',
              'Weather Forecast',
              message
            );
          }
        }
      } catch (error) {
        console.error('[WeatherJob] Critical Error:', error);
      }
    },
    {
      timezone: 'Europe/Rome',
    }
  );
};
