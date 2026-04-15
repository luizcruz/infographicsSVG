'use strict';

const {
    _initElement: initElement,
    _initAll:     initAll
} = require('../lib/infographicSVG');

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Build a [data-infographic] div with the given attribute overrides.
 * Pass `undefined` as a value to omit that attribute entirely.
 */
function makeElement(overrides = {}) {
    const defaults = {
        'data-infographic': '',
        'data-items':       '10',
        'data-per-column':  '5',
        'data-type':        'box',
        'data-segments':    '100,red'
    };
    const attrs = Object.assign({}, defaults, overrides);
    const div = document.createElement('div');
    for (const [k, v] of Object.entries(attrs)) {
        if (v !== undefined) div.setAttribute(k, v);
    }
    return div;
}

afterEach(() => {
    document.body.innerHTML = '';
});

// ── initElement – happy paths ──────────────────────────────────────────────

describe('initElement — valid configuration', () => {
    test('appends an <svg> element inside the container', () => {
        const el = makeElement();
        initElement(el);
        expect(el.querySelector('svg')).not.toBeNull();
    });

    test.each(['humans', 'box', 'circle', 'soccer', 'trophy'])(
        'renders all valid shape types: %s',
        (type) => {
            const el = makeElement({ 'data-type': type });
            initElement(el);
            expect(el.querySelector('svg')).not.toBeNull();
        }
    );

    test('accepts data-items equal to 1 (minimum)', () => {
        const el = makeElement({ 'data-items': '1' });
        initElement(el);
        expect(el.querySelector('svg')).not.toBeNull();
    });

    test('accepts data-items equal to 500 (MAX_ITEMS)', () => {
        const el = makeElement({ 'data-items': '500', 'data-per-column': '25' });
        initElement(el);
        expect(el.querySelector('svg')).not.toBeNull();
    });

    test('renders multi-segment infographic', () => {
        const el = makeElement({ 'data-segments': '60,red;40,blue' });
        initElement(el);
        expect(el.querySelector('svg')).not.toBeNull();
    });

    test('renders segment with hex color', () => {
        const el = makeElement({ 'data-segments': '100,#ff6600' });
        initElement(el);
        expect(el.querySelector('svg')).not.toBeNull();
    });
});

// ── initElement – invalid configuration ───────────────────────────────────

describe('initElement — invalid configuration', () => {
    const ERROR_MSG = '[infographic: invalid configuration]';

    test('shows error when data-items is missing', () => {
        const el = makeElement({ 'data-items': undefined });
        el.removeAttribute('data-items');
        initElement(el);
        expect(el.textContent).toContain(ERROR_MSG);
        expect(el.querySelector('svg')).toBeNull();
    });

    test('shows error when data-items is 0 (below minimum)', () => {
        const el = makeElement({ 'data-items': '0' });
        initElement(el);
        expect(el.textContent).toContain(ERROR_MSG);
    });

    test('shows error when data-items exceeds MAX_ITEMS (501)', () => {
        const el = makeElement({ 'data-items': '501' });
        initElement(el);
        expect(el.textContent).toContain(ERROR_MSG);
    });

    test('shows error when data-per-column is 0', () => {
        const el = makeElement({ 'data-per-column': '0' });
        initElement(el);
        expect(el.textContent).toContain(ERROR_MSG);
    });

    test('shows error when data-per-column is missing', () => {
        const el = makeElement();
        el.removeAttribute('data-per-column');
        initElement(el);
        expect(el.textContent).toContain(ERROR_MSG);
    });

    test('shows error for unknown data-type', () => {
        const el = makeElement({ 'data-type': 'invalidShape' });
        initElement(el);
        expect(el.textContent).toContain(ERROR_MSG);
    });

    test('shows error when data-type is missing', () => {
        const el = makeElement();
        el.removeAttribute('data-type');
        initElement(el);
        expect(el.textContent).toContain(ERROR_MSG);
    });

    test('shows error for malformed data-segments', () => {
        const el = makeElement({ 'data-segments': 'notvalid' });
        initElement(el);
        expect(el.textContent).toContain(ERROR_MSG);
    });

    test('shows error for unsafe color in data-segments (XSS attempt)', () => {
        const el = makeElement({ 'data-segments': '100,javascript:alert(1)' });
        initElement(el);
        expect(el.textContent).toContain(ERROR_MSG);
    });

    test('shows error for percentage > 100 in data-segments', () => {
        const el = makeElement({ 'data-segments': '101,red' });
        initElement(el);
        expect(el.textContent).toContain(ERROR_MSG);
    });

    test('shows error when data-segments is missing', () => {
        const el = makeElement();
        el.removeAttribute('data-segments');
        initElement(el);
        expect(el.textContent).toContain(ERROR_MSG);
    });
});

// ── initAll ────────────────────────────────────────────────────────────────

describe('initAll', () => {
    test('initialises all [data-infographic] elements in the DOM', () => {
        document.body.innerHTML = `
            <div data-infographic data-items="5" data-per-column="5" data-type="box" data-segments="100,red"></div>
            <div data-infographic data-items="3" data-per-column="3" data-type="circle" data-segments="100,blue"></div>
        `;
        initAll();
        expect(document.body.querySelectorAll('svg')).toHaveLength(2);
    });

    test('does nothing when no [data-infographic] elements exist', () => {
        document.body.innerHTML = '<div id="plain"></div>';
        expect(() => initAll()).not.toThrow();
        expect(document.body.querySelector('svg')).toBeNull();
    });

    test('renders error for invalid elements while still processing valid ones', () => {
        document.body.innerHTML = `
            <div id="good" data-infographic data-items="5" data-per-column="5" data-type="box" data-segments="100,red"></div>
            <div id="bad"  data-infographic data-items="0" data-per-column="5" data-type="box" data-segments="100,red"></div>
        `;
        initAll();
        expect(document.getElementById('good').querySelector('svg')).not.toBeNull();
        expect(document.getElementById('bad').textContent).toContain('[infographic: invalid configuration]');
    });

    test('handles a single valid element', () => {
        document.body.innerHTML = `
            <div data-infographic data-items="1" data-per-column="1" data-type="humans" data-segments="100,red"></div>
        `;
        initAll();
        expect(document.body.querySelector('svg')).not.toBeNull();
    });
});
