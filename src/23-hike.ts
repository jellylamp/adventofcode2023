
export class Hike {
  get longestPath(): number {
    return this._longestPath;
  }

  grid = [];
  startPosition = [];
  endPosition = [];
  private _longestPath = 0;
  private longestPathSymbols = [];

  constructor(input: string) {
    this.constructGrid(input.split('\n'));
    this.startPosition = [0, 1];
    this.endPosition = [this.grid.length - 1, this.grid[0].length - 2];
    this.dfs(this.startPosition, this.endPosition);

    // don't count start position
    this._longestPath = this._longestPath - 1;
    this.markLongestPath();
    this.printGrid();
  }

  constructGrid(inputList) {
    for (let index = 0; index < inputList.length; index += 1) {
      const line = inputList[index];
      const gridLine = [...line];
      this.grid.push(gridLine);
    }
  }

  dfs(start, end, path = []) {
    const [startRow, startCol] = start;
    path = [...path, [startRow, startCol]];

    if (startRow === end[0] && startCol === end[1]) {
      if (path.length > this._longestPath) {
        this._longestPath = path.length;
        this.longestPathSymbols = path;
      }
      return;
    }

    const neighbors = this.getOrthogonalNeighbors(startRow, startCol);
    for (const neighbor of neighbors) {
      const [nextRow, nextColumn] = neighbor;

      // Check if the new position is not already in the path
      if (!path.some(([x, y]) => x === nextRow && y === nextColumn)) {
        const newPath = this.dfs([nextRow, nextColumn], end, path);
        if (newPath) {
          return newPath;
        }
      }
    }

    return null;
  }

  getOrthogonalNeighbors(row, col) {
    const neighbors = [];
    const currentSymbol = this.grid[row][col];
    
    // Check top neighbor
    if (row > 0) {
      const neighborSymbol = this.grid[row - 1][col];
      const isValid = this.isValid(currentSymbol, neighborSymbol, 'N');
      if (isValid) {
        neighbors.push([row - 1, col]);
      }
    }
    // Check bottom neighbor
    if (row < this.grid.length - 1) {
      const neighborSymbol = this.grid[row + 1][col];
      const isValid = this.isValid(currentSymbol, neighborSymbol, 'S');
      if (isValid) {
        neighbors.push([row + 1, col]);
      }
    }
    // Check left neighbor
    if (col > 0) {
      const neighborSymbol = this.grid[row][col - 1];
      const isValid = this.isValid(currentSymbol, neighborSymbol, 'W');
      if (isValid) {
        neighbors.push([row, col - 1]);
      }
    }
    // Check right neighbor
    if (col < this.grid[0].length - 1) {
      const neighborSymbol = this.grid[row][col + 1];
      const isValid = this.isValid(currentSymbol, neighborSymbol, 'E');
      if (isValid) {
        neighbors.push([row, col + 1]);
      }
    }
    return neighbors;
  }

  isValid(currentSymbol, neighborSymbol, directionString) {
    if (currentSymbol === '#') {
      return false;
    } else if (currentSymbol === '.') {
      return true;
    } else {
      // we have hit a slope! We must move the direction of the slope next
      if (currentSymbol === neighborSymbol) {
        // dont move the same direction twice
        return false;
      }
      if (currentSymbol === '^' && directionString === 'N') {
        return true;
      } else if (currentSymbol === '>' && directionString === 'E') {
        return true;
      } else if (currentSymbol === 'v' && directionString === 'S') {
        return true;
      } else if (currentSymbol === '<' && directionString === 'W') {
        return true;
      }

      return false;
    }
  }

  markLongestPath() {
    this.longestPathSymbols.forEach(step => {
      const [row, col] = step;
      this.grid[row][col] = 'O';
    });
  }

  printGrid() {
    for (const row of this.grid) {
      console.log(row.join(''));
    }
  }
}