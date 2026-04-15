'use strict';

const {
    _buildHuman:  buildHuman,
    _buildBox:    buildBox,
    _buildCircle: buildCircle,
    _buildSoccer: buildSoccer,
    _buildTrophy: buildTrophy
} = require('../lib/infographicSVG');

// ── buildHuman ─────────────────────────────────────────────────────────────

describe('buildHuman', () => {
    test('returns a <g> SVG element', () => {
        expect(buildHuman('red').tagName).toBe('g');
    });

    test('applies the fill color to the group', () => {
        expect(buildHuman('blue').getAttribute('fill')).toBe('blue');
    });

    test('applies a hex fill color', () => {
        expect(buildHuman('#ff0000').getAttribute('fill')).toBe('#ff0000');
    });

    test('contains exactly one <circle> element (head)', () => {
        expect(buildHuman('red').querySelectorAll('circle')).toHaveLength(1);
    });

    test('contains at least two <rect> elements (shirt + body)', () => {
        expect(buildHuman('red').querySelectorAll('rect').length).toBeGreaterThanOrEqual(2);
    });

    test('head circle is positioned above the body (cy negative)', () => {
        const circle = buildHuman('red').querySelector('circle');
        expect(Number(circle.getAttribute('cy'))).toBeLessThan(0);
    });
});

// ── buildBox ───────────────────────────────────────────────────────────────

describe('buildBox', () => {
    test('returns a <rect> SVG element', () => {
        expect(buildBox(0, 0, 'red').tagName).toBe('rect');
    });

    test('applies x position', () => {
        expect(buildBox(10, 20, 'red').getAttribute('x')).toBe('10');
    });

    test('applies y position', () => {
        expect(buildBox(10, 20, 'red').getAttribute('y')).toBe('20');
    });

    test('applies fill color', () => {
        expect(buildBox(0, 0, '#abc').getAttribute('fill')).toBe('#abc');
    });

    test('has fixed width of 20', () => {
        expect(buildBox(0, 0, 'red').getAttribute('width')).toBe('20');
    });

    test('has fixed height of 20', () => {
        expect(buildBox(0, 0, 'red').getAttribute('height')).toBe('20');
    });

    test('has a black stroke', () => {
        expect(buildBox(0, 0, 'red').getAttribute('stroke')).toBe('black');
    });
});

// ── buildCircle ────────────────────────────────────────────────────────────

describe('buildCircle', () => {
    test('returns a <circle> SVG element', () => {
        expect(buildCircle(10, 20, 'red').tagName).toBe('circle');
    });

    test('applies cx position', () => {
        expect(buildCircle(10, 20, 'red').getAttribute('cx')).toBe('10');
    });

    test('applies cy position', () => {
        expect(buildCircle(10, 20, 'red').getAttribute('cy')).toBe('20');
    });

    test('applies fill color', () => {
        expect(buildCircle(0, 0, '#abc').getAttribute('fill')).toBe('#abc');
    });

    test('has radius of 10', () => {
        expect(buildCircle(0, 0, 'red').getAttribute('r')).toBe('10');
    });

    test('has a black stroke', () => {
        expect(buildCircle(0, 0, 'red').getAttribute('stroke')).toBe('black');
    });
});

// ── buildSoccer ────────────────────────────────────────────────────────────

describe('buildSoccer', () => {
    test('returns a <g> SVG element', () => {
        expect(buildSoccer('white').tagName).toBe('g');
    });

    test('contains exactly one outer <circle>', () => {
        expect(buildSoccer('white').querySelectorAll('circle')).toHaveLength(1);
    });

    test('outer circle has radius 10', () => {
        const circle = buildSoccer('white').querySelector('circle');
        expect(circle.getAttribute('r')).toBe('10');
    });

    test('applies color to outer circle fill', () => {
        const circle = buildSoccer('#00ff00').querySelector('circle');
        expect(circle.getAttribute('fill')).toBe('#00ff00');
    });

    test('contains exactly one <polygon> (pentagon patch)', () => {
        expect(buildSoccer('white').querySelectorAll('polygon')).toHaveLength(1);
    });

    test('contains exactly 5 <line> elements (seam lines)', () => {
        expect(buildSoccer('white').querySelectorAll('line')).toHaveLength(5);
    });
});

// ── buildTrophy ────────────────────────────────────────────────────────────

describe('buildTrophy', () => {
    test('returns a <g> SVG element', () => {
        expect(buildTrophy('gold').tagName).toBe('g');
    });

    test('applies fill color to the group', () => {
        expect(buildTrophy('gold').getAttribute('fill')).toBe('gold');
    });

    test('contains exactly 3 <path> elements (cup body + 2 handles)', () => {
        expect(buildTrophy('gold').querySelectorAll('path')).toHaveLength(3);
    });

    test('contains exactly 2 <rect> elements (stem + base)', () => {
        expect(buildTrophy('gold').querySelectorAll('rect')).toHaveLength(2);
    });

    test('has fill-opacity of 0.85', () => {
        expect(buildTrophy('gold').getAttribute('fill-opacity')).toBe('0.85');
    });
});
