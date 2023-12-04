interface CardRelationships {
  [card: number]: number[];
}

export class ScratchOffs {
    get cardIdsCopied(): any[] {
        return this._cardIdsCopied;
    }

    set cardIdsCopied(value: any[]) {
        this._cardIdsCopied = value;
    }
    get totalCardsWon(): number {
        return this._totalCardsWon;
    }

    set totalCardsWon(value: number) {
        this._totalCardsWon = value;
    }
    get cardRelationships(): CardRelationships {
        return this._cardRelationships;
    }

    set cardRelationships(value: CardRelationships) {
        this._cardRelationships = value;
    }
    get totalWon(): number {
        return this._totalWon;
    }

    set totalWon(value: number) {
        this._totalWon = value;
    }
    private _totalWon: number;
    private _totalCardsWon: number;
    private _cardIdsCopied: any[] = [];

    private _cardRelationships: CardRelationships = {};

    constructor(input: string) {
        this.determineWinnings(input);
    }

    determineWinnings(input: string) {
        const inputList = input.split('\n');
        this.totalWon = 0;

        inputList.forEach(line => {
            const intersection = this.getWinningNumbers(line);
            this.calculateTotalWinningsPart1(intersection);

            // going line by line here will tell us how many scratchoffs we have won, and we can get the
            // id to determine the ids of the cards we have won extra for
            const card = line.split("|");

            const numberRegex = /\d+(\.\d+)?/g;
            const cardId = parseInt(card[0].split(":")[0].match(numberRegex)[0]);
            const cardsWon = intersection.length;

            // if we make a map of all of the cards each card wins on the first go, we can then iterate over that
            // map for the extra parts
            const cardMap = [];
            for (let i = 1; i <= cardsWon; i++) {
                cardMap.push(cardId + i);
            }
            this.cardRelationships[cardId] = cardMap;
        });

        // we have built out our map and now need to do the math part
        this.totalCardsWon = 0;
        this.calculateTotalCards(1);
        this.addCardsThatAreNotCopied();
    }

    calculateTotalCards(cardToCheck) {
        // now loop through the values of each entry and grab its total and add it... recursion
        const cardsWon = this.cardRelationships[cardToCheck];
        let cardsToAdd = cardsWon.length;
        this.cardIdsCopied.push(cardToCheck);

        this.totalCardsWon += 1 + cardsToAdd;

        cardsWon.forEach(cardId => {
            this.calculateTotalCards(cardId);
        });
    }

    addCardsThatAreNotCopied() {
        // make sure that copied cards is a unique array
        this.cardIdsCopied = Array.from(new Set(this.cardIdsCopied));
        const nonIntersectingKeys = Object.keys(this.cardRelationships).filter(key => !this.cardIdsCopied.includes(Number(key)));
        this.totalCardsWon += nonIntersectingKeys.length;
    }

    private calculateTotalWinningsPart1(intersection: string[]) {
        let cardTotal = 0;
        intersection.forEach(win => {
            if (cardTotal === 0) {
                cardTotal = 1;
            } else {
                cardTotal = cardTotal * 2;
            }
        });
        this.totalWon += cardTotal;
    }

    private getWinningNumbers(line: string) {
        const card = line.split("|");
        const winningCardArr = card[0].split(":")[1].split(" ");
        const yourNumbersArr = card[1].split(" ");
        return yourNumbersArr.filter(element => {
            if (element === '') {
                return false;
            }
            return winningCardArr.includes(element)
        });
    }
}