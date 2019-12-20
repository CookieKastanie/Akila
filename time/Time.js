export class Time {
    constructor() {
        Time.init = () => {};
        Time.tick = () => {};
        Time.draw = () => {};

        Time.run = false;
    }

    onInit(callBack) {
        Time.init = callBack;
    }

    onTick(callack) {
        Time.tick = callack;
    }

    onDraw(callack) {
        Time.draw = callack;
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

            Time.tick();
            Time.draw();

            requestAnimationFrame(cb);
        }

        requestAnimationFrame((iNow) => {
            Time.lastTime = iNow / 1e3;

            requestAnimationFrame(cb);
        });
    }
}

Time.delta = 0;
Time.lastTime = 0;
Time.fps = 0;
Time.now = 0;
