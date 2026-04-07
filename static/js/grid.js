var SVG_NS = 'http://www.w3.org/2000/svg';

function createSVGElement(tag, attrs) {
    var el = document.createElementNS(SVG_NS, tag);
    if (attrs) {
        Object.keys(attrs).forEach(function(key) {
            el.setAttribute(key, attrs[key]);
        });
    }
    return el;
}

function renderCell(parent, x, y, semitonePosition, chordSemitones, cellSize, voiceLeading) {
    var MT = window.MusicTheory;
    var g = createSVGElement('g');

    var isSelected = chordSemitones.size > 0 && chordSemitones.has(semitonePosition);

    var rectAttrs = {
        x: x,
        y: y,
        width: cellSize,
        height: cellSize,
        fill: 'none',
        stroke: '#808080',
        'stroke-width': 1
    };

    if (isSelected) {
        rectAttrs.fill = MT.lightenColor(MT.INTERVAL_BORDER_COLORS[semitonePosition]);
        rectAttrs.stroke = MT.INTERVAL_BORDER_COLORS[semitonePosition];
        rectAttrs['stroke-width'] = semitonePosition === 0 ? 3 : 1;

        if (voiceLeading && voiceLeading.commonTones.has(semitonePosition)) {
            rectAttrs['stroke-dasharray'] = '3,2';
            rectAttrs['stroke-width'] = Math.max(rectAttrs['stroke-width'], 2);
        }
    }

    g.appendChild(createSVGElement('rect', rectAttrs));

    // Interval label
    var text = createSVGElement('text', {
        x: x + cellSize / 2,
        y: y + cellSize / 2,
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
        'font-size': cellSize * 0.45,
        'font-weight': isSelected ? 'bold' : 'normal',
        fill: isSelected ? '#000000' : '#696969',
        'font-family': 'Helvetica Neue, Arial, sans-serif'
    });
    text.textContent = MT.INTERVAL_LABELS[semitonePosition];
    g.appendChild(text);

    parent.appendChild(g);
}

function createGrid(container, config) {
    var MT = window.MusicTheory;
    var matrixSize = config.matrixSize;
    var cellSize = config.cellSize;
    var svg = null;

    function buildSVG() {
        var size = matrixSize * cellSize;
        svg = createSVGElement('svg', {
            width: size,
            height: size,
            viewBox: '0 0 ' + size + ' ' + size,
            style: 'display: block; max-width: 100%; height: auto;'
        });
        container.appendChild(svg);
    }

    function render(chordSemitones, voiceLeading) {
        if (!svg) buildSVG();

        // Clear existing content
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }

        // White background
        svg.appendChild(createSVGElement('rect', {
            x: 0,
            y: 0,
            width: matrixSize * cellSize,
            height: matrixSize * cellSize,
            fill: '#000000'
        }));

        for (var string = 0; string < matrixSize; string++) {
            for (var fret = 0; fret < matrixSize; fret++) {
                var x = fret * cellSize;
                var y = (matrixSize - 1 - string) * cellSize;
                var semitonePosition = MT.calculateSemitonePosition(string, fret);
                renderCell(svg, x, y, semitonePosition, chordSemitones, cellSize, voiceLeading);
            }
        }
    }

    function resize(newCellSize) {
        cellSize = newCellSize;
        if (svg) {
            var size = matrixSize * cellSize;
            svg.setAttribute('width', size);
            svg.setAttribute('height', size);
            svg.setAttribute('viewBox', '0 0 ' + size + ' ' + size);
        }
    }

    function destroy() {
        if (svg && svg.parentNode) {
            svg.parentNode.removeChild(svg);
        }
        svg = null;
    }

    buildSVG();

    return {
        render: render,
        resize: resize,
        destroy: destroy
    };
}
