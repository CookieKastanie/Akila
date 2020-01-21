import { Matrix4 } from './Matrix4';
import { Keyboard } from '../inputs/Keyboard';
import { Gamepad } from '../inputs/Gamepad';

export class Camera {
  constructor(width, height) {
    this.camMatrix = Matrix4.identity(new Float32Array(16));

    //this.projMatrix = Matrix4.perspective(Matrix4.identity(new Float32Array(16)), 1.0472, width / height, 0.001, 100.0);
    this.projMatrix = Matrix4.perspective(Matrix4.identity(new Float32Array(16)), 1.0472, width / height, 0.001, 1.0);

    //this.projMatrix = Matrix4.ortho(Matrix4.identity(new Float32Array(16)), -5.0, 5.0, -5.0, 5.0, 0.001, 100);

    this.finalMat = Matrix4.identity(new Float32Array(16));

    /*this.eye = [0, 0, 5];
    this.center = [0, 0, 0];
    this.up = [0, 1, 0];*/
  }

  getMatrix(){
    //Matrix4.lookAt(this.camMatrix, this.eye, this.center, this.up);
    return Matrix4.multiply(this.finalMat, this.projMatrix, this.camMatrix);
  }

  getCameraPositionMatrix() {
    return this.camMatrix;
  }

  getProjectionMatrix() {
    return this.projMatrix;
  }
}

Camera.DEMIPI = Math.PI / 2.0;

export class FirstPersonCamera extends Camera {
  constructor(width, height) {
    super(width, height);

    this.sensibilite = 0.004;
    this.acc = 0.04;
    this.maxSpeed = 0.4;


    this.x = 0; this.y = 0; this.z = 0;
    this.aX = 0; this.aY = 0; this.aZ = 0;

    this.dfront = 0; this.dlat = 0; this.dhaut = 0;
    this.front = 0; this.lat = 0; this.haut = 0;

    this.temp = Matrix4.identity(new Float32Array(16));
    this.temp2 = Matrix4.identity(new Float32Array(16));
    this.temp3 = Matrix4.identity(new Float32Array(16));

    this.xAxis = [1, 0, 0];
    this.yAxis = [0, 1, 0];
    this.zAxis = [0, 0, 1];

    this.movX = 0;
    this.movY = 0;

    this.canvas = document.getElementById("webgl-canvas");
    this.canvas.addEventListener("click", () => {
      if (!document.pointerLockElement) this.canvas.requestPointerLock();
    });

    this.canvas.addEventListener("mousemove", e => {
      if (!!document.pointerLockElement){
        this.movX = -e.movementX * this.sensibilite;
        this.movY = -e.movementY * this.sensibilite;
      }
    }, false);

    this.keyboard = new Keyboard();
    this.gamepad = new Gamepad();
    /*document.addEventListener("keydown", e => {
      if (!!document.pointerLockElement){
        if(e.ctrlKey) e.preventDefault();
        switch (e.keyCode) {
          case 90: this.dfront = 1; break;
          case 81: this.dlat = 1; break;
          case 83: this.dfront = -1; break;
          case 68: this.dlat = -1; break;
          case 32: this.dhaut = -1; break;
          case 17: this.dhaut = 1; break;
        }
      }
    });

    document.addEventListener("keyup", e => {
      if (!!document.pointerLockElement){
        switch (e.keyCode) {
          case 90: this.dfront = 0; break;
          case 81: this.dlat = 0; break;
          case 83: this.dfront = 0; break;
          case 68: this.dlat = 0; break;
          case 32: this.dhaut = 0; break;
          case 17: this.dhaut = 0; break;
        }
      }
    });*/
  }

  setSpeed(sp){
    this.maxSpeed = sp;
    return this;
  }

  setAcc(acc){
    this.acc = acc;
    return this;
  }

