interface instruction {
  letterToCompare: string,
  comparisonRule: string,
  nextCondition: string
}

export class GearSorting {
  ruleMap = {};
  acceptedSum = 0;

  constructor(input: string) {
    const inputArr = input.split(/^\s*$/gm);
    const instructionsList = inputArr[0].split('\n');
    const partsList = inputArr[1].split('\n');
    instructionsList.pop();
    partsList.shift();
    this.buildInstructionsMap(instructionsList);
    this.sortGears(partsList);
  }

  sortGears(partsList) {
    // {x=950,m=557,a=24,s=1444}
    partsList.forEach(part => {
      // start with in
      const inRule = this.ruleMap['in'];
      this.sortGear(part, inRule, 'in');
    });
  }

  sortGear(partRules, ogRuleList, debugListName) {
    // {x=950,m=557,a=24,s=1444}
    // remove {}
    let partString = partRules.replace('{', '').replace('}', '');
    const partList = partString.split(',');

    // i think i did this backwards...
    // need to go through the ogRuleString not the rule list
    for (let ruleIndex = 0; ruleIndex < ogRuleList.length; ruleIndex += 1) {
      const rule = ogRuleList[ruleIndex];

      // HAVE to go in order
      // loop through partList and find matching character
      for (let partIndex = 0; partIndex < partList.length; partIndex += 1) {
        const valueList = partList[partIndex].split('=');
        const char = valueList[0];
        const value = parseInt(valueList[1]);

        if (rule.letterToCompare === null || rule.letterToCompare === undefined) {
          if (rule.nextCondition === 'R') {
            return;
          }
          this.handleNextCondition(rule, partRules);
          return;
        }
        if (rule.letterToCompare === char) {
          // run eval and return true/false
          const matches = eval(`${value} ${rule.comparisonRule}`);
          if (matches) {
            this.handleNextCondition(rule, partRules);
            return;
          }
        }
      }
    }
  }

  private handleNextCondition(rule, partString) {
    if (rule.nextCondition === 'A') {
      // add all parts
      let replacedPartString = partString.replace('{', '').replace('}', '');
      const partList = replacedPartString.split(',');
      for (let partIndex = 0; partIndex < partList.length; partIndex += 1) {
        const valueList = partList[partIndex].split('=');
        const value = parseInt(valueList[1]);
        this.acceptedSum += value;
      }
    } else if (rule.nextCondition === 'R') {
      return;
    } else {
      this.sortGear(partString, this.ruleMap[rule.nextCondition], rule.nextCondition);
    }
  }

  buildInstructionsMap(instructionsList) {
    // sample hfm{a<1891:R,m<2881:A,m<2987:A,R}
    instructionsList.forEach(instruction => {
      instruction = instruction.replace('}', '');
      const instructionSplit = instruction.split('{');
      const title = instructionSplit[0];
      const listOfRules = instructionSplit[1].split(',');
      const ruleInstructionList = [];

      listOfRules.forEach(rule => {
        if (rule.length === 1) {
          ruleInstructionList.push({nextCondition: rule});
        } else {
          // Find the index of the first occurrence of '<' or '>'
          const indexOfLessThan = rule.indexOf('<');
          const indexOfGreaterThan = rule.indexOf('>');

          // Find the minimum index of '<' or '>'
          const indexOfOperation = Math.min(...[indexOfLessThan, indexOfGreaterThan].filter(index => index > 0));
          const indexOfColon = rule.indexOf(':');

          // Extract the substring up to the delimiter
          const lettersToCompare = indexOfOperation !== Infinity ? rule.substring(0, indexOfOperation): null;
          const operationComparison = indexOfOperation !== Infinity ? rule.substring(indexOfOperation, indexOfColon) : null;
          const nextCondition = rule.substring(indexOfColon, rule.length).replace(':', '');

          ruleInstructionList.push({
            letterToCompare: lettersToCompare,
            comparisonRule: operationComparison,
            nextCondition: nextCondition
          });
        }
      });
      this.ruleMap[title] = ruleInstructionList;
    });
  }
}