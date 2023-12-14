export class Mirror {
  get runningTotal(): number {
    return this._runningTotal;
  }
  private _runningTotal = 0;

  constructor(input: string, isSmudged) {
    const inputArr = input.split(/\n\s*\n/);
    this.parseMazes(inputArr, isSmudged);
  }

  parseMazes(inputArr, isSmudged) {
    inputArr.forEach(maze => {
      const mazeGridRows = maze.split('\n');
      const mazeColumns = Array.from({ length: mazeGridRows[0].length }, (_, i) => mazeGridRows.map(row => row[i]).join(''));

      // loop over columns to look for mirror
      let mirrorPoints = [];
      if (!isSmudged) {
        mirrorPoints = this.searchForMirror(mazeGridRows);
      } else {
        mirrorPoints = this.searchForSmudgedMirror(mazeGridRows);
      }

      if (mirrorPoints.length === 0) {
        // its a horizontal fold
        if (!isSmudged) {
          mirrorPoints = this.searchForMirror(mazeColumns);
        } else {
          mirrorPoints = this.searchForSmudgedMirror(mazeColumns);
        }

        // there could be no mirror?
        if (mirrorPoints.length > 0) {
          // vertical fold
          const numToAdd = (mirrorPoints[0] + 1);
          this._runningTotal += numToAdd;
        }
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

        while ((minCounter >= 0 && maxCounter < arrayToSearch.length) && isMirrored) {
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

    return mirrorPoints.sort(function(a, b) {
      return a - b;
    });
  }

  searchForSmudgedMirror(arrayToSearch) {
    // find a match
    // check indexes farther away to confirm
    const possibleMirrorIndexes = [];
    let smudgeCount = 0;

    for (let index = 0; index < arrayToSearch.length; index += 1) {
      const isSmudged = this.isSmudged(arrayToSearch[index], arrayToSearch[index + 1], smudgeCount);

      if (arrayToSearch[index] === arrayToSearch[index + 1] || isSmudged) {
        // need to check the rest of the row for mirrors from this point
        // go ahead and "re-check" min counter so we can handle literal edge cases
        let minCounter = index;
        let maxCounter = index + 1;
        let isMirrored = true; // innocent until proven guilty
        const preWhileSmudgeCounter = smudgeCount;

        while ((minCounter >= 0 && maxCounter < arrayToSearch.length) && isMirrored) {

          const isSmudged = this.isSmudged(arrayToSearch[minCounter], arrayToSearch[maxCounter], smudgeCount);
          if (isSmudged) {
            smudgeCount += 1;
          }

          // check the rest of the array
          if (arrayToSearch[minCounter] === arrayToSearch[maxCounter] || isSmudged) {
            minCounter -= 1;
            maxCounter += 1;
          } else {
            isMirrored = false;
            smudgeCount = preWhileSmudgeCounter;
          }
        }

        // MUST have a smudge
        if (isMirrored && smudgeCount === 1) {
          possibleMirrorIndexes.push(index);
          possibleMirrorIndexes.push(index + 1);
          break;
        }
      }
    }

    let mirrorPoints = [];
    // if possible indexes is only two best case scenario!
    if (possibleMirrorIndexes.length === 2) {
      // found the mirror point do the rest
      mirrorPoints = possibleMirrorIndexes;
    }

    return mirrorPoints.sort(function(a, b) {
      return a - b;
    });
  }

  isSmudged(str1, str2, smudgeCount) {
    let differences = 0;

    if (!str1 || !str2) {
      return false;
    }

    // can only smudge once per puzzle!
    if (smudgeCount > 1) {
      return false;
    }

    // Iterate through each character of the strings
    for (let i = 0; i < str1.length; i++) {
      if (str1[i] !== str2[i]) {
        differences++;

        // short circuit if greater than one
        if (differences > 1) {
          return false;
        }
      }
    }

    return differences === 1;
  }
}