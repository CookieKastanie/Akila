import { Time } from './Time';

class ClockNoLoopState {
    static calculate(clock) {
        clock.currentTime += Time.delta * clock.delta;
        if(clock.currentTime >= clock.end) clock.currentTime = clock.end;
    }
}

class ClockLoopState {
    static calculate(clock) {
        clock.currentTime += Time.delta * clock.delta;
        while(clock.currentTime >= clock.end) clock.currentTime -= clock.diff;
    }
}

export class Clock {
    constructor(start = 0, end = 10, delta = 1) {
        this.start = start;
        this.end = end;
        this.delta = delta;
        this.diff = end - start;

        this.setLoop(true);
        this.reset();
    }

    setLoop(loop) {
        if(loop) this.state = ClockLoopState;
        else this.state = ClockNoLoopState;
    }

    next() {
        this.state.calculate(this);
        this.tic = Math.floor(this.currentTime);
    }

    getValue() {
        return this.tic;
    }

    isFirst() {
        return this.currentTime == this.start;
    }

    reset() {
        this.currentTime = this.start;
        this.tic = this.start;
    }
}
