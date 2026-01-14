declare module '@mapbox/togeojson' {
  const toGeoJSON: {
    gpx: (doc: Document) => any;
    kml: (doc: Document) => any;
  };
  export default toGeoJSON;
}
