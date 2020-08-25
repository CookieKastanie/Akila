import { Display } from '../webgl/Display';
import { mat4 } from '../math';
import { Keyboard } from '../inputs/Keyboard';
import { Mouse } from '../inputs/Mouse';
import { Gamepad } from '../inputs/Gamepad';
import { Gesture } from '../inputs/Gesture';

export class Camera {
    constructor(width, height, option = {fovy: 1.0472, aspect: width / height, near: 0.1, far: 100.0}) {
        if(typeof width === 'object') option = width;

        option.fovy = typeof option.fovy === 'number' ? option.fovy : 1.0472;
        option.aspect = typeof option.aspect === 'number' ? option.aspect : width / height;
        option.near = typeof option.near === 'number' ? option.near : 1.0472;
        option.far = typeof option.far === 'number' ? option.far : 1.0472;

        this.position = new Float32Array([0, 0, 0]);
        this.up = new Float32Array([0, 1, 0]);
        this.forward = new Float32Array([0, 0, 1]);

        this.camera = mat4.create();
        this.projection = mat4.perspective(mat4.create(), option.fovy, option.aspect, option.near, option.far);
    
        this.buffer = mat4.create();
    }

    getPosition() {
        return this.position;
    }

    getUp() {
        return this.up;
    }

    getForward() {
        return this.forward;
    }

    update() {
        mat4.lookAt(this.camera, this.position, this.forward, this.up);
    }

    getProjectionMatrix() {
        return this.projection;
    }

    getCameraMatrix() {
        return this.camera;
    }

    getVPMatrix() {
        return mat4.multiply(this.buffer, this.projection, this.camera);
    }
}

Camera.DEMIPI = Math.PI / 2.0;


export class FirstPersonCamera extends Camera {
    constructor(width, height, option) {
        super(width, height, option);

        this.mouse = new Mouse();
        this.keyboard = new Keyboard();
        this.gamepad = new Gamepad();

        this.angle = new Float32Array([0, Camera.DEMIPI, 0]);

        this.speed = 0.4
        this.mouseSensibility = 0.004;
        this.gamepadSensibility = 0.06;

        //const canvas = document.getElementById('webgl-canvas');
        const canvas = Display.ctx.canvas;
        canvas.addEventListener('click', () => {
            if(!document.pointerLockElement) canvas.requestPointerLock();
        });
    }

    setPosition(position) {
        this.position[0] = position[0];
        this.position[1] = position[1];
        this.position[2] = position[2];

        return this;
    }

    setAngle(angle) {
        this.angle[0] = angle[0];
        this.angle[1] = angle[1];
        this.angle[2] = angle[2];

        return this;
    }

    setMouseSensibility(val) {
        this.mouseSensibility = val;
        return this;
    }

    setGamepadSensibility(val) {
        this.gamepadSensibility = val;
        return this;
    }

    getAngle() {
        return this.angle;
    }

    update() {
        if (!!document.pointerLockElement){
            this.movX = -this.mouse.velX() * this.mouseSensibility;
            this.movY = this.mouse.velY() * this.mouseSensibility;
        } else {
            /*this.movX = 0;
            this.movY = 0;*/
            this.movX = -this.gamepad.getStickBX() * this.gamepadSensibility;
            this.movY = this.gamepad.getStickBY() * this.gamepadSensibility;
        }
        

        let angle = Math.atan2(this.movX, this.movY);
        let dist = Math.sqrt(Math.pow(this.movX, 2) + Math.pow(this.movY, 2));
    
        this.angle[0] -= Math.cos(angle) * dist;
        this.angle[1] -= Math.sin(angle) * dist;

        if (this.angle[0] > Camera.DEMIPI) this.angle[0] = Camera.DEMIPI;
        else if (this.angle[0] < -Camera.DEMIPI) this.angle[0] = -Camera.DEMIPI;


        const cax = Math.cos(this.angle[0]);
        const cay = Math.cos(this.angle[1]);
        const say = Math.sin(this.angle[1]);

        this.forward[0] = cay * cax;
        this.forward[1] = Math.sin(this.angle[0]);
        this.forward[2] = say * cax;


        const angle2 = this.angle[0] + Camera.DEMIPI;
        const cangle2 = Math.cos(angle2);
        this.up[0] = cay * cangle2;
        this.up[1] = Math.sin(angle2);
        this.up[2] = say * cangle2;



        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        if(this.keyboard.isPressed(Keyboard.KEY_Z)) {
            this.position[0] += this.forward[0] * this.speed;
            this.position[1] += this.forward[1] * this.speed;
            this.position[2] += this.forward[2] * this.speed;
        } else {
            let upDir = 0;

            if(this.gamepad.getStickAY() > 0) upDir = 1;
            else if(this.gamepad.getStickAY() < 0) upDir = -1;

            this.position[0] -= this.forward[0] * this.speed * this.gamepad.getStickAY();
            this.position[1] -= this.forward[1] * this.speed * upDir;
            this.position[2] -= this.forward[2] * this.speed * this.gamepad.getStickAY();
        }

        if(this.keyboard.isPressed(Keyboard.KEY_S)) {
            this.position[0] -= this.forward[0] * this.speed;
            this.position[1] -= this.forward[1] * this.speed;
            this.position[2] -= this.forward[2] * this.speed;
        }

        if(this.keyboard.isPressed(Keyboard.KEY_Q)) {
            this.position[2] -= this.forward[0] * this.speed;
            //this.position[1] += this.forward[1] * this.speed;
            this.position[0] += this.forward[2] * this.speed;
        } else {
            this.position[2] += this.forward[0] * this.speed * this.gamepad.getStickAX();
            //this.position[1] += this.forward[1] * this.speed;
            this.position[0] -= this.forward[2] * this.speed * this.gamepad.getStickAX();
        }


        if(this.keyboard.isPressed(Keyboard.KEY_D)) {
            this.position[2] += this.forward[0] * this.speed;
            //this.position[1] += this.forward[1] * this.speed;
            this.position[0] -= this.forward[2] * this.speed;
        }



        if(this.keyboard.isPressed(Keyboard.SPACE)) this.position[1] += this.speed;
        else this.position[1] += this.speed * this.gamepad.getButton(Gamepad.RIGHT_TRIGGER);
        if(this.keyboard.isPressed(Keyboard.CTRL)) this.position[1] -= this.speed;
        else this.position[1] -= this.speed * this.gamepad.getButton(Gamepad.LEFT_TRIGGER);
        

        ////////////////////////////////////////////////////////////////////////////////////////////////////

        
        const fBuffer = new Float32Array(3);

        fBuffer[0] = this.forward[0] + this.position[0];
        fBuffer[1] = this.forward[1] + this.position[1];
        fBuffer[2] = this.forward[2] + this.position[2];

        mat4.lookAt(this.camera, this.position, fBuffer, this.up);
    }
}





