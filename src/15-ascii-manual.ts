interface Lens {
  label: string,
  focalPoint: string
}

export class AsciiManual {
  get focalPower(): number {
    return this._focalPower;
  }
  get hashTotalSum(): number {
    return this._hashTotalSum;
  }

  private _hashTotalSum = 0;
  private _focalPower = 0;

  constructor(input: string) {
    const inputArr = input.replace(/\n/g, '').split(',');
    this.calculateAsciiCodes(inputArr);
    this.organizeLenses(inputArr);
  }

  calculateAsciiCodes(inputArr) {
    inputArr.forEach(stringToCodify => {
      let stringSum = this.hashAlgorithm(stringToCodify);
      this._hashTotalSum += stringSum;
    });
  }

  organizeLenses(inputArr) {
    let numberMap = new Map();

    // Populate the map with keys from 0 to 255, each containing an empty array
    for (let i = 0; i <= 255; i++) {
        numberMap.set(i, []);
    }

    inputArr.forEach(stringToCodify => {
      this.addLensToBoxes(stringToCodify, numberMap);
    });

    this.getFocusPower(numberMap);
  }

  private getFocusPower(numberMap: Map<any, any>) {
    for (let [key, value] of numberMap) {
      if (value.length > 0) {
        for (let index = 0; index < value.length; index += 1) {
          // One plus the box number of the lens in question.
          const boxScore = 1 + key;
          // The slot number of the lens within the box: 1 for the first lens, 2 for the second lens, and so on.
          const lensSlot = index + 1;
          // The focal length of the lens.
          this._focalPower += boxScore * lensSlot * value[index].focalPoint;
        }
      }
    }
  }

  private addLensToBoxes(stringToCodify, numberMap: Map<any, any>) {
    // check if dash or equal sign
    if (stringToCodify.indexOf("-") !== -1) {
      const lensArr = stringToCodify.split('-');
      const label = lensArr[0];
      const boxNumber = this.hashAlgorithm(label);

      // check box for label, if there remove it
      const box = numberMap.get(boxNumber);
      const indexToRemove = box.findIndex(item => item.label === label);
      if (indexToRemove !== -1) {
        box.splice(indexToRemove, 1);
      }
    } else {
      // equal sign
      const lensArr = stringToCodify.split('=');
      const label = lensArr[0];
      const focalLength = lensArr[1];
      const boxNumber = this.hashAlgorithm(label);

      const box = numberMap.get(boxNumber);
      const indexOfLabel = box.findIndex(item => item.label === label);

      if (indexOfLabel !== -1) {
        // we found a match; replace with new lense
        box[indexOfLabel] = {
          label: label,
          focalPoint: focalLength
        };
      } else {
        box.push({
          label: label,
          focalPoint: focalLength
        });
      }
    }
  }

  private hashAlgorithm(stringToCodify) {
    const charArr = stringToCodify.split('');
    let stringSum = 0;

    charArr.forEach(character => {
      // Determine the ASCII code for the current character of the string.
      const asciiCode = character.charCodeAt(0);

      // Increase the current value by the ASCII code you just determined.
      stringSum += asciiCode;

      // Set the current value to itself multiplied by 17.
      stringSum = stringSum * 17;

      // Set the current value to the remainder of dividing itself by 256.
      stringSum = stringSum % 256;
    });
    return stringSum;
  }
}