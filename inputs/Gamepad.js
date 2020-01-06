import { Time } from '../time/Time';

export class Gamepad {
    constructor() {
        if(Gamepad.instance != null) return;
        Gamepad.instance = this;
        Time.gamepad = this.update;

        this.states = new Array();
        this.connect = [false, false, false, false];
        this.setDeadZone(0.1);

        for(let i = 0; i < 4; ++i) this.clear(i);

        window.addEventListener("gamepadconnected", event => {
            this.connect[event.gamepad.index] = true;
        });

        window.addEventListener("gamepaddisconnected", event => {
            this.clear(event.gamepad.index);
            this.connect[event.gamepad.index] = false;
        });
    }

    clear(player) {
        const buttons = new Array();

        for(let i = 0; i < 17; ++i) buttons.push({value: 0});

        Gamepad.instance.states[player] = {
            axes: [0, 0, 0, 0],
            buttons: buttons
        };
    }

    update() {
        let i = 0;
        for (let m of navigator.getGamepads()) if(m) {
            const state = Gamepad.instance.states[i++];
            state.buttons = m.buttons;
            //state.axes = m.axes;
            state.axes[0] = m.axes[0] >= Gamepad.deadZone || m.axes[0] <= -Gamepad.deadZone ? m.axes[0] : 0;
            state.axes[1] = m.axes[1] >= Gamepad.deadZone || m.axes[1] <= -Gamepad.deadZone ? m.axes[1] : 0;
            state.axes[2] = m.axes[2] >= Gamepad.deadZone || m.axes[2] <= -Gamepad.deadZone ? m.axes[2] : 0;
            state.axes[3] = m.axes[3] >= Gamepad.deadZone || m.axes[3] <= -Gamepad.deadZone ? m.axes[3] : 0;
        }
    }

    isConnect(player) {
        return Gamepad.instance.connect[player];
    }

    setDeadZone(value) {
        Gamepad.deadZone = value;
    }

    getButton(player, button) {
        return Gamepad.instance.states[player].buttons[button].value;
    }

    getStickAX(player) {
        return Gamepad.instance.states[player].axes[0];
    }

    getStickAY(player) {
        return Gamepad.instance.states[player].axes[1];
    }

    getStickBX(player) {
        return Gamepad.instance.states[player].axes[2];
    }

    getStickBY(player) {
        return Gamepad.instance.states[player].axes[3];
    }
}

Gamepad.instance = null;

Gamepad.PLAYER1 = 0;
Gamepad.PLAYER2 = 2;
Gamepad.PLAYER3 = 2;
Gamepad.PLAYER4 = 3;

Gamepad.A = 0;
Gamepad.B = 1;
Gamepad.X = 2;
Gamepad.Y = 3;

Gamepad.LEFT_BUTTON = 4;
Gamepad.RIGHT_BUTTON = 5;

Gamepad.LEFT_TRIGGER = 6;
Gamepad.RIGHT_TRIGGER = 7;

Gamepad.SELECT = 8;
Gamepad.START = 9;

Gamepad.LEFT_STICK = 10;
Gamepad.RIGHT_STICK = 11;

Gamepad.UP = 12;
Gamepad.DOWN = 13;
Gamepad.LEFT = 14;
Gamepad.RIGHT = 15;

Gamepad.GUIDE = 16;
