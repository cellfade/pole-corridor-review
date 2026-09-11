# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Approved Prototype Direction

- Selected visual: `reference/pole-corridor-option-1.png`.
- Keep the 3D utility pole and its evidence as the dominant work surface.
- Keep the interface simpler and less utilitarian than legacy IKE Office while preserving its charcoal, orange, purple, green, and red semantic roles.
- Use a vertex-anchored radial marking menu for inspect, measure, source, accept, and flag actions.
- Borrow constrained orbit, focus, reset, screen-space labeling, selection outlines, and orientation controls from professional 3D software.
- Preserve a slim corridor rail and lightweight inspector for orientation and evidence.
- Build a functional map/satellite/3D transition and a complete accept/flag review path.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
