export class Mirror {
  get runningTotal(): number {
    return this._runningTotal;
  }
  private _runningTotal = 0;

  constructor(input: string) {
    const inputArr = input.split(/\n\s*\n/);
    this.parseMazes(inputArr);
  }

  parseMazes(inputArr) {
    inputArr.forEach(maze => {
      const mazeGridRows = maze.split('\n');
      const mazeColumns = Array.from({ length: mazeGridRows[0].length }, (_, i) => mazeGridRows.map(row => row[i]).join(''));

      // loop over columns to look for mirror
      let mirrorPoints = this.searchForMirror(mazeGridRows);

      if (mirrorPoints.length === 0) {
        // its a horizontal fold
        mirrorPoints = this.searchForMirror(mazeColumns);
        // vertical fold
        const numToAdd = (mirrorPoints[0] + 1);
        this._runningTotal += numToAdd;
      } else {
        // horizontal fold
        const numToAdd = (mirrorPoints[0] + 1) * 100;
        this._runningTotal += numToAdd;
      }
    });
  }

  searchForMirror(arrayToSearch) {
    // edge cases:
    // multiple matching rows but ones not mirrored
    // match is right on the edge
    // no match
    // multiple mirrors but they are tiny? havent done this yet lets wait and see....
    // both the columns and row mirror (I think not it said either)


    // find a match
    // check indexes farther away to confirm
    const possibleMirrorIndexes = [];

    for (let index = 0; index < arrayToSearch.length; index += 1) {
      if (arrayToSearch[index] === arrayToSearch[index + 1]) {
        // need to check the rest of the row for mirrors from this point
        let minCounter = index - 1;
        let maxCounter = index + 2;
        let isMirrored = true; // innocent until proven guilty

        while ((minCounter !== 0 || maxCounter !== arrayToSearch.length) && isMirrored) {
          // check the rest of the array
          if (arrayToSearch[minCounter] === arrayToSearch[maxCounter]) {
            minCounter -= 1;
            maxCounter += 1;
          } else {
            isMirrored = false;
          }
        }

        if (isMirrored) {
          possibleMirrorIndexes.push(index);
          possibleMirrorIndexes.push(index + 1);
        }
      }
    }

    let mirrorPoints = [];
    // if possible indexes is only two best case scenario!
    if (possibleMirrorIndexes.length === 2) {
      // found the mirror point do the rest
      mirrorPoints = possibleMirrorIndexes;
    }

    if (possibleMirrorIndexes.length > 2) {
      // oh boy we have a tricky situation
      if (possibleMirrorIndexes.length % 2 === 0) {
        // evenly divisible, divide by 2 and take the two middle items
        // 8/2 = 4; match would be 4 and 4 + 1
        const middleIndex = possibleMirrorIndexes.length /2;
        mirrorPoints.push(middleIndex);
        mirrorPoints.push(middleIndex + 1);
      } else {
        // get ceiling point
        const middlePoint = Math.ceil(possibleMirrorIndexes.length / 2);
        mirrorPoints.push(middlePoint);

        // this can only happen near an edge
        if (possibleMirrorIndexes[possibleMirrorIndexes.length - 1] === arrayToSearch.length) {
          // we ran over on the right side;
          // ..#####]
          mirrorPoints.push(middlePoint + 1);
        } else {
          mirrorPoints.push(middlePoint - 1);
        }
      }
    }
    return mirrorPoints.sort(function(a, b) {
      return a - b;
    });
  }
}