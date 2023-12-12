export class Coord {
  constructor(row: number, column: number) {
    this._row = row;
    this._column = column;
  }

  private _row: number;
  private _column: number;


  get row(): number {
    return this._row;
  }

  get column(): number {
    return this._column;
  }
}

export class Observatory {
  get distanceSum(): number {
    return this._distanceSum;
  }

  private _grid = [];
  private _galaxyCoords = [];
  private _distanceSum = 0;
  private extraRows = new Set();
  private extraCols = new Set();

  constructor(input: string, numToAdd: number) {
    const inputArr = input.split('\n');
    this.constructGrid(inputArr);
    this._distanceSum = this.findEachGalaxy(numToAdd);
  }

  findEachGalaxy(numToAdd: number) {
    let count = 1;

    let runningRowAdditions = 0;
    for (let row = 0; row < this._grid.length; row = row + 1) {
      let runningColAdditions = 0;

      if (this.extraRows.has(row)) {
        runningRowAdditions += numToAdd;
      }

      for (let col = 0; col < this._grid[0].length; col = col + 1) {
        if (this.extraCols.has(col)) {
          runningColAdditions += numToAdd;
        }

        if (this._grid[row][col] === '#') {
          this._grid[row][col] = count;
          this._galaxyCoords.push(new Coord(row + runningRowAdditions, col + runningColAdditions));
          count += 1;
        }
      }
    }

    // 6, 1
    // 11, 5

    // get absolute value of (11 - 6) + (5 - 1) = 9
    let distanceSum = 0;
    this._galaxyCoords.forEach(startingCoord => {
      this._galaxyCoords.forEach(comparisonCoord => {
          distanceSum += this.getDistance(startingCoord, comparisonCoord);
      });
    });

    return distanceSum / 2;
  }

  getDistance(a: Coord, b: Coord) {
    return Math.abs(a.row - b.row) + Math.abs(a.column - b.column);
  }

  constructGrid(inputList) {
    const horizontalExpanded = [];

    // Expand horizontally
    for (let index = 0; index < inputList.length; index += 1) {
      const line = inputList[index];
      const gridLine = [...line];

      // Expand the universe! Push grid line twice to handle empty rows
      if (!line.includes('#')) {
        // horizontalExpanded.push(gridLine);
        this.extraRows.add(index);
      }

      horizontalExpanded.push(gridLine);
    }

    const verticalExpanded = horizontalExpanded.map(row => [...row]);
    let columnsExpanded = 0;

    // Expand vertically
    for (let column = 0; column < horizontalExpanded[0].length; column++) {
      let hasHash = false;

      // Check if the column contains a '#'
      for (let row = 0; row < horizontalExpanded.length; row++) {
        if (horizontalExpanded[row][column] === '#') {
          hasHash = true;
          break; // exit the loop if '#' is found in the column
        }
      }

      // after the first expansion the counts get whacked...
      if (!hasHash) {
        // Expand the universe vertically
        for (let row = 0; row < horizontalExpanded.length; row++) {
          // verticalExpanded[row].splice(column + 1 + columnsExpanded, 0, verticalExpanded[row][column + columnsExpanded]);
          this.extraCols.add(column);
        }
        columnsExpanded += 1;
      }
    }

    this._grid = verticalExpanded;
  }
}