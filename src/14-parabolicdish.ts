export class ParabolicDish {
  get runningTotal(): number {
    return this._runningTotal;
  }
  private _runningTotal = 0;
  private grid = [];

  constructor(input: string, shouldCycle: boolean, cycleCount: number) {
    const inputArr = input.split("\n");
    this.constructGrid(inputArr);

    if (!shouldCycle) {
      this.applyNorthTilt();
      this.calculateScore();
    } else {
      this.cycle(cycleCount);
    }
  }

  cycle(cycleCount) {
    const scorePatterns = [];
    let hasDetectedCycle = false;
    let detectedCycle = [];

    for (let count = 0; count < cycleCount; count += 1) {
      this.applyNorthTilt();
      this.applyWestTilt();
      this.applySouthTilt();
      this.applyEastTilt();

      this.calculateScore();
      scorePatterns.push(this.runningTotal);

      // randomly make this long enough that 69x3 stops ruining my life
      if (count > 7 && !hasDetectedCycle) {
        // Detect if there is a cycle
        const detected = this.detectCycle(scorePatterns);
        if (detected.cycle.length > 0) {
          hasDetectedCycle = true;
          detectedCycle = detected.cycle;

          // Use modulus to find the value at the trillionth index
          const trillionthIndexInCycle = ((cycleCount - 1) - detected.startPattern) % detectedCycle.length;
          const valueAtTrillionthIndex = detectedCycle[trillionthIndexInCycle];
          this._runningTotal = valueAtTrillionthIndex;
          break;
        }
      }
    }
  }

  detectCycle(arr) {
    let hashMap = new Map();
    let cycles = [];
    let index = 0;
    let minRepeats = 3;
    let minLength = 12;
    let cycleCount = 0;
    let currentCycle = [];

    for (const num of arr) {
      if (hashMap.has(num)) {
        // Cycle detected
        const cycleStartIndex = hashMap.get(num);
        const cycleLength = index - cycleStartIndex;

        // Update the cycle array with the detected cycle and its starting index
        const startIndex = cycleStartIndex;
        currentCycle = arr.slice(startIndex, index);
        cycles.push({cycle: currentCycle, startIndex});

        if (cycleLength >= minLength) {
          // Increment the cycle count if the cycle is long enough; that way we are sure its a real cycle
          cycleCount++;
        }

        if (cycleCount >= minRepeats) {
          // Break out of the loop if the required number of repeats is met
          break;
        }
      } else {
        // Add current number to the hashmap
        hashMap.set(num, index);
      }

      index++;
    }

    // return the cycle and the starting index of that pattern
    return {
      'cycle': cycleCount >= minRepeats ? currentCycle : [],
      'startPattern': index
    }
  }

  constructGrid(inputList) {
    for (let index = 0; index < inputList.length; index += 1) {
      const line = inputList[index];
      const gridLine = [...line];
      this.grid.push(gridLine);
    }
  }

  calculateScore() {
    this._runningTotal = 0;
    for (let rowIndex = 0; rowIndex < this.grid.length; rowIndex += 1) {
      for (let colIndex = 0; colIndex < this.grid.length; colIndex += 1) {
        let item = this.grid[rowIndex][colIndex];
        if (item === 'O') {
          this._runningTotal += this.grid.length - rowIndex;
        }
      }
    }
  }

  applyNorthTilt() {
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
            if (itemToRollTo === '.' && spotToCheck === 0) {
              hasRockStopped = true;
              copiedArray[rowIndex][colIndex] = '.';
              copiedArray[spotToCheck][colIndex] = 'O';
            } else if (itemToRollTo !== '.') {
              hasRockStopped = true;
              copiedArray[rowIndex][colIndex] = '.';
              copiedArray[spotToCheck + 1][colIndex] = 'O';
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

  applySouthTilt() {
    const copiedArray = this.grid.map(innerArray => [...innerArray]);

    // apply tilt one line at a time in a for loop
    for (let colIndex = 0; colIndex < this.grid.length; colIndex += 1) {
      for (let rowIndex = this.grid.length - 2; rowIndex >= 0; rowIndex -= 1) {
        // look for zeros
        const itemToRoll = this.grid[rowIndex][colIndex];
        if (itemToRoll === 'O') {
          // if zero found, check rows above
          let hasRockStopped = false;
          let spotToCheck = rowIndex + 1;
          while (!hasRockStopped) {
            const itemToRollTo = copiedArray[spotToCheck][colIndex];
            if (itemToRollTo === '.' && spotToCheck === this.grid.length - 1) {
              hasRockStopped = true;
              copiedArray[rowIndex][colIndex] = '.';
              copiedArray[spotToCheck][colIndex] = 'O';
            } else if (itemToRollTo !== '.') {
              hasRockStopped = true;
              copiedArray[rowIndex][colIndex] = '.';
              copiedArray[spotToCheck - 1][colIndex] = 'O';
            } else {
              if (spotToCheck === 0) {
                // can't go any further; exit
                break;
              }
              spotToCheck += 1;
            }
          }
        }
      }
    }
    this.grid = copiedArray;
  }

  applyWestTilt() {
    const copiedArray = this.grid.map(innerArray => [...innerArray]);

    // apply tilt one line at a time in a for loop
    for (let rowIndex = 0; rowIndex < this.grid.length; rowIndex += 1) {
      // start at col 0 col 0 can't tilt
      for (let colIndex = 1; colIndex < this.grid.length; colIndex += 1) {
        // look for zeros
        const itemToRoll = this.grid[rowIndex][colIndex];
        if (itemToRoll === 'O') {
          // if zero found, check rows above
          let hasRockStopped = false;
          let spotToCheck = colIndex - 1;
          while (!hasRockStopped) {
            const itemToRollTo = copiedArray[rowIndex][spotToCheck];
            if (itemToRollTo === '.' && spotToCheck === 0) {
              hasRockStopped = true;
              copiedArray[rowIndex][colIndex] = '.';
              copiedArray[rowIndex][spotToCheck] = 'O';
            } else if (itemToRollTo !== '.') {
              hasRockStopped = true;
              copiedArray[rowIndex][colIndex] = '.';
              copiedArray[rowIndex][spotToCheck + 1] = 'O';
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

  applyEastTilt() {
    const copiedArray = this.grid.map(innerArray => [...innerArray]);

    // apply tilt one line at a time in a for loop
    for (let rowIndex = 0; rowIndex < this.grid.length; rowIndex += 1) {
      for (let colIndex = this.grid.length - 2; colIndex >= 0; colIndex -= 1) {
        // look for zeros
        const itemToRoll = this.grid[rowIndex][colIndex];
        if (itemToRoll === 'O') {
          // if zero found, check rows above
          let hasRockStopped = false;
          let spotToCheck = colIndex + 1;
          while (!hasRockStopped) {
            const itemToRollTo = copiedArray[rowIndex][spotToCheck];
            if (itemToRollTo === '.' && spotToCheck === this.grid.length - 1) {
              hasRockStopped = true;
              copiedArray[rowIndex][colIndex] = '.';
              copiedArray[rowIndex][spotToCheck] = 'O';
            } else if (itemToRollTo !== '.') {
              hasRockStopped = true;
              copiedArray[rowIndex][colIndex] = '.';
              copiedArray[rowIndex][spotToCheck - 1] = 'O';
            } else {
              if (spotToCheck === 0) {
                // can't go any further; exit
                break;
              }
              spotToCheck += 1;
            }
          }
        }
      }
    }
    this.grid = copiedArray;
  }

  printGrid() {
    let runningString = '';
    for (let row = 0; row < this.grid.length; row++) {
      let rowString = '';
      for (let col = 0; col < this.grid[row].length; col++) {
        rowString += this.grid[row][col] + ' ';
      }
      // console.log(rowString.trim());
      runningString = runningString.concat(rowString.trim());
    }
    return runningString;
  }
}
