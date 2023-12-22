interface ConnectedSignal {
  connectedKey: string,
  isLow: true
}

interface Signal {
  connectedList: ConnectedSignal[]
  valueList: Signal[],
  signal: string,
  isOn: false,
}

interface SentSignal {
  isLow: boolean,
  key: string,
  signal: string,
  sentFrom: string
}

export class BroadcastingSignals {
  signalMap = {};
  lowPulseCount = 0;
  highPulseCount = 0;
  signalQueue = [];
  finalCount = 0;

  constructor(input: string, buttonPresses) {
    const inputArr = input.split("\n");
    this.buildMap(inputArr);

    for (let i = 0; i < buttonPresses; i+= 1) {
      this.pressButton();
      this.runQueue();
    }
    this.finalCount = this.highPulseCount * this.lowPulseCount;
  }

  runQueue() {
    while (this.signalQueue.length > 0) {
      const sentSignal = this.signalQueue.shift();

      // handle the signal
      if (sentSignal.isLow) {
        this.lowPulseCount += 1;
      } else {
        this.highPulseCount += 1;
      }

      // handle flip flops and conjunctions
      if (sentSignal.signal === '%') {
        this.flipFlopSignal(sentSignal);
      } else if (sentSignal.signal === '&') {
        this.conjunctionSignal(sentSignal);
      } else {
        this.sendGenericSignals(sentSignal);
      }
    }
  }

  pressButton() {
    this.signalQueue.push({
      isLow: true,
      key: 'broadcaster',
      signal: ''
    });
  }

  flipFlopSignal(sentSignal) {
    if (!sentSignal.isLow) {
      // do nothing!
      return;
    }

    // low pulse! Toggle on or off
    const signalFromMap = this.signalMap[sentSignal.key];
    if (!signalFromMap.isOn) {
      // turns on sends a high pulse
      sentSignal.isLow = false;
      signalFromMap.isOn = true;

      this.sendGenericSignals(sentSignal);
    } else {
      // turns off sends low pulse
      signalFromMap.isOn = false;
      sentSignal.isLow = true;
      this.sendGenericSignals(sentSignal);
    }
  }

  conjunctionSignal(sentSignal) {
    // remember the type of the most recent pulse received from each of their connected input modules;
    // they initially default to remembering a low pulse for each input.
    // When a pulse is received, the conjunction module first updates its memory for that input.
    // Then, if it remembers high pulses for all inputs, it sends a low pulse; otherwise, it sends a high pulse.

    const signalFromMap = this.signalMap[sentSignal.key];
    let isAllHighPulses = true;
    signalFromMap.connectedList.forEach(connectedValue => {
      if (connectedValue.connectedKey === sentSignal.sentFrom) {
        connectedValue.isLow = sentSignal.isLow;
      }
      if (connectedValue.isLow) {
        // we have a low not all high pulses
        isAllHighPulses = false;
      }
    });

    if (isAllHighPulses) {
      // if is all high pulses, send a low
      sentSignal.isLow = true;
      this.sendGenericSignals(sentSignal);
    } else {
      sentSignal.isLow = false;
      this.sendGenericSignals(sentSignal);
    }
  }

  // will send signals to children with no other considerations
  sendGenericSignals(sentSignal: SentSignal) {
    const keysToSend = this.signalMap[sentSignal.key].valueList;

    // might need this to be more generic
    keysToSend.forEach(key => {
      const signal = this.signalMap[key];
      this.signalQueue.push({
        isLow: sentSignal.isLow,
        key: key,
        signal: signal.signal,
        sentFrom: sentSignal.key
      });
    });
  }


  buildMap(inputArr) {
    // broadcaster -> sr, cg, dt, zs
    inputArr.forEach(line => {
      const split = line.split('->');
      let key = split[0].trim();
      const valueList = split[1].replaceAll(' ','').split(',');
      const keySignal = key.substring(0, 1) === 'b' ? '' : key.substring(0, 1);
      key = keySignal === "" ?  key : key.substring(1);

      if (this.signalMap.hasOwnProperty(key)) {
        this.signalMap[key].valueList = valueList;
        this.signalMap[key].signal = keySignal;
      } else {
        this.signalMap[key] = {
          valueList: valueList,
          signal: keySignal,
          connectedList : []
        }
      }

      if (key !== "broadcaster") {
        valueList.forEach(linkedValue => {
          if (!this.signalMap[linkedValue]) {
            this.signalMap[linkedValue] = {
              valueList: [],
              signal: '',
              connectedList: []
            }
          }

          // setup connections!
          this.signalMap[linkedValue].connectedList.push({
            connectedKey: key,
            isLow: true
          });
        });
      }
    });
  }
}