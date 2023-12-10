const Array2D = require('array2d');

export class PipeMaze {
  get longestPath(): number {
    return this._longestPath;
  }

  grid = [];
  startingLocationRow = 0;
  startingLocationColumn = 0;
  private _longestPath = 0;
  private longestPathSymbols = [];

  constructor(input: string) {
    this.constructGrid(input.split('\n'));
    this.longestPathSymbols = this.traverseMazeBFS(this.startingLocationRow, this.startingLocationColumn);
    this._longestPath = this.longestPathSymbols.length;
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
                const nextPath = path.concat(this.grid[nextRow][nextCol]); // Store values in the path
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

    // everything matches s except periods
    if (currentSymbol === 'S') {
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