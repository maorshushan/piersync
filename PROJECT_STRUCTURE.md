# Piersync — Project structure

```
src/
├── components/       # Reusable UI
│   ├── EarSVG.jsx      # SVG ear illustration (left/right via side prop)
│   ├── Piercing.jsx    # Single piercing dot (position + status styling)
│   ├── PiercingLayer.jsx  # Ear + overlay; click to add, coordinates in viewBox units
│   └── WishlistPanel.jsx  # List of piercings, status badges, labels, remove
├── store/
│   └── useWishlistStore.js  # Load from localStorage, persist on change; add/update/remove/cycle
├── pages/
│   ├── Home.jsx        # Planner: PiercingLayer + WishlistPanel
│   └── About.jsx
├── constants.js       # PIERCING_STATUS, STORAGE_KEY, EAR_VIEWBOX
├── index.css           # Tailwind + @theme (purple design tokens)
├── App.jsx
└── main.jsx
```

- **Ear**: Single ear for now; `EarSVG` accepts `side="left"|"right"` for future mirroring.
- **State**: No external store; `useWishlistStore` holds piercings and syncs to `localStorage` on every change.
- **PWA**: `vite.config.js` uses `vite-plugin-pwa` (manifest + Workbox). Add `public/pwa-192x192.png` and `public/pwa-512x512.png` for install icons.
