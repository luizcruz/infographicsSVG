'use strict';

/**
 * @jest-environment jsdom
 */

const path = require('path');

function loadLib() {
    jest.resetModules();
    delete window.doGraph;
    require(path.resolve(__dirname, '../lib/infographicSVG.js'));
}

// ── doGraph: input validation ──────────────────────────────────────────────

describe('doGraph – input validation', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="t"></div>';
        loadLib();
    });

    test('renders SVG for a valid box config', () => {
        window.doGraph(4, 2, [[100, 'blue']], 'box', 't');
        expect(document.getElementById('t').querySelector('svg')).not.toBeNull();
    });

    test('returns early when numberOfItems is 0', () => {
        window.doGraph(0, 2, [[100, 'blue']], 'box', 't');
        expect(document.getElementById('t').querySelector('svg')).toBeNull();
    });

    test('returns early when numberOfItems is negative', () => {
        window.doGraph(-1, 2, [[100, 'blue']], 'box', 't');
        expect(document.getElementById('t').querySelector('svg')).toBeNull();
    });

    test('returns early when numberOfItems exceeds MAX_ITEMS (500)', () => {
        window.doGraph(501, 2, [[100, 'blue']], 'box', 't');
        expect(document.getElementById('t').querySelector('svg')).toBeNull();
    });

    test('renders 500 items (MAX_ITEMS boundary)', () => {
        window.doGraph(500, 50, [[100, 'red']], 'box', 't');
        expect(document.getElementById('t').querySelector('svg')).not.toBeNull();
    });

    test('returns early for an unknown shape type', () => {
        window.doGraph(4, 2, [[100, 'blue']], 'unknown', 't');
        expect(document.getElementById('t').querySelector('svg')).toBeNull();
    });

    test('does not throw when targetId does not exist', () => {
        expect(() => window.doGraph(4, 2, [[100, 'blue']], 'box', 'does-not-exist')).not.toThrow();
    });

    test('returns early for percentage below 0', () => {
        window.doGraph(4, 2, [[-1, 'blue']], 'box', 't');
        expect(document.getElementById('t').querySelector('svg')).toBeNull();
    });

    test('returns early for percentage above 100', () => {
        window.doGraph(4, 2, [[101, 'blue']], 'box', 't');
        expect(document.getElementById('t').querySelector('svg')).toBeNull();
    });
});

// ── doGraph: color whitelist ───────────────────────────────────────────────

describe('doGraph – color whitelist', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="t"></div>';
        loadLib();
    });

    test('accepts #rrggbb hex', () => {
        window.doGraph(2, 2, [[100, '#ff0000']], 'box', 't');
        expect(document.getElementById('t').querySelector('svg')).not.toBeNull();
    });

    test('accepts #rgb short hex', () => {
        window.doGraph(2, 2, [[100, '#f00']], 'box', 't');
        expect(document.getElementById('t').querySelector('svg')).not.toBeNull();
    });

    test('accepts alphabetic CSS color name', () => {
        window.doGraph(2, 2, [[100, 'red']], 'box', 't');
        expect(document.getElementById('t').querySelector('svg')).not.toBeNull();
    });

    test('accepts mixed-case color name', () => {
        window.doGraph(2, 2, [[100, 'DarkBlue']], 'box', 't');
        expect(document.getElementById('t').querySelector('svg')).not.toBeNull();
    });

    test('rejects color containing digits (not hex)', () => {
        window.doGraph(2, 2, [[100, 'red1']], 'box', 't');
        expect(document.getElementById('t').querySelector('svg')).toBeNull();
    });

    test('rejects color with javascript: scheme', () => {
        window.doGraph(2, 2, [[100, 'javascript:alert(1)']], 'box', 't');
        expect(document.getElementById('t').querySelector('svg')).toBeNull();
    });

    test('rejects color with parentheses (e.g. rgb() function)', () => {
        window.doGraph(2, 2, [[100, 'rgb(255,0,0)']], 'box', 't');
        expect(document.getElementById('t').querySelector('svg')).toBeNull();
    });

    test('rejects empty color string', () => {
        window.doGraph(2, 2, [[100, '']], 'box', 't');
        expect(document.getElementById('t').querySelector('svg')).toBeNull();
    });
});

// ── doGraph: all shape types ───────────────────────────────────────────────