export class TrackBallCamera extends Camera {
    constructor(width, height, option) {
        super(width, height, option);



        this.gesture = new Gesture();

        this.gamepad = new Gamepad();


        this.mouse = new Mouse();

        this.angle = new Float32Array([0, Camera.DEMIPI, 0]);
        this.center = new Float32Array([0, 0, 0]);

        this.mouseSensibility = 0.004;
        this.scrollSpeed = 1.2;
        this.distance = 1;
    }

    setMouseSensibility(val) {
        this.mouseSensibility = val;
        return this;
    }

    setAngle(angle) {
        this.angle[0] = angle[0];
        this.angle[1] = angle[1];
        this.angle[2] = angle[2];

        return this;
    }

    getAngle() {
        return this.angle;
    }

    setCenter(center) {
        this.center[0] = center[0];
        this.center[1] = center[1];
        this.center[2] = center[2];

        return this;
    }

    getCenter() {
        return this.center;
    }

    setDistance(distance) {
        this.distance = distance;

        return this;
    }

    getDistance() {
        return this.distance;
    }

    update() {
        let movX = 0;
        let movY = 0;

        if(this.mouse.isPressed(Mouse.LEFT_BUTTON)) {
            movX = -this.mouse.velX() * this.mouseSensibility;
            movY = -this.mouse.velY() * this.mouseSensibility;
        } else if(this.gamepad.isConnect(Gamepad.PLAYER1)){
            movX = this.gamepad.getStickBX() * 0.08;
            movY = this.gamepad.getStickBY() * 0.08;
        } else {
            movX = -this.gesture.swipX() * this.mouseSensibility;
            movY = -this.gesture.swipY() * this.mouseSensibility;
        }

        this.distance += this.mouse.scrollVelY() * this.scrollSpeed;
        this.distance += (this.gamepad.getButton(Gamepad.LEFT_TRIGGER) - this.gamepad.getButton(Gamepad.RIGHT_TRIGGER)) * this.scrollSpeed;
        this.distance = Math.max(this.distance, 0.0001);
        
        let angle = Math.atan2(movX, movY);
        let dist = Math.sqrt(Math.pow(movX, 2) + Math.pow(movY, 2));
    
        this.angle[0] -= Math.cos(angle) * dist;
        this.angle[1] -= Math.sin(angle) * dist;


        const cax = Math.cos(this.angle[0]);
        const cay = Math.cos(this.angle[1]);
        const say = Math.sin(this.angle[1]);

        this.position[0] = (cay * cax              ) * this.distance + this.center[0];
        this.position[1] = (Math.sin(this.angle[0])) * this.distance + this.center[1];
        this.position[2] = (say * cax              ) * this.distance + this.center[2];


        const angle2 = this.angle[0] + Camera.DEMIPI;
        const cangle2 = Math.cos(angle2);
        this.up[0] = cay * cangle2;
        this.up[1] = Math.sin(angle2);
        this.up[2] = say * cangle2;

 
        mat4.lookAt(this.camera, this.position, this.center, this.up);
    }
}
