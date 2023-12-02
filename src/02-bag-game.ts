enum Color {
    BLUE = "blue",
    RED = "red",
    GREEN ="green"
}

export class BagGame {
    get totalPowerOfGames(): number {
        return this._totalPowerOfGames;
    }

    set totalPowerOfGames(value: number) {
        this._totalPowerOfGames = value;
    }
    get totalIdCount(): number {
        return this._totalIdCount;
    }

    set totalIdCount(value: number) {
        this._totalIdCount = value;
    }

    private _totalIdCount: number;
    private _totalPowerOfGames: number;

    constructor(input: string) {
        this.determinePossibleGames(input);
    }

    determinePossibleGames(input: string) {
        const inputList = input.split('\n');
        this.totalIdCount = 0;
        this.totalPowerOfGames = 0;

        inputList.forEach(line => {
            const id = line.substring(0, line.indexOf(':'));
            const rules = line.substring(line.indexOf(':') + 1);
            const rulesList = rules.split(';');
            const redCount = this.getCountBasedOnColor(Color.RED, rulesList);
            const blueCount = this.getCountBasedOnColor(Color.BLUE, rulesList);
            const greenCount = this.getCountBasedOnColor(Color.GREEN, rulesList);
            if (this.doesFollowRule(Color.RED, redCount) && this.doesFollowRule(Color.BLUE, blueCount) && this.doesFollowRule(Color.GREEN, greenCount)) {
                this.totalIdCount += this.getNumberFromString(id);
            }
            const power = redCount * blueCount * greenCount;
            this.totalPowerOfGames += power;
        });
    }

    getCountBasedOnColor(color: Color, rulesList: string[]) {
        let highestCount = 0;
        rulesList.forEach(rule => {
            const colorList = rule.split(',');
            colorList.forEach(colorRule => {
                if (colorRule.includes(color)) {
                    const newCount = this.getNumberFromString(colorRule);
                    highestCount = Math.max(highestCount, newCount);
                }
            })
        });
        return highestCount;
    }

    getNumberFromString(lineToParse: string): number {
        const r = /\d+/;
        return parseInt(lineToParse.match(r)[0]);
    }

    doesFollowRule(color: Color, count: number) {
        // 12 red, 13 green, 14 blue
        const RED_MAX = 12;
        const GREEN_MAX = 13;
        const BLUE_MAX = 14;

        if (
            (color === Color.RED && count <= RED_MAX) ||
            (color === Color.GREEN && count <= GREEN_MAX) ||
            (color === Color.BLUE && count <= BLUE_MAX)
        ) {
            return true;
        }
        return false;
    }
}