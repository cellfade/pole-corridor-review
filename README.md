# Pole Corridor Review

A working interview prototype exploring how IKE Office could help utility analysts move from a corridor map into a constrained 3D pole-review experience without requiring professional 3D-navigation expertise.

## Prototype Flow

1. Select a pole from the corridor rail or map.
2. Enter the 3D view.
3. Orbit around the selected pole or choose a ground capture point.
4. Open the attachment vertex menu.
5. Inspect, measure, view evidence, accept, or flag the AI suggestion.
6. Move to the next connected pole while preserving corridor context.

## Interaction Principles

- Constrained orbit instead of free-flight navigation.
- Origin-aware radial actions anchored to the selected asset vertex.
- Screen-space labels and a persistent inspector connect geometry to source evidence.
- Map, minimap, compass, previous/next controls, and capture circles preserve orientation.
- PolePilot-inspired purple suggestions remain reviewable before acceptance.
- Every canvas action has an accessible interface counterpart.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The prototype uses React, Vite, Three.js, React Three Fiber, and Lucide icons.
