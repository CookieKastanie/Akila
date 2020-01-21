import { Time } from './Time';

export class Key {
    constructor(data, time) {
        this.setData(data);
        this.time = time;
    }

    getTime() {
        return this.time;
    }

    setData(data) {
        this.data = data;
        return this;
    }

    setController1(data) {
        this.controller1 = data;
        return this;
    }

    getController1() {
        return this.controller1;
    }

    setController2(data) {
        this.controller2 = data;
        return this;
    }

    getController2() {
        return this.controller2;
    }

    getData() {
        return this.data;
    }
}

export class Timeline {
    constructor() {
        this.keys = new Array();
        this.props = null;
        this.buffer = new Object();
        this.setLoop(false);
        this.reset();
    }

    addKey(key) {
        if(this.keys.length == 0) this.setProps(key.getData());
        if(this.props) this.keys.push(key);

        return this;
    }

    setProps(data) {
        const props = Object.getOwnPropertyNames(data);
        for(const prop of props) {
            if(typeof data[prop] != 'number') {
                console.error(`La propriété "${prop}" n'est pas un nombre`);
                return;
            }
        }

        this.props = props;
    }

    setLoop(loop) {
        this.loop = loop;
        return this;
    }

    update() {
        const notLast = this.currentIndex < (this.keys.length - 2);
        const needNext = this.keys[this.currentIndex + 1].getTime() < this.currentTime;

        if(notLast) {
            if(needNext) ++this.currentIndex;
        } else {
            const lastTime = this.keys[this.currentIndex + 1].getTime();

            if(lastTime < this.currentTime) {

                if(this.loop) {
                    this.currentIndex = 0;
                    this.currentTime -= lastTime;
                } else {
                    this.currentTime = lastTime;
                }
            }
        }

        const key1 = this.keys[this.currentIndex];
        const key2 = this.keys[this.currentIndex + 1];
        const data1 = key1.getData();
        const dataControl1 = key1.getController1();
        const dataControl2 = key1.getController2();
        const data2 = key2.getData();

        const delta = (this.currentTime - key1.getTime()) / (key2.getTime() - key1.getTime());

        if(dataControl1) {
            if(dataControl2) {
                for(const prop of this.props) {
                    this.buffer[prop] = this.bezier3(data1[prop], dataControl1[prop], dataControl2[prop], data2[prop], delta);
                }
            } else {
                for(const prop of this.props) {
                    this.buffer[prop] = this.bezier2(data1[prop], dataControl1[prop], data2[prop], delta);
                }
            }

        } else {
            for(const prop of this.props) {
                this.buffer[prop] = this.bezier1(data1[prop], data2[prop], delta);
            }
        }

        this.currentTime += Time.delta;
    }

    bezier1(p0, p1, t) {
        return p0 * (1 - t) + p1 * t;
    }

    bezier2(p0, p1, p2, t) {
        const mt = 1 - t;
        return p0 * (mt * mt) + 2 * p1 * t * mt + p2 * (t * t);
    }

    bezier3(p0, p1, p2, p3, t) {
        const t1 = 1 - t;
        return p0 * (t1 * t1 * t1) + 3 * p1 * t * (t1 * t1) + 3 * p2 *(t * t) * t1 + p3 * (t * t * t);
      }

    getData() {
        return this.buffer;
    }

    reset() {
        this.currentTime = 0;
        this.currentIndex = 0;
    }
}
