
export class HotSprings {
  get possibleSum(): number {
    return this._possibleSum;
  }
  private _possibleSum = 0;
  private cache = new Map();

  constructor(input: string, isPartB: boolean) {
    const inputArr = input.split('\n');
    this.findPossibleArrangements(inputArr, isPartB);
  }

  findPossibleArrangements(lineArr, isPartB) {
    const repetitions = 5;
    lineArr.forEach(line => {
      const lineSplit = line.split(' ');
      let instruction = lineSplit[0];
      let arrangements = lineSplit[1];

      // "unfold" it
      if (isPartB) {
        instruction = Array.from({ length: repetitions }, (_, index) => instruction + (index < repetitions - 1 ? "?" : "")).join("");
        arrangements = Array.from({ length: repetitions }, (_, index) => arrangements + (index < repetitions - 1 ? "," : "")).join("");
        arrangements = arrangements.split(',').map(Number);
      } else {
        arrangements = lineSplit[1].split(',').map(Number);
      }
      this.getPossibleArrangements(instruction, arrangements);
    });
  }

  getPossibleArrangements(instructions: string, arrangements: number[]): number {
    if (instructions.includes('?')) {
      // determine permutations/combinations of ways to fit remaining numbers into remaining consecutive groups
      this.bruteForceReplacementChecks(instructions, arrangements);
    } else {
      // if no ??? then the arrangement count is the instruction count
      return arrangements.length;
    }
  }

  bruteForceReplacementChecks(instruction, arrangements) {
    let combinations = [];

    // get all possible combinations of all of the groups joined
    combinations = this.generateCombinationsWithCaching(instruction);

    combinations.forEach(combination => {
      const combinationsConsecutiveGroups = combination.match(/([?#]+)/g);
      for (let i = 0; i < arrangements.length; i++) {
        const numberToCheck = arrangements[i];
        if (combinationsConsecutiveGroups.length === 0) {
          // we still have numbers left but we quit, bail, not a match; add 1 so we don't miscount
          combinationsConsecutiveGroups.push('FAILURE');
          return false;
        }

        const didFilter = this.filterOutDefiniteFits(combinationsConsecutiveGroups, numberToCheck);

        if (!didFilter) {
          // bail combination; it's not a match
          break;
        }
      }
      if (combinationsConsecutiveGroups.length === 0) {
        // successfully fit each option
        this._possibleSum += 1;
      }
    });
  }

  generateCombinationsWithCaching(instruction) {
    const combinationsConsecutiveGroups = instruction.match(/([?#]+)/g);
    const runningCombinations = [];
    const concatenatedArrays = [];

    combinationsConsecutiveGroups.forEach(combination => {
      const combinations = [];

      // Check if the combination is already cached
      if (this.cache.has(combination)) {
        // If yes, use the cached result
        combinations.push(...this.cache.get(combination));
      } else {
        this.generateCombinations(combination, 0, '', combinations);
      }

      runningCombinations.push(combinations);
      // add to cache
      this.cache.set(combination, combinations.slice());
    });

    this.squashArrayOfArrays(runningCombinations, 0, [], concatenatedArrays);

    return concatenatedArrays;
  }

  squashArrayOfArrays(arrays, currentIndex, currentCombination, result) {
    if (currentIndex === arrays.length) {
      result.push(currentCombination.join('.'));
      return;
    }

    for (const element of arrays[currentIndex]) {
      currentCombination.push(element);
      this.squashArrayOfArrays(arrays, currentIndex + 1, currentCombination, result);
      currentCombination.pop();
    }
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
    // Calculate consecutive hashes that exactly match length, remove if you can
    const firstGroup = consecutiveGroups[0];

    // Check the first consecutive group
    if (firstGroup && firstGroup.length === sizeToCheck && /^#+$/.test(firstGroup)) {
      // Only one possible match; remove it to reduce miscounts later and return immediately because we know it works
      consecutiveGroups.shift(); // Remove the first group
      return true;
    }

    return false;
  }
}