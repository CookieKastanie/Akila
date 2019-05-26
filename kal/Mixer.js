import { MainMixer } from './MainMixer';

export class Mixer {
    constructor() {
        this.mainGain = MainMixer.ctx.createGain();
        this.mainGain.connect(MainMixer.ctx.destination);
        
        this.setVolume(0.2);
    }

    setVolume(val) {
        this.mainGain.gain.value = val;
    }

    createEmmiterFrom(name) {

    }
}

