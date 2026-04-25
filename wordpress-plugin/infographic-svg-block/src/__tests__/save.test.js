import { render } from '@testing-library/react';
import save from '../save';

jest.mock( '@wordpress/block-editor', () => ( {
    useBlockProps: Object.assign(
        jest.fn( () => ( {} ) ),
        { save: jest.fn( () => ( {} ) ) }
    ),
} ) );

const baseAttributes = {
    items: 40,
    perColumn: 10,
    type: 'humans',
    segments: '63,red;33,blue',
};

describe( 'save()', () => {
    test( 'renders a [data-infographic] element', () => {
        const { container } = render( save( { attributes: baseAttributes } ) );
        expect( container.querySelector( '[data-infographic]' ) ).not.toBeNull();
    } );

    test( 'sets data-items attribute', () => {
        const { container } = render( save( { attributes: baseAttributes } ) );
        const el = container.querySelector( '[data-infographic]' );
        expect( el.getAttribute( 'data-items' ) ).toBe( '40' );
    } );

    test( 'sets data-per-column attribute', () => {
        const { container } = render( save( { attributes: baseAttributes } ) );
        const el = container.querySelector( '[data-infographic]' );
        expect( el.getAttribute( 'data-per-column' ) ).toBe( '10' );
    } );

    test( 'sets data-type attribute', () => {
        const { container } = render( save( { attributes: baseAttributes } ) );
        const el = container.querySelector( '[data-infographic]' );
        expect( el.getAttribute( 'data-type' ) ).toBe( 'humans' );
    } );

    test( 'sets data-segments attribute', () => {
        const { container } = render( save( { attributes: baseAttributes } ) );
        const el = container.querySelector( '[data-infographic]' );
        expect( el.getAttribute( 'data-segments' ) ).toBe( '63,red;33,blue' );
    } );

    test( 'reflects a different shape type', () => {
        const { container } = render(
            save( { attributes: { ...baseAttributes, type: 'soccer' } } )
        );
        expect( container.querySelector( '[data-infographic]' ).getAttribute( 'data-type' ) )
            .toBe( 'soccer' );
    } );

    test( 'reflects updated items count', () => {
        const { container } = render(
            save( { attributes: { ...baseAttributes, items: 20, perColumn: 5 } } )
        );
        const el = container.querySelector( '[data-infographic]' );
        expect( el.getAttribute( 'data-items' ) ).toBe( '20' );
        expect( el.getAttribute( 'data-per-column' ) ).toBe( '5' );
    } );

    test( 'reflects updated segments', () => {
        const { container } = render(
            save( { attributes: { ...baseAttributes, segments: '50,#ff0000;50,#0000ff' } } )
        );
        expect(
            container.querySelector( '[data-infographic]' ).getAttribute( 'data-segments' )
        ).toBe( '50,#ff0000;50,#0000ff' );
    } );
} );
