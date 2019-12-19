export class Keyboard {
    constructor() {
        if(Keyboard.instance != null) return;
        Keyboard.instance = this;

        this.pressStates = new Array();
        this.toggleStates = new Array();

        this.clear();

        window.addEventListener('keydown', event => {
            this.pressStates[event.keyCode] = true;
            this.toggleStates[event.keyCode] = !this.toggleStates[event.keyCode];
        });

        window.addEventListener('keyup', event => {
            this.pressStates[event.keyCode] = false;
        });
    }

    clear() {
        for(let i = 0; i < 256; ++i) {
            Keyboard.instance.pressStates[i] = false;
            Keyboard.instance.toggleStates[i] = false;
        }
    }

    isPressed(key) {
        return Keyboard.instance.pressStates[key];
    }

    isToggled(key) {
        return Keyboard.instance.toggleStates[key];
    }
}

Keyboard.instance = null;

Keyboard.BACKSPACE = 8;
Keyboard.TAB = 9;
Keyboard.ENTER = 13;
Keyboard.SHIFT = 16;
Keyboard.CTRL = 17;
Keyboard.ALT = 18;
Keyboard.PAUSE = 19;
Keyboard.CAPS_LOCK = 20;
Keyboard.ESCAPE = 27;
Keyboard.SPACE = 32;
Keyboard.PAGE_UP = 33;
Keyboard.PAGE_DOWN = 34;
Keyboard.END = 35;
Keyboard.HOME = 36;
Keyboard.LEFT_ARROW = 37;
Keyboard.UP_ARROW = 38;
Keyboard.RIGHT_ARROW = 39;
Keyboard.DOWN_ARROW = 40;
Keyboard.INSERT = 45;
Keyboard.DELETE = 46;
Keyboard.KEY_0 = 48;
Keyboard.KEY_1 = 49;
Keyboard.KEY_2 = 50;
Keyboard.KEY_3 = 51;
Keyboard.KEY_4 = 52;
Keyboard.KEY_5 = 53;
Keyboard.KEY_6 = 54;
Keyboard.KEY_7 = 55;
Keyboard.KEY_8 = 56;
Keyboard.KEY_9 = 57;
Keyboard.KEY_A = 65;
Keyboard.KEY_B = 66;
Keyboard.KEY_C = 67;
Keyboard.KEY_D = 68;
Keyboard.KEY_E = 69;
Keyboard.KEY_F = 70;
Keyboard.KEY_G = 71;
Keyboard.KEY_H = 72;
Keyboard.KEY_I = 73;
Keyboard.KEY_J = 74;
Keyboard.KEY_K = 75;
Keyboard.KEY_L = 76;
Keyboard.KEY_M = 77;
Keyboard.KEY_N = 78;
Keyboard.KEY_O = 79;
Keyboard.KEY_P = 80;
Keyboard.KEY_Q = 81;
Keyboard.KEY_R = 82;
Keyboard.KEY_S = 83;
Keyboard.KEY_T = 84;
Keyboard.KEY_U = 85;
Keyboard.KEY_V = 86;
Keyboard.KEY_W = 87;
Keyboard.KEY_X = 88;
Keyboard.KEY_Y = 89;
Keyboard.KEY_Z = 90;
Keyboard.LEFT_META = 91;
Keyboard.RIGHT_META = 92;
Keyboard.SELECT = 93;
Keyboard.NUMPAD_0 = 96;
Keyboard.NUMPAD_1 = 97;
Keyboard.NUMPAD_2 = 98;
Keyboard.NUMPAD_3 = 99;
Keyboard.NUMPAD_4 = 100;
Keyboard.NUMPAD_5 = 101;
Keyboard.NUMPAD_6 = 102;
Keyboard.NUMPAD_7 = 103;
Keyboard.NUMPAD_8 = 104;
Keyboard.NUMPAD_9 = 105;
Keyboard.MULTIPLY = 106;
Keyboard.ADD = 107;
Keyboard.SUBTRACT = 109;
Keyboard.DECIMAL = 110;
Keyboard.DIVIDE = 111;
Keyboard.F1 = 112;
Keyboard.F2 = 113;
Keyboard.F3 = 114;
Keyboard.F4 = 115;
Keyboard.F5 = 116;
Keyboard.F6 = 117;
Keyboard.F7 = 118;
Keyboard.F8 = 119;
Keyboard.F9 = 120;
Keyboard.F10 = 121;
Keyboard.F11 = 122;
Keyboard.F12 = 123;
Keyboard.NUM_LOCK = 144;
Keyboard.SCROLL_LOCK = 145;
Keyboard.SEMICOLON = 186;
Keyboard.EQUALS = 187;
Keyboard.COMMA = 188;
Keyboard.DASH = 189;
Keyboard.PERIOD = 190;
Keyboard.FORWARD_SLASH = 191;
Keyboard.GRAVE_ACCENT = 192;
Keyboard.OPEN_BRACKET = 219;
Keyboard.BACK_SLASH = 220;
Keyboard.CLOSE_BRACKET = 221;
Keyboard.SINGLE_QUOTE = 222;
