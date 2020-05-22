import { Mixer } from './Mixer';
import { permissionPopup } from './permissionPopup';

export class MainMixer {
    constructor(askPermission = true) {
        if(MainMixer.ctx) throw `MainMixer est un singleton.`;

        this.ctx = null;

        if (window.AudioContext || window.webkitAudioContext)
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();

        if (!this.ctx) throw "Impossible de d'initialiser le contexte audio";

        if(askPermission && this.ctx.state != 'running') {
            permissionPopup();
        }

        MainMixer.ctx = this.ctx;  

        MainMixer.mainGain = this.ctx.createGain();
        MainMixer.mainGain.connect(this.ctx.destination);

        MainMixer.input = MainMixer.mainGain;
    
        this.setVolume(1.0);

        if(MainMixer.ctx.listener.forwardX) this.setPosition = MainMixer.prototype.setPosition_COMPATIBILITY_METHODE_1;
        else this.setPosition = MainMixer.prototype.setPosition_COMPATIBILITY_METHODE_2;
    }

    askPermission() {
        if(this.ctx.state != 'running') {
            return permissionPopup();
        } else {
            return Promise.resolve(true);
        }
    }

    resume() {
        return MainMixer.ctx.resume();
    }

    setPosition_COMPATIBILITY_METHODE_1(position, forward, up) {
        MainMixer.ctx.listener.setPosition(position[0], position[1], position[2]);

        MainMixer.ctx.listener.forwardX.value = forward[0];
        MainMixer.ctx.listener.forwardY.value = forward[1];
        MainMixer.ctx.listener.forwardZ.value = forward[2];

        MainMixer.ctx.listener.upX.value = up[0];
        MainMixer.ctx.listener.upY.value = up[1];
        MainMixer.ctx.listener.upZ.value = up[2];
    }

    setPosition_COMPATIBILITY_METHODE_2(position, forward, up) {
        MainMixer.ctx.listener.setPosition(position[0], position[1], position[2]);
        MainMixer.ctx.listener.setOrientation(forward[0], forward[1], forward[2], up[0], up[1], up[2]);
    }


    setPosition(position, forward, up) {
        /*console.log(MainMixer.ctx.listener)

        MainMixer.ctx.listener.positionX.value = position[0];
        MainMixer.ctx.listener.positionY.value = position[1];
        MainMixer.ctx.listener.positionZ.value = position[2];

        MainMixer.ctx.listener.forwardX.value = forward[0];
        MainMixer.ctx.listener.forwardY.value = forward[1];
        MainMixer.ctx.listener.forwardZ.value = forward[2];

        MainMixer.ctx.listener.upX.value = up[0];
        MainMixer.ctx.listener.upY.value = up[1];
        MainMixer.ctx.listener.upZ.value = up[2];*/
    }

    setVolume(val) {
        MainMixer.mainGain.gain.value = val;
    }

    getVolume() {
        MainMixer.mainGain.gain.value;
    }

    /*static setSample(name, sample) {
        if(MainMixer.getSample(name)) return;


        MainMixer.samples.set(name, sample);
    }

    static getSample(name) {
        MainMixer.samples.get(name);
    }*/
}

//MainMixer.samples = new Map();
