
export class UltraCrucibleDistance {
  get heatLost(): number {
    return this._heatLost;
  }
  grid = [];
  private _heatLost = 0;

  constructor(inputArr) {
    this.grid = inputArr.split('\n');
    this.dijkstra(0, 0, this.grid.length - 1, this.grid[0].length - 1);
    console.log(this.heatLost);
  }

  dijkstra(startRow, startCol, endRow, endCol) {
    const priorityQueue = [];
    const visited = new Set();

    const startNode = {
      row: startRow,
      col: startCol,
      direction: '',
      currentPathCost: 0,
      consecutiveSteps: 0,
      parent: null,
      grandParent: null
    };

    priorityQueue.push(startNode);

    while (priorityQueue.length > 0) {
      priorityQueue.sort((a, b) => a.currentPathCost - b.currentPathCost);
      const currentNode = priorityQueue.shift();
      const { row, col, direction, grandParent, consecutiveSteps } = currentNode;

      if (row === endRow && col === endCol) {
        return this.reconstructPathAndPrint(currentNode);
      }

      const key = `${row}-${col}-${direction}-${consecutiveSteps}`;
      if (visited.has(key)) {
        continue;
      }

      visited.add(key);

      const neighbors = this.getNeighbors(row, col, direction, consecutiveSteps);
      for (const neighbor of neighbors) {
        const { neighborRow, neighborCol, neighborDirection } = neighbor;

        if (this.isValidCell(neighborRow, neighborCol, neighborDirection, currentNode, currentNode.parent, grandParent, consecutiveSteps)) {
          const possibleCurrentPathCost = currentNode.currentPathCost + parseInt(this.grid[neighborRow][neighborCol]);

          const newNode = {
            row: neighborRow,
            col: neighborCol,
            direction: neighborDirection,
            currentPathCost: possibleCurrentPathCost,
            consecutiveSteps: neighborDirection === direction ? consecutiveSteps + 1 : 1,
            parent: currentNode,
            grandParent: currentNode.parent
          };

          priorityQueue.push(newNode);
        }
      }
    }

    return null; // No path found
  }

  getNeighbors(row, col, direction, consecutiveSteps) {
    // can only move left, right, or straight
    const minStepsBeforeTurn = 4;

    switch (direction) {
      case ('N'):
        let dirArr = [
          { neighborRow: row - 1, neighborCol: col, neighborDirection: 'N' }, // straight
        ];

        if (consecutiveSteps >= minStepsBeforeTurn) {
          dirArr.push({ neighborRow: row, neighborCol: col + 1, neighborDirection: 'E' }); // right
          dirArr.push({ neighborRow: row, neighborCol: col - 1, neighborDirection: 'W' }); // left
        }

        return dirArr;
      case ('E'):
        let eastDirArr = [
          { neighborRow: row, neighborCol: col + 1, neighborDirection: 'E' }, // straight
        ];

        if (consecutiveSteps >= minStepsBeforeTurn) {
          eastDirArr.push({ neighborRow: row + 1, neighborCol: col, neighborDirection: 'S' }); // right
          eastDirArr.push({ neighborRow: row - 1, neighborCol: col, neighborDirection: 'N' }); // left
        }

        return eastDirArr;
      case ('W'):
        let westDirArr = [
          { neighborRow: row, neighborCol: col - 1, neighborDirection: 'W' }, // straight
        ];

        if (consecutiveSteps >= minStepsBeforeTurn) {
          westDirArr.push({ neighborRow: row - 1, neighborCol: col, neighborDirection: 'N' }); // right
          westDirArr.push({ neighborRow: row + 1, neighborCol: col, neighborDirection: 'S' }); // left
        }

        return westDirArr;
      case ('S'):
        let southDirArr = [
          { neighborRow: row + 1, neighborCol: col, neighborDirection: 'S' }, // straight
        ];

        if (consecutiveSteps >= minStepsBeforeTurn) {
          southDirArr.push({ neighborRow: row, neighborCol: col - 1, neighborDirection: 'W' }); // right
          southDirArr.push({ neighborRow: row, neighborCol: col + 1, neighborDirection: 'E' }); // left
        }

        return southDirArr;
      default:
        return [
          { neighborRow: row, neighborCol: col + 1, neighborDirection: 'E' },
          { neighborRow: row + 1, neighborCol: col, neighborDirection: 'S' },
        ];
    }
  }

  isValidCell(row, col, direction, parent, grandParent, greatGrandParent, consecutiveSteps) {
    const doesntExceedBounds = row >= 0 && row < this.grid.length && col >= 0 && col < this.grid[0].length;
    const endRow = this.grid.length - 1;
    const endCol = this.grid[0].length - 1;

    // check that we haven't moved more than three times in a row in a straight direction
    const gpDir = grandParent ? grandParent.direction : '';
    const pDir = parent ? parent.direction : '';

    // can't move more than three times in the same direction
    if (gpDir === pDir && pDir === direction && consecutiveSteps >= 10) {
      return false;
    }

    // can't turn before 4
    const minStepsBeforeTurn = 4;
    if (pDir !== '' && pDir !== direction && consecutiveSteps < minStepsBeforeTurn) {
      return false;
    }

    // ensure that the path reaches endRow and endCol only after at least 4 consecutive steps
    // tricksy wording (or even before it can stop at the end)
    if (row === endRow && col === endCol) {
      console.log('here');
    }
    if ((row === endRow && col === endCol) && (consecutiveSteps < minStepsBeforeTurn || direction !== pDir)) {
      return false;
    }

    return doesntExceedBounds;
  }

  reconstructPathAndPrint(node) {
    const path = [];
    const pathGrid = this.grid.map(row => row.split(''));

    while (node !== null) {
      const { row, col, direction } = node;

      if (!(row === 0 && col === 0)) {
        this._heatLost += parseInt(this.grid[row][col]);
        path.push({ row, col, direction });
        // Mark the path in the grid based on the direction
        pathGrid[row][col] = this.getArrowMarker(direction);
      }

      node = node.parent;
    }

    // Convert the path grid to a string
    const pathString = pathGrid.map(row => row.join('')).join('\n');

    // Print the path string
    console.log(pathString);

    // Return the path array
    return path.reverse();
  }

  getArrowMarker(direction) {
    switch (direction) {
      case 'N':
        return '^';
      case 'E':
        return '>';
      case 'S':
        return 'v';
      case 'W':
        return '<';
      default:
        return 'v'; // Default to 'v' for unknown direction
    }
  }
}

