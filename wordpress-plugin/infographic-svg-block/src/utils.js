/**
 * Parses "pct,color;pct,color;..." into [{pct, color}, ...].
 * Returns empty array on parse failure.
 */
export function parseSegments( raw ) {
    if ( ! raw ) return [];
    return raw.split( ';' ).reduce( ( acc, pair ) => {
        const parts = pair.trim().split( ',' );
        if ( parts.length === 2 ) {
            const pct = parseFloat( parts[ 0 ] );
            const color = parts[ 1 ].trim();
            if ( ! isNaN( pct ) && color ) acc.push( { pct, color } );
        }
        return acc;
    }, [] );
}

/** Serializes [{pct, color}, ...] back to "pct,color;..." */
export function serializeSegments( segs ) {
    return segs.map( s => `${ s.pct },${ s.color }` ).join( ';' );
}

/** Parses "label1;label2;..." into an array of trimmed strings. */
export function parseLegend( raw ) {
    if ( ! raw ) return [];
    return raw.split( ';' ).map( s => s.trim() );
}

/** Serializes an array of label strings back to "label1;label2;..." */
export function serializeLegend( labels ) {
    return labels.join( ';' );
}
