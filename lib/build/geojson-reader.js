
// reader for GeoJSON feature collections and feature arrays

class GeoJsonReader {
  constructor(features) {
    this.features = features.features || features;
  }

  [Symbol.asyncIterator]() {
    var i = -1;

    return {
      next: () => Promise.resolve({ value: this.features[++i], done: !(i in this.features) })
    };
  };
}

export default GeoJsonReader;

  