const INTERVALS = {
    '1': 0, 'b2': 1, '2': 2, 'b3': 3, '3': 4,
    '4': 5, 'b5': 6, '#4': 6, '5': 7, '#5': 8, 'b6': 8,
    '6': 9, 'bb7': 9, 'b7': 10, '7': 11,
};

const INTERVAL_BORDER_COLORS = [
    '#FF0000', '#AA7733', '#EEBB00', '#007744', '#44CC66', '#2299DD',
    '#EE7700', '#0055BB', '#6644AA', '#BB77FF', '#AA2255', '#FF66AA',
];

const CHORD_OPTIONS = [
    { value: '',        label: 'Select a chord',          intervals: [] },
    { value: 'maj',     label: 'Major',                   intervals: ['1', '3', '5'] },
    { value: 'min',     label: 'Minor',                   intervals: ['1', 'b3', '5'] },
    { value: 'dim',     label: 'Diminished',              intervals: ['1', 'b3', 'b5'] },
    { value: 'aug',     label: 'Augmented',               intervals: ['1', '3', '#5'] },
    { value: 'maj7',    label: 'Major 7th',               intervals: ['1', '3', '5', '7'] },
    { value: 'min7',    label: 'Minor 7th',               intervals: ['1', 'b3', '5', 'b7'] },
    { value: '7',       label: 'Dominant 7th',            intervals: ['1', '3', '5', 'b7'] },
    { value: 'dim7',    label: 'Diminished 7th',          intervals: ['1', 'b3', 'b5', 'bb7'] },
    { value: 'min7b5',  label: 'Half-Diminished',         intervals: ['1', 'b3', 'b5', 'b7'] },
    { value: 'sus2',    label: 'Suspended 2nd',           intervals: ['1', '2', '5'] },
    { value: 'sus4',    label: 'Suspended 4th',           intervals: ['1', '4', '5'] },
    { value: 'add9',    label: 'Add 9',                   intervals: ['1', '3', '5', '2'] },
    { value: 'madd9',   label: 'Minor Add 9',             intervals: ['1', 'b3', '5', '2'] },
    { value: '6',       label: 'Major 6th',               intervals: ['1', '3', '5', '6'] },
    { value: 'min6',    label: 'Minor 6th',               intervals: ['1', 'b3', '5', '6'] },
    { value: 'minmaj7', label: 'Minor Major 7th',         intervals: ['1', 'b3', '5', '7'] },
    { value: 'augmaj7', label: 'Augmented Major 7th',     intervals: ['1', '3', '#5', '7'] },
    { value: 'maj9',    label: 'Major 9th',               intervals: ['1', '3', '5', '7', '2'] },
    { value: 'min9',    label: 'Minor 9th',               intervals: ['1', 'b3', '5', 'b7', '2'] },
    { value: '9',       label: 'Dominant 9th',            intervals: ['1', '3', '5', 'b7', '2'] },
    { value: '13',      label: 'Dominant 13th',           intervals: ['1', '3', '5', 'b7', '6'] },
    { value: '7sus4',   label: 'Dominant 7th sus4',       intervals: ['1', '4', '5', 'b7'] },
    { value: '5',       label: 'Power Chord',             intervals: ['1', '5'] },
];

