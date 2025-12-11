import { LatLng, Zone } from '../types';

/**
 * Ray-casting algorithm to check if a point is inside a polygon
 */
export function isPointInPolygon(point: LatLng, polygon: LatLng[]): boolean {
  let inside = false;
  const x = point.lng;
  const y = point.lat;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Find which zone a point belongs to
 */
export function findZoneForPoint(point: LatLng, zones: Zone[]): Zone | null {
  for (const zone of zones) {
    if (isPointInPolygon(point, zone.polygon)) {
      return zone;
    }
  }
  return null;
}

/**
 * Get the center of a polygon
 */
export function getPolygonCenter(polygon: LatLng[]): LatLng {
  const lat = polygon.reduce((sum, p) => sum + p.lat, 0) / polygon.length;
  const lng = polygon.reduce((sum, p) => sum + p.lng, 0) / polygon.length;
  return { lat, lng };
}
