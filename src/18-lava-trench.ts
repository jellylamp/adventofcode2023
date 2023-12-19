export class LavaTrench {
  get filledSqFt(): number {
    return this._filledSqFt;
  }
  grid = [];
  private _filledSqFt = 0;
  private polygonPoints = [];

  constructor(input: string) {
    const inputArr = input.split('\n');
    this.digTrenchFromInstructions(inputArr);
    this.digRestOfTheTrench();
    this.printGrid();
  }

  digRestOfTheTrench() {
    const copy = this.grid.map(innerArr => innerArr.slice());
    for (let row = 0; row < copy.length; row += 1) {
      for (let col = 0; col < copy[0].length; col += 1) {
        if (copy[row][col] !== '.') {
          this._filledSqFt += 1;
        } else if (this.isPointInsidePolygon(row, col)) {
          this._filledSqFt += 1;
          this.grid[row][col] = '#';
        }
      }
    }
  }

  isPointInsidePolygon(row, col) {
    let isInside = false;

    for (let i = 0, j = this.polygonPoints.length - 1; i < this.polygonPoints.length; j = i++) {
      const x1 = this.polygonPoints[i][0];
      const y1 = this.polygonPoints[i][1];
      const x2 = this.polygonPoints[j][0];
      const y2 = this.polygonPoints[j][1];

      const doesRayIntersect = ((y1 > col) !== (y2 > col)) &&
        (row < (x2 - x1) * (col - y1) / (y2 - y1) + x1);

      if (doesRayIntersect) {
        isInside = !isInside;
      }
    }

    return isInside;
  }

  digTrenchFromInstructions(inputArr) {
    // theory, the array probably wont get THAT big we could start with a 100x100 grid and see if it fills up?
    this.grid = Array.from({ length: 500 }, () => Array(500).fill('.'));

    let currentRow = 200;
    let currentCol = 200;

    inputArr.forEach(line => {
      const instructions = line.split(' ');
      const dir = instructions[0];
      const spacesToMove = parseInt(instructions[1]);
      const hexToColor = instructions[2].replaceAll('(', '').replaceAll(')', '');

      if (dir === 'R') {
        for (let i = 0; i < spacesToMove; i += 1) {
          this.grid[currentRow][currentCol + i] = '#';
          this.polygonPoints.push([currentRow, currentCol + i]);
        }
        currentCol += spacesToMove;
      } else if (dir === 'L') {
        for (let i = 0; i < spacesToMove; i += 1) {
          this.grid[currentRow][currentCol - i] = '#';
          this.polygonPoints.push([currentRow, currentCol - i]);
        }
        currentCol -= spacesToMove;
      } else if (dir === 'U') {
        for (let i = 0; i < spacesToMove; i += 1) {
          this.grid[currentRow - i][currentCol] = '#';
          this.polygonPoints.push([currentRow - i, currentCol]);
        }
        currentRow -= spacesToMove;
      } else {
        for (let i = 0; i < spacesToMove; i += 1) {
          this.grid[currentRow + i][currentCol] = '#';
          this.polygonPoints.push([currentRow + i, currentCol]);
        }
        currentRow += spacesToMove;
      }
    });
  }

  printGrid() {
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[0].length; col++) {
        process.stdout.write(this.grid[row][col] + ' ');
      }
      process.stdout.write('\n');
    }
  }
}