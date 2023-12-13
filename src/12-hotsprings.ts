
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

      // filter out definite numbers to reduce our set
      for (let index = 0; index < sortedArrangements.length; index += 1) {
        const largestNumber = sortedArrangements[index];
        const didFilter = this.filterOutDefiniteFits(consecutiveGroups, largestNumber);

        if (didFilter) {
          // remove largest number
          sortedArrangements.splice(index, 1);
        }
      }

      // determine permutations/combinations of ways to fit remaining numbers into remaining consecutive groups
      possibleCount += this.bruteForceReplacementChecks(consecutiveGroups, sortedArrangements);

      return possibleCount;
    } else {
      // if no ??? then the arrangement count is the instruction count
      return arrangements.length;
    }
  }

  bruteForceReplacementChecks(consecutiveGroups, sortedNumbers) {
    // join back into a string for easier searching
    const consecutiveGroupsJoined = consecutiveGroups.join('.');
    const combinations = [];
    let possibilityCount = 0;

    // get all possible combinations of all of the groups joined
    this.generateCombinations(consecutiveGroupsJoined, 0, '', combinations);

    combinations.forEach(combination => {
      const combinationsConsecutiveGroups = combination.match(/([?#]+)/g);
      for (let i = 0; i < sortedNumbers.length; i++) {
        const sortedNumber = sortedNumbers[i];
        if (combinationsConsecutiveGroups.length === 0) {
          // we still have numbers left but we quit, bail, not a match; add 1 so we don't miscount
          combinationsConsecutiveGroups.push('FAILURE');
          return false;
        }

        const didFilter = this.filterOutDefiniteFits(combinationsConsecutiveGroups, sortedNumber);

        if (!didFilter) {
          // bail combination; it's not a match
          break;
        }
      }
      if (combinationsConsecutiveGroups.length === 0) {
        // successfully fit each option
        possibilityCount += 1;
      }
    });
    return possibilityCount;
  }

  generateCombinations(str, index, currentCombination, result) {
    // Base case: if we have processed all characters in the input string
    if (index === str.length) {
      // Check if the combination contains only periods
      if (currentCombination.includes('#')) {
        // Add the current combination to the result array
        result.push(currentCombination);
      }
      return;
    }

    // If the current character is a '?', explore both possibilities: '#' and '.'
    if (str[index] === '?') {
      this.generateCombinations(str, index + 1, currentCombination + '#', result);
      this.generateCombinations(str, index + 1, currentCombination + '.', result);
    } else {
      // If the current character is not a '?', simply append it to the current combination
      this.generateCombinations(str, index + 1, currentCombination + str[index], result);
    }
  }

  filterOutDefiniteFits(consecutiveGroups: string[], sizeToCheck: number) {
    // calculate consecutive hashes that exactly match length, remove if you can
    const definiteIndex = consecutiveGroups.findIndex((item, idx) => item.length === sizeToCheck && /^#+$/.test(item));

    // only one possible match remove it to reduce miscounts later; return immediately we know it works
    if (definiteIndex !== -1) {
      consecutiveGroups.splice(definiteIndex, 1);
      return true;
    }
    return false;
  }
}