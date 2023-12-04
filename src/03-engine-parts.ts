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
        // knowns: 1, 2 or 3 digit numbers
        // 3 cases:
        // left is a period, can tell that by neighbors[5]???
        // right is a period, can tell that by neighbors[1]
        // two right is a number... can tell that grid[row][column + 2]
        // two left is a number... can tell that with grid[row][column - 2]

        // if we are in here we already found a symbol SO get the full number then set all items to a known string in the main grid so we don't add it twice

        const rightNeighbor = neighbors[4];
        const leftNeighbor = neighbors[3];
        const twoRightNeighhor = grid[row][column + 2];
        const twoLeftNeighhor = grid[row][column - 2];
        // replace zeros and all non digits
        const fullNumber = this.createFullNumber(rightNeighbor, leftNeighbor, twoRightNeighhor, twoLeftNeighhor, cell);
        const fullNumberWithCharsRemoved = fullNumber.replaceAll(/\D/g,'');
        this.totalCount += parseInt(fullNumberWithCharsRemoved);

        //change the grid to zeros so we don't double count!
        grid[row][column - 2] = '.';
        grid[row][column - 1] = '.';
        grid[row][column] = '.';

        //don't forward replace if there is a period breaking it up
        if (rightNeighbor !== undefined && !rightNeighbor.match(/[^0-9]|^\d+\.\d*$/)) {
            grid[row][column + 1] = '.';

            // don't replace two right neighbor also if it its a symbol
            if (twoRightNeighhor !== undefined && !twoRightNeighhor.match(/[^0-9]|^\d+\.\d*$/)) {
                grid[row][column + 2] = '.';
            }
        }
    }

    createFullNumber(rightNeighbor, leftNeighbor, twoRightNeighbor, twoLeftNeighbor, cell) {
        let fullNumber = `${twoLeftNeighbor}${leftNeighbor}${cell}${rightNeighbor}${twoRightNeighbor}`;
        fullNumber = fullNumber.replaceAll('undefined', "");

        // full number does not have any special characters in it
        if (!fullNumber.match(/[^0-9]|^\d+\.\d*$/)) {
            return fullNumber;
        }

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