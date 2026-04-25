<?php
/**
 * Plugin Name:       Infographic SVG Block
 * Plugin URI:        https://github.com/luizcruz/infographicsSVG
 * Description:       Gutenberg block to render SVG infographics (humans, box, circle, soccer, trophy) from percentage data — no external dependencies.
 * Requires at least: 6.1
 * Requires PHP:      7.4
 * Version:           1.0.0
 * Author:            Luiz Cruz
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       infographic-svg-block
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function infographic_svg_block_init() {
    register_block_type( __DIR__ . '/block.json' );

    wp_register_script(
        'infographic-svg-lib',
        plugins_url( 'assets/infographicSVG.js', __FILE__ ),
        [],
        '1.0.0',
        true
    );
}
add_action( 'init', 'infographic_svg_block_init' );

function infographic_svg_block_enqueue_frontend( $block_content, $block ) {
    if ( isset( $block['blockName'] ) && $block['blockName'] === 'infographic-svg/block' ) {
        wp_enqueue_script( 'infographic-svg-lib' );
    }
    return $block_content;
}
add_filter( 'render_block', 'infographic_svg_block_enqueue_frontend', 10, 2 );
