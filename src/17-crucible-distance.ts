
export class CrucibleDistance {
  get heatLost(): number {
    return this._heatLost;
  }
  grid = [];
  private _heatLost = 0;

  constructor(inputArr) {
    this.grid = inputArr.split('\n');
    const path = this.aStar(0, 0, this.grid.length - 1, this.grid[0].length - 1);
    console.log(path);
    console.log(this.heatLost);
  }

  aStar(startRow, startCol, endRow, endCol) {
    const discoveredButUnvisited = [];
    const visited = new Set();

    const startNode = {
      row: startRow,
      col: startCol,
      direction: 'E',
      currentPathCost: 0,
      costToGoalEstimate: this.calculateHeuristic(startRow, startCol, endRow, endCol),
      estimatedTotalCost: 0,
      parent: null,
      grandParent: null
    };

    discoveredButUnvisited.push(startNode);

    while (discoveredButUnvisited.length > 0) {
      // sort unvisited by weights
      discoveredButUnvisited.sort((a, b) => a.estimatedTotalCost - b.estimatedTotalCost);

      const currentNode = discoveredButUnvisited.shift();
      const { row, col, direction } = currentNode;

      if (row === endRow && col === endCol) {
        // return the final taken path
        return this.reconstructPath(currentNode);
      }

      visited.add(`${row}-${col}-${direction}`);

      const neighbors = this.getNeighbors(row, col, direction);
      for (const neighbor of neighbors) {
        const { neighborRow, neighborCol, neighborDirection } = neighbor;

        if (
          this.isValidCell(neighborRow, neighborCol, neighborDirection, currentNode, currentNode.parent, currentNode.grandParent)
          && !visited.has(`${neighborRow}-${neighborCol}-${neighborDirection}`)
        ) {
          const possibleCurrentPathCost = currentNode.currentPathCost + parseInt(this.grid[neighborRow][neighborCol]);
          const existingNode = discoveredButUnvisited.find((node) => node.row === neighborRow && node.col === neighborCol);

          if (!existingNode || possibleCurrentPathCost < existingNode.currentPathCost) {
            const newNode = {
              row: neighborRow,
              col: neighborCol,
              direction: neighborDirection,
              currentPathCost: possibleCurrentPathCost,
              costToGoalEstimate: this.calculateHeuristic(neighborRow, neighborCol, endRow, endCol),
              estimatedTotalCost: possibleCurrentPathCost + this.calculateHeuristic(neighborRow, neighborCol, endRow, endCol),
              parent: currentNode,
              grandParent: currentNode.parent
            };

            if (!existingNode) {
              discoveredButUnvisited.push(newNode);
            }
          }
        }
      }
    }

    return null; // No path found
  }

  calculateHeuristic(row, col, endRow, endCol) {
    // Manhattan distance heuristic
    // return Math.abs(endRow - row) + Math.abs(endCol - col);
    return Math.sqrt(Math.pow(endRow - row, 2) + Math.pow(endCol - col, 2));
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
          { neighborRow: row - 1, neighborCol: col, neighborDirection: 'N' }, // left
          { neighborRow: row, neighborCol: col + 1, neighborDirection: 'E' }, // straight
          { neighborRow: row + 1, neighborCol: col, neighborDirection: 'S' } // right
        ];
      case ('W'):
        return [
          { neighborRow: row - 1, neighborCol: col, neighborDirection: 'N' }, // right
          { neighborRow: row + 1, neighborCol: col, neighborDirection: 'S' }, // left
          { neighborRow: row, neighborCol: col - 1, neighborDirection: 'W' } // straight
        ];
      case ('S'):
        return [
          { neighborRow: row, neighborCol: col + 1, neighborDirection: 'E' }, // left
          { neighborRow: row + 1, neighborCol: col, neighborDirection: 'S' }, // straight
          { neighborRow: row, neighborCol: col - 1, neighborDirection: 'W' } // right
        ];
      default:
        return [
          { neighborRow: row, neighborCol: col + 1, neighborDirection: 'E' },
          { neighborRow: row + 1, neighborCol: col, neighborDirection: 'S' },
        ];
    }
  }

  isValidCell(row, col, direction, parent, grandParent, greatGrandParent) {
    const doesntExceedBounds = row >= 0 && row < this.grid.length && col >= 0 && col < this.grid[0].length;

    // check that we havent moved more than three times in a row in a straight direction
    const ggpDir = greatGrandParent ? greatGrandParent.direction : '';
    const gpDir = grandParent ? grandParent.direction : '';
    const pDir = parent ? parent.direction : '';

    // can't move more three times in the same direction
    if (ggpDir === direction && gpDir === direction && pDir === direction) {
      return false;
    }

    return doesntExceedBounds;
  }

  reconstructPath(node) {
    const path = [];
    // reverse back while node is not null or we are not at the start
    while (node !== null) {
      path.push({ row: node.row, col: node.col });

      if (!(node.row === 0 && node.col === 0)) {
        this._heatLost += parseInt(this.grid[node.row][node.col]);
      }
      node = node.parent;
    }
    return path.reverse();
  }
}

