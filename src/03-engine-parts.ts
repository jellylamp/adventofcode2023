const array2d = require('array2d');

export class EngineParts {
    get runningPartNumber(): number {
        return this._runningPartNumber;
    }

    set runningPartNumber(value: number) {
        this._runningPartNumber = value;
    }
    get totalCount(): number {
        return this._totalCount;
    }

    set totalCount(value: number) {
        this._totalCount = value;
    }
    private _totalCount: number;
    private _runningPartNumber: number;

    constructor(input: string) {
        this.determineEnginePartCount(input);
    }

    determineEnginePartCount(input: string) {
        const inputList = input.split('\n');
        this.totalCount = 0;
        const grid = this.constructGrid(inputList);
        array2d.stringize(grid);

        array2d.eachCell(
            grid,
            (cell, row, column, grid) => {
                this.checkSurroundingCell(cell, row, column, grid);
            }
        );

    }

    checkSurroundingCell(cell, row, column, grid) {
        let shouldAdd = false;
        if (cell === '.' || isNaN(cell)) {
            return;
        }

        // get surrounding cells
        const neighbors: any = array2d.neighbors(grid, row, column);
        neighbors.forEach(neighborCell => {
            if (neighborCell !== undefined && isNaN(neighborCell) && neighborCell !== '.') {
                shouldAdd = true;
            }
        });

        if (shouldAdd) {
            this.getFullNumberAndAddToTotal(cell, row, column, grid, neighbors);
        }
    }

    getFullNumberAndAddToTotal(cell, row, column, grid, neighbors) {
        const rightNeighbor = neighbors[4];
        const leftNeighbor = neighbors[3];
        const twoRightNeighhor = grid[row][column + 2];
        const twoLeftNeighhor = grid[row][column - 2];
        // replace zeros and all non digits
        const fullNumber = this.createFullNumber(rightNeighbor, leftNeighbor, twoRightNeighhor, twoLeftNeighhor, cell);
        this.totalCount += parseInt(fullNumber);

        //change the grid to zeros so we don't double count!
        grid[row][column] = '.';

        if (leftNeighbor !== undefined && leftNeighbor.match(/[0-9]/)) {
            grid[row][column - 1] = '.';

            // don't replace two right neighbor also if it its a symbol
            if (twoLeftNeighhor !== undefined && twoLeftNeighhor.match(/[0-9]/)) {
                grid[row][column - 2] = '.';
            }
        }

        //don't forward replace if there is a period breaking it up
        if (rightNeighbor !== undefined && rightNeighbor.match(/[0-9]/)) {
            grid[row][column + 1] = '.';

            // don't replace two right neighbor also if it its a symbol
            if (twoRightNeighhor !== undefined && twoRightNeighhor.match(/[0-9]/)) {
                grid[row][column + 2] = '.';
            }
        }
    }

    createFullNumber(rightNeighbor, leftNeighbor, twoRightNeighbor, twoLeftNeighbor, cell) {
        let fullNumber = `${twoLeftNeighbor}${leftNeighbor}${cell}${rightNeighbor}${twoRightNeighbor}`;
        fullNumber = fullNumber.replaceAll('undefined', "");

        // if we are here, there is a special character in the middle
        let characterBookends =  fullNumber.split(/[^0-9]+/).filter(Boolean);

        characterBookends = characterBookends.filter(item => {
          const isNumeric = !isNaN(parseFloat(item)) && isFinite(Number(item));
          const matchesCell = item.includes(cell);
          return isNumeric && matchesCell;
        });

        // make the assumption that the longest number is the correct number in this case.
        if (characterBookends.length > 1) {
            return characterBookends.reduce((a, b) => a.length <= b.length ? b : a);
        }
        return characterBookends[0];
    }

    constructGrid(inputList) {
        const grid = [];
        inputList.forEach(line => {
            const gridLine = [...line];
            grid.push(gridLine);
        });
        return grid;
    }
}