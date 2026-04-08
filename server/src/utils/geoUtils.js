/**
 * Grid-based segment identification.
 * Each tile is approximately 100m x 100m.
 */
const getSegmentId = (lat, lng) => {
  const precision = 3; // ~111m at equator
  const tileLat = lat.toFixed(precision);
  const tileLng = lng.toFixed(precision);
  return `seg_${tileLat}_${tileLng}`;
};

module.exports = {
  getSegmentId
};
