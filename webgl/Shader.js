import { Display } from './Display';

export class Shader {
  constructor(vs, fs, fileName = "Shader") {
    this.name = fileName;
    this.program = null;
    this.attributList = new Object();
    this.attributNumber = 0;

    this.uniformList = new Object();

    this.vertexShader = this.createShader(Display.ctx.VERTEX_SHADER, vs);
    if (!this.vertexShader) return;
    this.fragmantShader = this.createShader(Display.ctx.FRAGMENT_SHADER, fs);
    if (!this.fragmantShader) return;

    this.createProgramme();

    let uniform = null;
    let index = 0;
    const nbUnif = Display.ctx.getProgramParameter(this.program, Display.ctx.ACTIVE_UNIFORMS);

    while (index < nbUnif){
      uniform = Display.ctx.getActiveUniform(this.program, index++);
      if (uniform) {
        this.initUniformLocation(uniform.name);
      }
    }
  }


///////////////// Private


  delShad(s){
    Display.ctx.detacheShader(this.program, s);
    Display.ctx.deleteShader(s);
  }

  createShader(type, text) {
    const shader = Display.ctx.createShader(type);

    Display.ctx.shaderSource(shader, text);
    Display.ctx.compileShader(shader);
  	if (!Display.ctx.getShaderParameter(shader, Display.ctx.COMPILE_STATUS)) {
  		console.error(this.name + ' -> erreur de compilation '+ (type == Display.ctx.VERTEX_SHADER ? 'vertex' : 'fragment') +' shader!', Display.ctx.getShaderInfoLog(shader));
  		return null;
  	}

    return shader;
  }

  createProgramme() {
    let program = Display.ctx.createProgram();
  	Display.ctx.attachShader(program, this.vertexShader);
  	Display.ctx.attachShader(program, this.fragmantShader);
  	Display.ctx.linkProgram(program);
  	if (!Display.ctx.getProgramParameter(program, Display.ctx.LINK_STATUS)) {
  		console.error(this.name + ' -> Impossible de lier le programme', Display.ctx.getProgramInfoLog(program));
  		return;
  	}
  	Display.ctx.validateProgram(program);
  	if (!Display.ctx.getProgramParameter(program, Display.ctx.VALIDATE_STATUS)) {
  		console.error(this.name + ' -> erreur de validation du programme', Display.ctx.getProgramInfoLog(program));
  		return;
  	}

    this.program = program;
  }

  initUniformLocation(nom){
    nom = nom.replace(/\[0\]/,'');
    
    const pointer = Display.ctx.getUniformLocation(this.program, nom);
    if(pointer) this.uniformList[nom] = pointer;
    else console.error("Uniform '"+ nom +"' n'existe pas dans "+ this.name);
  }


///////////////// Public


  delete(){
    if(this.program){
      this.delShad(this.vertexShader);
      this.delShad(this.fragmantShader);

      Display.ctx.deleteProgram(this.program);
      this.program = null;
    }
  }

  use(){
    if(!this.program) return console.error(this.name + ' -> Programme invalide');
    Display.ctx.useProgram(this.program);
    for (let i = 0; i <= Shader.attributeMax; ++i) {
      if(i <= this.attributNumber) {Display.ctx.enableVertexAttribArray(i);}
      else {Display.ctx.disableVertexAttribArray(i);}
    }
  }

//////////////////// Variables attributs

  getAttribLocation(nom){
    if(this.attributList[nom] === undefined){
      const num = Display.ctx.getAttribLocation(this.program, nom);

      if(num < 0) {
        console.error("L'attribut '"+ nom +"' n'existe pas, ou il n'est pas utilisé dans "+ this.name);
        return;
      }

      if(this.attributNumber < num) this.attributNumber = num;
      if(Shader.attributeMax < num) Shader.attributeMax = num;

      this.attributList[nom] = num;
    }

    return this.attributList[nom];
  }

//////////////////// Variables uniformes

  getUniformLocation(nom){
    return this.uniformList[nom];
  }

  sendFloat(nom, value){
    Display.ctx.uniform1f(this.getUniformLocation(nom), value);
  }

  sendInt(nom, value){
    Display.ctx.uniform1i(this.getUniformLocation(nom), value);
  }

  sendIntVec(nom, value){
    Display.ctx.uniform1iv(this.getUniformLocation(nom), value);
  }

  sendVec1(nom, value){
    Display.ctx.uniform1fv(this.getUniformLocation(nom), value);
  }

  sendVec2(nom, value){
    Display.ctx.uniform2fv(this.getUniformLocation(nom), value);
  }

  sendVec3(nom, value){
    Display.ctx.uniform3fv(this.getUniformLocation(nom), value);
  }

  sendVec4(nom, value){
    Display.ctx.uniform4fv(this.getUniformLocation(nom), value);
  }

  sendMat4(nom, value){
    Display.ctx.uniformMatrix4fv(this.getUniformLocation(nom), Display.ctx.FALSE, value);
  }
}

Shader.attributeMax = 0;
