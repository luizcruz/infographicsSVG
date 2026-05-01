import { parseSegments, serializeSegments } from '../utils';

// ── parseSegments ──────────────────────────────────────────────────────────

describe( 'parseSegments', () => {
    test( 'parses two segments', () => {
        expect( parseSegments( '63,red;33,blue' ) ).toEqual( [
            { pct: 63, color: 'red' },
            { pct: 33, color: 'blue' },
        ] );
    } );

    test( 'parses a single segment', () => {
        expect( parseSegments( '100,steelblue' ) ).toEqual( [
            { pct: 100, color: 'steelblue' },
        ] );
    } );

    test( 'parses hex color values', () => {
        expect( parseSegments( '50,#ff0000;50,#0000ff' ) ).toEqual( [
            { pct: 50, color: '#ff0000' },
            { pct: 50, color: '#0000ff' },
        ] );
    } );

    test( 'parses float percentages', () => {
        expect( parseSegments( '33.5,red;66.5,blue' ) ).toEqual( [
            { pct: 33.5, color: 'red' },
            { pct: 66.5, color: 'blue' },
        ] );
    } );

    test( 'trims whitespace around pairs', () => {
        expect( parseSegments( ' 50 , red ; 50 , blue ' ) ).toEqual( [
            { pct: 50, color: 'red' },
            { pct: 50, color: 'blue' },
        ] );
    } );

    test( 'returns empty array for empty string', () => {
        expect( parseSegments( '' ) ).toEqual( [] );
    } );

    test( 'returns empty array for null', () => {
        expect( parseSegments( null ) ).toEqual( [] );
    } );

    test( 'returns empty array for undefined', () => {
        expect( parseSegments( undefined ) ).toEqual( [] );
    } );

    test( 'skips malformed pairs (no comma)', () => {
        expect( parseSegments( 'badpair;50,blue' ) ).toEqual( [
            { pct: 50, color: 'blue' },
        ] );
    } );

    test( 'skips pairs with non-numeric percentage', () => {
        expect( parseSegments( 'abc,red;50,blue' ) ).toEqual( [
            { pct: 50, color: 'blue' },
        ] );
    } );

    test( 'parses five segments', () => {
        const result = parseSegments( '20,red;20,blue;20,green;20,gold;20,gray' );
        expect( result ).toHaveLength( 5 );
        expect( result[ 4 ] ).toEqual( { pct: 20, color: 'gray' } );
    } );
} );

// ── serializeSegments ──────────────────────────────────────────────────────

describe( 'serializeSegments', () => {
    test( 'serializes two segments', () => {
        expect( serializeSegments( [
            { pct: 63, color: 'red' },
            { pct: 33, color: 'blue' },
        ] ) ).toBe( '63,red;33,blue' );
    } );

    test( 'serializes a single segment', () => {
        expect( serializeSegments( [ { pct: 100, color: '#ffffff' } ] ) ).toBe( '100,#ffffff' );
    } );

    test( 'returns empty string for empty array', () => {
        expect( serializeSegments( [] ) ).toBe( '' );
    } );

    test( 'preserves float percentages', () => {
        expect( serializeSegments( [ { pct: 33.5, color: 'red' } ] ) ).toBe( '33.5,red' );
    } );

    test( 'round-trips with parseSegments', () => {
        const original = '60,red;40,blue';
        const segs = parseSegments( original );
        expect( serializeSegments( segs ) ).toBe( original );
    } );

    test( 'serializes five segments', () => {
        const segs = [
            { pct: 20, color: 'red' },
            { pct: 20, color: 'blue' },
            { pct: 20, color: 'green' },
            { pct: 20, color: 'gold' },
            { pct: 20, color: 'gray' },
        ];
        expect( serializeSegments( segs ) ).toBe( '20,red;20,blue;20,green;20,gold;20,gray' );
    } );
} );
