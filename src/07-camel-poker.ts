enum HandType {
    FIVE_OF_A_KIND = 7,
    FOUR_OF_A_KIND = 6,
    FULL_HOUSE = 5,
    THREE_OF_A_KIND = 4,
    TWO_PAIR = 3,
    ONE_PAIR = 2,
    HIGH_CARD = 1
}

export class PokerHand {
    private _handType: HandType;
    private _cardObj: any;
    private _cardString: string;
    private _bid: number;


    get handType(): HandType {
        return this._handType;
    }

    set handType(value: HandType) {
        this._handType = value;
    }

    get cardObj(): any {
        return this._cardObj;
    }

    set cardObj(value: any) {
        this._cardObj = value;
    }

    get cardString(): string {
        return this._cardString;
    }

    set cardString(value: string) {
        this._cardString = value;
    }

    get bid(): number {
        return this._bid;
    }

    set bid(value: number) {
        this._bid = value;
    }

    constructor(handType: HandType, cardObj: any, cardString: string, bid: number) {
        this._handType = handType;
        this._cardObj = cardObj;
        this._cardString = cardString;
        this._bid = bid;
    }
}

export class CamelPoker {
    get hasJokers(): boolean {
        return this._hasJokers;
    }

    set hasJokers(value: boolean) {
        this._hasJokers = value;
    }
    get totalWinnings(): number {
        return this._totalWinnings;
    }

    set totalWinnings(value: number) {
        this._totalWinnings = value;
    }
    get handList(): PokerHand[] {
        return this._handList;
    }

    set handList(value: PokerHand[]) {
        this._handList = value;
    }
    private _handList = [];

    private _totalWinnings = 0;
    private _hasJokers: boolean;

    constructor(input: string, hasJokers) {
        this.hasJokers = hasJokers;
        this.createPokerHandList(input, hasJokers);

        // sort the array
        this._handList.sort((a, b) => this.sortHands(a, b, hasJokers));
        this.calculateTotalWinnings();
    }

    calculateTotalWinnings() {
        for (let i = 0; i < this.handList.length; i += 1) {
            this.totalWinnings += (i + 1) * this.handList[i].bid;
        }
    }

    createPokerHandList(input, hasJokers) {
        const inputArr = input.split('\n');

        for (let i = 0; i < inputArr.length; i += 1) {
            const handArr = inputArr[i].split(' ');
            const handString = handArr[0];
            const bidValue = parseInt(handArr[1]);
            const handObj = this.organizeHand(handString, hasJokers);
            const handType = CamelPoker.getHandType(handObj);

            this.handList.push(new PokerHand(handType, handObj, handString, bidValue));
        }
    }

    private static getHandType(handObj) {
        const handKeys = Object.keys(handObj);
        const keyLength = handKeys.length;

        if (keyLength === 1) {
            return HandType.FIVE_OF_A_KIND;
        }
        if (keyLength === 2) {
            // four of a kind or a full house
            for (const numberKey of handKeys) {
                const numberValue = parseInt(handObj[numberKey]);
                if (numberValue === 4 || numberValue === 1) {
                    return HandType.FOUR_OF_A_KIND;
                }
                if (numberValue === 3 || numberValue === 2) {
                    return HandType.FULL_HOUSE;
                }
            }
        }
        if (keyLength === 3) {
            // three of a kind or two pair
            for (const numberKey of handKeys) {
                const numberValue = parseInt(handObj[numberKey]);

                if (numberValue === 3) {
                    return HandType.THREE_OF_A_KIND;
                }
            }
            return HandType.TWO_PAIR;
        }
        if (keyLength === 4) {
            return HandType.ONE_PAIR;
        }
        if (keyLength === 5) {
            return HandType.HIGH_CARD;
        }
    }

    private organizeHand(handString, hasJokers) {
        let charCount = {};
        let jokerCount = 0;

        // Iterate through each character in the string
        for (let i = 0; i < handString.length; i++) {
            let currentChar = handString[i];

            if (hasJokers && currentChar === 'J') {
                jokerCount += 1;
                continue;
            }

            // Check if the character is already in the object
            if (charCount[currentChar]) {
                // Increment the count if the character is already present
                charCount[currentChar]++;
            } else {
                // Add the character to the object with a count of 1 if it's not present
                charCount[currentChar] = 1;
            }
        }

        if (hasJokers && jokerCount > 0) {
            // add jokerCount to highest numbered variable; if even add to highest valued variable
            charCount[this.getKeyWithMaxValue(charCount)] += jokerCount;
        }

        return charCount;
    }

    getKeyWithMaxValue(obj) {
        let maxKey = null;
        let maxValue = 1;

        for (const key in obj) {
          const value = obj[key];

          if (value > maxValue) {
            maxValue = value;
            maxKey = key;
          }

          if (value === maxValue) {
              // we want to help the highest value so dont include jokers
              maxKey = CamelPoker.getCardValue(maxKey, false) > CamelPoker.getCardValue(key, false) ? maxKey : key;
          }
        }

        return maxKey;
    }

     sortHands(a: PokerHand, b: PokerHand, hasJokers): number {
        // sort by order of enum
        if (a.handType === b.handType) {
            // add additional sorting; each hand is 5 cards
            for (let i = 0; i < 5; i += 1) {
                const aChar = a.cardString[i];
                const bChar = b.cardString[i];

                // loop through comparing card values
                const aValue = CamelPoker.getCardValue(aChar, hasJokers);
                const bValue = CamelPoker.getCardValue(bChar, hasJokers);

                if (aValue > bValue) {
                    return 1;
                } else if (bValue > aValue) {
                    return -1;
                }
            }
        } else if (a.handType > b.handType) {
            return 1;
        } else {
            return -1;
        }
        // in case of a final tie
        return 0;
    }

    static getCardValue(card, hasJokers) {
        let customOrder = "23456789TJQKA";

        if (hasJokers) {
            customOrder = "J23456789TQKA";
        }
        return customOrder.indexOf(card);
    }
}