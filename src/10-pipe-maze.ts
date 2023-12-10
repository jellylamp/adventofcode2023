const Array2D = require('array2d');

export class PipeMaze {
  get longestPath(): number {
    return this._longestPath;
  }

  grid = [];
  startingLocationRow = 0;
  startingLocationColumn = 0;
  private _longestPath = 0;

  constructor(input: string) {
    this.constructGrid(input.split('\n'));
    this._longestPath = this.traverseThroughMaze(this.startingLocationRow, this.startingLocationColumn, 0);
    this._longestPath = Math.floor(this.longestPath / 2);
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

  traverseThroughMaze(row, column, currentLength, visitedSet = new Set()) {
    const visitedKey = `${row}-${column}`;

    if (visitedSet.has(visitedKey)) {
        return currentLength;
    }
    visitedSet.add(visitedKey);

    // get orthogonal neighbors
    let orthogonals = this.getOrthogonalNeighbors(this.grid, row, column);
    let maxLength = currentLength;

    // continue search
    for (const neighbor of orthogonals) {
      const [nextRow, nextColumn] = neighbor;
      const nextLength = this.traverseThroughMaze(nextRow, nextColumn, currentLength + 1, visitedSet);

      // Update maxLength if the new path is longer
      maxLength = Math.max(maxLength, nextLength);
    }

    return maxLength;
  }

  getOrthogonalNeighbors(grid, row, col) {
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
    if (row < grid.length - 1) {
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
    if (col < grid[0].length - 1) {
      const neighborSymbol = this.grid[row][col + 1];
      const doesIntersect = this.doesSnapTogether(currentSymbol, neighborSymbol, 'E');
      if (doesIntersect) {
        neighbors.push([row, col + 1]);
      }
    }

    return neighbors;
  }

  doesSnapTogether(currentSymbol, strToCheck, neighborDirection) {
    // everything matches s
    if (strToCheck === 'S' || currentSymbol === 'S') {
      return true;
    }

    // Check if the two pipe shapes fit together
    switch (currentSymbol) {
      case '|':
        if (neighborDirection === 'N' || neighborDirection == 'S') {
          return strToCheck === '|' || strToCheck === '7' || strToCheck === 'F' || strToCheck === 'L' || strToCheck === 'J';
        }
        return false;
      case '-':
        if (neighborDirection === 'E' || neighborDirection == 'W') {
          return strToCheck === '-' || strToCheck === '7' || strToCheck === 'J' || strToCheck === 'F' || strToCheck === 'L';
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
      default:
        return false;
    }
  }
}