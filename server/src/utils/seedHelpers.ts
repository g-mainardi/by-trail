import fs from 'fs';
import path from 'path';
import { DOMParser } from '@xmldom/xmldom';
import { RoutePathTypeEnum } from '../types/index.js';
import toGeoJSON from '@mapbox/togeojson';
import { FeatureCollection, LineString, MultiLineString } from 'geojson';

const { LINE_STRING, MULTI_LINE_STRING } = RoutePathTypeEnum;

export const getGeoJsonFromGpx = (
  fileName: string
): LineString | MultiLineString | null => {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'gpx', fileName);

    if (!fs.existsSync(filePath)) {
      console.error(`GPX file missing: ${fileName}`);
      return null;
    }

    const gpxString = fs.readFileSync(filePath, 'utf-8');
    const parser = new DOMParser();
    const gpxDoc = parser.parseFromString(gpxString, 'text/xml');
    const geoJSON = toGeoJSON.gpx(gpxDoc) as unknown as FeatureCollection;

    const track = geoJSON.features.find(
      (f) =>
        f.geometry.type === LINE_STRING || f.geometry.type === MULTI_LINE_STRING
    );

    if (!track) return null;

    return track.geometry as LineString | MultiLineString;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error parsing GPX ${fileName}:`, error.message);
    } else {
      console.error(`Unknown error parsing GPX ${fileName}:`, error);
    }
    return null;
  }
};