describe('doGraph – shape types', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="t"></div>';
        loadLib();
    });

    ['humans', 'box', 'circle', 'soccer', 'trophy'].forEach(type => {
        test(`renders an SVG for shape type "${type}"`, () => {
            window.doGraph(4, 2, [[100, 'steelblue']], type, 't');
            const svg = document.getElementById('t').querySelector('svg');
            expect(svg).not.toBeNull();
            expect(svg.namespaceURI).toBe('http://www.w3.org/2000/svg');
        });
    });
});

// ── doGraph: SVG dimensions ────────────────────────────────────────────────

describe('doGraph – SVG dimensions', () => {
    const cases = [
        { type: 'humans', wMul: 12, hMul: 4  },
        { type: 'box',    wMul: 7,  hMul: 4  },
        { type: 'circle', wMul: 12, hMul: 5  },
        { type: 'soccer', wMul: 12, hMul: 5  },
        { type: 'trophy', wMul: 14, hMul: 10 },
    ];

    beforeEach(() => {
        document.body.innerHTML = '<div id="t"></div>';
        loadLib();
    });

    cases.forEach(({ type, wMul, hMul }) => {
        test(`SVG dimensions for "${type}" with 10 items`, () => {
            window.doGraph(10, 5, [[100, 'red']], type, 't');
            const svg = document.getElementById('t').querySelector('svg');
            expect(svg.getAttribute('width')).toBe(String(wMul * 10));
            expect(svg.getAttribute('height')).toBe(String(hMul * 10));
        });
    });
});

// ── doGraph: element counts ────────────────────────────────────────────────

describe('doGraph – rendered element counts', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="t"></div>';
        loadLib();
    });

    test('box: one <rect> per item', () => {
        window.doGraph(6, 3, [[100, 'red']], 'box', 't');
        const rects = document.getElementById('t').querySelectorAll('svg > rect');
        expect(rects.length).toBe(6);
    });

    test('circle: one <circle> per item', () => {
        window.doGraph(5, 5, [[100, 'green']], 'circle', 't');
        const circles = document.getElementById('t').querySelectorAll('svg > circle');
        expect(circles.length).toBe(5);
    });

    test('humans: one <g> per item', () => {
        window.doGraph(4, 4, [[100, 'navy']], 'humans', 't');
        const groups = document.getElementById('t').querySelectorAll('svg > g');
        expect(groups.length).toBe(4);
    });

    test('soccer: one <g> per item', () => {
        window.doGraph(3, 3, [[100, 'gold']], 'soccer', 't');
        const groups = document.getElementById('t').querySelectorAll('svg > g');
        expect(groups.length).toBe(3);
    });

    test('trophy: one <g> per item', () => {
        window.doGraph(2, 2, [[100, 'goldenrod']], 'trophy', 't');
        const groups = document.getElementById('t').querySelectorAll('svg > g');
        expect(groups.length).toBe(2);
    });
});

// ── doGraph: multiple segments ─────────────────────────────────────────────

describe('doGraph – multiple segments', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="t"></div>';
        loadLib();
    });

    test('renders with two segments', () => {
        window.doGraph(10, 5, [[60, 'red'], [40, 'blue']], 'box', 't');
        expect(document.getElementById('t').querySelector('svg')).not.toBeNull();
    });

    test('renders with three segments', () => {
        window.doGraph(9, 3, [[33, 'red'], [33, 'blue'], [34, 'green']], 'circle', 't');
        expect(document.getElementById('t').querySelector('svg')).not.toBeNull();
    });

    test('segments below 100% still renders all items', () => {
        window.doGraph(10, 5, [[50, 'red']], 'box', 't');
        const rects = document.getElementById('t').querySelectorAll('svg > rect');
        expect(rects.length).toBe(10);
    });

    test('replaces previous SVG on re-render', () => {
        window.doGraph(4, 2, [[100, 'red']], 'box', 't');
        window.doGraph(6, 3, [[100, 'blue']], 'box', 't');
        const svgs = document.getElementById('t').querySelectorAll('svg');
        expect(svgs.length).toBe(1);
        const rects = document.getElementById('t').querySelectorAll('svg > rect');
        expect(rects.length).toBe(6);
    });
});

// ── Declarative API ────────────────────────────────────────────────────────

