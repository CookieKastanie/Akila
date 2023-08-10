import { Display } from './Display';

export class Shader {
    constructor(vs, fs, fileName = "Shader") {
        this.name = fileName;
        this.program = null;
        this.attributList = new Object();
        this.attributNumber = 0;

        this.vertexShader = this.createShader(Display.ctx.VERTEX_SHADER, vs);
        if(!this.vertexShader) return;
        this.fragmantShader = this.createShader(Display.ctx.FRAGMENT_SHADER, fs);
        if(!this.fragmantShader) return;

        this.createProgramme();

        this.fetchUniforms();

        this.attributNumber = Display.ctx.getProgramParameter(this.program, Display.ctx.ACTIVE_ATTRIBUTES) - 1;
        if(Shader.attributeMax < this.attributNumber) Shader.attributeMax = this.attributNumber;
    }


  ///////////////// Private

    fetchUniforms() {
        this.uniformList = new Object();
        this.uniformInfos = new Object();
        
        let uniform = null;
        let index = 0;
        const nbUnif = Display.ctx.getProgramParameter(this.program, Display.ctx.ACTIVE_UNIFORMS);

        while(index < nbUnif){
            uniform = Display.ctx.getActiveUniform(this.program, index++);
            if(uniform) {
                this.initUniformLocation(uniform);
            }
        }
    }

    delShad(s){
        Display.ctx.detachShader(this.program, s);
        Display.ctx.deleteShader(s);
    }

    createShader(type, text) {
        const shader = Display.ctx.createShader(type);

        Display.ctx.shaderSource(shader, text);
        Display.ctx.compileShader(shader);
        if(!Display.ctx.getShaderParameter(shader, Display.ctx.COMPILE_STATUS)) {
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
        if(!Display.ctx.getProgramParameter(program, Display.ctx.LINK_STATUS)) {
            console.error(this.name + ' -> Impossible de lier le programme', Display.ctx.getProgramInfoLog(program));
            return;
        }
        Display.ctx.validateProgram(program);
        if(!Display.ctx.getProgramParameter(program, Display.ctx.VALIDATE_STATUS)) {
            console.error(this.name + ' -> erreur de validation du programme', Display.ctx.getProgramInfoLog(program));
            return;
        }

        this.program = program;
    }

    initUniformLocation(uniform){
        const pointer = Display.ctx.getUniformLocation(this.program, uniform.name);
        if(pointer) {
            this.uniformList[uniform.name] = pointer;
            this.uniformInfos[uniform.name] = uniform;
        }
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
        for(let i = 0; i <= Shader.attributeMax; ++i) {
            if(i <= this.attributNumber) {Display.ctx.enableVertexAttribArray(i);}
            else {Display.ctx.disableVertexAttribArray(i);}
        }
    }

  //////////////////// Variables attributs

    getAttribLocation(name){
        if(this.attributList[name] === undefined){
            const num = Display.ctx.getAttribLocation(this.program, name);

            if(num < 0) {
                console.error("L'attribut '"+ name +"' n'existe pas, ou il n'est pas utilisé dans "+ this.name);
                return;
            }

            this.attributList[name] = num;
        }

        return this.attributList[name];
    }

  //////////////////// Variables uniformes

    getUniformLocation(name){
        return this.uniformList[name];
    }

    getUniformInfos(name){
        return this.uniformInfos[name];
    }

    getUniformsInfos(){
        return this.uniformInfos;
    }

    sendFloat(name, value){
        Display.ctx.uniform1f(this.getUniformLocation(name), value);
    }

    sendInt(name, value){
        Display.ctx.uniform1i(this.getUniformLocation(name), value);
    }

    sendIntVec(name, value){
        Display.ctx.uniform1iv(this.getUniformLocation(name), value);
    }

    sendVec1(name, value){
        Display.ctx.uniform1fv(this.getUniformLocation(name), value);
    }

    sendVec2(name, value){
        Display.ctx.uniform2fv(this.getUniformLocation(name), value);
    }

    sendVec3(name, value){
        Display.ctx.uniform3fv(this.getUniformLocation(name), value);
    }

    sendVec4(name, value){
        Display.ctx.uniform4fv(this.getUniformLocation(name), value);
    }

    sendIVec2(name, value){
        Display.ctx.uniform2iv(this.getUniformLocation(name), value);
    }

    sendIVec3(name, value){
        Display.ctx.uniform3iv(this.getUniformLocation(name), value);
    }

    sendIVec4(name, value){
        Display.ctx.uniform4iv(this.getUniformLocation(name), value);
    }

    sendMat2(name, value){
        Display.ctx.uniformMatrix2fv(this.getUniformLocation(name), Display.ctx.FALSE, value);
    }

    sendMat3(name, value){
        Display.ctx.uniformMatrix3fv(this.getUniformLocation(name), Display.ctx.FALSE, value);
    }

    sendMat4(name, value){
        Display.ctx.uniformMatrix4fv(this.getUniformLocation(name), Display.ctx.FALSE, value);
    }
}

Shader.attributeMax = -1;
