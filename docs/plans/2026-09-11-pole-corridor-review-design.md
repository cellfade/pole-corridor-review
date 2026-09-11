# Pole Corridor Review Design

**Date:** 2026-09-11
**Status:** Approved
**Approach:** Spatial Studio, ideation option 1

## Problem Statement

Utility analysts need the spatial value of 3D without learning a general-purpose 3D editor. The prototype extends IKE Office with a guided map-to-pole review flow that keeps source evidence, geographic context, and AI review controls visible.

## Architecture

- React and Vite application using Three.js through React Three Fiber.
- Full-bleed 3D corridor canvas with constrained orbit controls.
- Persistent corridor rail, contextual evidence inspector, and map/satellite/3D view switch.
- Local prototype state for pole selection, radial-menu actions, accepted measurements, and flagged issues.

## Components

- Application header and spatial-mode switch.
- Six-pole corridor rail.
- Three.js utility corridor with selectable attachment vertex.
- Origin-aware radial marking menu.
- Evidence and measurement inspector.
- Map and satellite context views.
- Previous/next pole navigator and orientation controls.

## Data Flow

Selecting a pole updates the 3D camera target, corridor state, labels, and inspector. Clicking the highlighted attachment vertex opens the radial action menu. Accepting or flagging updates the pole status, review count, inspector treatment, and feedback message.

## Error Handling

- Every canvas action has a DOM equivalent in the inspector or corridor rail.
- Escape closes the radial menu; arrow keys move between poles.
- Reduced-motion preferences remove nonessential camera and interface animation.
- Mobile layouts convert rails and inspector panels into compact overlays without hiding the canvas.

## Decisions Made

- 3D is a view mode inside IKE Office, not a separate product.
- Camera navigation is constrained orbit rather than free flight.
- The radial menu is attached to an asset vertex and preserves the selected point at its center.
- PolePilot purple denotes AI suggestion; orange denotes active manual selection; green and red retain confirm/flag meaning.
- The prototype uses one polished review path rather than a broad feature inventory.

## Non-Goals

- Authentication, persistence, real GIS data, and backend integrations.
- Exhaustive pole editing or CAD-style transform tools.
- A full redesign of the IKE Office portfolio.
