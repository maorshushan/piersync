/** Guide SVG viewBox — use same units for piercing x/y */
export const GUIDE_VIEWBOX = { width: 223, height: 358 }

/** Range placement types: user can place within the colored region. { id, name, color, styles: ['stud'|'hoop'] } */
export const RANGE_PIERCING_TYPES = [
  { id: 'lobe', name: 'Lobe', color: '#FB4141', styles: ['stud', 'hoop'] },
  { id: 'lowerHelix', name: 'Lower helix', color: '#C247F7', styles: ['stud', 'hoop'] },
  { id: 'helix', name: 'Helix', color: '#34F0FA', styles: ['stud', 'hoop'] },
  { id: 'forwardHelix', name: 'Forward helix', color: '#2DEA39', styles: ['stud', 'hoop'] },
  { id: 'contraconch', name: 'Contraconch', color: '#FF2BCA', styles: ['stud'] },
  { id: 'conch', name: 'Conch', color: '#F3E13F', styles: ['stud', 'hoop'] },
  { id: 'flat', name: 'Flat', color: '#3056EC', styles: ['stud'] }
]

/** Approximate bounding box per range type in guide coords (x, y, width, height) for clamping */
export const RANGE_BOUNDS = {
  lobe: { x: 11, y: 254, width: 140, height: 90 },
  lowerHelix: { x: 151, y: 172, width: 70, height: 80 },
  helix: { x: 60, y: 5, width: 165, height: 150 },
  forwardHelix: { x: 15, y: 10, width: 55, height: 150 },
  contraconch: { x: 64, y: 95, width: 95, height: 100 },
  conch: { x: 86, y: 170, width: 55, height: 65 },
  flat: { x: 30, y: 59, width: 135, height: 90 }
}

/** Guide SVG path d per range type — left ear (Lear-large-guide) */
export const GUIDE_PATHS_LEFT = {
  lobe: 'M62.0433 275.5C71.6433 275.5 96.3767 261.833 108.043 254L150.543 221.5L181.543 245.5C167.377 269.833 125.343 325.2 104.543 342C78.5433 363 49.0433 353.5 34.0433 339.5C22.0433 328.3 12.3767 306.667 11.0433 298L28.5433 267.5C35.5433 267.5 52.4433 275.5 62.0433 275.5Z',
  lowerHelix: 'M182.543 172.5C177.543 188 161.21 211.5 151.043 222L182.543 246C188.877 234.333 203.043 215.5 209.543 200.5C213.742 190.81 219.543 163 220.543 149.5H187.043C185.877 151.167 186.971 158.774 182.543 172.5Z',
  flat: 'M188.043 145H156.543C158.877 141 159.343 130.4 142.543 120C125.743 109.6 87.5433 99.3331 70.5433 95.4998L30.0433 78.9998L39.0433 62.9998C46.0433 53.6664 68.5433 34.7998 102.543 33.9998C145.043 32.9998 151.333 43.0542 163.543 59.9998C188.043 94 189.543 123.333 188.043 145Z',
  conch: 'M113.043 170C116.643 154.4 96.5433 133.833 86.0433 125.5C95.5433 125.5 104.543 125.5 129.043 145.5C141.395 155.583 138.377 186.333 135.043 201C132.877 208.333 121.743 224.2 114.543 223C107.343 221.8 94.21 229 86.0433 233.5C93.5433 218.833 109.443 185.6 113.043 170Z',
  contraconch: 'M70.0433 95L64.5433 118.5C118.543 127 121.561 133 133.043 151.5C140.243 163.1 138.71 183.333 137.043 192H153.043C154.71 182.667 157.743 158.6 156.543 137C155.343 115.4 83.3767 98.3333 70.0433 95Z',
  helix: 'M173.543 77.5C189.543 99.9 191.71 134 187.043 149.5H221.043C221.043 146 220.777 135 221.043 129.5C222.543 98.5 204.043 70.5 194.043 50.5C184.043 30.5 159.543 15 133.543 5.00002C112.743 -2.99998 75.8767 4.33335 60.0433 9.00002L67.0433 42C81.0433 36 97.5433 31 125.543 36.5C153.543 42 157.543 55.1 173.543 77.5Z',
  forwardHelix: 'M59.5434 155L15.0434 160.5C9.71003 138.833 -0.756633 93.4 0.0433675 85C1.04337 74.5 4.54333 61 15.0434 46C27.0615 28.8313 48.21 14 59.5434 10L67.5434 42C54.8767 47.3333 28.7434 65.5 25.5434 95.5C22.3434 125.5 46.8767 147.667 59.5434 155Z'
}

