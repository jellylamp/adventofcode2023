
export class BoatRacing {
    get bigRaceWinCount(): number {
        return this._bigRaceWinCount;
    }

    set bigRaceWinCount(value: number) {
        this._bigRaceWinCount = value;
    }
    get winningRaceProduct(): number {
        return this._winningRaceProduct;
    }

    set winningRaceProduct(value: number) {
        this._winningRaceProduct = value;
    }

    private _winningRaceProduct = 1;
    private _bigRaceWinCount = 0;

    constructor(input: string) {
        this.determineSpeedsToWin(input);
        this.determineWaysToBeatLargeRace(input);
    }

    determineSpeedsToWin(input: string) {
        // split on empty lines
        const inputList = input.split('\n');
        const timeList = inputList[0].split(' ').filter(Boolean);
        const distanceList = inputList[1].split(' ').filter(Boolean);

        // throw away label
        timeList.shift();
        distanceList.shift();
        this.calculateRaceWin(timeList, distanceList, false);
    }

    determineWaysToBeatLargeRace(input: string) {
        // split on empty lines
        const inputList = input.split('\n');
        const timeList = inputList[0].replaceAll(' ', '').split(':');
        const distanceList = inputList[1].replaceAll(' ', '').split(':');

        // throw away label
        timeList.shift();
        distanceList.shift();
        this.calculateRaceWin(timeList, distanceList, true);
    }

    private calculateRaceWin(timeList: string[], distanceList: string[], isBigRace) {
        for (let index = 0; index < timeList.length; index += 1) {
            const maxTime = parseInt(timeList[index]);
            const distToBeat = parseInt(distanceList[index]);
            let winCount = 0;

            // start at 1 and dont include max; both are worthless
            for (let timeIndex = 1; timeIndex < maxTime; timeIndex += 1) {
                const mmPerSecond = timeIndex;
                const travelTime = maxTime - timeIndex;
                const distanceTravelled = mmPerSecond * travelTime;

                if (distanceTravelled > distToBeat) {
                    winCount += 1;
                    if (isBigRace) {
                        this._bigRaceWinCount += 1;
                    }
                }
            }

            if (!isBigRace) {
                this.winningRaceProduct = this.winningRaceProduct * winCount;
            }
        }
    }
}