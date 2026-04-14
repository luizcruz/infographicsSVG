/*
    Lib: Infographic SVG
    Author: Luiz Cruz
    Year: 2015
    Updated: 2024 - Declarative HTML API; secure DOM construction; soccer and trophy shapes

    Declarative usage (no script calls required):

        <div data-infographic
             data-items="40"
             data-per-column="10"
             data-type="humans"
             data-segments="63,red;33,blue">
        </div>

    Shape types : humans | box | circle | soccer | trophy
    data-segments: "pct1,color1;pct2,color2;..."
    Colors       : hex (#rgb or #rrggbb) or CSS named colors (letters only, e.g. red)

    Security notes:
      - All input is validated before use; invalid configs render an error message.
      - SVG is built with createElementNS/setAttribute — no innerHTML, no XSS risk.
      - Color values are whitelisted to hex or alphabetic names only.
      - numberOfItems is capped at MAX_ITEMS to prevent DoS via oversized grids.
*/

(function () {
    'use strict';

    var SVG_NS    = 'http://www.w3.org/2000/svg';
    var MAX_ITEMS = 500;

    // Whitelist: #rgb, #rrggbb, or purely alphabetic CSS color names (e.g. red, gold, black)
    var SAFE_COLOR_RE = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$|^[a-zA-Z]+$/;

    var VALID_TYPES = { humans: true, box: true, circle: true, soccer: true, trophy: true };

    // ── Input validation ───────────────────────────────────────────────

    function safeColor(raw) {
        var s = String(raw).trim();
        return SAFE_COLOR_RE.test(s) ? s : null;
    }

    function safeInt(raw, min, max) {
        var n = parseInt(raw, 10);
        return (isNaN(n) || n < min || n > max) ? null : n;
    }

    // Parses "pct,color;pct,color;..." into [[pct, color], ...]
    function parseSegments(raw) {
        var result = [];
        var pairs  = String(raw).split(';');
        for (var i = 0; i < pairs.length; i++) {
            var parts = pairs[i].trim().split(',');
            if (parts.length !== 2) return null;
            var pct   = parseFloat(parts[0].trim());
            var color = safeColor(parts[1]);
            if (isNaN(pct) || pct < 0 || pct > 100 || !color) return null;
            result.push([pct, color]);
        }
        return result.length > 0 ? result : null;
    }

    // ── Safe SVG element factory ───────────────────────────────────────

    function svgEl(tag, attrs) {
        var node = document.createElementNS(SVG_NS, tag);
        for (var k in attrs) {
            if (Object.prototype.hasOwnProperty.call(attrs, k)) {
                node.setAttribute(k, attrs[k]);
            }
        }
        return node;
    }

    // ── Shape builders ─────────────────────────────────────────────────
    // Each builder returns an SVG element. Position is applied by the
    // caller via transform="translate(x,y)" or direct x/y attributes.

    function buildHuman(color) {
        var g = svgEl('g', { fill: color });
        g.appendChild(svgEl('circle', { cx: 0, cy: -3, r: 3 }));
        g.appendChild(svgEl('rect', { x: -5, y: 1, width: 10, height: 10, rx: 2.5, ry: 2.5 }));
        g.appendChild(svgEl('rect', { x: -3, y: 1, width: 6,  height: 18, rx: 1.5, ry: 1.5 }));
        return g;
    }

    function buildBox(x, y, color) {
        return svgEl('rect', {
            x: x, y: y, width: 20, height: 20,
            fill: color, stroke: 'black', 'stroke-width': 1,
            'fill-opacity': 0.6, 'stroke-opacity': 0.1
        });
    }

    function buildCircle(x, y, color) {
        return svgEl('circle', {
            cx: x, cy: y, r: 10,
            fill: color, stroke: 'black', 'stroke-width': 2,
            'fill-opacity': 0.6, 'stroke-opacity': 0.1
        });
    }

    function buildSoccer(color) {
        // Colored circle with classic central pentagon patch and 5 seam lines.
        // Pentagon vertices at radius 4.5; seam lines reach the ball edge at radius 10.
        var g = svgEl('g', {});
        g.appendChild(svgEl('circle', {
            cx: 0, cy: 0, r: 10,
            fill: color, stroke: '#333', 'stroke-width': 1, 'fill-opacity': 0.85
        }));
        g.appendChild(svgEl('polygon', {
            points: '0,-4.5 4.28,-1.39 2.65,3.64 -2.65,3.64 -4.28,-1.39',
            fill: '#333', opacity: 0.35
        }));
        var seams = [
            [0, -10,   0, -4.5],
            [ 9.51, -3.09,  4.28, -1.39],
            [ 5.88,  8.09,  2.65,  3.64],
            [-5.88,  8.09, -2.65,  3.64],
            [-9.51, -3.09, -4.28, -1.39]
        ];
        for (var i = 0; i < seams.length; i++) {
            g.appendChild(svgEl('line', {
                x1: seams[i][0], y1: seams[i][1],
                x2: seams[i][2], y2: seams[i][3],
                stroke: '#333', 'stroke-width': 0.7, opacity: 0.5
            }));
        }
        return g;
    }

    function buildTrophy(color) {
        // Cup body, two curved handles, narrow stem, wide base.
        var g = svgEl('g', { fill: color, 'fill-opacity': 0.85, stroke: '#333', 'stroke-width': 1 });
        g.appendChild(svgEl('path', { d: 'M-7,-18 L7,-18 L5,-5 Q0,0 -5,-5 Z' }));
        g.appendChild(svgEl('path', {
            d: 'M-7,-14 Q-11,-9 -7,-6',
            fill: 'none', stroke: color, 'stroke-width': 3, 'stroke-opacity': 0.85
        }));
        g.appendChild(svgEl('path', {
            d: 'M7,-14 Q11,-9 7,-6',
            fill: 'none', stroke: color, 'stroke-width': 3, 'stroke-opacity': 0.85
        }));
        g.appendChild(svgEl('rect', { x: -2.5, y: -5, width: 5,  height: 9, 'stroke-width': 0.5 }));
        g.appendChild(svgEl('rect', { x: -7,   y:  4, width: 14, height: 4, rx: 1.5 }));
        return g;
    }

    // ── Core renderer ──────────────────────────────────────────────────

    function render(target, numberOfItems, itemsPerColumn, segments, shapeType) {
        var svgWidth, svgHeight;
        if (shapeType === 'humans') { svgWidth = 12 * numberOfItems; svgHeight =  4 * numberOfItems; }
        if (shapeType === 'box')    { svgWidth =  7 * numberOfItems; svgHeight =  4 * numberOfItems; }
        if (shapeType === 'circle') { svgWidth = 12 * numberOfItems; svgHeight =  5 * numberOfItems; }
        if (shapeType === 'soccer') { svgWidth = 12 * numberOfItems; svgHeight =  5 * numberOfItems; }
        if (shapeType === 'trophy') { svgWidth = 14 * numberOfItems; svgHeight = 10 * numberOfItems; }

        var svg    = svgEl('svg', { width: svgWidth, height: svgHeight });
        var items  = numberOfItems;
        var col = 1, row = 1;
        var countColor = 1, indexCount = 0;
        var color  = segments[0][1];

        while (items > 0) {
            if (col % (itemsPerColumn + 1) === 0) { row++; col = 1; }

            var select = segments[indexCount][0] / 100 * numberOfItems;
            if (countColor < select) {
                color = segments[indexCount][1];
                countColor++;
            } else {
                countColor = 1;
                indexCount++;
            }

            var shape;
            if (shapeType === 'humans') {
                shape = buildHuman(color);
                shape.setAttribute('transform', 'translate(' + (20 * col) + ',' + (30 * row) + ')');
            } else if (shapeType === 'box') {
                shape = buildBox(25 * col, 30 * row, color);
            } else if (shapeType === 'circle') {
                shape = buildCircle(30 * col, 30 * row, color);
            } else if (shapeType === 'soccer') {
                shape = buildSoccer(color);
                shape.setAttribute('transform', 'translate(' + (30 * col) + ',' + (30 * row) + ')');
            } else if (shapeType === 'trophy') {
                shape = buildTrophy(color);
                shape.setAttribute('transform', 'translate(' + (35 * col) + ',' + (40 * row) + ')');
            }

            svg.appendChild(shape);
            items--;
            col++;
        }

        // Replace target content with the SVG element — no innerHTML used.
        while (target.firstChild) {
            target.removeChild(target.firstChild);
        }
        target.appendChild(svg);
    }

    // ── Declarative HTML initializer ───────────────────────────────────
    // Scans for [data-infographic] elements and renders each one.

    function initElement(container) {
        var items  = safeInt(container.getAttribute('data-items'),      1, MAX_ITEMS);
        var perCol = safeInt(container.getAttribute('data-per-column'), 1, MAX_ITEMS);
        var type   = container.getAttribute('data-type');
        var segs   = parseSegments(container.getAttribute('data-segments'));

        if (!items || !perCol || !type || !VALID_TYPES[type] || !segs) {
            container.textContent = '[infographic: invalid configuration]';
            return;
        }
        render(container, items, perCol, segs, type);
    }

    document.addEventListener('DOMContentLoaded', function () {
        var nodes = document.querySelectorAll('[data-infographic]');
        for (var i = 0; i < nodes.length; i++) {
            initElement(nodes[i]);
        }
    });

    // ── Programmatic API (backwards-compatible) ────────────────────────
    // doGraph(numberOfItems, itemsPerColumn, [[pct,color],...], shapeType, targetId)

    window.doGraph = function (numberOfItems, itemsPerColumn, percentageColorArray, shapeType, targetId) {
        var items  = safeInt(numberOfItems,  1, MAX_ITEMS);
        var perCol = safeInt(itemsPerColumn, 1, MAX_ITEMS);
        if (!items || !perCol || !VALID_TYPES[shapeType]) return;

        var segs = [];
        for (var i = 0; i < percentageColorArray.length; i++) {
            var color = safeColor(String(percentageColorArray[i][1]));
            var pct   = percentageColorArray[i][0];
            if (!color || isNaN(pct) || pct < 0 || pct > 100) return;
            segs.push([pct, color]);
        }

        var target = document.getElementById(targetId);
        if (!target) return;
        render(target, items, perCol, segs, shapeType);
    };

}());
