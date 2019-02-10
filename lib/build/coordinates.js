
// Coordinate utilities.  Coordinates are managed in GeoJSON format, 
// i.e. [ x, y, z ].  Z is optional and will be treated as zero if missing.


const compare = (a, b) => {
  var result = 0;
  
  if (a > b) {
    result = 1;
  }
  else if (a < b) {
    result = -1;
  }
  
  return result;
};

const getZ = (c) => c.length > 2 ? c[2] : 0;

const coordinates = {

  // compare two coordinates in X-Y-Z order

  compare: (a, b) => {
    let result = compare(a[0], b[0]);
    
    if (!result) {
      result = compare(a[1], b[1]);
    
      if (!result) {
        result = compare(getZ(a), getZ(b));
      }
    }
  
    return result;
  },

  // return the absolute difference between two coordinates in X, Y and Z as well as
  // the squared distance between them

  difference: (a, b) => {
    const x = Math.abs(a[0] - b[0]);
    const y = Math.abs(a[1] - b[1]);
    const z = Math.abs(getZ(a) - getZ(b));
    return { x, y, z, d2: x * x + y * y + z * z };
  }
};

export default coordinates;
