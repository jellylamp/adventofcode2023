
export class CrucibleDistance {
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

      const neighbors = this.getNeighbors(row, col, direction);
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

  getNeighbors(row, col, direction) {
    // can only move left, right, or straight

    switch (direction) {
      case ('N'):
        return [
          { neighborRow: row - 1, neighborCol: col, neighborDirection: 'N' }, // straight
          { neighborRow: row, neighborCol: col + 1, neighborDirection: 'E' }, // right
          { neighborRow: row, neighborCol: col - 1, neighborDirection: 'W' } // left
        ];
      case ('E'):
        return [
          { neighborRow: row, neighborCol: col + 1, neighborDirection: 'E' }, // straight
          { neighborRow: row - 1, neighborCol: col, neighborDirection: 'N' }, // left
          { neighborRow: row + 1, neighborCol: col, neighborDirection: 'S' } // right
        ];
      case ('W'):
        return [
          { neighborRow: row, neighborCol: col - 1, neighborDirection: 'W' }, // straight
          { neighborRow: row - 1, neighborCol: col, neighborDirection: 'N' }, // right
          { neighborRow: row + 1, neighborCol: col, neighborDirection: 'S' } // left
        ];
      case ('S'):
        return [
          { neighborRow: row + 1, neighborCol: col, neighborDirection: 'S' }, // straight
          { neighborRow: row, neighborCol: col + 1, neighborDirection: 'E' }, // left
          { neighborRow: row, neighborCol: col - 1, neighborDirection: 'W' } // right
        ];
      default:
        return [
          { neighborRow: row, neighborCol: col + 1, neighborDirection: 'E' },
          { neighborRow: row + 1, neighborCol: col, neighborDirection: 'S' },
        ];
    }
  }

  isValidCell(row, col, direction, parent, grandParent, greatGrandParent, consecutiveSteps) {
    const doesntExceedBounds = row >= 0 && row < this.grid.length && col >= 0 && col < this.grid[0].length;

    // check that we haven't moved more than three times in a row in a straight direction
    const gpDir = grandParent ? grandParent.direction : '';
    const pDir = parent ? parent.direction : '';

    // can't move more than three times in the same direction
    if (gpDir === pDir && pDir === direction && consecutiveSteps > 2) {
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

