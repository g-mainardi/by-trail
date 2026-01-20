export const placeholderEmpty = new URL(
  '@/assets/placeholder.jpg',
  import.meta.url
).href;

export const placeholderBivouac = new URL(
  '@/assets/bivouacs/bivouac-2.jpg',
  import.meta.url
).href;

export const placeholderRoute = new URL(
  '@/assets/routes/route-1.jpg',
  import.meta.url
).href;

const bivouacURLs = [
  new URL('@/assets/bivouacs/bivouac-1.jpg', import.meta.url).href,
  new URL('@/assets/bivouacs/bivouac-2.jpg', import.meta.url).href,
  new URL('@/assets/bivouacs/bivouac-3.jpg', import.meta.url).href,
  new URL('@/assets/bivouacs/bivouac-4.jpg', import.meta.url).href,
  new URL('@/assets/bivouacs/bivouac-5.jpg', import.meta.url).href,
];

const routeURLs = [
  new URL('@/assets/routes/route-1.jpg', import.meta.url).href,
  new URL('@/assets/routes/route-2.jpg', import.meta.url).href,
  new URL('@/assets/routes/route-3.jpg', import.meta.url).href,
  new URL('@/assets/routes/route-4.jpg', import.meta.url).href,
  new URL('@/assets/routes/route-5.jpg', import.meta.url).href,
];

export const getRandomBivouacPlaceholder = (): string => {
  const randomIndex = Math.floor(Math.random() * bivouacURLs.length);
  return bivouacURLs[randomIndex] ?? placeholderBivouac;
};

export const getRandomRoutePlaceholder = (): string => {
  const randomIndex = Math.floor(Math.random() * routeURLs.length);
  return routeURLs[randomIndex] ?? placeholderRoute;
};