  getMatrix(){

    if(this.keyboard.isPressed(Keyboard.KEY_Z)) this.dfront = 1;
    if(this.keyboard.isPressed(Keyboard.KEY_S)) this.dfront = -1;
    if(this.keyboard.isPressed(Keyboard.KEY_Q)) this.dlat = 1;
    if(this.keyboard.isPressed(Keyboard.KEY_D)) this.dlat = -1;
    if(this.keyboard.isPressed(Keyboard.SPACE)) this.dhaut = -1;
    if(this.keyboard.isPressed(Keyboard.CTRL)) this.dhaut = 1;

    if(!this.movX) this.movX = -this.gamepad.getStickBX(Gamepad.PLAYER1) * 0.05;
    if(!this.movY) this.movY = -this.gamepad.getStickBY(Gamepad.PLAYER1) * 0.05;
    if(!this.dfront) this.dfront = -this.gamepad.getStickAY(Gamepad.PLAYER1);
    if(!this.dlat) this.dlat = -this.gamepad.getStickAX(Gamepad.PLAYER1);
    if(!this.dhaut) this.dhaut = this.gamepad.getButton(Gamepad.PLAYER1, Gamepad.LEFT_TRIGGER);
    if(!this.dhaut) this.dhaut = -this.gamepad.getButton(Gamepad.PLAYER1, Gamepad.RIGHT_TRIGGER);

    //console.log(this.dfront, this.dlat);


    if(this.dfront != 0) this.front += this.acc * this.dfront;
    else if(this.front > 0) this.front -= this.acc;
    else if(this.front < 0) this.front += this.acc;
    if(this.front < this.acc && this.front > -this.acc) this.front = 0;
    if(this.front > this.maxSpeed) this.front = this.maxSpeed;
    else if(this.front < -this.maxSpeed) this.front = -this.maxSpeed;

    if(this.dlat != 0) this.lat += this.acc * this.dlat;
    else if(this.lat > 0) this.lat -= this.acc;
    else if(this.lat < 0) this.lat += this.acc;
    if(this.lat < this.acc && this.lat > -this.acc) this.lat = 0;
    if(this.lat > this.maxSpeed) this.lat = this.maxSpeed;
    else if(this.lat < -this.maxSpeed) this.lat = -this.maxSpeed;

    if(this.dhaut != 0) this.haut += this.acc * this.dhaut;
    else if(this.haut > 0) this.haut -= this.acc;
    else if(this.haut < 0) this.haut += this.acc;
    if(this.haut < this.acc && this.haut > -this.acc) this.haut = 0;
    if(this.haut > this.maxSpeed) this.haut = this.maxSpeed;
    else if(this.haut < -this.maxSpeed) this.haut = -this.maxSpeed;

    let angle = Math.atan2(this.movX, this.movY);
    let dist = Math.sqrt(Math.pow(this.movX, 2) + Math.pow(this.movY, 2));

    this.aX -= Math.cos(angle) * dist;
    this.aY -= Math.sin(angle) * dist;

    this.x += Math.sin(-this.aY) * this.front + Math.cos(this.aY) * this.lat;
    this.y += this.haut;
    this.z += Math.cos(-this.aY) * this.front + Math.sin(this.aY) * this.lat;

    if (this.aX > Camera.DEMIPI) this.aX = Camera.DEMIPI;
    else if (this.aX < -Camera.DEMIPI) this.aX = -Camera.DEMIPI;

    Matrix4.identity(this.temp);

    Matrix4.multiply(this.temp,
      Matrix4.fromRotation(Matrix4.identity(this.temp2), this.aX, this.xAxis),
      Matrix4.fromRotation(Matrix4.identity(this.temp3), this.aY, this.yAxis)
    );

    Matrix4.identity(this.camMatrix);

    this.camMatrix[12] = this.x;
    this.camMatrix[13] = this.y;
    this.camMatrix[14] = this.z - 1;

    Matrix4.multiply(this.camMatrix, this.temp, this.camMatrix);

    this.camMatrix[14] += 1;

    this.movX = 0;
    this.movY = 0;


    this.dfront = 0;
    this.dlat = 0;
    this.dhaut = 0;

    return super.getMatrix();
  }
}
