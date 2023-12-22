export class StepCounter {
  grid = [];
  startingLocationRow = 0;
  startingLocationColumn = 0;
  zeroCounter = 0;

  constructor(input: string, stepCount) {
    this.constructGrid(input.split('\n'));
    this.traverseMazeBFS(this.startingLocationRow, this.startingLocationColumn, stepCount);

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

  traverseMazeBFS(startRow, startCol, stepCount) {
    let queue = [
      [startRow, startCol, 0]
    ];
    const visited = new Set();

    while (queue.length > 0) {
      const [row, col, runningStepCount] = queue.shift();

      if (runningStepCount === stepCount) {
        break;
      }

      if (visited.has(this.getKey(row, col, runningStepCount))) {
        continue;
      }

      visited.add(this.getKey(row, col, runningStepCount));

      const neighbors = this.getOrthogonalNeighbors(row, col);

      // remove last steps
      this.grid[row][col] = '.';

      for (const [nextRow, nextCol] of neighbors) {
        if (!visited.has(this.getKey(nextRow, nextCol, runningStepCount))) {
          const nextSymbol = this.grid[nextRow][nextCol];
          // setup next cols
          this.grid[nextRow][nextCol] = '0';
          queue.push([nextRow, nextCol, runningStepCount + 1]);
        }
      }
    }
    this.printGrid();
  }

  getKey(row, col, count) {
    return `${row}-${col}-${count}`
  }

  getOrthogonalNeighbors(row, col) {
    const neighbors = [];
    const currentSymbol = this.grid[row][col];

    // Check top neighbor
    if (row > 0) {
      const neighborSymbol = this.grid[row - 1][col];
      const isOpen = this.isOpenPlot(neighborSymbol);
      if (isOpen) {
        neighbors.push([row - 1, col]);
      }
    }

    // Check bottom neighbor
    if (row < this.grid.length - 1) {
      const neighborSymbol = this.grid[row + 1][col];
      const isOpen = this.isOpenPlot(neighborSymbol);
      if (isOpen) {
        neighbors.push([row + 1, col]);
      }
    }

    // Check left neighbor
    if (col > 0) {
      const neighborSymbol = this.grid[row][col - 1];
      const isOpen = this.isOpenPlot(neighborSymbol);
      if (isOpen) {
        neighbors.push([row, col - 1]);
      }
    }

    // Check right neighbor
    if (col < this.grid[0].length - 1) {
      const neighborSymbol = this.grid[row][col + 1];
      const isOpen = this.isOpenPlot(neighborSymbol);
      if (isOpen) {
        neighbors.push([row, col + 1]);
      }
    }

    return neighbors;
  }

  isOpenPlot(neighborSymbol) {
    if (neighborSymbol === '.') {
      return true;
    }
    return false;
  }

  printGrid() {
    let runningString = '';
    for (let row = 0; row < this.grid.length; row++) {
      let rowString = '';
      for (let col = 0; col < this.grid[row].length; col++) {
        rowString += this.grid[row][col] + ' ';
        if (this.grid[row][col] === '0') {
          this.zeroCounter += 1;
        }
      }
      console.log(rowString.trim());
      runningString = runningString.concat(rowString.trim());
    }
    return runningString;
  }
}