
interface NextMove {
  nextRow: number,
  nextCol: number,
  nextDir: string
}

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
    let queue = [[startRow, startCol, direction, []]]; // [row, col, pathLen, path]
    const visited = new Set();

    while (queue.length > 0) {
      const [row, col, direction, path] = queue.shift();

      if (visited.has(this.getKey(row, col))) {
        continue;
      }

      // for the bfs we can about revisiting direction; for the overall grid we dont
      visited.add(this.getDirectionalKey(row, col, direction));
      this.visited.add(this.getKey(row, col));

      const nextMoves = this.moveBeam(row, col, direction);

      nextMoves.forEach(nextMove => {
        // if undefined we went outside the bounds of the grid, stop.
        if (nextMove !== undefined) {
          if (!visited.has(this.getDirectionalKey(nextMove.nextRow, nextMove.nextCol, nextMove.nextDir))) {
            const nextSymbol = this.grid[nextMove.nextRow][nextMove.nextCol];
            const nextPath = path.concat([{
              symbol: nextSymbol,
              coordinates: [nextMove.nextRow, nextMove.nextCol],
              direction: nextMove.nextDir
            }]);
            queue.push([nextMove.nextRow, nextMove.nextCol, nextMove.nextDir, nextPath]);
          }
        }
      });
    }
  }

  getDirectionalKey(row, col, dir) {
    return `${row}-${col}-${dir}`;
  }

  getKey(row, col) {
    return `${row}-${col}`;
  }

  moveBeam(row, col, currentDirection) {
    const currentSymbol = this.grid[row][col];
    const nextMove = [];

    if (currentSymbol === '.') {
      // keep going in current direction
      nextMove.push(this.moveBeamInDirection(row, col, currentDirection));
    } else if (currentSymbol === '/') {
      if (currentDirection === 'N') {
        nextMove.push(this.moveBeamInDirection(row, col, 'E'));
      } else if (currentDirection === 'E') {
        nextMove.push(this.moveBeamInDirection(row, col, 'N'));
      } else if (currentDirection === 'S') {
        nextMove.push(this.moveBeamInDirection(row, col, 'W'));
      } else if (currentDirection === 'W') {
        nextMove.push(this.moveBeamInDirection(row, col, 'S'));
      }
    } else if (currentSymbol === '\\') {
      if (currentDirection === 'N') {
        nextMove.push(this.moveBeamInDirection(row, col, 'W'));
      } else if (currentDirection === 'E') {
        nextMove.push(this.moveBeamInDirection(row, col, 'S'));
      } else if (currentDirection === 'S') {
        nextMove.push(this.moveBeamInDirection(row, col, 'E'));
      } else if (currentDirection === 'W') {
        nextMove.push(this.moveBeamInDirection(row, col, 'N'));
      }
    } else if (currentSymbol === '|') {
      // if hit the pointy end, keep going, if hit the flat end split
      if (currentDirection === 'N') {
        nextMove.push(this.moveBeamInDirection(row, col, currentDirection));
      } else if (currentDirection === 'E') {
        nextMove.push(this.moveBeamInDirection(row, col, 'N'));
        nextMove.push(this.moveBeamInDirection(row, col, 'S'));
      } else if (currentDirection === 'S') {
        nextMove.push(this.moveBeamInDirection(row, col, currentDirection));
      } else if (currentDirection === 'W') {
        nextMove.push(this.moveBeamInDirection(row, col, 'N'));
        nextMove.push(this.moveBeamInDirection(row, col, 'S'));
      }
    } else if (currentSymbol === '-') {
      if (currentDirection === 'N') {
        nextMove.push(this.moveBeamInDirection(row, col, 'E'));
        nextMove.push(this.moveBeamInDirection(row, col, 'W'));
      } else if (currentDirection === 'E') {
        nextMove.push(this.moveBeamInDirection(row, col, currentDirection));
      } else if (currentDirection === 'S') {
        nextMove.push(this.moveBeamInDirection(row, col, 'E'));
        nextMove.push(this.moveBeamInDirection(row, col, 'W'));
      } else if (currentDirection === 'W') {
        nextMove.push(this.moveBeamInDirection(row, col, currentDirection));
      }
    }
    return nextMove;
  }

  moveBeamInDirection(row, col, direction): NextMove {
    if (direction === 'N') {
      if (row - 1 >= 0) {
        return { nextRow: row - 1, nextCol: col, nextDir: 'N' };
      }
    } else if (direction === 'E') {
      if (col + 1 < this.grid.length) {
        return { nextRow: row, nextCol: col + 1, nextDir: 'E' };
      }
    } else if (direction === 'W') {
      if (col - 1 >= 0) {
        return { nextRow: row, nextCol: col - 1, nextDir: 'W' };
      }
    } else {
      if (row + 1 < this.grid.length) {
        return { nextRow: row + 1, nextCol: col, nextDir: 'S' };
      }
    }
  }
}