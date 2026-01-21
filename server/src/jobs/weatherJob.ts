import cron from 'node-cron';
import { Reservation } from '../models/models.js';
import { getForecast } from '../utils/weatherHelper.js';
import { sendNotification } from '../utils/notificationHelper.js';

export const initWeatherJob = () => {
  cron.schedule('0 6 * * *', async () => {
    console.log('[WeatherJob] Starting daily check...');

    const startWindow = new Date();
    startWindow.setDate(startWindow.getDate() + 1);
    startWindow.setHours(0, 0, 0, 0);

    const endWindow = new Date();
    endWindow.setDate(endWindow.getDate() + 3);
    endWindow.setHours(23, 59, 59, 999);

    try {
      const upcomingReservations = await Reservation.find({
        reservationDate: { $gte: startWindow, $lte: endWindow },
      }).populate('bivouac');

      console.log(
        `[WeatherJob] Checking ${upcomingReservations.length} reservations between ${startWindow.toISOString()} and ${endWindow.toISOString()}`
      );

      for (const reservation of upcomingReservations) {
        const bivouac: any = reservation.bivouac;

        const lat = bivouac.coords.latitude;
        const lng = bivouac.coords.longitude;

        const weather = await getForecast(
          lat,
          lng,
          reservation.reservationDate
        );

        if (weather) {
          const message = `Forecast for ${bivouac.name} on ${reservation.reservationDate.toISOString().split('T')[0]}: ${weather.description}, Min Temp: ${weather.minTemp}°C, Max Temp: ${weather.maxTemp}°C.\n
                    Precipitation: ${weather.precipitationSum}mm over ${weather.precipitationHours} hours. Max Wind Speed: ${weather.maxWindSpeed} km/h.\n
                    Sunrise: ${new Date(weather.sunrise).toLocaleTimeString()}, Sunset: ${new Date(weather.sunset).toLocaleTimeString()}.`;

          await sendNotification(
            reservation.user.toString(),
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
  });
};
