export class Coordinates {
    constructor(left: string, right: string) {
        this._left = left;
        this._right = right;
    }
    private _left: string;
    private _right: string;


    get left(): string {
        return this._left;
    }

    set left(value: string) {
        this._left = value;
    }

    get right(): string {
        return this._right;
    }

    set right(value: string) {
        this._right = value;
    }
}

export class HauntedWasteland {
    get countToZZZ(): number {
        return this._countToZZZ;
    }

    set countToZZZ(value: number) {
        this._countToZZZ = value;
    }

    private map = {};
    private _countToZZZ = 0;
    private startingLocation = '';
    private runningLocation = '';

    constructor(input: string) {
        const inputList = input.split(/\n\s*\n/);
        this.buildMap(inputList[1].split('\n'));
        this.loopThroughInstructionsAndCount(inputList[0])
    }

    loopThroughInstructionsAndCount(directionString) {
        const directionArr = directionString.split('');

        let zzzWasFound = false;
        this.runningLocation = this.startingLocation;
        while (!zzzWasFound) {
            zzzWasFound = this.loopThroughDirections(directionArr);
        }
    }

    private loopThroughDirections(directionArr: string[]) {
        let wasFound = false;

        directionArr.forEach(direction => {
            if (this.runningLocation === 'ZZZ') {
                wasFound = true;
                return;
            }
            this._countToZZZ += 1;

            if (direction === 'L') {
                this.runningLocation = this.map[this.runningLocation].left;
            } else {
                this.runningLocation = this.map[this.runningLocation].right;
            }
        });
        return wasFound;
    }

    buildMap(inputArr) {

        // build out a map of coordinates
        inputArr.forEach(coordLine => {
            const matches = coordLine.match(/(\w+)\s*=\s*\(([\w\s,]+)\)/);
            const characterList = matches[2].replace(/\s/g, '').split(',');
            const id = matches[1];
            const left = characterList[0];
            const right = characterList[1];

            // set initial location
            if (this.startingLocation === '') {
               this.startingLocation = id;
            }

            this.map[id] = new Coordinates(left, right);
        });
    }
}