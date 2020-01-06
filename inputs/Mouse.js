import { Time } from '../time/Time';

export class Mouse {
    constructor() {
        if(Mouse.instance != null) return;
        Mouse.instance = this;
        Time.mouse = this.update;

        this.pressStates = new Array();
        this.toggleStates = new Array();

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
            //console.log(event)
        });

        window.addEventListener('mousewheel', event => {
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
    }

    isPressed(button) {
        return Mouse.instance.pressStates[button];
    }

    isToggled(button) {
        return Mouse.instance.toggleStates[button];
    }

    getMouseVelX() {

    }

    getMouseVelX() {
        
    }

    getScrollVelX() {      
        return Mouse.instance.mouseScrollVelX;
    }

    getScrollVelY() {
        return Mouse.instance.mouseScrollVelY;
    }
}

Mouse.instance = null;

Mouse.LEFT_BUTTON = 0;
Mouse.WHEEL_BUTTON = 1;
Mouse.RIGHT_BUTTON = 2;
