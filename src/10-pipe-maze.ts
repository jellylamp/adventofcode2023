import { JSDOM } from 'jsdom';
import { createCanvas } from 'canvas';

export class PipeMaze {
  get insideCoords(): number {
    return this._insideCoords;
  }
  get longestPath(): number {
    return this._longestPath;
  }

  grid = [];
  startingLocationRow = 0;
  startingLocationColumn = 0;
  private _longestPath = 0;
  private longestPathSymbols = [];
  private _insideCoords = 0;

  constructor(input: string) {
    this.constructGrid(input.split('\n'));
    this.longestPathSymbols = this.traverseMazeBFS(this.startingLocationRow, this.startingLocationColumn);
    this._longestPath = this.longestPathSymbols.length;
    this._insideCoords = this.drawPolygonAndListCoords(this.longestPathSymbols).length;
  }

  constructGrid(inputList) {
    for (let index = 0; index < inputList.length; index += 1) {
      const line = inputList[index];
      const indexOfS = line.indexOf('S');

      if (indexOfS !== -1) {
        this.startingLocationColumn = indexOfS;
        this.startingLocationRow = index;
      }

      const gridLine = [...line];
      this.grid.push(gridLine);
    }
  }

  traverseMazeBFS(startRow, startCol) {
    let queue = [[startRow, startCol, 0, []]]; // [row, col, pathLen, path]
    const visited = new Set();

    let longestPath = [];

    while (queue.length > 0) {
      const [row, col, pathLen, path] = queue.shift();

      if (pathLen > longestPath.length) {
        longestPath = path.slice(); // Copy the current path
      }

      if (visited.has(this.getKey(row, col))) {
        continue;
      }

      visited.add(this.getKey(row, col));

      const neighbors = this.getOrthogonalNeighbors(row, col);

      for (const [nextRow, nextCol] of neighbors) {
        if (!visited.has(this.getKey(nextRow, nextCol))) {
          // Add path length
          const nextPathLen = pathLen + 1;
          const nextSymbol = this.grid[nextRow][nextCol];
          const nextPath = path.concat([{ symbol: nextSymbol, coordinates: [nextRow, nextCol] }]);
          queue.push([nextRow, nextCol, nextPathLen, nextPath]);
        }
      }
    }

    return longestPath;
  }

  getKey(row, col) {
    return `${row}-${col}`
  }

  getOrthogonalNeighbors(row, col) {
    const neighbors = [];
    const currentSymbol = this.grid[row][col];

    // Check top neighbor
    if (row > 0) {
      const neighborSymbol = this.grid[row - 1][col];
      const doesIntersect = this.doesSnapTogether(currentSymbol, neighborSymbol, 'N');
      if (doesIntersect) {
        neighbors.push([row - 1, col]);
      }
    }

    // Check bottom neighbor
    if (row < this.grid.length - 1) {
      const neighborSymbol = this.grid[row + 1][col];
      const doesIntersect = this.doesSnapTogether(currentSymbol, neighborSymbol, 'S');
      if (doesIntersect) {
        neighbors.push([row + 1, col]);
      }
    }

    // Check left neighbor
    if (col > 0) {
      const neighborSymbol = this.grid[row][col - 1];
      const doesIntersect = this.doesSnapTogether(currentSymbol, neighborSymbol, 'W');
      if (doesIntersect) {
        neighbors.push([row, col - 1]);
      }
    }

    // Check right neighbor
    if (col < this.grid[0].length - 1) {
      const neighborSymbol = this.grid[row][col + 1];
      const doesIntersect = this.doesSnapTogether(currentSymbol, neighborSymbol, 'E');
      if (doesIntersect) {
        neighbors.push([row, col + 1]);
      }
    }

    return neighbors;
  }

  doesSnapTogether(currentSymbol, strToCheck, neighborDirection) {
    if (strToCheck === '.') {
      return false;
    }

    // Check if the two pipe shapes fit together
    switch (currentSymbol) {
      case '|':
        if (neighborDirection === 'N') {
          return strToCheck === '|' || strToCheck === '7' || strToCheck === 'F';
        } else if (neighborDirection == 'S') {
          return strToCheck === '|' || strToCheck === 'L' || strToCheck === 'J';
        }
        return false;
      case '-':
        if (neighborDirection === 'E') {
          return strToCheck === '-' || strToCheck === '7' || strToCheck === 'J';
        } else if (neighborDirection == 'W') {
          return strToCheck === '-' || strToCheck === 'F' || strToCheck === 'L';
        }
        return false;
      case 'L':
        if (neighborDirection === 'N') {
          return strToCheck === '7' || strToCheck === '|' || strToCheck === 'F';
        } else if (neighborDirection === 'E') {
          return strToCheck === '-' || strToCheck === 'J' || strToCheck === '7';
        }
        return false;
      case 'J':
        if (neighborDirection === 'N') {
          return strToCheck === '|' || strToCheck === '7' || strToCheck === 'F';
        } else if (neighborDirection === 'W') {
          return strToCheck === 'F' || strToCheck === 'L' || strToCheck === '-';
        }
        return false;
      case '7':
        if (neighborDirection === 'S') {
          return strToCheck === '|' || strToCheck === 'J' || strToCheck === 'L';
        } else if (neighborDirection === 'W') {
          return strToCheck === 'L' || strToCheck === '-' || strToCheck === 'F';
        }
        return false;
      case 'F':
        if (neighborDirection === 'S') {
          return strToCheck === 'J' || strToCheck === 'L' || strToCheck === '|';
        } else if (neighborDirection === 'E') {
          return strToCheck === '-' || strToCheck === '7' || strToCheck === 'J';
        }
        return false;
      case 'S':
        if (neighborDirection === 'N') {
          return strToCheck === '|' || strToCheck === '7' || strToCheck === 'F';
        } else if (neighborDirection === 'S') {
          return strToCheck === '|' || strToCheck === 'L' || strToCheck === 'J';
        } else if (neighborDirection === 'E') {
          return strToCheck === '-' || strToCheck === '7' || strToCheck === 'J';
        } else if (neighborDirection === 'W') {
          return strToCheck === '-' || strToCheck === 'L' || strToCheck === 'F';
        }
        return false;
      default:
        return false;
    }
  }

  drawPolygonAndListCoords(path: { symbol: string, coordinates: number[] }[]) {
    const { window } = new JSDOM();
    const document = window.document;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Draw the path
    context.beginPath();

    // set starting location
    context.moveTo(this.startingLocationRow, this.startingLocationColumn);

    for (const step of path) {
      const [x, y] = step.coordinates;
      if (step === path[0]) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }
    context.closePath();

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const insideCoordinates = [];

    for (let x = 0; x < canvasWidth; x++) {
      for (let y = 0; y < canvasHeight; y++) {
        if (context.isPointInPath(x, y) && !this.isCoordinateOnPath(x, y, path)) {
          const helperSymbol = this.grid[x][y];
          insideCoordinates.push([x, y]);
        }
      }
    }

    return insideCoordinates;
  }

  isCoordinateOnPath(x, y, path) {
    // Check if the coordinate (x, y) is part of the given path
    return path.some(step => step.coordinates[0] === x && step.coordinates[1] === y);
  }
}