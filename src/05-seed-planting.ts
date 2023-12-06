class Seed {
    get seedId(): number {
        return this._seedId;
    }

    set seedId(value: number) {
        this._seedId = value;
    }

    get soilId(): number {
        return this._soilId;
    }

    set soilId(value: number) {
        this._soilId = value;
    }

    get fertilizerId(): number {
        return this._fertilizerId;
    }

    set fertilizerId(value: number) {
        this._fertilizerId = value;
    }

    get waterId(): number {
        return this._waterId;
    }

    set waterId(value: number) {
        this._waterId = value;
    }

    get lightId(): number {
        return this._lightId;
    }

    set lightId(value: number) {
        this._lightId = value;
    }

    get tempId(): number {
        return this._tempId;
    }

    set tempId(value: number) {
        this._tempId = value;
    }

    get humidityId(): number {
        return this._humidityId;
    }

    set humidityId(value: number) {
        this._humidityId = value;
    }

    get locationId(): number {
        return this._locationId;
    }

    set locationId(value: number) {
        this._locationId = value;
    }

    private _seedId: number;
    private _soilId: number;
    private _fertilizerId: number;
    private _waterId: number;
    private _lightId: number;
    private _tempId: number;
    private _humidityId: number;
    private _locationId: number;

    constructor(seedId, soilId, fertilizerId, waterId, lightId, tempId, humidityId, locationId) {
        this._seedId = seedId;
        this.soilId = soilId;
        this.fertilizerId = fertilizerId;
        this.waterId = waterId;
        this.lightId = lightId;
        this.tempId = tempId;
        this.humidityId = humidityId;
        this.locationId = locationId;
    }
}

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
    get lowestLocation(): number {
        return this._lowestLocation;
    }

    set lowestLocation(value: number) {
        this._lowestLocation = value;
    }
    get seedIds(): any[] {
        return this._seedIds;
    }

    set seedIds(value: any[]) {
        this._seedIds = value;
    }
    private _seedIds = [];
    private _lowestLocation = -1;

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
            const soilId = this.getSeedInfo(seedToSoilList, parseInt(seedId));
            const fertilizerId = this.getSeedInfo(soilToFertilizerList, soilId);
            const waterId = this.getSeedInfo(fertilizerToWaterList, fertilizerId);
            const lightId = this.getSeedInfo(waterToLightList, waterId);
            const tempId = this.getSeedInfo(lightToTemperatureList, lightId);
            const humidityId = this.getSeedInfo(temperatureToHumidityList, tempId);
            const locationId = this.getSeedInfo(humidityToLocationList, humidityId);

            this.seedIds.push(new Seed(parseInt(seedId), soilId, fertilizerId, waterId, lightId, tempId, humidityId, locationId));

            if (this._lowestLocation === -1 || this.lowestLocation > locationId) {
                this.lowestLocation = locationId;
            }
        });
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