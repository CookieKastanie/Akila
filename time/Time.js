export class Time {
    constructor() {
        if(Time.instance) return;
        Time.instance = this;

        this.onInit(() => {});
        this.onTick(() => {});
        this.onDraw(() => {});

        Time.mouse = () => {};
        Time.gamepad = () => {};

        Time.run = false;
        Time.tickStart = 0;
        Time.drawStart = 0;
    }

    onInit(callBack) {
        Time.init = callBack;
    }

    onTick(callack) {
        Time.tickCallback = () => {
            callack();
            Time.tick = Time.now - Time.tickStart;
        }
    }

    onDraw(callack) {
        Time.drawCallback = () => {
            callack();
            Time.draw = Time.now - Time.drawStart;
        }
    }

    async start() {
        if(Time.run) return;

        await Time.init();

        Time.run = true;

        const cb = (iNow) => {
            Time.now = iNow / 1e3;
            Time.delta = Time.now - Time.lastTime;
            if(Time.delta > 1) Time.delta = 0;
            Time.fps = Math.floor(1 / Time.delta * 100) / 100;
            Time.lastTime = Time.now;

            Time.gamepad();

            Time.tickFunc();
            Time.drawFunc();

            Time.mouse();

            requestAnimationFrame(cb);
        }

        requestAnimationFrame((iNow) => {
            Time.lastTime = iNow / 1e3;

            Time.now = Time.lastTime;
            this.play();

            requestAnimationFrame(cb);
        });
    }

    pause() {
        this.pauseTick();
        this.pauseDraw();
    }

    play() {
        this.playTick();
        this.playDraw();
    }

    pauseTick() {
        Time.tickFunc = () => {};
    }

    playTick() {
        Time.tickFunc = Time.tickCallback;
        Time.tickStart = Time.now - Time.tick;
    }

    pauseDraw() {
        Time.drawFunc = () => {};
    }

    playDraw() {
        Time.drawFunc = Time.drawCallback;
        Time.drawStart = Time.now - Time.draw;
    }
}

Time.delta = 0;
Time.lastTime = 0;
Time.fps = 0;
Time.now = 0;
Time.tick = 0;
Time.draw = 0;