describe('Declarative API – [data-infographic]', () => {
    test('renders SVG for a valid element', () => {
        document.body.innerHTML = `
            <div data-infographic
                 data-items="4"
                 data-per-column="2"
                 data-type="box"
                 data-segments="100,blue">
            </div>`;
        loadLib();
        expect(document.querySelector('[data-infographic] svg')).not.toBeNull();
    });

    test('renders all valid elements on the page', () => {
        document.body.innerHTML = `
            <div id="a" data-infographic data-items="2" data-per-column="2"
                 data-type="box" data-segments="100,red"></div>
            <div id="b" data-infographic data-items="2" data-per-column="2"
                 data-type="circle" data-segments="100,blue"></div>`;
        loadLib();
        expect(document.getElementById('a').querySelector('svg')).not.toBeNull();
        expect(document.getElementById('b').querySelector('svg')).not.toBeNull();
    });

    test('shows error message for invalid data-type', () => {
        document.body.innerHTML = `
            <div data-infographic data-items="4" data-per-column="2"
                 data-type="invalid" data-segments="100,blue"></div>`;
        loadLib();
        expect(document.querySelector('[data-infographic]').textContent)
            .toBe('[infographic: invalid configuration]');
    });

    test('shows error message when data-items exceeds 500', () => {
        document.body.innerHTML = `
            <div data-infographic data-items="501" data-per-column="2"
                 data-type="box" data-segments="100,blue"></div>`;
        loadLib();
        expect(document.querySelector('[data-infographic]').textContent)
            .toBe('[infographic: invalid configuration]');
    });

    test('shows error message when data-items is missing', () => {
        document.body.innerHTML = `
            <div data-infographic data-per-column="2"
                 data-type="box" data-segments="100,blue"></div>`;
        loadLib();
        expect(document.querySelector('[data-infographic]').textContent)
            .toBe('[infographic: invalid configuration]');
    });

    test('shows error message when data-segments is missing', () => {
        document.body.innerHTML = `
            <div data-infographic data-items="4" data-per-column="2"
                 data-type="box"></div>`;
        loadLib();
        expect(document.querySelector('[data-infographic]').textContent)
            .toBe('[infographic: invalid configuration]');
    });

    test('shows error message for invalid color in data-segments', () => {
        document.body.innerHTML = `
            <div data-infographic data-items="4" data-per-column="2"
                 data-type="box" data-segments="100,javascript:xss"></div>`;
        loadLib();
        expect(document.querySelector('[data-infographic]').textContent)
            .toBe('[infographic: invalid configuration]');
    });

    test('accepts hex colors in data-segments', () => {
        document.body.innerHTML = `
            <div data-infographic data-items="4" data-per-column="2"
                 data-type="box" data-segments="50,#ff0000;50,#0000ff"></div>`;
        loadLib();
        expect(document.querySelector('[data-infographic] svg')).not.toBeNull();
    });

    test('shows error message for malformed data-segments pairs', () => {
        document.body.innerHTML = `
            <div data-infographic data-items="4" data-per-column="2"
                 data-type="box" data-segments="notvalid"></div>`;
        loadLib();
        expect(document.querySelector('[data-infographic]').textContent)
            .toBe('[infographic: invalid configuration]');
    });
});

// ── Security invariants ────────────────────────────────────────────────────

describe('Security invariants', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="t"></div>';
        loadLib();
    });

    test('SVG element is in the SVG namespace (not innerHTML)', () => {
        window.doGraph(2, 2, [[100, 'blue']], 'box', 't');
        const svg = document.getElementById('t').querySelector('svg');
        expect(svg.namespaceURI).toBe('http://www.w3.org/2000/svg');
    });

    test('shape elements are in the SVG namespace', () => {
        window.doGraph(2, 2, [[100, 'blue']], 'box', 't');
        const rect = document.getElementById('t').querySelector('rect');
        expect(rect.namespaceURI).toBe('http://www.w3.org/2000/svg');
    });

    test('MAX_ITEMS (500) renders; 501 does not', () => {
        window.doGraph(500, 50, [[100, 'red']], 'box', 't');
        expect(document.getElementById('t').querySelector('svg')).not.toBeNull();

        document.body.innerHTML = '<div id="t"></div>';
        window.doGraph(501, 50, [[100, 'red']], 'box', 't');
        expect(document.getElementById('t').querySelector('svg')).toBeNull();
    });
});
