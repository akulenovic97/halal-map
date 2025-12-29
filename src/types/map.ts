/**
 * Represents the geographical bounds of a map viewport
 */
export interface MapBounds {
  /** Maximum latitude (northern edge) */
  north: number;
  /** Minimum latitude (southern edge) */
  south: number;
  /** Maximum longitude (eastern edge) */
  east: number;
  /** Minimum longitude (western edge) */
  west: number;
}
