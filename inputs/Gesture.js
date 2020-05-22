import { Time } from '../time/Time';
import { Display } from '../webgl/Display';

export class Gesture {
    constructor() {
        if(Gesture.instance != null) return;
        Gesture.instance = this;

        if(Display.ctx) this.setDOMElementReference(Display.ctx.canvas);
        else this.setDOMElementReference({
            getBoundingClientRect: () => {
                return {left: 0, top: 0};
            } 
        });

        //document.getElementsByTagName('body')[0].requestFullscreen().then(console.log).catch(console.log)

        this.clear();

        window.addEventListener('touchstart', event => {
            const rect = Gesture.domRef.getBoundingClientRect();
            const t1 = event.touches[0];

            Gesture.instance.x = t1.clientX - (rect.left + window.scrollX);
            Gesture.instance.y = t1.clientY - (rect.top + window.scrollY);

            Gesture.instance.lastX = Gesture.instance.x;
            Gesture.instance.lastY = Gesture.instance.y;

            Gesture.isTouch = true;
        });

        window.addEventListener('touchmove', event => {
            const rect = Gesture.domRef.getBoundingClientRect();
            const t1 = event.touches[0];
            //console.log(t1)

            Gesture.instance.x = t1.clientX - (rect.left + window.scrollX);
            Gesture.instance.y = t1.clientY - (rect.top + window.scrollY);



            Gesture.instance.movX = Gesture.instance.x - Gesture.instance.lastX;
            Gesture.instance.movY = Gesture.instance.y - Gesture.instance.lastY;



            Gesture.instance.lastX = Gesture.instance.x;
            Gesture.instance.lastY = Gesture.instance.y;

            Gesture.isTouch = true;
        });

        window.addEventListener('touchend', event => {
            Gesture.instance.movX = 0;
            Gesture.instance.movY = 0;
            Gesture.isTouch = false;
        });
    }

    clear() {
        Gesture.instance.lastX = 0;
        Gesture.instance.lastY = 0;

        Gesture.instance.x = 0;
        Gesture.instance.y = 0;

        Gesture.instance.movX = 0;
        Gesture.instance.movY = 0;

        Gesture.isTouch = false;
    }

    isTouch() {
        return Gesture.isTouch;
    }

    touchX() {
        return Gesture.instance.x;
    }

    touchY() {
        return Gesture.instance.y;
    }

    swipX() {
        return Gesture.instance.movX;
    }

    swipY() {
        return Gesture.instance.movY;
    }

    scaleVel() {
        
    }

    setDOMElementReference(elem) {
        Gesture.domRef = elem;
    }
}

Gesture.instance = null;
