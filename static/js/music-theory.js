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
    INTERVAL_LABELS: INTERVAL_LABELS,
    MATRIX_SIZE: MATRIX_SIZE,
    BASE_TUNING: BASE_TUNING,
    STRING_INTERVAL: STRING_INTERVAL,
    lightenColor: lightenColor,
    calculateSemitonePosition: calculateSemitonePosition,
    getChordSemitones: getChordSemitones
};
