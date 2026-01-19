import type { Icon, IconOptions } from 'leaflet';
import L from 'leaflet';

export function getDurationHM(durationInMinutes: number): {
  hours: number;
  minutes: number;
} {
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  return { hours, minutes };
}

export function getCoords(
  coords: { lat: number; lng: number }[]
): L.LatLngExpression[] {
  return coords.map((coord) => [coord.lat, coord.lng]);
}

const iconSize: [number, number] = [30, 30];

const routeIconUrl = new URL('@/assets/route.svg', import.meta.url).href;

export const routeIcon = L.divIcon({
  className: 'route-icon-wrapper',
  html: `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${iconSize[0]}px;
      height: ${iconSize[1]}px;
      background: #bc6c25;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
    ">
      <img src="${routeIconUrl}" alt="Route" style="width: 60%; height: 60%; filter: brightness(0) invert(1);" />
    </div>
  `,
  iconSize: iconSize as [number, number],
  iconAnchor: [iconSize[0] / 2, iconSize[1] - iconSize[0] / 2] as [
    number,
    number,
  ],
}) as Icon<IconOptions>;

const mapPinHouseIconUrl = new URL(
  '@/assets/map-pin-house.svg',
  import.meta.url
).href;

export const bivouacIcon = L.divIcon({
  className: 'bivouac-icon-wrapper',
  html: `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${iconSize[0]}px;
      height: ${iconSize[1]}px;
      background: var(--primary);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
    ">
      <img src="${mapPinHouseIconUrl}" alt="Bivouac" style="width: 60%; height: 60%; filter: brightness(0) invert(1);" />
    </div>
  `,
  iconSize: iconSize as [number, number],
  iconAnchor: [iconSize[0] / 2, iconSize[1] - iconSize[0] / 2] as [
    number,
    number,
  ],
}) as Icon<IconOptions>;
