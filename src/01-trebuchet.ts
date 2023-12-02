enum Direction {
  FIRST = 'first',
  LAST = 'last',
}

type SpelledOutNumber = {
  spelling: string;
  value: number;
}

type IndexAndValue = {
  indexCount: number,
  valueOfNumber: number
}

export class Trebuchet {
  private integerList: SpelledOutNumber[] = [
    { spelling: "one", value: 1},
    { spelling: "two", value: 2},
    { spelling: "three", value: 3},
    { spelling: "four", value: 4},
    { spelling: "five", value: 5},
    { spelling: "six", value: 6},
    { spelling: "seven", value: 7},
    { spelling: "eight", value: 8},
    { spelling: "nine", value: 9},
  ];

  get trebuchetNumberSpelledOut(): string {
    return this._trebuchetNumberSpelledOut;
  }

  set trebuchetNumberSpelledOut(value: string) {
    this._trebuchetNumberSpelledOut = value;
  }
  set trebuchetNumber(value: string) {
    this._trebuchetNumber = value;
  }
  get trebuchetNumber(): string {
    return this._trebuchetNumber;
  }

  private _trebuchetNumber: string;

  private _trebuchetNumberSpelledOut: string;

  constructor(input: string) {
    this.createTrebuchetNumber(input);
    this.createTrebuchetNumberSpelledOut(input)
  }

  findNumber(codeString: string, direction: Direction): IndexAndValue {
    const codeArr = [...codeString];
    const ogCodeArr = codeArr.slice();
    let number = {
      indexCount: -1,
      valueOfNumber: 0
    };

    while (codeArr.length > 0) {
      let char = 0;
      if (direction === Direction.FIRST) {
        char = parseInt(codeArr.shift());
      } else {
        char = parseInt(codeArr.pop());
      }
      if (!isNaN(char)) {
        number.valueOfNumber = char;
        if (direction === Direction.FIRST) {
          number.indexCount = ogCodeArr.indexOf(char.toString());
        } else if (direction === Direction.LAST) {
          number.indexCount = ogCodeArr.lastIndexOf(char.toString());
        }
        break;
      }
    }

    return number;
  }

  searchForSpelledWords(codeString: string, direction: Direction): IndexAndValue {
    let runningNum = {
      indexCount: -1,
      valueOfNumber: 0
    };

    this.integerList.some(integer => {

      const indexOfInteger = direction === Direction.FIRST ? codeString.indexOf(integer.spelling) : codeString.lastIndexOf(integer.spelling);
      if (indexOfInteger !== -1) {
        if (direction === Direction.FIRST && (indexOfInteger < runningNum.indexCount || runningNum.indexCount === -1)) {
            runningNum.valueOfNumber = integer.value;
            runningNum.indexCount = indexOfInteger;
        } else if (direction === Direction.LAST && (indexOfInteger > runningNum.indexCount || runningNum.indexCount === -1)) {
            runningNum.valueOfNumber = integer.value;
            runningNum.indexCount = codeString.lastIndexOf(integer.spelling);
        }
      }
    });

    return runningNum;
  }


  findNumberIncludingSpelledOut(codeString: string, direction: Direction): number {
    // do a indexof? of each digit spelling and check the index of the first letter;
    // then do the other one and take the smaller?

    const spelledOutNumber = this.searchForSpelledWords(codeString, direction);
    const digitNumber = this.findNumber(codeString, direction);

    if (spelledOutNumber.indexCount === -1 && digitNumber.indexCount === -1) {
      return 0;
    } else if (spelledOutNumber.indexCount === -1) {
      return digitNumber.valueOfNumber;
    } else if (digitNumber.indexCount === -1) {
      return spelledOutNumber.valueOfNumber;
    }

    if (direction === Direction.FIRST) {
      if (spelledOutNumber.indexCount < digitNumber.indexCount) {
        return spelledOutNumber.valueOfNumber;
      } else {
        return digitNumber.valueOfNumber;
      }
    } else if (direction === Direction.LAST) {
      if (spelledOutNumber.indexCount > digitNumber.indexCount) {
        return spelledOutNumber.valueOfNumber;
      } else {
        return digitNumber.valueOfNumber;
      }
    }
  }

   addArrayNumsTogether(numArray) {
    return numArray.reduce((accumulator, currentValue) => {
      return accumulator + currentValue
    }, 0);
  }

  // create trebuchet number
  createTrebuchetNumber(input) {
    const inputList = input.split('\n');
    const numList = [];

    inputList.forEach(codeString => {
      const firstNum = this.findNumber(codeString, Direction.FIRST).valueOfNumber;
      const secondNum = this.findNumber(codeString, Direction.LAST).valueOfNumber;
      const fullNum = parseInt(`${firstNum}${secondNum}`);
      numList.push(fullNum);
    });

    this.trebuchetNumber = this.addArrayNumsTogether(numList);
  }

    // create trebuchet number
  createTrebuchetNumberSpelledOut(input) {
    const inputList = input.split('\n');
    const numList = [];

    inputList.forEach(codeString => {
      const firstNum = this.findNumberIncludingSpelledOut(codeString, Direction.FIRST);
      const secondNum = this.findNumberIncludingSpelledOut(codeString, Direction.LAST);
      const fullNum = parseInt(`${firstNum}${secondNum}`);
      numList.push(fullNum);
    });

    this.trebuchetNumberSpelledOut = this.addArrayNumsTogether(numList);
  }

}
