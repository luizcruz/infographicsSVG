/*
    Lib: Infographic SVG
    Author: Luiz Cruz
    Year: 2015
    Updated: 2024 - Added soccer ball ("soccer") and champion trophy ("trophy") shapes
*/

function doGraph(numberOfItems, itemsPerColumn, percentageColorArray, shapeType, targetId) {
    var svgContent = "", svgWrapper = "";
    var items = numberOfItems;
    var col = 1, row = 1;
    var countColor = 1, indexCount = 0;
    var color = "";
    var x, y;

    for (; items > 0;) {
        if (col % (itemsPerColumn + 1) === 0) { row++; col = 1; }

        var select = percentageColorArray[indexCount][0] / 100 * numberOfItems;
        if (countColor < select) {
            color = percentageColorArray[indexCount][1];
            countColor++;
        } else {
            countColor = 1;
            indexCount++;
        }

        if (shapeType === "humans") {
            x = 20 * col; y = 30 * row;
            svgContent += '<g transform="translate(' + x + ',' + y + ')" fill="' + color + '">' +
                '<circle cx="0" cy="-3" r="3"></circle>' +
                '<rect x="-5" y="1" width="10" height="10" rx="2.5" ry="2.5"></rect>' +
                '<rect x="-3" y="1" width="6" height="18" rx="1.5" ry="1.5"></rect>' +
                '</g>';
        }

        if (shapeType === "box") {
            x = 25 * col; y = 30 * row;
            svgContent += '<rect x="' + x + '" y="' + y + '" width="20" height="20"' +
                ' style="fill:' + color + ';stroke:black;stroke-width:1;fill-opacity:0.6;stroke-opacity:.1">' +
                '</rect>';
        }

        if (shapeType === "circle") {
            x = 30 * col; y = 30 * row;
            svgContent += '<circle cx="' + x + '" cy="' + y + '" r="10"' +
                ' stroke="black" stroke-width="2" fill-opacity="0.6" stroke-opacity="0.1" fill="' + color + '">' +
                '</circle>';
        }

        if (shapeType === "soccer") {
            // Classic soccer ball: colored circle with central pentagon patch and 5 seam lines.
            // Pentagon vertices at inner radius 4.5, seam lines connect to circle edge at radius 10.
            x = 30 * col; y = 30 * row;
            svgContent +=
                '<g transform="translate(' + x + ',' + y + ')">' +
                  '<circle cx="0" cy="0" r="10" fill="' + color + '" stroke="#333" stroke-width="1" fill-opacity="0.85"></circle>' +
                  '<polygon points="0,-4.5 4.28,-1.39 2.65,3.64 -2.65,3.64 -4.28,-1.39" fill="#333" opacity="0.35"></polygon>' +
                  '<line x1="0" y1="-10" x2="0" y2="-4.5" stroke="#333" stroke-width="0.7" opacity="0.5"></line>' +
                  '<line x1="9.51" y1="-3.09" x2="4.28" y2="-1.39" stroke="#333" stroke-width="0.7" opacity="0.5"></line>' +
                  '<line x1="5.88" y1="8.09" x2="2.65" y2="3.64" stroke="#333" stroke-width="0.7" opacity="0.5"></line>' +
                  '<line x1="-5.88" y1="8.09" x2="-2.65" y2="3.64" stroke="#333" stroke-width="0.7" opacity="0.5"></line>' +
                  '<line x1="-9.51" y1="-3.09" x2="-4.28" y2="-1.39" stroke="#333" stroke-width="0.7" opacity="0.5"></line>' +
                '</g>';
        }

        if (shapeType === "trophy") {
            // Champion trophy: cup body, two handles, stem, and base.
            // Wider column spacing (35) prevents handle overlap between adjacent trophies.
            x = 35 * col; y = 40 * row;
            svgContent +=
                '<g transform="translate(' + x + ',' + y + ')" fill="' + color + '" fill-opacity="0.85" stroke="#333" stroke-width="1">' +
                  '<path d="M-7,-18 L7,-18 L5,-5 Q0,0 -5,-5 Z"></path>' +
                  '<path d="M-7,-14 Q-11,-9 -7,-6" fill="none" stroke="' + color + '" stroke-width="3" stroke-opacity="0.85"></path>' +
                  '<path d="M7,-14 Q11,-9 7,-6" fill="none" stroke="' + color + '" stroke-width="3" stroke-opacity="0.85"></path>' +
                  '<rect x="-2.5" y="-5" width="5" height="9" stroke-width="0.5"></rect>' +
                  '<rect x="-7" y="4" width="14" height="4" rx="1.5"></rect>' +
                '</g>';
        }

        items--;
        col++;
    }

    if (shapeType === "humans")  svgWrapper = '<svg width="' + 12 * numberOfItems + '" height="' + 4 * numberOfItems + '">' + svgContent + '</svg>';
    if (shapeType === "box")     svgWrapper = '<svg width="' + 7 * numberOfItems + '" height="' + 4 * numberOfItems + '">' + svgContent + '</svg>';
    if (shapeType === "circle")  svgWrapper = '<svg width="' + 12 * numberOfItems + '" height="' + 5 * numberOfItems + '">' + svgContent + '</svg>';
    if (shapeType === "soccer")  svgWrapper = '<svg width="' + 12 * numberOfItems + '" height="' + 5 * numberOfItems + '">' + svgContent + '</svg>';
    if (shapeType === "trophy")  svgWrapper = '<svg width="' + 14 * numberOfItems + '" height="' + 10 * numberOfItems + '">' + svgContent + '</svg>';

    document.getElementById(targetId).innerHTML = svgWrapper;
}
