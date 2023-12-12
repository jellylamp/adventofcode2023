
export class HotSprings {
  get possibleSum(): number {
    return this._possibleSum;
  }
  private _possibleSum = 0;

  constructor(input: string) {
    const inputArr = input.split('\n');
    this.findPossibleArrangements(inputArr);
  }

  findPossibleArrangements(lineArr) {
    lineArr.forEach(line => {
      const lineSplit = line.split(' ');
      const instructions = lineSplit[0];
      const arrangements = lineSplit[1].split(',').map(Number);

      this._possibleSum += this.getPossibleArrangements(instructions, arrangements);
    });
  }

  getPossibleArrangements(instructions: string, arrangements: number[]): number {
    if (instructions.includes('?')) {
      const sortedArrangements = arrangements.sort((a, b) => b - a);
      let possibleCount = 0;

      const consecutiveGroups = instructions.match(/([?#]+)/g);

      for (let index = 0; index < sortedArrangements.length; index += 1) {
        const largestNumber = sortedArrangements[index];
        possibleCount += this.calcHowManySlotsFit(consecutiveGroups, largestNumber);
      }
      return possibleCount;
    } else {
      // if no ??? then the arrangement count is the instruction count
      return arrangements.length;
    }
  }

  calcHowManySlotsFit(consecutiveGroups: string[], sizeToCheck: number) {
    let possibleIndexes = [];

    // calculate consecutive hashes that exactly match length, remove if you can
    const definiteIndex = consecutiveGroups.findIndex((item, idx) => item.length === sizeToCheck && /^#+$/.test(item));

    // only one possible match remove it to reduce miscounts later; return immediately we know it works
    if (definiteIndex !== -1) {
      consecutiveGroups.splice(definiteIndex, 1);
      return 1;
    }

    for (let index = 0; index < consecutiveGroups.length; index += 1) {
      if (consecutiveGroups[index].length >= sizeToCheck) {
        if (consecutiveGroups[index].includes('?')) {
          possibleIndexes.push(index);
        }
      }
    }

    return possibleIndexes.length;
  }
}