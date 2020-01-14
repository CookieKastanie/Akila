import { Mixer } from './Mixer';

export class MainMixer extends Mixer{
    constructor() {
        if(MainMixer.ctx) throw `MainMixer est un singleton.`;

        this.ctx = null;

        if (window.AudioContext || window.webkitAudioContext)
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();

        if (!this.ctx) throw "Impossible de d'initialiser le contexte audio";

        MainMixer.ctx = this.ctx;  

        MainMixer.mainGain = this.ctx.createGain();
        MainMixer.mainGain.connect(this.ctx.destination);
        
        this.setVolume(0.2);
    }

    setVolume(val) {
        MainMixer.mainGain.gain.value = val;
    }

    static setSample(name, sample) {
        if(MainMixer.getSample(name)) return;


        MainMixer.samples.set(name, sample);
    }

    static getSample(name) {
        MainMixer.samples.get(name);
    }
}

MainMixer.samples = new Map();
