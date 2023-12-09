export class Oasis {
  get runningTotal(): number {
    return this._runningTotal;
  }

  private _runningTotal = 0;

  constructor(input: string) {
    const inputArr = input.split('\n');
    this.extrapolateNextValuesAndSum(inputArr)
  }

  extrapolateNextValuesAndSum(inputArr) {
    inputArr.forEach(line => {
      const lineArr = line.split(' ').map(str => parseInt(str, 10));
      const eachSequenceLine = [lineArr];
      this.calculateValuesDown(lineArr, eachSequenceLine);
      this._runningTotal += this.extrapolateNextValue(eachSequenceLine);
    })
  }

  extrapolateNextValue(eachSequenceLine) {
    let extrapolated = 0;
    for (let index = eachSequenceLine.length - 1; index > 0; index = index - 1) {
      const lineAbove = eachSequenceLine[index - 1];

      extrapolated = extrapolated + lineAbove[lineAbove.length - 1];
    }
    return extrapolated;
  }

  calculateValuesDown(lineValues, eachSequenceLine) {
    const nextLine = [];

    for (let index = 0; index < lineValues.length - 1; index += 1) {
      const largeVal = lineValues[index + 1];
      const smallerVal = lineValues[index];
      const nextSequenceVal = largeVal - smallerVal;
      nextLine.push(nextSequenceVal);
    }
    eachSequenceLine.push(nextLine);

    // if next line is all zeros
    if (nextLine.every(element => element === 0)) {
      // we gotta do something with this...
      // get the last value of next line, return it.
      return;
    } else {
      this.calculateValuesDown(nextLine, eachSequenceLine);
    }
    return;
  }
}