const SCALE_OPTIONS = [
    { value: '',                label: 'Select a scale',     intervals: [] },
    { value: 'major',           label: 'Major',              intervals: ['1', '2', '3', '4', '5', '6', '7'] },
    { value: 'natural_minor',   label: 'Natural Minor',      intervals: ['1', '2', 'b3', '4', '5', 'b6', 'b7'] },
    { value: 'harmonic_minor',  label: 'Harmonic Minor',     intervals: ['1', '2', 'b3', '4', '5', 'b6', '7'] },
    { value: 'melodic_minor',   label: 'Melodic Minor',      intervals: ['1', '2', 'b3', '4', '5', '6', '7'] },
    { value: 'pentatonic_major',label: 'Major Pentatonic',   intervals: ['1', '2', '3', '5', '6'] },
    { value: 'pentatonic_minor',label: 'Minor Pentatonic',   intervals: ['1', 'b3', '4', '5', 'b7'] },
    { value: 'blues',           label: 'Blues',              intervals: ['1', 'b3', '4', 'b5', '5', 'b7'] },
    { value: 'dorian',          label: 'Dorian',             intervals: ['1', '2', 'b3', '4', '5', '6', 'b7'] },
    { value: 'phrygian',        label: 'Phrygian',           intervals: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'] },
    { value: 'lydian',          label: 'Lydian',             intervals: ['1', '2', '3', '#4', '5', '6', '7'] },
    { value: 'mixolydian',      label: 'Mixolydian',         intervals: ['1', '2', '3', '4', '5', '6', 'b7'] },
    { value: 'locrian',         label: 'Locrian',            intervals: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'] },
];

const SCALE_CHORD_DATA = {
    'major': {
        triads:          ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'],
        sevenths:        ['maj7', 'min7', 'min7', 'maj7', '7', 'min7', 'min7b5'],
        numerals:        ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii\u00B0'],
        numeralSevenths: ['Imaj7', 'ii7', 'iii7', 'IVmaj7', 'V7', 'vi7', 'vii\u00F87']
    },
    'natural_minor': {
        triads:          ['min', 'dim', 'maj', 'min', 'min', 'maj', 'maj'],
        sevenths:        ['min7', 'min7b5', 'maj7', 'min7', 'min7', 'maj7', '7'],
        numerals:        ['i', 'ii\u00B0', 'III', 'iv', 'v', 'VI', 'VII'],
        numeralSevenths: ['i7', 'ii\u00F87', 'IIImaj7', 'iv7', 'v7', 'VImaj7', 'VII7']
    },
    'dorian': {
        triads:          ['min', 'min', 'maj', 'maj', 'min', 'dim', 'maj'],
        sevenths:        ['min7', 'min7', 'maj7', '7', 'min7', 'min7b5', 'maj7'],
        numerals:        ['i', 'ii', 'III', 'IV', 'v', 'vi\u00B0', 'VII'],
        numeralSevenths: ['i7', 'ii7', 'IIImaj7', 'IV7', 'v7', 'vi\u00F87', 'VIImaj7']
    },
    'phrygian': {
        triads:          ['min', 'maj', 'maj', 'min', 'dim', 'maj', 'min'],
        sevenths:        ['min7', 'maj7', '7', 'min7', 'min7b5', 'maj7', 'min7'],
        numerals:        ['i', 'II', 'III', 'iv', 'v\u00B0', 'VI', 'vii'],
        numeralSevenths: ['i7', 'IImaj7', 'III7', 'iv7', 'v\u00F87', 'VImaj7', 'vii7']
    },
    'lydian': {
        triads:          ['maj', 'maj', 'min', 'dim', 'maj', 'min', 'min'],
        sevenths:        ['maj7', '7', 'min7', 'min7b5', 'maj7', 'min7', 'min7'],
        numerals:        ['I', 'II', 'iii', 'iv\u00B0', 'V', 'vi', 'vii'],
        numeralSevenths: ['Imaj7', 'II7', 'iii7', 'iv\u00F87', 'Vmaj7', 'vi7', 'vii7']
    },
    'mixolydian': {
        triads:          ['maj', 'min', 'dim', 'maj', 'min', 'min', 'maj'],
        sevenths:        ['7', 'min7', 'min7b5', 'maj7', 'min7', 'min7', 'maj7'],
        numerals:        ['I', 'ii', 'iii\u00B0', 'IV', 'v', 'vi', 'VII'],
        numeralSevenths: ['I7', 'ii7', 'iii\u00F87', 'IVmaj7', 'v7', 'vi7', 'VIImaj7']
    },
    'locrian': {
        triads:          ['dim', 'maj', 'min', 'min', 'maj', 'maj', 'min'],
        sevenths:        ['min7b5', 'maj7', 'min7', 'min7', 'maj7', '7', 'min7'],
        numerals:        ['i\u00B0', 'II', 'iii', 'iv', 'V', 'VI', 'vii'],
        numeralSevenths: ['i\u00F87', 'IImaj7', 'iii7', 'iv7', 'Vmaj7', 'VI7', 'vii7']
    },
    'harmonic_minor': {
        triads:          ['min', 'dim', 'aug', 'min', 'maj', 'maj', 'dim'],
        sevenths:        ['minmaj7', 'min7b5', 'augmaj7', 'min7', '7', 'maj7', 'dim7'],
        numerals:        ['i', 'ii\u00B0', 'III+', 'iv', 'V', 'VI', 'vii\u00B0'],
        numeralSevenths: ['imMaj7', 'ii\u00F87', 'III+maj7', 'iv7', 'V7', 'VImaj7', 'vii\u00B07']
    },
    'melodic_minor': {
        triads:          ['min', 'min', 'aug', 'maj', 'maj', 'dim', 'dim'],
        sevenths:        ['minmaj7', 'min7', 'augmaj7', '7', '7', 'min7b5', 'min7b5'],
        numerals:        ['i', 'ii', 'III+', 'IV', 'V', 'vi\u00B0', 'vii\u00B0'],
        numeralSevenths: ['imMaj7', 'ii7', 'III+maj7', 'IV7', 'V7', 'vi\u00F87', 'vii\u00F87']
    }
};

function buildScaleChords(scaleType, sevenths) {
    var data = SCALE_CHORD_DATA[scaleType];
    if (!data) return [];
    var qualities = sevenths ? data.sevenths : data.triads;
    var numerals = sevenths ? data.numeralSevenths : data.numerals;
    var results = [];
    for (var i = 0; i < qualities.length; i++) {
        var chordType = qualities[i];
        var chord = CHORD_OPTIONS.find(function(opt) { return opt.value === chordType; });
        results.push({
            degree: i + 1,
            numeral: numerals[i],
            chordType: chordType,
            label: chord ? chord.label : chordType,
            intervals: chord ? chord.intervals : []
        });
    }
    return results;
}

function findContainingScales(chordIntervals) {
    var chordSemitones = chordIntervals.map(function(i) { return INTERVALS[i]; });
    var results = [];
    SCALE_OPTIONS.forEach(function(scale) {
        if (scale.intervals.length === 0) return;
        var scaleSemitones = scale.intervals.map(function(i) { return INTERVALS[i]; });
        var containsAll = chordSemitones.every(function(s) { return scaleSemitones.indexOf(s) !== -1; });
        if (containsAll) results.push(scale);
    });
    return results;
}

function computeVoiceLeading(prevIntervals, currIntervals) {
    var prevSemitones = new Set(prevIntervals.map(function(i) { return INTERVALS[i]; }));
    var currSemitones = new Set(currIntervals.map(function(i) { return INTERVALS[i]; }));
    var commonTones = [];
    var addedTones = [];
    var removedTones = [];
    currSemitones.forEach(function(s) {
        if (prevSemitones.has(s)) commonTones.push(s);
        else addedTones.push(s);
    });
    prevSemitones.forEach(function(s) {
        if (!currSemitones.has(s)) removedTones.push(s);
    });
    return { commonTones: new Set(commonTones), addedTones: new Set(addedTones), removedTones: new Set(removedTones) };
}

const MATRIX_SIZE = 15;
const BASE_TUNING = 4;
const STRING_INTERVAL = 5;
const INTERVAL_LABELS = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'];

function lightenColor(hex, amount) {
    if (amount === undefined) amount = 0.82;
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    var lr = Math.round(r + (255 - r) * amount);
    var lg = Math.round(g + (255 - g) * amount);
    var lb = Math.round(b + (255 - b) * amount);
    return '#' + [lr, lg, lb].map(function(c) { return c.toString(16).padStart(2, '0'); }).join('');
}

function calculateSemitonePosition(string, fret) {
    var noteInSemitones = (BASE_TUNING + (string * STRING_INTERVAL) + fret) % 12;
    if (noteInSemitones < 0) noteInSemitones += 12;
    return noteInSemitones;
}

function getChordSemitones(intervals) {
    return new Set(intervals.map(function(interval) { return INTERVALS[interval]; }));
}

window.MusicTheory = {
    INTERVALS: INTERVALS,
    INTERVAL_BORDER_COLORS: INTERVAL_BORDER_COLORS,
    CHORD_OPTIONS: CHORD_OPTIONS,
    SCALE_OPTIONS: SCALE_OPTIONS,
    SCALE_CHORD_DATA: SCALE_CHORD_DATA,
    INTERVAL_LABELS: INTERVAL_LABELS,
    MATRIX_SIZE: MATRIX_SIZE,
    BASE_TUNING: BASE_TUNING,
    STRING_INTERVAL: STRING_INTERVAL,
    lightenColor: lightenColor,
    calculateSemitonePosition: calculateSemitonePosition,
    getChordSemitones: getChordSemitones,
    buildScaleChords: buildScaleChords,
    findContainingScales: findContainingScales,
    computeVoiceLeading: computeVoiceLeading
};
