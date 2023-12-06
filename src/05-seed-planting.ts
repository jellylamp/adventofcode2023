class Coordinates {
    private source: number;
    private dest: number;
    private range: number;
    private maxSource: number;

    constructor(inputString: string) {
        this.calculateMinAndMax(inputString);
    }

    calculateMinAndMax(inputString) {
        const inputArr = inputString.split(' ');
        this.dest = parseInt(inputArr[0]);
        this.source = parseInt(inputArr[1]);
        this.range = parseInt(inputArr[2]);
        this.maxSource = this.source + this.range;
    }
}

export class SeedPlanting {
    get lowestRangeLocation(): number {
        return this._lowestRangeLocation;
    }

    set lowestRangeLocation(value: number) {
        this._lowestRangeLocation = value;
    }
    get lowestLocation(): number {
        return this._lowestLocation;
    }

    set lowestLocation(value: number) {
        this._lowestLocation = value;
    }

    private _lowestLocation = -1;
    private _lowestRangeLocation = -1;

    constructor(input: string) {
        this.determineSeedPlots(input);
    }

    determineSeedPlots(input: string) {
        // split on empty lines
        const inputList = input.split(/\n\s*\n/);
        const seedList = inputList[0].split(' ');
        const seedToSoilList = this.parseCoordinates(inputList[1].split('\n'));
        const soilToFertilizerList = this.parseCoordinates(inputList[2].split('\n'));
        const fertilizerToWaterList = this.parseCoordinates(inputList[3].split('\n'));
        const waterToLightList = this.parseCoordinates(inputList[4].split('\n'));
        const lightToTemperatureList = this.parseCoordinates(inputList[5].split('\n'));
        const temperatureToHumidityList = this.parseCoordinates(inputList[6].split('\n'));
        const humidityToLocationList = this.parseCoordinates(inputList[7].split('\n'));

        // throw away first seed label
        seedList.shift();

        seedList.forEach(seedId => {
            this.getSeedValues(
                seedId,
                seedToSoilList,
                soilToFertilizerList,
                fertilizerToWaterList,
                waterToLightList,
                lightToTemperatureList,
                temperatureToHumidityList,
                humidityToLocationList,
                false);
        });


        // calculate based on ranges!
        for (let i = 0; i < seedList.length; i = i + 2) {
            const seedStart = parseInt(seedList[i]);
            const seedRange = parseInt(seedList[i + 1]);

            for (let seedId = seedStart; seedId < seedStart + seedRange; seedId += 1) {
                this.getSeedValues(
                    seedId,
                    seedToSoilList,
                    soilToFertilizerList,
                    fertilizerToWaterList,
                    waterToLightList,
                    lightToTemperatureList,
                    temperatureToHumidityList,
                    humidityToLocationList,
                    true);
            }
        }
    }

    private getSeedValues(seedId, seedToSoilList: any[], soilToFertilizerList: any[], fertilizerToWaterList: any[], waterToLightList: any[], lightToTemperatureList: any[], temperatureToHumidityList: any[], humidityToLocationList: any[], isRange) {
        const soilId = this.getSeedInfo(seedToSoilList, parseInt(seedId));
        const fertilizerId = this.getSeedInfo(soilToFertilizerList, soilId);
        const waterId = this.getSeedInfo(fertilizerToWaterList, fertilizerId);
        const lightId = this.getSeedInfo(waterToLightList, waterId);
        const tempId = this.getSeedInfo(lightToTemperatureList, lightId);
        const humidityId = this.getSeedInfo(temperatureToHumidityList, tempId);
        const locationId = this.getSeedInfo(humidityToLocationList, humidityId);

        if (!isRange && (this._lowestLocation === -1 || this.lowestLocation > locationId)) {
            this.lowestLocation = locationId;
        }
        if (isRange && (this.lowestRangeLocation === -1 || this.lowestRangeLocation > locationId)) {
            this.lowestRangeLocation = locationId;
        }
    }

    getSeedInfo(listOfCoords, idToUse) {
        // loop through coordinates and check min vs max; if within use the range to get the ideal plot info
        // if not then its just itself
        let destinationId = -1;

        listOfCoords.forEach(coord => {
            if (idToUse >= coord.source && idToUse < coord.maxSource) {
                // found it! Not sure if the -1 is correct
                const numToAdd = idToUse - coord.source;
                destinationId = coord.dest + numToAdd;
            }
        });
        if (destinationId === -1) {
            // maps just flat if we never found destination
            destinationId = idToUse;
        }
        return destinationId;
    }

    parseCoordinates(stringArr: any[]) {
        const coords = [];
        // throw away the first line
        stringArr.shift();

        stringArr.forEach(coordinate => {
            coordinate = new Coordinates(coordinate);
            coords.push(coordinate);
        });

        return coords;
    }

}