/** Guide SVG path d per range type — right ear (Rear-large-guide) */
export const GUIDE_PATHS_RIGHT = {
  lobe: 'M160.5 275.5C150.9 275.5 126.167 261.833 114.5 254L72 221.5L41 245.5C55.1667 269.833 97.2 325.2 118 342C144 363 173.5 353.5 188.5 339.5C200.5 328.3 210.167 306.667 211.5 298L194 267.5C187 267.5 170.1 275.5 160.5 275.5Z',
  lowerHelix: 'M40 172.5C45 188 61.3333 211.5 71.5 222L40 246C33.6667 234.333 19.5 215.5 13 200.5C8.80114 190.81 3 163 2 149.5H35.5C36.6667 151.167 35.5723 158.774 40 172.5Z',
  flat: 'M34.5 145H66C63.6667 141 63.2 130.4 80 120C96.8 109.6 135 99.3331 152 95.4998L192.5 78.9998L183.5 62.9998C176.5 53.6664 154 34.7998 120 33.9998C77.5 32.9998 71.2107 43.0542 59 59.9998C34.5 94 33 123.333 34.5 145Z',
  conch: 'M109.5 170C105.9 154.4 126 133.833 136.5 125.5C127 125.5 118 125.5 93.5 145.5C81.1479 155.583 84.1667 186.333 87.5 201C89.6667 208.333 100.8 224.2 108 223C115.2 221.8 128.333 229 136.5 233.5C129 218.833 113.1 185.6 109.5 170Z',
  contraconch: 'M152.5 95L158 118.5C104 127 100.983 133 89.5 151.5C82.3 163.1 83.8333 183.333 85.5 192H69.5C67.8333 182.667 64.8 158.6 66 137C67.2 115.4 139.167 98.3333 152.5 95Z',
  helix: 'M49 77.5C33 99.9 30.8333 134 35.5 149.5H1.5C1.5 146 1.76613 135 1.5 129.5C0 98.5 18.5 70.5 28.5 50.5C38.5 30.5 63 15 89 5.00002C109.8 -2.99998 146.667 4.33335 162.5 9.00002L155.5 42C141.5 36 125 31 97 36.5C69 42 65 55.1 49 77.5Z',
  forwardHelix: 'M163 155L207.5 160.5C212.833 138.833 223.3 93.4 222.5 85C221.5 74.5 218 61 207.5 46C195.482 28.8313 174.333 14 163 10L155 42C167.667 47.3333 193.8 65.5 197 95.5C200.2 125.5 175.667 147.667 163 155Z'
}

/** Center point per range type for initial placement */
export function getRangeTypeCenter(typeId) {
  const b = RANGE_BOUNDS[typeId]
  if (!b) return { x: GUIDE_VIEWBOX.width / 2, y: GUIDE_VIEWBOX.height / 2 }
  return { x: b.x + b.width / 2, y: b.y + b.height / 2 }
}

/** Clamp (x, y) to range type bounds (rectangle fallback) */
export function clampToRangeBounds(typeId, x, y) {
  const b = RANGE_BOUNDS[typeId]
  if (!b) return { x, y }
  return {
    x: Math.max(b.x, Math.min(b.x + b.width, x)),
    y: Math.max(b.y, Math.min(b.y + b.height, y))
  }
}

let _pathCache = null
let _pathCacheContainer = null

function getPathSVG(typeId, ear) {
  const paths = ear === 'right' ? GUIDE_PATHS_RIGHT : GUIDE_PATHS_LEFT
  const d = paths[typeId]
  if (!d) return null
  if (typeof document === 'undefined') return null
  if (!_pathCache) _pathCache = {}
  const key = `${ear}-${typeId}`
  if (!_pathCache[key]) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', `0 0 ${GUIDE_VIEWBOX.width} ${GUIDE_VIEWBOX.height}`)
    svg.setAttribute('width', String(GUIDE_VIEWBOX.width))
    svg.setAttribute('height', String(GUIDE_VIEWBOX.height))
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', d)
    svg.appendChild(path)
    if (!_pathCacheContainer) {
      _pathCacheContainer = document.createElement('div')
      _pathCacheContainer.setAttribute('aria-hidden', 'true')
      _pathCacheContainer.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;pointer-events:none'
      document.body.appendChild(_pathCacheContainer)
    }
    _pathCacheContainer.appendChild(svg)
    _pathCache[key] = { svg, path }
  }
  return _pathCache[key]
}

