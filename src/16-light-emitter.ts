export class LightEmitter {
  get visited(): Set<string> {
    return this._visited;
  }
  grid = [];
  private _visited = new Set<string>;

  constructor(input: string) {
    this.constructGrid(input.split('\n'));
    this.traverseMazeBFS(0,0, 'E');
  }

  constructGrid(inputList) {
    for (let index = 0; index < inputList.length; index += 1) {
      const line = inputList[index];
      const gridLine = [...line];
      this.grid.push(gridLine);
    }
  }

  // traverseMazeBFS(row, col, direction) {
  //     this._visited.add(this.getKey(row, col));
  //     this.moveBeam(row, col, direction);
  // }

    traverseMazeBFS(startRow, startCol, direction) {
    let queue = [[startRow, startCol, 0, []]]; // [row, col, pathLen, path]
    const visited = new Set();

    while (queue.length > 0) {
      const [row, col, pathLen, path] = queue.shift();

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
  }

  getKey(row, col) {
    return `${row}-${col}`
  }

  moveBeam(row, col, currentDirection) {
    const currentSymbol = this.grid[row][col];

    if (currentSymbol === '.') {
      // keep going in current direction
      this.moveBeanInDirection(row, col, currentDirection);
    } else if (currentSymbol === '/') {
      if (currentDirection === 'N') {
        this.moveBeanInDirection(row, col, 'E');
      } else if (currentDirection === 'E') {
        this.moveBeanInDirection(row, col, 'N');
      } else if (currentDirection === 'S') {
        this.moveBeanInDirection(row, col, 'W');
      } else if (currentDirection === 'W') {
        this.moveBeanInDirection(row, col, 'S');
      }
    } else if (currentSymbol === '\\') {
      if (currentDirection === 'N') {
        this.moveBeanInDirection(row, col, 'W');
      } else if (currentDirection === 'E') {
        this.moveBeanInDirection(row, col, 'S');
      } else if (currentDirection === 'S') {
        this.moveBeanInDirection(row, col, 'E');
      } else if (currentDirection === 'W') {
        this.moveBeanInDirection(row, col, 'N');
      }
    } else if (currentSymbol === '|') {
      // if hit the pointy end, keep going, if hit the flat end split
      if (currentDirection === 'N') {
        this.moveBeanInDirection(row, col, currentDirection);
      } else if (currentDirection === 'E') {
        this.moveBeanInDirection(row, col, 'N');
        this.moveBeanInDirection(row, col, 'S');
      } else if (currentDirection === 'S') {
        this.moveBeanInDirection(row, col, currentDirection);
      } else if (currentDirection === 'W') {
        this.moveBeanInDirection(row, col, 'N');
        this.moveBeanInDirection(row, col, 'S');
      }
    } else if (currentSymbol === '-') {
      if (currentDirection === 'N') {
        this.moveBeanInDirection(row, col, 'E');
        this.moveBeanInDirection(row, col, 'W');
      } else if (currentDirection === 'E') {
        this.moveBeanInDirection(row, col, currentDirection);
      } else if (currentDirection === 'S') {
        this.moveBeanInDirection(row, col, 'E');
        this.moveBeanInDirection(row, col, 'W');
      } else if (currentDirection === 'W') {
        this.moveBeanInDirection(row, col, currentDirection);
      }
    }
  }

  moveBeanInDirection(row, col, direction) {
    if (direction === 'N') {
      if (row - 1 > 0) {
        this.traverseMazeBFS(row - 1, col, 'N');
      }
    } else if (direction === 'E') {
      if (col + 1 < this.grid.length) {
        this.traverseMazeBFS(row, col + 1, 'E');
      }
    } else if (direction === 'W') {
      if (col - 1 > 0) {
        this.traverseMazeBFS(row, col - 1, 'W');
      }
    } else {
      if (row + 1 < this.grid.length) {
        this.traverseMazeBFS(row + 1, col, 'S');
      }
    }
  }
}