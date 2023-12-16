export class AsciiManual {
  get hashTotalSum(): number {
    return this._hashTotalSum;
  }

  private _hashTotalSum = 0;

  constructor(input: string) {
    const inputArr = input.replace(/\n/g, '').split(',');
    this.calculateAsciiCodes(inputArr);
  }

  calculateAsciiCodes(inputArr) {
    inputArr.forEach(stringToCodify => {
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

      this._hashTotalSum += stringSum;
    });
  }
}