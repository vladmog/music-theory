import { useRef, useEffect, useState } from 'react';
import p5 from 'p5';
import './App.css';

interface ChordOption {
  value: string;
  label: string;
  intervals: string[];
}

const INTERVALS: Record<string, number> = {
  '1': 0, 'b2': 1, '2': 2, 'b3': 3, '3': 4,
  '4': 5, 'b5': 6, '#4': 6, '5': 7, '#5': 8, 'b6': 8,
  '6': 9, 'bb7': 9, 'b7': 10, '7': 11,
};

const INTERVAL_BORDER_COLORS: string[] = [
  '#FF0000', '#AA7733', '#EEBB00', '#007744', '#44CC66', '#2299DD',
  '#EE7700', '#0055BB', '#6644AA', '#BB77FF', '#AA2255', '#FF66AA',
];

function lightenColor(hex: string, amount: number = 0.82): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lr = Math.round(r + (255 - r) * amount);
  const lg = Math.round(g + (255 - g) * amount);
  const lb = Math.round(b + (255 - b) * amount);
  return '#' + [lr, lg, lb].map(c => c.toString(16).padStart(2, '0')).join('');
}

const CHORD_OPTIONS: ChordOption[] = [
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
const getOptimalCellSize = () => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const padding = 40;
  const headerHeight = 120;

  const cellSizeByWidth = Math.floor((viewportWidth - padding) / MATRIX_SIZE);
  const availableHeight = viewportHeight - headerHeight - padding;
  const cellSizeByHeight = Math.floor(availableHeight / MATRIX_SIZE);

  return Math.min(cellSizeByWidth, cellSizeByHeight);
};

const BASE_TUNING = 4;
const STRING_INTERVAL = 5;
const INTERVAL_LABELS = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'];

function App() {
  const sketchRef = useRef<HTMLDivElement>(null);
  const [selectedChord, setSelectedChord] = useState<string>('');
  const [cellSize, setCellSize] = useState(getOptimalCellSize());
  const p5Instance = useRef<p5 | null>(null);

  const calculateSemitonePosition = (string: number, fret: number): number => {
    let noteInSemitones = (BASE_TUNING + (string * STRING_INTERVAL) + fret) % 12;
    if (noteInSemitones < 0) noteInSemitones += 12;
    return noteInSemitones;
  };

  const getChordSemitones = (intervals: string[]): Set<number> => {
    return new Set(intervals.map(interval => INTERVALS[interval]));
  };

  const drawCell = (p: p5, x: number, y: number, semitonePosition: number, chordSemitones: Set<number>, currentCellSize: number) => {
    p.stroke(128);
    p.strokeWeight(1);
    p.noFill();
    p.rect(x, y, currentCellSize, currentCellSize);

    if (chordSemitones.size > 0 && chordSemitones.has(semitonePosition)) {
      const fillColor = lightenColor(INTERVAL_BORDER_COLORS[semitonePosition]);
      const borderColor = INTERVAL_BORDER_COLORS[semitonePosition];
      p.fill(fillColor);

      if (semitonePosition === 0) {
        p.strokeWeight(3);
      } else {
        p.strokeWeight(1);
      }
      p.stroke(borderColor);

      const circleRadius = currentCellSize * 0.35;
      p.circle(x + currentCellSize / 2, y + currentCellSize / 2, circleRadius * 2);

      p.strokeWeight(1);
    }

    p.fill(0);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(currentCellSize * 0.45);
    p.text(INTERVAL_LABELS[semitonePosition], x + currentCellSize / 2, y + currentCellSize / 2);
  };

  const drawMatrix = (p: p5, chordSemitones: Set<number>, currentCellSize: number) => {
    p.background(255);

    for (let string = 0; string < MATRIX_SIZE; string++) {
      for (let fret = 0; fret < MATRIX_SIZE; fret++) {
        const x = fret * currentCellSize;
        const y = (MATRIX_SIZE - 1 - string) * currentCellSize;
        const semitonePosition = calculateSemitonePosition(string, fret);
        drawCell(p, x, y, semitonePosition, chordSemitones, currentCellSize);
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setCellSize(getOptimalCellSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!sketchRef.current) return;

    if (p5Instance.current) {
      p5Instance.current.remove();
    }

    sketchRef.current.innerHTML = '';

    const sketch = (p: p5) => {
      p.setup = () => {
        const canvas = p.createCanvas(MATRIX_SIZE * cellSize, MATRIX_SIZE * cellSize);
        canvas.parent(sketchRef.current!);
        p.noLoop();
      };

      p.draw = () => {
        const selectedChordOption = CHORD_OPTIONS.find(option => option.value === selectedChord);
        const chordSemitones = getChordSemitones(selectedChordOption?.intervals || []);
        drawMatrix(p, chordSemitones, cellSize);
      };
    };

    p5Instance.current = new p5(sketch);
    p5Instance.current.redraw();

    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
  }, [selectedChord, cellSize]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chord interval visualizer</h1>

        <div
          ref={sketchRef}
          style={{
            border: '1px solid #ccc',
            display: 'block',
            backgroundColor: 'white',
            margin: '0 auto',
            maxWidth: '100vw',
            overflow: 'auto'
          }}
        />

        <div style={{ marginTop: '20px' }}>
          <label htmlFor="chord-select" style={{ color: '#333' }}>Select Chord: </label>
          <select
            id="chord-select"
            value={selectedChord}
            onChange={(e) => setSelectedChord(e.target.value)}
            style={{ padding: '5px', fontSize: '16px' }}
          >
            {CHORD_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </header>
    </div>
  );
}

export default App;
