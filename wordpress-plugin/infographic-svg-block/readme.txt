=== Infographic SVG Block ===
Contributors:      luizcruz
Tags:              block, infographic, svg, pictogram, chart
Tested up to:      6.7
Stable tag:        1.0.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A Gutenberg block that renders SVG pictogram infographics from percentage data — no external dependencies.

== Description ==

Add visual pictogram infographics to any page or post using the WordPress block editor (Gutenberg).

**Shape types:**

* **Humans** – pictogram people icons, ideal for population data
* **Box** – simple squares for category comparisons
* **Circle** – coloured circles for multi-category data
* **Soccer** – classic soccer-ball icon with pentagon patch and seam lines
* **Trophy** – champion trophy silhouette for sports titles or achievements

**Features:**

* Sidebar controls for total items, items per column, shape type, and colour segments
* Live colour picker per segment
* Percentage validator that warns when segments don't sum to 100%
* No jQuery, no external CDN — lightweight, self-contained
* Secure SVG rendering: DOM-based construction, whitelisted colour values, no innerHTML

**Data format:**

Segments are stored as `percentage,color;percentage,color;...`, e.g.:

    60,#27ae60;40,#e74c3c

Percentages don't have to sum exactly to 100%; surplus items receive the last segment colour.

== Installation ==

1. Upload the `infographic-svg-block` folder to `/wp-content/plugins/`.
2. Activate the plugin through the **Plugins** menu in WordPress.
3. In the block editor, search for **Infographic SVG** and insert it into your content.

**Development build (from source):**

    cd infographic-svg-block
    npm install
    npm run build

If you update `lib/infographicSVG.js` in the parent project, run:

    npm run sync-lib

to copy the latest version into `assets/`.

== Changelog ==

= 1.0.0 =
* Initial release: humans, box, circle, soccer, trophy shapes with full sidebar controls.
