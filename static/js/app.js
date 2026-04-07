(function() {
    'use strict';

    var MT = window.MusicTheory;

    var state = {
        mode: 'chord',
        selectedChord: '',
        selectedScale: '',
        showSevenths: false,
        voiceLeadingEnabled: false,
        previousIntervals: [],
        cellSize: 0,
        grid: null
    };

    function getOptimalCellSize() {
        var viewportWidth = window.innerWidth;
        var viewportHeight = window.innerHeight;
        var padding = 40;
        var headerHeight = 200;

        var cellSizeByWidth = Math.floor((viewportWidth - padding) / MT.MATRIX_SIZE);
        var availableHeight = viewportHeight - headerHeight - padding;
        var cellSizeByHeight = Math.floor(availableHeight / MT.MATRIX_SIZE);

        return Math.min(cellSizeByWidth, cellSizeByHeight);
    }

    function getSelectedIntervals() {
        if (state.mode === 'chord') {
            var opt = MT.CHORD_OPTIONS.find(function(o) { return o.value === state.selectedChord; });
            return opt ? opt.intervals : [];
        } else {
            var opt = MT.SCALE_OPTIONS.find(function(o) { return o.value === state.selectedScale; });
            return opt ? opt.intervals : [];
        }
    }

    function updateDisplay() {
        var intervals = getSelectedIntervals();
        var semitones = MT.getChordSemitones(intervals);

        var voiceLeading = null;
        if (state.mode === 'chord' && state.voiceLeadingEnabled && state.previousIntervals.length > 0 && intervals.length > 0) {
            voiceLeading = MT.computeVoiceLeading(state.previousIntervals, intervals);
        }
        if (state.mode === 'chord' && intervals.length > 0) {
            state.previousIntervals = intervals;
        }

        state.grid.render(semitones, voiceLeading);
        updateInfoPanel(intervals);
    }

    function updateInfoPanel(intervals) {
        var panel = document.getElementById('info-panel');
        panel.innerHTML = '';

        if (state.mode === 'chord') {
            if (intervals.length === 0) return;
            var scales = MT.findContainingScales(intervals);
            if (scales.length === 0) return;

            var h3 = document.createElement('h3');
            h3.textContent = 'Scales containing this chord';
            panel.appendChild(h3);

            var list = document.createElement('div');
            list.className = 'scale-list';
            scales.forEach(function(scale) {
                var item = document.createElement('span');
                item.className = 'scale-item';
                item.textContent = scale.label;
                item.addEventListener('click', function() {
                    switchToScale(scale.value);
                });
                list.appendChild(item);
            });
            panel.appendChild(list);
        } else {
            if (!state.selectedScale) return;
            var chords = MT.buildScaleChords(state.selectedScale, state.showSevenths);
            if (chords.length === 0) {
                var p = document.createElement('p');
                p.textContent = 'Diatonic chords are defined for 7-note scales';
                p.style.color = '#999';
                panel.appendChild(p);
                return;
            }

            var selectedOption = MT.SCALE_OPTIONS.find(function(o) { return o.value === state.selectedScale; });
            var h3 = document.createElement('h3');
            h3.textContent = 'Diatonic chords of ' + (selectedOption ? selectedOption.label : '') + ' scale';
            panel.appendChild(h3);

            var degs = document.createElement('div');
            degs.className = 'chord-degrees';
            chords.forEach(function(chord) {
                var item = document.createElement('span');
                item.className = 'degree';
                item.textContent = chord.numeral + ': ' + chord.label;
                item.addEventListener('click', function() {
                    switchToChord(chord.chordType);
                });
                degs.appendChild(item);
            });
            panel.appendChild(degs);
        }
    }

    function switchToScale(scaleValue) {
        state.mode = 'scale';
        state.selectedScale = scaleValue;
        state.previousIntervals = [];
        document.querySelector('input[name="mode"][value="scale"]').checked = true;
        document.getElementById('chord-controls').style.display = 'none';
        document.getElementById('scale-controls').style.display = 'flex';
        document.getElementById('scale-select').value = scaleValue;
        updateDisplay();
    }

    function switchToChord(chordValue) {
        state.mode = 'chord';
        state.selectedChord = chordValue;
        state.previousIntervals = [];
        document.querySelector('input[name="mode"][value="chord"]').checked = true;
        document.getElementById('chord-controls').style.display = 'flex';
        document.getElementById('scale-controls').style.display = 'none';
        document.getElementById('chord-select').value = chordValue;
        updateDisplay();
    }

    function handleModeChange(mode) {
        state.mode = mode;
        state.previousIntervals = [];
        document.getElementById('chord-controls').style.display = mode === 'chord' ? 'flex' : 'none';
        document.getElementById('scale-controls').style.display = mode === 'scale' ? 'flex' : 'none';
        updateDisplay();
    }

    function handleChordChange(value) {
        state.selectedChord = value;
        updateDisplay();
    }

    function handlePrevChord() {
        var currentIndex = MT.CHORD_OPTIONS.findIndex(function(opt) {
            return opt.value === state.selectedChord;
        });
        if (currentIndex <= 0) {
            state.selectedChord = MT.CHORD_OPTIONS[1].value;
        } else {
            var prevIndex = currentIndex === 1 ? MT.CHORD_OPTIONS.length - 1 : currentIndex - 1;
            state.selectedChord = MT.CHORD_OPTIONS[prevIndex].value;
        }
        document.getElementById('chord-select').value = state.selectedChord;
        updateDisplay();
    }

    function handleNextChord() {
        var currentIndex = MT.CHORD_OPTIONS.findIndex(function(opt) {
            return opt.value === state.selectedChord;
        });
        if (currentIndex <= 0) {
            state.selectedChord = MT.CHORD_OPTIONS[1].value;
        } else {
            var nextIndex = currentIndex === MT.CHORD_OPTIONS.length - 1 ? 1 : currentIndex + 1;
            state.selectedChord = MT.CHORD_OPTIONS[nextIndex].value;
        }
        document.getElementById('chord-select').value = state.selectedChord;
        updateDisplay();
    }

    function handleScaleChange(value) {
        state.selectedScale = value;
        updateDisplay();
    }

    function handlePrevScale() {
        var currentIndex = MT.SCALE_OPTIONS.findIndex(function(opt) {
            return opt.value === state.selectedScale;
        });
        if (currentIndex <= 0) {
            state.selectedScale = MT.SCALE_OPTIONS[1].value;
        } else {
            var prevIndex = currentIndex === 1 ? MT.SCALE_OPTIONS.length - 1 : currentIndex - 1;
            state.selectedScale = MT.SCALE_OPTIONS[prevIndex].value;
        }
        document.getElementById('scale-select').value = state.selectedScale;
        updateDisplay();
    }

    function handleNextScale() {
        var currentIndex = MT.SCALE_OPTIONS.findIndex(function(opt) {
            return opt.value === state.selectedScale;
        });
        if (currentIndex <= 0) {
            state.selectedScale = MT.SCALE_OPTIONS[1].value;
        } else {
            var nextIndex = currentIndex === MT.SCALE_OPTIONS.length - 1 ? 1 : currentIndex + 1;
            state.selectedScale = MT.SCALE_OPTIONS[nextIndex].value;
        }
        document.getElementById('scale-select').value = state.selectedScale;
        updateDisplay();
    }

    function populateChordDropdown() {
        var select = document.getElementById('chord-select');
        MT.CHORD_OPTIONS.forEach(function(option) {
            var opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.label;
            select.appendChild(opt);
        });
    }

    function populateScaleDropdown() {
        var select = document.getElementById('scale-select');
        MT.SCALE_OPTIONS.forEach(function(option) {
            var opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.label;
            select.appendChild(opt);
        });
    }

    function initEventListeners() {
        // Mode toggle
        document.querySelectorAll('input[name="mode"]').forEach(function(radio) {
            radio.addEventListener('change', function(e) {
                handleModeChange(e.target.value);
            });
        });

        // Chord controls
        document.getElementById('chord-select').addEventListener('change', function(e) {
            handleChordChange(e.target.value);
        });
        document.getElementById('prev-chord-btn').addEventListener('click', handlePrevChord);
        document.getElementById('next-chord-btn').addEventListener('click', handleNextChord);

        // Voice leading toggle
        document.getElementById('voice-leading-toggle').addEventListener('change', function(e) {
            state.voiceLeadingEnabled = e.target.checked;
            state.previousIntervals = [];
            updateDisplay();
        });

        // Scale controls
        document.getElementById('scale-select').addEventListener('change', function(e) {
            handleScaleChange(e.target.value);
        });
        document.getElementById('prev-scale-btn').addEventListener('click', handlePrevScale);
        document.getElementById('next-scale-btn').addEventListener('click', handleNextScale);

        // Sevenths toggle
        document.getElementById('sevenths-toggle').addEventListener('change', function(e) {
            state.showSevenths = e.target.checked;
            updateDisplay();
        });

        // Resize
        window.addEventListener('resize', function() {
            var newCellSize = getOptimalCellSize();
            if (newCellSize !== state.cellSize) {
                state.cellSize = newCellSize;
                state.grid.resize(newCellSize);
                updateDisplay();
            }
        });
    }

    function init() {
        state.cellSize = getOptimalCellSize();

        var container = document.getElementById('grid-panel');
        state.grid = createGrid(container, {
            matrixSize: MT.MATRIX_SIZE,
            cellSize: state.cellSize
        });

        populateChordDropdown();
        populateScaleDropdown();
        initEventListeners();
        updateDisplay();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
