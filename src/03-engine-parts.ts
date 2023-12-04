const array2d = require('array2d');

export class EngineParts {
    get gearTotalCount(): number {
        return this._gearTotalCount;
    }

    set gearTotalCount(value: number) {
        this._gearTotalCount = value;
    }
    get totalCount(): number {
        return this._totalCount;
    }

    set totalCount(value: number) {
        this._totalCount = value;
    }
    private _totalCount: number;

    private _gearTotalCount: number;

    constructor(input: string) {
        this.determineEnginePartCount(input);
        this.determineGearCount(input);
    }

    determineEnginePartCount(input: string) {
        const inputList = input.split('\n');
        this.totalCount = 0;
        const grid = this.constructGrid(inputList);
        array2d.stringize(grid);

        array2d.eachCell(
            grid,
            (cell, row, column, grid) => {
                this.checkSurroundingCellsForCharacters(cell, row, column, grid, false);
            }
        );
    }

    determineGearCount(input: string) {
        const inputList = input.split('\n');
        this.gearTotalCount = 0;
        const grid = this.constructGrid(inputList);
        array2d.stringize(grid);

        array2d.eachCell(
            grid,
            (cell, row, column, grid) => {
                // run through the grid and replace all numbers with their squashed number
                this.checkSurroundingCellsForCharacters(cell, row, column, grid, true);
            }
        );

        // should go after the first run through so all numbers are replaced first
        array2d.eachCell(
            grid,
            (cell, row, column, grid) => {
                // run through the grid and replace all numbers with their squashed number
                this.checkSurroundingCellsForNumbers(cell, row, column, grid);
            }
        );
    }

    checkSurroundingCellsForCharacters(cell, row, column, grid, shouldCalculateGears) {
        let shouldAddToTotal = false;
        if (cell === '.' || cell === '*' || isNaN(cell)) {
            return;
        }

        // get surrounding cells
        const neighbors: any = array2d.neighbors(grid, row, column);
        neighbors.forEach(neighborCell => {
            // running total looks for adjacent special chars
            if (neighborCell !== undefined && isNaN(neighborCell) && neighborCell !== '.') {
                shouldAddToTotal = true;
            }
        });

        if (shouldAddToTotal) {
            this.getFullNumberAndAddToTotal(cell, row, column, grid, neighbors, shouldCalculateGears);
        }
    }

    checkSurroundingCellsForNumbers(cell, row, column, grid) {
        // only care about potential gears
        if (cell !== '*') {
            return;
        }

        // get surrounding cells and filter out any non numbers
        const neighbors: any = array2d.neighbors(grid, row, column);
        const uniqueNeighbors = Array.from(new Set(neighbors));
        const parsedNeighbors = uniqueNeighbors.map((item: any) => (typeof item === 'string' ? item.substring(0, item.indexOf(':')) : item));
        const numNeighbors = parsedNeighbors.filter(item => {
            return !isNaN(parseFloat(item)) && isFinite(Number(item));
        });

        if (numNeighbors.length === 2) {
            this.gearTotalCount += (parseInt(String(numNeighbors[0])) * parseInt(String(numNeighbors[1])));
        }
    }

    getFullNumberAndAddToTotal(cell, row, column, grid, neighbors, shouldReplaceWithTotal) {
        if (cell.toString().length > 1) {
            // duplicate return
            return;
        }

        const rightNeighbor = this.getNeighborValue(neighbors[4]);
        const leftNeighbor = this.getNeighborValue(neighbors[3]);
        const twoRightNeighhor = this.getNeighborValue(grid[row][column + 2]);
        const twoLeftNeighhor = this.getNeighborValue(grid[row][column - 2]);
        // replace zeros and all non digits
        const fullNumber = this.createFullNumber(rightNeighbor, leftNeighbor, twoRightNeighhor, twoLeftNeighhor, cell);

        //change the grid to zeros so we don't double count! only care about total count for non gears
        let toReplaceWith = '.';
        if (shouldReplaceWithTotal) {
            // replace with the full number and also a row/column so we can scan out duplicates but not real matches
            toReplaceWith = `${fullNumber}:${row}${column}`;
            grid[row][column] = toReplaceWith;
        } else {
            this.totalCount += parseInt(fullNumber);
            grid[row][column] = toReplaceWith;
        }

        const digitsOnly = /[0-9]/;
        if (leftNeighbor !== undefined && leftNeighbor.match(digitsOnly)) {
            grid[row][column - 1] = toReplaceWith;

            // don't replace two right neighbor also if it its a symbol
            if (twoLeftNeighhor !== undefined && twoLeftNeighhor.match(digitsOnly)) {
                grid[row][column - 2] = toReplaceWith;
            }
        }

        //don't forward replace if there is a period breaking it up
        if (rightNeighbor !== undefined && rightNeighbor.match(digitsOnly)) {
            grid[row][column + 1] = toReplaceWith;

            // don't replace two right neighbor also if it its a symbol
            if (twoRightNeighhor !== undefined && twoRightNeighhor.match(digitsOnly)) {
                grid[row][column + 2] = toReplaceWith;
            }
        }
    }

    private getNeighborValue(neighbor) {
        if (neighbor === undefined) {
            return neighbor;
        }
        if (neighbor.indexOf(':') !== -1) {
            return '.'
        }
        return neighbor;
    }

    createFullNumber(rightNeighbor, leftNeighbor, twoRightNeighbor, twoLeftNeighbor, cell) {
        let fullNumber = `${twoLeftNeighbor}${leftNeighbor}${cell}${rightNeighbor}${twoRightNeighbor}`;
        fullNumber = fullNumber.replaceAll('undefined', "");

        // if we are here, there is a special character in the middle
        const fullNumbersOnly = /[^0-9]+/;
        let characterBookends =  fullNumber.split(fullNumbersOnly).filter(Boolean);

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