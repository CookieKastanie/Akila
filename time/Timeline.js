import { Time } from './Time';

class KeyLinearState {
    static calculate(buffer, indexDelimiter, key1, key2, delta) {
        const data1 = key1.getData();
        const data2 = key2.getData();

        for(let i = 0; i < indexDelimiter; ++i) buffer[i] = TimelineUtils.bezier1(data1[i], data2[i], delta);
        for(let i = indexDelimiter; i < data1.length; ++i) buffer[i] = data1[i];
    }
}


class KeyQuadraticBezierState {
    static calculate(buffer, indexDelimiter, key1, key2, delta) {
        const data1 = key1.getData();
        const data2 = key2.getData();

        const dataControl1 = key1.getController1();
              
        for(let i = 0; i < indexDelimiter; ++i) buffer[i] = TimelineUtils.bezier2(data1[i], dataControl1[i], data2[i], delta);
        for(let i = indexDelimiter; i < data1.length; ++i) buffer[i] = data1[i];
    }
}

class KeyCubicBezierState {
    static calculate(buffer, indexDelimiter, key1, key2, delta) {
        const data1 = key1.getData();
        const data2 = key2.getData();

        const dataControl1 = key1.getController1();
        const dataControl2 = key1.getController2();

        for(let i = 0; i < indexDelimiter; ++i) buffer[i] = TimelineUtils.bezier3(data1[i], dataControl1[i], dataControl2[i], data2[i], delta);
        for(let i = indexDelimiter; i < data1.length; ++i) buffer[i] = data1[i];
    }
}

export class Key {
    constructor(data, time) {
        this.setData(data);
        this.time = time;
        this.state = KeyLinearState;
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
        if(this.state == KeyLinearState) this.state = KeyQuadraticBezierState;
        return this;
    }

    getController1() {
        return this.controller1;
    }

    setController2(data) {
        this.controller2 = data;
        if(this.state != KeyCubicBezierState) this.state = KeyCubicBezierState;
        return this;
    }

    getController2() {
        return this.controller2;
    }

    getData() {
        return this.data;
    }
}


class TimelineUtils {
    static bezier1(p0, p1, t) {
        return p0 * (1 - t) + p1 * t;
    }

    static bezier2(p0, p1, p2, t) {
        const mt = 1 - t;
        return p0 * (mt * mt) + 2 * p1 * t * mt + p2 * (t * t);
    }

    static bezier3(p0, p1, p2, p3, t) {
        const t1 = 1 - t;
        return p0 * (t1 * t1 * t1) + 3 * p1 * t * (t1 * t1) + 3 * p2 *(t * t) * t1 + p3 * (t * t * t);
    }
}

class TimelineNoLoopState {
    static calculateIndex(tl) {
        const indexMax = tl.keys.length - 2;
        while (tl.keys[tl.currentIndex + 1].getTime() < tl.currentTime) {
            if(tl.currentIndex < indexMax) {
                ++tl.currentIndex;
            } else {
                tl.currentTime = tl.keys[tl.currentIndex + 1].getTime();
                tl.currentIndex = indexMax;
                break;
            }
        }
    }
}

class TimelineLoopState {
    static calculateIndex(tl) {
        while(tl.keys[tl.currentIndex + 1].getTime() < tl.currentTime) {
            if(tl.currentIndex < (tl.keys.length - 2)) {
                ++tl.currentIndex;
            } else {
                tl.currentTime -= tl.keys[tl.currentIndex + 1].getTime();
                tl.currentIndex = 0;
            }
        }
    }
}

export class Timeline {
    constructor(interpolateIndexDelimiter = -1) {
        this.keys = new Array();
        this.buffer = new Array();
        this.indexDelimiter = interpolateIndexDelimiter;
        this.setLoop(false);
        this.reset();
    }

    addKey(key) {
        if(this.keys.length == 0) {
            const data = key.getData();

            if(data instanceof Float32Array) this.buffer = new Float32Array(data.length);
            else if(data instanceof Float64Array) this.buffer = new Float64Array(data.length);
            else if(data instanceof Int8Array) this.buffer = new Int8Array(data.length);
            else if(data instanceof Int16Array) this.buffer = new Int16Array(data.length);
            else if(data instanceof Int32Array) this.buffer = new Int32Array(data.length);
            else this.buffer = new Array(data.length);

            if(this.indexDelimiter == -1) this.indexDelimiter = data.length;
            for(let i = 0; i < data.length; ++i) this.buffer[i] = data[i];
        }
        
        this.keys.push(key);
        return this;
    }

    setLoop(loop) {
        if(loop) this.state = TimelineLoopState;
        else this.state = TimelineNoLoopState;
        return this;
    }

    next() {
        this.state.calculateIndex(this);

        const key1 = this.keys[this.currentIndex];
        const key2 = this.keys[this.currentIndex + 1];
        const delta = (this.currentTime - key1.getTime()) / (key2.getTime() - key1.getTime());

        key1.state.calculate(this.buffer, this.indexDelimiter, key1, key2, delta);

        this.currentTime += Time.delta;
    }

    getData() {
        return this.buffer;
    }

    reset() {
        this.currentTime = 0;
        this.currentIndex = 0;
    }
}
