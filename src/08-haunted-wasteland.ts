class CoordinatesGraph {
  private graph;

  constructor() {
    this.graph = {};
  }

  addCoordinate(id, L, R, endsWithZ, endsWithA) {
    this.graph[id] = { L, R, endsWithZ, endsWithA };
  }

  move(currentLocation, direction, shouldGhostMove) {
    const targetLocation = this.graph[currentLocation][direction] || currentLocation;

    if (shouldGhostMove) {
      return { location: targetLocation, endsWithZ: this.graph[targetLocation].endsWithZ };
    }
    return targetLocation;
  }

  getNodesEndingWithA() {
    return Object.keys(this.graph).filter(node => this.graph[node].endsWithA);
  }
}


export class HauntedWasteland {
    get countToZZZ(): number {
        return this._countToZZZ;
    }

    set countToZZZ(value: number) {
        this._countToZZZ = value;
    }

    private graph;
    private _countToZZZ = 0;
    private startingLocation = 'AAA';
    private runningLocation = '';
    private runningList = [];
    private shouldGhostMove;

    constructor(input: string, shouldGhostMove) {
      const inputList = input.split(/\n\s*\n/);
      this.graph = new CoordinatesGraph();
      this.buildGraph(inputList[1].split('\n'));

      this.shouldGhostMove = shouldGhostMove;

      if (shouldGhostMove) {
        this.loopThroughInstructionsAndCountToAllZs(inputList[0]);
      } else {
        this.loopThroughInstructionsAndCount(inputList[0]);
      }
    }

    loopThroughInstructionsAndCount(directionString) {
        const directionArr = directionString.split('');

        let zzzWasFound = false;
        this.runningLocation = this.startingLocation;

        while (!zzzWasFound) {
            zzzWasFound = this.loopThroughDirections(directionArr);
        }
    }

    private loopThroughDirections(directionArr: string[]) {
        let wasFound = false;

        directionArr.forEach(direction => {
           if (this.runningLocation === 'ZZZ') {
                wasFound = true;
                return;
            }
            this.countToZZZ += 1;
            this.runningLocation = this.graph.move(this.runningLocation, direction, false);
        });
        return wasFound;
    }

  loopThroughInstructionsAndCountToAllZs(directionString) {
    const directionArr = directionString.split('');

    let allZsWereFound = false;
    this.runningList = this.graph.getNodesEndingWithA();

    while (!allZsWereFound) {
      allZsWereFound = this.loopThroughDirectionsWithRunningList(directionArr);
    }
  }

  private loopThroughDirectionsWithRunningList(directionArr: string[]) {
    let allNodesEndWithZ = false;
    let directionIndex = 0;

    while (directionIndex < directionArr.length && !allNodesEndWithZ) {
      allNodesEndWithZ = true;

      const nextNodes = [];
      const direction = directionArr[directionIndex];

      this.runningList.forEach((node: string) => {
        // Get the direction without modifying the array
        const moveResult = this.graph.move(node, direction, true);

        if (!moveResult.endsWithZ) {
          allNodesEndWithZ = false;
        }
        nextNodes.push(moveResult.location);
      });
      directionIndex += 1; // Move to the next direction

      // Update the running list for the next iteration
      this.runningList = nextNodes;

      this.countToZZZ += 1;
    }

    return allNodesEndWithZ;
  }

  buildGraph(inputArr) {

    // build out a map of coordinates
    inputArr.forEach(coordLine => {
      const matches = coordLine.match(/(\w+)\s*=\s*\(([\w\s,]+)\)/);
      const characterList = matches[2].replace(/\s/g, '').split(',');
      const id = matches[1];
      const left = characterList[0];
      const right = characterList[1];
      const endsWithZ = id.endsWith('Z');
      const endsWithA = id.endsWith('A');

      this.graph.addCoordinate(id, left, right, endsWithZ, endsWithA);
    });
  }
}