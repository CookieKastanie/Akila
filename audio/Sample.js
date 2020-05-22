import { MainMixer } from './MainMixer';

export class Sample {
    constructor() {
        this.buffer = null;
        this.panner = MainMixer.ctx.createPanner();
        this.panner.connect(MainMixer.input);
        this.panner.coneInnerAngle = 360;

        this.currentSource = null;
    }

    async loadData(data) {
        return new Promise((resolve, reject) => {
            MainMixer.ctx.decodeAudioData(data, buffer => {
                this.buffer = buffer;
                resolve(this);
            }, e => {
                console.error(e);
                reject(this);
            });
        });
    }

    setPosition(x, y, z) {
        this.panner.setPosition(x, y, z);
    }

    test(a) {
        if(this.currentSource != null) {
            this.currentSource.playbackRate.value = a;
        }
    }

    play(offSet = 0, loop = false) {
        const source = MainMixer.ctx.createBufferSource();
        source.buffer = this.buffer;
        //console.log(source)
        source.loop = loop;
        this.currentSource = source;
        source.connect(this.panner);
        source.start(MainMixer.ctx.currentTime + offSet);
    }
}
