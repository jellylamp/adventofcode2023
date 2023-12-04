
export class ScratchOffs {
    get totalWon(): number {
        return this._totalWon;
    }

    set totalWon(value: number) {
        this._totalWon = value;
    }
    private _totalWon: number;

    constructor(input: string) {
        this.determineWinnings(input);
    }

    determineWinnings(input: string) {
        const inputList = input.split('\n');
        this.totalWon = 0;

        inputList.forEach(line => {
            const card = line.split("|");
            const winningCardArr = card[0].split(":")[1].split(" ");
            const yourNumbersArr = card[1].split(" ");
            const intersection = yourNumbersArr.filter(element => {
                if (element === '') {
                    return false;
                }
                return winningCardArr.includes(element)
            });

            let cardTotal = 0;
            intersection.forEach(win => {
               if (cardTotal === 0) {
                   cardTotal = 1;
               } else {
                   cardTotal = cardTotal * 2;
               }
            });
            this.totalWon += cardTotal;
        });
    }

}