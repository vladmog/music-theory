(function() {
    'use strict';

    var MT = window.MusicTheory;

    var state = {
        selectedChord: '',
        cellSize: 0,
        grid: null
    };

    function getOptimalCellSize() {
        var viewportWidth = window.innerWidth;
        var viewportHeight = window.innerHeight;
        var padding = 40;
        var headerHeight = 120;

        var cellSizeByWidth = Math.floor((viewportWidth - padding) / MT.MATRIX_SIZE);
        var availableHeight = viewportHeight - headerHeight - padding;
        var cellSizeByHeight = Math.floor(availableHeight / MT.MATRIX_SIZE);

        return Math.min(cellSizeByWidth, cellSizeByHeight);
    }

    function updateDisplay() {
        var selectedOption = MT.CHORD_OPTIONS.find(function(opt) {
            return opt.value === state.selectedChord;
        });
        var chordSemitones = MT.getChordSemitones(selectedOption ? selectedOption.intervals : []);
        state.grid.render(chordSemitones);
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

    function populateChordDropdown() {
        var select = document.getElementById('chord-select');
        MT.CHORD_OPTIONS.forEach(function(option) {
            var opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.label;
            select.appendChild(opt);
        });
    }

    function initEventListeners() {
        document.getElementById('chord-select').addEventListener('change', function(e) {
            handleChordChange(e.target.value);
        });

        document.getElementById('prev-chord-btn').addEventListener('click', handlePrevChord);
        document.getElementById('next-chord-btn').addEventListener('click', handleNextChord);

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
        initEventListeners();
        updateDisplay();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
