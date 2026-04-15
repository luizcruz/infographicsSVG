'use strict';

const { _render: render } = require('../lib/infographicSVG');

function makeContainer() {
    const div = document.createElement('div');
    document.body.appendChild(div);
    return div;
}

afterEach(() => {
    document.body.innerHTML = '';
});

// ── SVG output ─────────────────────────────────────────────────────────────

describe('render — SVG output', () => {
    test('appends an <svg> child to the target element', () => {
        const el = makeContainer();
        render(el, 5, 5, [[100, 'red']], 'box');
        expect(el.querySelector('svg')).not.toBeNull();
    });

    test('replaces existing content on re-render (only one <svg> present)', () => {
        const el = makeContainer();
        render(el, 5, 5, [[100, 'red']], 'box');
        render(el, 5, 5, [[100, 'blue']], 'box');
        expect(el.querySelectorAll('svg')).toHaveLength(1);
    });

    test('renders the correct number of items for box type', () => {
        const el = makeContainer();
        render(el, 10, 10, [[100, 'red']], 'box');
        expect(el.querySelector('svg').querySelectorAll('rect')).toHaveLength(10);
    });

    test('renders the correct number of items for circle type', () => {
        const el = makeContainer();
        render(el, 7, 7, [[100, 'red']], 'circle');
        expect(el.querySelector('svg').querySelectorAll('circle')).toHaveLength(7);
    });

    test('renders single item without error', () => {
        const el = makeContainer();
        expect(() => render(el, 1, 1, [[100, 'red']], 'box')).not.toThrow();
        expect(el.querySelectorAll('rect')).toHaveLength(1);
    });

    test('renders MAX_ITEMS (500) without error', () => {
        const el = makeContainer();
        expect(() => render(el, 500, 25, [[100, 'red']], 'box')).not.toThrow();
        expect(el.querySelector('svg').querySelectorAll('rect')).toHaveLength(500);
    });
});

// ── SVG dimensions ─────────────────────────────────────────────────────────

describe('render — SVG dimensions per shape type', () => {
    const cases = [
        ['humans', 10, 120,  40],
        ['box',    10,  70,  40],
        ['circle', 10, 120,  50],
        ['soccer', 10, 120,  50],
        ['trophy', 10, 140, 100]
    ];

    test.each(cases)(
        '%s with n=10 → width=%i height=%i',
        (type, n, expectedW, expectedH) => {
            const el = makeContainer();
            render(el, n, n, [[100, 'red']], type);
            const svg = el.querySelector('svg');
            expect(Number(svg.getAttribute('width'))).toBe(expectedW);
            expect(Number(svg.getAttribute('height'))).toBe(expectedH);
        }
    );
});

// ── Color distribution ─────────────────────────────────────────────────────

describe('render — color distribution', () => {
    test('single-segment: every item gets that color', () => {
        const el = makeContainer();
        render(el, 4, 4, [[100, 'red']], 'box');
        const rects = Array.from(el.querySelectorAll('rect'));
        rects.forEach(r => expect(r.getAttribute('fill')).toBe('red'));
    });

    test('two equal segments: both colors appear in the output', () => {
        const el = makeContainer();
        render(el, 10, 10, [[50, 'red'], [50, 'blue']], 'box');
        const fills = Array.from(el.querySelectorAll('rect')).map(r => r.getAttribute('fill'));
        expect(fills).toContain('red');
        expect(fills).toContain('blue');
    });

    test('last-segment guard: no crash when segment pct < 100 with one segment', () => {
        const el = makeContainer();
        // segment covers 10 % of 10 items = 1 item; the guard prevents out-of-bounds
        expect(() => render(el, 10, 10, [[10, 'red']], 'box')).not.toThrow();
        expect(el.querySelector('svg').querySelectorAll('rect')).toHaveLength(10);
    });

    test('items beyond the last segment keep the last segment color', () => {
        const el = makeContainer();
        // 50 % red, 50 % blue; all items should be either red or blue (no undefined)
        render(el, 10, 10, [[50, 'red'], [50, 'blue']], 'box');
        const fills = Array.from(el.querySelectorAll('rect')).map(r => r.getAttribute('fill'));
        fills.forEach(f => expect(['red', 'blue']).toContain(f));
    });
});

// ── Column wrapping ────────────────────────────────────────────────────────

describe('render — column wrapping', () => {
    test('6 items with 3 per column produces 6 shapes without error', () => {
        const el = makeContainer();
        expect(() => render(el, 6, 3, [[100, 'red']], 'box')).not.toThrow();
        expect(el.querySelectorAll('rect')).toHaveLength(6);
    });

    test('itemsPerColumn equal to numberOfItems (single row) works', () => {
        const el = makeContainer();
        expect(() => render(el, 5, 5, [[100, 'red']], 'circle')).not.toThrow();
        expect(el.querySelectorAll('circle')).toHaveLength(5);
    });

    test('itemsPerColumn of 1 (single column) works', () => {
        const el = makeContainer();
        expect(() => render(el, 4, 1, [[100, 'red']], 'box')).not.toThrow();
        expect(el.querySelectorAll('rect')).toHaveLength(4);
    });
});

// ── All shape types render without error ───────────────────────────────────

describe('render — all shape types', () => {
    test.each(['humans', 'box', 'circle', 'soccer', 'trophy'])(
        'renders %s without throwing',
        (type) => {
            const el = makeContainer();
            expect(() => render(el, 5, 5, [[100, 'red']], type)).not.toThrow();
            expect(el.querySelector('svg')).not.toBeNull();
        }
    );
});
