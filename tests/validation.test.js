'use strict';

const {
    _safeColor:     safeColor,
    _safeInt:       safeInt,
    _parseSegments: parseSegments
} = require('../lib/infographicSVG');

// ── safeColor ──────────────────────────────────────────────────────────────

describe('safeColor', () => {
    describe('valid inputs', () => {
        test('accepts 3-digit hex color', () => {
            expect(safeColor('#abc')).toBe('#abc');
        });
        test('accepts 6-digit hex color', () => {
            expect(safeColor('#aabbcc')).toBe('#aabbcc');
        });
        test('accepts uppercase hex color', () => {
            expect(safeColor('#AABBCC')).toBe('#AABBCC');
        });
        test('accepts mixed-case hex color', () => {
            expect(safeColor('#aAbBcC')).toBe('#aAbBcC');
        });
        test('accepts alphabetic CSS color name', () => {
            expect(safeColor('red')).toBe('red');
        });
        test('accepts multi-word-style camelCase color', () => {
            expect(safeColor('darkblue')).toBe('darkblue');
        });
        test('strips surrounding whitespace', () => {
            expect(safeColor('  red  ')).toBe('red');
        });
    });

    describe('security – rejects unsafe values', () => {
        test('rejects empty string', () => {
            expect(safeColor('')).toBeNull();
        });
        test('rejects rgb() functional notation (XSS vector)', () => {
            expect(safeColor('rgb(255,0,0)')).toBeNull();
        });
        test('rejects url() notation', () => {
            expect(safeColor('url(evil.png)')).toBeNull();
        });
        test('rejects javascript: URI', () => {
            expect(safeColor('javascript:alert(1)')).toBeNull();
        });
        test('rejects color name with embedded space', () => {
            expect(safeColor('dark blue')).toBeNull();
        });
        test('rejects semicolon injection attempt', () => {
            expect(safeColor('red;background:url(x)')).toBeNull();
        });
    });

    describe('invalid hex formats', () => {
        test('rejects 4-digit hex', () => {
            expect(safeColor('#abcd')).toBeNull();
        });
        test('rejects 5-digit hex', () => {
            expect(safeColor('#abcde')).toBeNull();
        });
        test('rejects 7-digit hex', () => {
            expect(safeColor('#abcdefg')).toBeNull();
        });
        test('rejects non-hex digits after #', () => {
            expect(safeColor('#xyz')).toBeNull();
        });
        test('rejects bare hash', () => {
            expect(safeColor('#')).toBeNull();
        });
    });
});

// ── safeInt ────────────────────────────────────────────────────────────────

describe('safeInt', () => {
    describe('valid inputs', () => {
        test('parses a valid numeric string', () => {
            expect(safeInt('10', 1, 500)).toBe(10);
        });
        test('accepts a numeric value directly', () => {
            expect(safeInt(10, 1, 500)).toBe(10);
        });
        test('accepts the minimum boundary', () => {
            expect(safeInt('1', 1, 500)).toBe(1);
        });
        test('accepts the maximum boundary', () => {
            expect(safeInt('500', 1, 500)).toBe(500);
        });
        test('truncates float to integer', () => {
            expect(safeInt('10.9', 1, 500)).toBe(10);
        });
    });

    describe('rejection – out-of-range', () => {
        test('rejects value below minimum', () => {
            expect(safeInt('0', 1, 500)).toBeNull();
        });
        test('rejects value above maximum (DoS guard)', () => {
            expect(safeInt('501', 1, 500)).toBeNull();
        });
        test('rejects negative value', () => {
            expect(safeInt('-1', 1, 500)).toBeNull();
        });
    });

    describe('rejection – non-numeric', () => {
        test('rejects alphabetic string', () => {
            expect(safeInt('abc', 1, 500)).toBeNull();
        });
        test('rejects empty string', () => {
            expect(safeInt('', 1, 500)).toBeNull();
        });
        test('rejects null', () => {
            expect(safeInt(null, 1, 500)).toBeNull();
        });
        test('rejects undefined', () => {
            expect(safeInt(undefined, 1, 500)).toBeNull();
        });
    });
});

// ── parseSegments ──────────────────────────────────────────────────────────

describe('parseSegments', () => {
    describe('valid inputs', () => {
        test('parses a single segment', () => {
            expect(parseSegments('100,red')).toEqual([[100, 'red']]);
        });
        test('parses two segments', () => {
            expect(parseSegments('63,red;37,blue')).toEqual([[63, 'red'], [37, 'blue']]);
        });
        test('parses three segments', () => {
            expect(parseSegments('50,red;30,blue;20,green')).toEqual([
                [50, 'red'],
                [30, 'blue'],
                [20, 'green']
            ]);
        });
        test('parses segment with 3-digit hex color', () => {
            expect(parseSegments('100,#abc')).toEqual([[100, '#abc']]);
        });
        test('parses segment with 6-digit hex color', () => {
            expect(parseSegments('50,#ff0000')).toEqual([[50, '#ff0000']]);
        });
        test('accepts zero percentage', () => {
            expect(parseSegments('0,red;100,blue')).toEqual([[0, 'red'], [100, 'blue']]);
        });
        test('accepts 100 percentage', () => {
            expect(parseSegments('100,red')).toEqual([[100, 'red']]);
        });
        test('trims whitespace around values', () => {
            expect(parseSegments(' 50 , red ; 50 , blue ')).toEqual([
                [50, 'red'],
                [50, 'blue']
            ]);
        });
    });

    describe('rejection – malformed structure', () => {
        test('rejects empty string', () => {
            expect(parseSegments('')).toBeNull();
        });
        test('rejects segment with no comma (missing color)', () => {
            expect(parseSegments('63')).toBeNull();
        });
        test('rejects segment with extra comma', () => {
            expect(parseSegments('63,red,extra')).toBeNull();
        });
    });

    describe('rejection – invalid values', () => {
        test('rejects unsafe color (javascript: URI)', () => {
            expect(parseSegments('63,javascript:alert(1)')).toBeNull();
        });
        test('rejects unsafe color (url notation)', () => {
            expect(parseSegments('50,url(evil)')).toBeNull();
        });
        test('rejects percentage above 100', () => {
            expect(parseSegments('101,red')).toBeNull();
        });
        test('rejects negative percentage', () => {
            expect(parseSegments('-1,red')).toBeNull();
        });
        test('rejects non-numeric percentage', () => {
            expect(parseSegments('abc,red')).toBeNull();
        });
        test('rejects unsafe color in one segment while rest are valid', () => {
            expect(parseSegments('50,red;50,javascript:evil')).toBeNull();
        });
    });
});
