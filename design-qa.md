# Design QA

## Comparison Target

- Source visual truth: `reference/pole-corridor-option-1.png`
- Source pixels: 1487 x 1058
- Implementation screenshot: `qa/implementation-3d-environment-reference-size.png`
- Implementation pixels and CSS viewport: 1487 x 1058 at browser screenshot density
- Normalization: source and implementation preserved at 1487 x 1058
- Combined comparison: `qa/compare-3d-environment.png`
- State: Pole 104 selected, 3D active, radial menu open, inspector visible
- Responsive evidence: `qa/implementation-3d-environment-mobile.png`, 390 x 844

## Full-View Comparison Evidence

The combined comparison preserves the source composition: a 52px charcoal header, slim six-pole rail, dominant spatial canvas, 348px evidence inspector, vertex-centered radial actions, lower corridor navigator, right-side orientation tools, and lower-right minimap. The implementation now places the pole corridor inside a complete low-poly Three.js environment instead of compositing live geometry over a static photographic plate. Photorealism intentionally gives way to honest spatial depth and visible parallax in this iteration.

## Focused Comparison Evidence

- Header: brand lockup, location context, view switch, review progress, and avatar preserve the source hierarchy at a denser product scale.
- Corridor rail: six repeated pole rows, continuous route rail, status markers, thumbnails, and orange selected row match the source anatomy.
- Vertex menu: five actions remain anchored to the selected 3D point and use the source's dark circular actions, white borders, orange center, green accept, and red flag semantics.
- Inspector: title, AI confidence, source image, grouped attributes, measurements, source thumbnails, and action hierarchy match the source content order.
- Spatial aids: constrained orbit, frame/reset, compass, minimap, previous/next controls, measurement line, and ground capture points remain visible without displacing the canvas. Road, curbs, terrain, homes, trees, parked vehicles, and foothills share the same camera and respond to orbiting.

## Required Fidelity Surfaces

### Fonts And Typography

Inter is used for operational text and Barlow Semi Condensed for product identity and panel titles. Sizes, weights, line heights, truncation, and zero letter spacing were checked across the header, rail, radial labels, inspector, buttons, and mobile sheet. No clipped primary text remains.

### Spacing And Layout Rhythm

The desktop grid matches the source's three-region proportions. Panels use low radii, thin dividers, restrained shadows, and consistent 4/8px spacing. Mobile converts the rail and inspector into overlays while preserving the spatial canvas. No horizontal or vertical viewport overflow was detected at 1440 x 1024 or 390 x 844.

### Colors And Visual Tokens

The implementation consistently uses charcoal `#1A1E2C`, orange `#FF9239`, PolePilot purple `#7257D9`, confirmation green `#3FA66A`, flag red `#D24F55`, and neutral white/gray surfaces. State colors are paired with icons, labels, and shape changes.

### Image Quality And Asset Fidelity

The corridor environment is rendered entirely as live Three.js geometry, including low-poly terrain, roadway, curbs, lane markings, houses, trees, vehicles, foothills, poles, and wires. Official IKE Office screenshots remain limited to evidence thumbnails and the minimap, where imagery is appropriate. The scene is visibly nonblank at desktop and mobile sizes, and the environment maintains depth from multiple orbit angles without a photographic background layer.

### Copy And Content

Above-the-fold product copy matches the approved concept's job, pole, attachment, AI confidence, evidence, measurement, acceptance, and flagging vocabulary. The implementation adds only functional context required by the interactive prototype: review count, corridor location, and explicit vertex/orbit guidance.

## Interaction And Browser Verification

- Map, Satellite, and 3D view controls update the primary work surface.
- A pole can be selected in the corridor rail or map.
- `Open 3D` returns to the live spatial scene with the selected pole preserved.
- Dragging the scene changes the rendered camera view and reveals correct parallax between the selected pole, adjacent poles, road, buildings, vegetation, vehicles, and terrain.
- The selected attachment vertex exposes a keyboard-accessible radial menu.
- Accept updates pole status, inspector state, toast feedback, and review progress from 2/6 to 3/6.
- Previous/Next and arrow keys change the selected pole and camera target.
- Flag issue updates the selected pole and inspector state.
- Escape closes the radial menu.
- Browser console: zero errors. Third-party Three.js deprecation warnings do not affect behavior.

## Comparison History

### Iteration 1

- P1: Radial menu closed during initial render because the selection effect ran on mount.
- P2: Camera was too close and cropped spatial context.
- P2: Compass and Three.js gizmo overlapped.
- P2: Selected-pole outline was visually heavy.

Fixes: preserved the initial open state, widened and repositioned the camera, removed the duplicate gizmo, and reduced selection emphasis to the vertex and row states.

### Iteration 2

- P1: Procedural environment was significantly flatter than the approved visual target.
- P2: Mobile radial actions visually crossed the inspector hierarchy.
- P2: Minimap crop showed too much legacy UI rather than geographic context.

Fixes: added a purpose-made photographic Lehi corridor plate behind the real Three.js geometry, raised mobile panel stacking, and replaced/repositioned the map source crop.

### Iteration 3

- P1: The original live poles and wires moved with the camera, but a photographic CSS background remained fixed and broke the spatial illusion during orbit.
- P2: The viewer lacked environmental depth cues beyond the utility geometry.

Fixes: removed the CSS background image and added a deterministic low-poly world with terrain elevation, a road and curbs, lane markings, driveways, homes, vegetation, parked vehicles, sky, fog, and distant foothills. Desktop and mobile captures confirm the world remains visible and coherent around the selected pole; an alternate orbit angle confirms environmental parallax.

### Final Pass

The 3D-environment update intentionally changes the scene from the reference's photographic realism to a low-poly model while preserving the approved interface composition and task flow. No actionable P0, P1, or P2 findings remain. Simplified mesh detail is an acceptable P3 prototype-level deviation because all visible environmental layers now participate in the actual camera space.

## Follow-Up Polish

- P3: Replace procedural pole geometry with an optimized photogrammetry or glTF pole asset if production-fidelity 3D data becomes available.
- P3: Replace the illustrative corridor with GIS-derived terrain tiles, building footprints, and aerial textures when a production data source and performance budget are known.

final result: passed
