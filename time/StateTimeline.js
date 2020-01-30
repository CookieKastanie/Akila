class StateTimelineNoLoopState {
    static calculateIndex(tl) {
        tl.currentIndex = Math.min(tl.currentIndex + 1, tl.states.length - 1);
    }
}

class StateTimelineLoopState {
    static calculateIndex(tl) {
        ++tl.currentIndex;
        if(tl.currentIndex >= tl.states.length) tl.currentIndex = 0;
    }
}

export class StateTimeline {
    constructor() {
        this.states = new Array();
        this.buffer = new Object();
        this.setLoop(false);
        this.reset();
    }

    addState(obj) {
        if(this.states.length == 0) this.buffer = obj;
        this.states.push(obj);
        return this;
    }

    setLoop(loop) {
        if(loop) this.state = StateTimelineLoopState;
        else this.state = StateTimelineNoLoopState;
        return this;
    }

    next() {
        this.state.calculateIndex(this);
        this.buffer = this.states[this.currentIndex];
    }

    reset() {
        this.currentIndex = 0;
    }

    getData() {
        return this.buffer;
    }
}
