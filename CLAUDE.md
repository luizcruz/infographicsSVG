# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**infographicsSVG** is a zero-dependency, vanilla JavaScript library for rendering SVG pictogram infographics from percentage-based data. Charts are declared entirely in HTML via `data-*` attributes — no JavaScript calls required for normal use.

Live demo: `graph.html` (deployed to GitHub Pages on every push to `master`).

## Architecture

The entire library is a single IIFE in `lib/infographicSVG.js`. There is no build step and no bundler. The file is loaded directly by `<script src="lib/infographicSVG.js">` in any HTML page.

### Data flow

```
HTML [data-infographic] attributes
  → initAll() scans DOM on DOMContentLoaded (or immediately if already loaded)
    → initElement() validates each container's attributes
      → render() creates SVG element and appends shape nodes
        → buildHuman / buildBox / buildCircle / buildSoccer / buildTrophy
```

The programmatic API (`window.doGraph`) is a thin wrapper that validates its arguments and calls `render()` directly.

### Rendering logic

`render()` iterates `numberOfItems` times, advancing through segments sequentially. A segment's icon count is `Math.floor(pct/100 * numberOfItems)`. When a segment is exhausted, the next segment becomes active; remaining items beyond all segments keep the last segment's color. Columns wrap when `col % (itemsPerColumn + 1) === 0`.

SVG viewport dimensions are computed from `numberOfItems` using hardcoded multipliers per shape type — there is no auto-sizing.

### Security invariants (must be preserved)

- **No `innerHTML`** anywhere in the library. All SVG nodes are created via `document.createElementNS` / `setAttribute`.
- **Color whitelist**: `SAFE_COLOR_RE = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$|^[a-zA-Z]+$/` — only hex or purely alphabetic CSS names are accepted.
- **Item cap**: `MAX_ITEMS = 500` prevents runaway grid generation.
- Invalid configurations render the text `[infographic: invalid configuration]` in place of the SVG.

## Testing

### Library (`tests/infographicSVG.test.js`)

Run `npm test` at the repo root (requires `npm install` first). Uses Jest + `jest-environment-jsdom`.

The library is a side-effect-only IIFE, so tests use a `loadLib()` helper that calls `jest.resetModules()` + `require()` before each test, re-executing the IIFE against fresh DOM state. Covers: `doGraph` validation, color whitelist, all five shape types, SVG dimensions, element counts, multiple segments, declarative `[data-infographic]` API, security invariants.

### Gutenberg block (`wordpress-plugin/infographic-svg-block/src/__tests__/`)

Run `npm test` inside `wordpress-plugin/infographic-svg-block/` (requires `npm install` first). Uses `wp-scripts test-unit-js` (Jest + `@wordpress/jest-preset-default`).

- `utils.test.js` — `parseSegments` and `serializeSegments` pure-function tests
- `save.test.js` — `save()` component tests via `@testing-library/react`; `@wordpress/block-editor` is mocked

`parseSegments` and `serializeSegments` are defined in `src/utils.js` and imported by `edit.js`.

### CI pipeline

`.github/workflows/deploy.yml` runs the `test` job on every push and pull request. The `deploy` job only runs on `master` and only after `test` passes.

## Deployment

Pushing to `master` triggers `.github/workflows/deploy.yml`, which publishes the entire repository root to GitHub Pages with no build step. The workflow requires **Repository Settings → Pages → Source → GitHub Actions** to be enabled.

## Adding a New Shape Type

1. Add the new key to `VALID_TYPES` in `lib/infographicSVG.js`.
2. Write a `buildMyShape(color)` function that returns an SVG `<g>` element using `svgEl()` only — never `innerHTML`.
3. Add an `if (shapeType === 'myshape')` branch in `render()` for SVG width/height calculation.
4. Add an `else if` branch in the `while` loop to call your builder and set its position via `transform="translate(x,y)"`.
5. Add an example to `graph.html` using the declarative `data-infographic` API.
