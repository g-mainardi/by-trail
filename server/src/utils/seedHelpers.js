import fs from 'fs';
import path from 'path';
import { DOMParser } from '@xmldom/xmldom';
import toGeoJSON from '@mapbox/togeojson';

export const getGeoJsonFromGpx = (fileName) => {
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'gpx', fileName);

        if (!fs.existsSync(filePath)) {
            console.error(`GPX file missing: ${fileName}`);
            return null;
        }

        const gpxString = fs.readFileSync(filePath, 'utf-8');
        const parser = new DOMParser();
        const gpxDoc = parser.parseFromString(gpxString, 'text/xml');
        const geoJSON = toGeoJSON.gpx(gpxDoc);

        const track = geoJSON.features.find(f => f.geometry.type === 'LineString' || f.geometry.type === 'MultiLineString');

        return track ? track.geometry : null;
    } catch (error) {
        console.error(`Error parsing GPX ${fileName}:`, error.message);
        return null;
    }
};

