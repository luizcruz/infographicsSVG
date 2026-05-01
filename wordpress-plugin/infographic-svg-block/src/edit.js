import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
    PanelBody,
    PanelRow,
    SelectControl,
    RangeControl,
    TextControl,
    Button,
    ColorPicker,
    Popover,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { parseSegments, serializeSegments } from './utils';

const SHAPE_OPTIONS = [
    { label: __( 'Humans', 'infographic-svg-block' ),  value: 'humans'  },
    { label: __( 'Box',    'infographic-svg-block' ),  value: 'box'     },
    { label: __( 'Circle', 'infographic-svg-block' ),  value: 'circle'  },
    { label: __( 'Soccer', 'infographic-svg-block' ),  value: 'soccer'  },
    { label: __( 'Trophy', 'infographic-svg-block' ),  value: 'trophy'  },
];

function SegmentRow( { seg, index, onChange, onRemove, canRemove } ) {
    const [ pickerOpen, setPickerOpen ] = useState( false );

    return (
        <PanelRow style={ { flexDirection: 'column', alignItems: 'stretch', gap: '4px', marginBottom: '12px' } }>
            <div style={ { display: 'flex', alignItems: 'center', gap: '8px' } }>
                <button
                    style={ {
                        width: 24, height: 24, borderRadius: 3,
                        background: seg.color, border: '1px solid #aaa',
                        cursor: 'pointer', flexShrink: 0,
                    } }
                    onClick={ () => setPickerOpen( ! pickerOpen ) }
                    aria-label={ __( 'Pick color', 'infographic-svg-block' ) }
                />
                <TextControl
                    label={ __( 'Color', 'infographic-svg-block' ) }
                    hideLabelFromVision
                    value={ seg.color }
                    onChange={ val => onChange( index, { ...seg, color: val } ) }
                    style={ { flex: 1 } }
                />
                { canRemove && (
                    <Button
                        isDestructive
                        variant="tertiary"
                        onClick={ () => onRemove( index ) }
                        style={ { padding: '0 4px' } }
                    >
                        ✕
                    </Button>
                ) }
            </div>
            { pickerOpen && (
                <Popover onClose={ () => setPickerOpen( false ) }>
                    <ColorPicker
                        color={ seg.color }
                        onChange={ val => onChange( index, { ...seg, color: val } ) }
                        enableAlpha={ false }
                    />
                </Popover>
            ) }
            <RangeControl
                label={ __( 'Percentage', 'infographic-svg-block' ) }
                value={ seg.pct }
                onChange={ val => onChange( index, { ...seg, pct: val } ) }
                min={ 1 }
                max={ 100 }
            />
        </PanelRow>
    );
}

export default function Edit( { attributes, setAttributes } ) {
    const { items, perColumn, type, segments } = attributes;
    const blockProps = useBlockProps();
    const segs = parseSegments( segments );

    function updateSeg( idx, updated ) {
        const next = segs.map( ( s, i ) => ( i === idx ? updated : s ) );
        setAttributes( { segments: serializeSegments( next ) } );
    }

    function removeSeg( idx ) {
        const next = segs.filter( ( _, i ) => i !== idx );
        setAttributes( { segments: serializeSegments( next ) } );
    }

    function addSeg() {
        const next = [ ...segs, { pct: 10, color: '#cccccc' } ];
        setAttributes( { segments: serializeSegments( next ) } );
    }

    const totalPct = segs.reduce( ( s, seg ) => s + seg.pct, 0 );

    return (
        <>
            <InspectorControls>
                <PanelBody title={ __( 'Infographic Settings', 'infographic-svg-block' ) } initialOpen={ true }>
                    <SelectControl
                        label={ __( 'Shape type', 'infographic-svg-block' ) }
                        value={ type }
                        options={ SHAPE_OPTIONS }
                        onChange={ val => setAttributes( { type: val } ) }
                    />
                    <RangeControl
                        label={ __( 'Total items', 'infographic-svg-block' ) }
                        value={ items }
                        onChange={ val => setAttributes( { items: val } ) }
                        min={ 1 }
                        max={ 500 }
                    />
                    <RangeControl
                        label={ __( 'Items per column', 'infographic-svg-block' ) }
                        value={ perColumn }
                        onChange={ val => setAttributes( { perColumn: val } ) }
                        min={ 1 }
                        max={ 100 }
                    />
                </PanelBody>

                <PanelBody title={ __( 'Segments', 'infographic-svg-block' ) } initialOpen={ true }>
                    { totalPct !== 100 && (
                        <p style={ { color: '#b45309', fontSize: '0.8em', marginTop: 0 } }>
                            { __( 'Percentages sum to', 'infographic-svg-block' ) } { totalPct }%
                            { totalPct < 100
                                ? __( ' — remaining items get the last color.', 'infographic-svg-block' )
                                : __( ' — exceeds 100%.', 'infographic-svg-block' ) }
                        </p>
                    ) }
                    { segs.map( ( seg, i ) => (
                        <SegmentRow
                            key={ i }
                            seg={ seg }
                            index={ i }
                            onChange={ updateSeg }
                            onRemove={ removeSeg }
                            canRemove={ segs.length > 1 }
                        />
                    ) ) }
                    <Button variant="secondary" onClick={ addSeg } style={ { width: '100%' } }>
                        { __( '+ Add segment', 'infographic-svg-block' ) }
                    </Button>
                </PanelBody>
            </InspectorControls>

            <div { ...blockProps }>
                <div
                    data-infographic
                    data-items={ items }
                    data-per-column={ perColumn }
                    data-type={ type }
                    data-segments={ segments }
                />
                <p style={ { fontSize: '0.75em', color: '#888', marginTop: 4 } }>
                    { __( 'Infographic SVG — preview rendered on the frontend.', 'infographic-svg-block' ) }
                </p>
            </div>
        </>
    );
}
