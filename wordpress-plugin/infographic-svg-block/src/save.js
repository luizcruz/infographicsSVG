import { useBlockProps } from '@wordpress/block-editor';

/**
 * Outputs the static HTML that the infographicSVG.js library reads on page load.
 * The library initialises any [data-infographic] element automatically.
 */
export default function save( { attributes } ) {
    const { items, perColumn, type, segments } = attributes;

    return (
        <div { ...useBlockProps.save() }>
            <div
                data-infographic
                data-items={ items }
                data-per-column={ perColumn }
                data-type={ type }
                data-segments={ segments }
            />
        </div>
    );
}
