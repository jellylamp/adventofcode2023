export class Observatory {
  private _grid = [];

  constructor(input: string) {
    const inputArr = input.split('\n');
    this.constructGrid(inputArr);
  }

  constructGrid(inputList) {
  const horizontalExpanded = [];

  // Expand horizontally
  for (let index = 0; index < inputList.length; index += 1) {
    const line = inputList[index];
    const gridLine = [...line];

    // Expand the universe! Push grid line twice to handle empty rows
    if (!line.includes('#')) {
      horizontalExpanded.push(gridLine);
    }

    horizontalExpanded.push(gridLine);
  }

  const verticalExpanded = horizontalExpanded.map(row => [...row]);
  let columnsExpanded = 0;

  // Expand vertically
  for (let column = 0; column < horizontalExpanded[0].length; column++) {
    let hasHash = false;

    // Check if the column contains a '#'
    for (let row = 0; row < horizontalExpanded.length; row++) {
      if (horizontalExpanded[row][column] === '#') {
        hasHash = true;
        break; // exit the loop if '#' is found in the column
      }
    }

    // after the first expansion the counts get whacked...
    if (!hasHash) {
      // Expand the universe vertically
      for (let row = 0; row < horizontalExpanded.length; row++) {
        verticalExpanded[row].splice(column + 1 + columnsExpanded, 0, verticalExpanded[row][column + columnsExpanded]);
      }
      columnsExpanded += 1;
    }
  }

    this._grid = verticalExpanded;
  }
}