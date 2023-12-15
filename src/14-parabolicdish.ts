export class ParabolicDish {
  get runningTotal(): number {
    return this._runningTotal;
  }
  private _runningTotal = 0;
  private grid = [];

  constructor(input: string) {
    const inputArr = input.split("\n");
    this.constructGrid(inputArr);
    this.applyTilt();
    this.calculateScore();
  }

  constructGrid(inputList) {
    for (let index = 0; index < inputList.length; index += 1) {
      const line = inputList[index];
      const gridLine = [...line];
      this.grid.push(gridLine);
    }
  }

  calculateScore() {
    for (let rowIndex = 0; rowIndex < this.grid.length; rowIndex += 1) {
      for (let colIndex = 0; colIndex < this.grid.length; colIndex += 1) {
        let item = this.grid[rowIndex][colIndex];
        if (item === 'O') {
          this._runningTotal += this.grid.length - rowIndex;
        }
      }
    }
  }

  applyTilt() {
    const copiedArray = this.grid.map(innerArray => [...innerArray]);

    // apply tilt one line at a time in a for loop
    for (let colIndex = 0; colIndex < this.grid.length; colIndex += 1) {
      // start at row 1 row 0 can't tilt
      for (let rowIndex = 1; rowIndex < this.grid.length; rowIndex += 1) {
        // look for zeros
        const itemToRoll = this.grid[rowIndex][colIndex];
        if (itemToRoll === 'O') {
          // if zero found, check rows above
          let hasRockStopped = false;
          let spotToCheck = rowIndex - 1;
          while (!hasRockStopped) {
            const itemToRollTo = copiedArray[spotToCheck][colIndex];
            if (itemToRollTo !== '.') {
              hasRockStopped = true;
              copiedArray[rowIndex][colIndex] = '.';
              copiedArray[spotToCheck + 1][colIndex] = 'O';
            } else if (itemToRollTo === '.' && spotToCheck === 0) {
              hasRockStopped = true;
              copiedArray[rowIndex][colIndex] = '.';
              copiedArray[spotToCheck][colIndex] = 'O';
            } else {
              if (spotToCheck === 0) {
                // can't go any further; exit
                break;
              }
              spotToCheck -= 1;
            }
          }
        }
      }
    }
    this.grid = copiedArray;
  }
}
