import { useRef, useEffect, useState } from 'react';
import p5 from 'p5';
import './App.css';

interface TriadOption {
  value: string;
  label: string;
  degrees: number[];
}

const TRIAD_OPTIONS: TriadOption[] = [
  { value: '', label: 'Select a triad', degrees: [] },
  { value: 'I', label: 'I (Major)', degrees: [1, 3, 5] },
  { value: 'ii', label: 'ii (minor)', degrees: [2, 4, 6] },
  { value: 'iii', label: 'iii (minor)', degrees: [3, 5, 7] },
  { value: 'IV', label: 'IV (Major)', degrees: [4, 6, 1] },
  { value: 'V', label: 'V (Major)', degrees: [5, 7, 2] },
  { value: 'vi', label: 'vi (minor)', degrees: [6, 1, 3] },
  { value: 'vii*', label: 'vii° (diminished)', degrees: [7, 2, 4] },
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
const SCALE_MAPPING = [1, null, 2, null, 3, 4, null, 5, null, 6, null, 7];

function App() {
  const sketchRef = useRef<HTMLDivElement>(null);
  const [selectedTriad, setSelectedTriad] = useState<string>('');
  const [cellSize, setCellSize] = useState(getOptimalCellSize());
  const p5Instance = useRef<p5 | null>(null);

  const calculateScaleDegree = (string: number, fret: number): number | null => {
    let noteInSemitones = (BASE_TUNING + (string * STRING_INTERVAL) + fret) % 12;
    
    if (noteInSemitones < 0) {
      noteInSemitones += 12;
    }
    
    return SCALE_MAPPING[noteInSemitones];
  };

  const isTriadNote = (scaleDegree: number, triadDegrees: number[]): boolean => {
    return triadDegrees.includes(scaleDegree);
  };

  const getTriadNoteColor = (scaleDegree: number, triadDegrees: number[]): string => {
    if (triadDegrees.length === 0) return '#DCDCDC';
    
    const index = triadDegrees.indexOf(scaleDegree);
    if (index === -1) return '#DCDCDC';
    
    switch (index) {
      case 0: return '#FFB6C1'; // light red for root
      case 1: return '#FFFF99'; // yellow for third
      case 2: return '#90EE90'; // light green for fifth
      default: return '#DCDCDC';
    }
  };

  const drawCell = (p: p5, x: number, y: number, scaleDegree: number | null, triadDegrees: number[], currentCellSize: number) => {
    p.stroke(128);
    p.strokeWeight(1);
    p.noFill();
    p.rect(x, y, currentCellSize, currentCellSize);
    
    if (scaleDegree !== null) {
      if (triadDegrees.length > 0 && isTriadNote(scaleDegree, triadDegrees)) {
        const color = getTriadNoteColor(scaleDegree, triadDegrees);
        const index = triadDegrees.indexOf(scaleDegree);
        p.fill(color);
        
        // Make root circles bold
        if (index === 0) {
          p.strokeWeight(3);
        } else {
          p.strokeWeight(1);
        }
        p.stroke(0);
        
        const circleRadius = currentCellSize * 0.35;
        p.circle(x + currentCellSize / 2, y + currentCellSize / 2, circleRadius * 2);
        
        // Reset stroke weight for subsequent drawings
        p.strokeWeight(1);
      }
      
      p.fill(0);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(currentCellSize * 0.6);
      p.text(scaleDegree.toString(), x + currentCellSize / 2, y + currentCellSize / 2);
    }
  };

  const drawMatrix = (p: p5, triadDegrees: number[], currentCellSize: number) => {
    p.background(255);
    
    for (let string = 0; string < MATRIX_SIZE; string++) {
      for (let fret = 0; fret < MATRIX_SIZE; fret++) {
        const x = fret * currentCellSize;
        const y = (MATRIX_SIZE - 1 - string) * currentCellSize;
        const scaleDegree = calculateScaleDegree(string, fret);
        
        drawCell(p, x, y, scaleDegree, triadDegrees, currentCellSize);
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
        const selectedTriadOption = TRIAD_OPTIONS.find(option => option.value === selectedTriad);
        const triadDegrees = selectedTriadOption?.degrees || [];
        drawMatrix(p, triadDegrees, cellSize);
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
  }, [selectedTriad, cellSize]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Major scale degree visualizer</h1>
        
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
          <label htmlFor="triad-select" style={{ color: '#333' }}>Select Triad: </label>
          <select 
            id="triad-select"
            value={selectedTriad} 
            onChange={(e) => setSelectedTriad(e.target.value)}
            style={{ padding: '5px', fontSize: '16px' }}
          >
            {TRIAD_OPTIONS.map(option => (
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