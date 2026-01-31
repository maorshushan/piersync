export const PIERCING_STATUS = {
  OWNED: 'owned',
  PLANNED: 'planned',
  WISHLIST: 'wishlist'
}

export const STORAGE_KEY = 'piersync-data'

/** ViewBox for ear SVG — use same units for piercing x/y (0–100, 0–120) */
export const EAR_VIEWBOX = { width: 100, height: 120 }

/** Current data schema version for migrations */
export const DATA_VERSION = 1
