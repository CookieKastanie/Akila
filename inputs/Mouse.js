import { Time } from '../time/Time';
import { Display } from '../webgl/Display';

export class Mouse {
    constructor() {
        if(Mouse.instance != null) return;
        Mouse.instance = this;
        Time.mouse = this.update;

        this.pressStates = new Array();
        this.toggleStates = new Array();

        this.x = 0;
        this.y = 0;

        this.update();

        if(Display.ctx) this.setDOMElementReference(Display.ctx.canvas);
        else this.setDOMElementReference({
            getBoundingClientRect: () => {
                return {left: 0, top: 0};
            } 
        });

        this.clear();

        window.addEventListener('mousedown', event => {
            event.preventDefault();
            this.pressStates[event.button] = true;
            this.toggleStates[event.button] = !this.toggleStates[event.button];
        });

        window.addEventListener('mouseup', event => {
            this.pressStates[event.button] = false;
        });

        window.addEventListener('contextmenu', event => {
            event.preventDefault();
            return false;
        });

        window.addEventListener('mousemove', event => {
            const rect = Mouse.domRef.getBoundingClientRect();
            Mouse.instance.x = event.clientX - (rect.left + window.scrollX);
            Mouse.instance.y = event.clientY - (rect.top + window.scrollY);

            Mouse.instance.movX += event.movementX;
            Mouse.instance.movY += event.movementY;
        });

        window.addEventListener('wheel', event => {
            Mouse.instance.mouseScrollVelX = event.deltaX > 0 ? 1 : -1;
            Mouse.instance.mouseScrollVelY = event.deltaY > 0 ? 1 : -1;

            return false;
        });
    }



    clear() {
        for(let i = 0; i < 4; ++i) {
            Mouse.instance.pressStates[i] = false;
            Mouse.instance.toggleStates[i] = false;
        }
    }

    update() {
        Mouse.instance.mouseScrollVelX = 0;
        Mouse.instance.mouseScrollVelY = 0;

        Mouse.instance.movX = 0;
        Mouse.instance.movY = 0;
    }

    isPressed(button) {
        return Mouse.instance.pressStates[button];
    }

    isToggled(button) {
        return Mouse.instance.toggleStates[button];
    }

    posX() {
        return Mouse.instance.x;
    }

    posY() {
        return Mouse.instance.y;
    }

    velX() {
        return Mouse.instance.movX;
    }

    velY() {
        return Mouse.instance.movY;
    }

    scrollVelX() {      
        return Mouse.instance.mouseScrollVelX;
    }

    scrollVelY() {
        return Mouse.instance.mouseScrollVelY;
    }

    setDOMElementReference(elem) {
        Mouse.domRef = elem;
    }
}

Mouse.instance = null;

Mouse.LEFT_BUTTON = 0;
Mouse.WHEEL_BUTTON = 1;
Mouse.RIGHT_BUTTON = 2;