/** True if (x, y) in viewBox coords is inside the guide path for this type/ear */
export function isPointInGuidePath(typeId, ear, x, y) {
  const entry = getPathSVG(typeId, ear)
  if (!entry) return false
  const pt = entry.svg.createSVGPoint()
  pt.x = x
  pt.y = y
  return entry.path.isPointInFill(pt)
}

/** Clamp (x, y) to the guide shape: if inside return it; else return boundary point so piercing never leaves the path */
export function clampToGuidePath(typeId, ear, x, y, prevX, prevY) {
  try {
    const entry = getPathSVG(typeId, ear)
    if (!entry) return clampToRangeBounds(typeId, x, y)
    const pt = entry.svg.createSVGPoint()
    pt.x = x
    pt.y = y
    if (entry.path.isPointInFill(pt)) return { x, y }

    const test = (px, py) => {
      pt.x = px
      pt.y = py
      return entry.path.isPointInFill(pt)
    }

    let startX = prevX
    let startY = prevY
    if (!test(prevX, prevY)) {
      const c = getRangeTypeCenter(typeId)
      if (!test(c.x, c.y)) return { x: prevX, y: prevY }
      startX = c.x
      startY = c.y
    }

    let lo = 0
    let hi = 1
    for (let i = 0; i < 28; i++) {
      const t = (lo + hi) / 2
      const px = startX + t * (x - startX)
      const py = startY + t * (y - startY)
      if (test(px, py)) lo = t
      else hi = t
    }
    const bx = startX + lo * (x - startX)
    const by = startY + lo * (y - startY)
    return { x: Math.round(bx * 100) / 100, y: Math.round(by * 100) / 100 }
  } catch {
    return clampToRangeBounds(typeId, x, y)
  }
}

/** Fixed placement types: predefined position(s), cannot move. { id, name, color, style, positions } */
export const FIXED_PIERCING_TYPES = [
  { id: 'daith', name: 'Daith', color: '#0DBB84', style: 'hoop', positions: [{ x1: 51, y1: 171.5, x2: 99, y2: 171.5 }] },
  { id: 'tragus', name: 'Tragus', color: '#1A4086', style: 'stud', positions: [{ x: 35.54, y: 219 }], altColor: '#6548DF', altStyle: 'hoop', altPositions: [{ x1: 35.54, y1: 219.5, x2: 35.54, y2: 240.5 }] },
  { id: 'antiTragus', name: 'Anti tragus', color: '#861A37', style: 'curved', positions: [{ x: 92.54, y: 243 }], altColor: '#4F0505', altStyle: 'hoop', altPositions: [{ x1: 91.65, y1: 243.8, x2: 83.65, y2: 233.8 }] },
  { id: 'snug', name: 'Snug', color: '#53861A', style: 'curved', positions: [{ x: 138.54, y: 173 }, { x: 189.54, y: 175 }], altColor: '#380873', altStyle: 'hoop', altPositions: [{ x1: 138, y1: 173, x2: 190, y2: 175 }] },
  { id: 'rook', name: 'Rook', color: '#EBE37C', style: 'curved', positions: [{ x: 61.54, y: 97 }, { x: 61.54, y: 119 }], altColor: '#FFD64D', altStyle: 'hoop', altPositions: [{ x1: 61.54, y1: 97.5, x2: 61.54, y2: 119.5 }] },
  { id: 'industrial', name: 'Industrial', color: '#F2754F', style: 'industrial', positions: [{ x1: 60.23, y1: 37, x2: 193.23, y2: 89 }] }
]

/** All piercing type ids (range + fixed) for "custom" fallback */
export const ALL_TYPE_IDS = [...RANGE_PIERCING_TYPES.map((t) => t.id), ...FIXED_PIERCING_TYPES.map((t) => t.id)]

export function getPiercingTypeName(typeId) {
  const r = RANGE_PIERCING_TYPES.find((t) => t.id === typeId)
  if (r) return r.name
  const f = FIXED_PIERCING_TYPES.find((t) => t.id === typeId)
  if (f) return f.name
  return 'Custom'
}
