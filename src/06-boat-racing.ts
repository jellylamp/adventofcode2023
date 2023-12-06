
export class BoatRacing {
    get winningRaceProduct(): number {
        return this._winningRaceProduct;
    }

    set winningRaceProduct(value: number) {
        this._winningRaceProduct = value;
    }

    private _winningRaceProduct = 1;

    constructor(input: string) {
        this.determineSpeedsToWin(input);
    }

    determineSpeedsToWin(input: string) {
        // split on empty lines
        const inputList = input.split('\n');
        const timeList = inputList[0].split(' ').filter(Boolean);
        const distanceList = inputList[1].split(' ').filter(Boolean);

        // throw away label
        timeList.shift();
        distanceList.shift();

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
                }
            }

            this.winningRaceProduct = this.winningRaceProduct * winCount;
        }
    }
}