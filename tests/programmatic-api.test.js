'use strict';

// Loading the module attaches window.doGraph and runs initAll() (no-op on empty DOM).
require('../lib/infographicSVG');

// ── Helpers ────────────────────────────────────────────────────────────────

let container;

beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-target';
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.innerHTML = '';
});

// ── Happy paths ────────────────────────────────────────────────────────────

describe('window.doGraph — valid calls', () => {
    test('renders an <svg> into the target element', () => {
        window.doGraph(10, 5, [[100, 'red']], 'box', 'test-target');
        expect(container.querySelector('svg')).not.toBeNull();
    });

    test('renders with multi-segment color array', () => {
        window.doGraph(10, 5, [[50, 'red'], [50, 'blue']], 'box', 'test-target');
        expect(container.querySelector('svg')).not.toBeNull();
    });

    test('renders with hex color', () => {
        window.doGraph(5, 5, [[100, '#ff6600']], 'circle', 'test-target');
        expect(container.querySelector('svg')).not.toBeNull();
    });

    test.each(['humans', 'box', 'circle', 'soccer', 'trophy'])(
        'renders shape type: %s',
        (type) => {
            window.doGraph(5, 5, [[100, 'red']], type, 'test-target');
            expect(container.querySelector('svg')).not.toBeNull();
            container.innerHTML = '';          // reset for next iteration
        }
    );

    test('replaces existing SVG on subsequent calls', () => {
        window.doGraph(5, 5, [[100, 'red']], 'box', 'test-target');
        window.doGraph(5, 5, [[100, 'blue']], 'box', 'test-target');
        expect(container.querySelectorAll('svg')).toHaveLength(1);
    });
});

// ── Silent failure / guard paths ───────────────────────────────────────────

describe('window.doGraph — invalid calls silently do nothing', () => {
    test('does nothing when targetId does not exist', () => {
        expect(() => window.doGraph(10, 5, [[100, 'red']], 'box', 'nonexistent')).not.toThrow();
        expect(container.querySelector('svg')).toBeNull();
    });

    test('does nothing when numberOfItems is 0', () => {
        window.doGraph(0, 5, [[100, 'red']], 'box', 'test-target');
        expect(container.querySelector('svg')).toBeNull();
    });

    test('does nothing when numberOfItems exceeds MAX_ITEMS (501)', () => {
        window.doGraph(501, 5, [[100, 'red']], 'box', 'test-target');
        expect(container.querySelector('svg')).toBeNull();
    });

    test('does nothing when numberOfItems is negative', () => {
        window.doGraph(-1, 5, [[100, 'red']], 'box', 'test-target');
        expect(container.querySelector('svg')).toBeNull();
    });

    test('does nothing when itemsPerColumn is 0', () => {
        window.doGraph(10, 0, [[100, 'red']], 'box', 'test-target');
        expect(container.querySelector('svg')).toBeNull();
    });

    test('does nothing for unknown shape type', () => {
        window.doGraph(10, 5, [[100, 'red']], 'unknownType', 'test-target');
        expect(container.querySelector('svg')).toBeNull();
    });

    test('does nothing when color is a javascript: URI (XSS guard)', () => {
        window.doGraph(10, 5, [[100, 'javascript:alert(1)']], 'box', 'test-target');
        expect(container.querySelector('svg')).toBeNull();
    });

    test('does nothing when color uses url() notation', () => {
        window.doGraph(10, 5, [[100, 'url(evil)']], 'box', 'test-target');
        expect(container.querySelector('svg')).toBeNull();
    });

    test('does nothing when percentage is above 100', () => {
        window.doGraph(10, 5, [[101, 'red']], 'box', 'test-target');
        expect(container.querySelector('svg')).toBeNull();
    });

    test('does nothing when percentage is negative', () => {
        window.doGraph(10, 5, [[-1, 'red']], 'box', 'test-target');
        expect(container.querySelector('svg')).toBeNull();
    });
});
