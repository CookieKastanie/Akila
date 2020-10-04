import { Display } from './Display';

export class VAO {
    constructor(mode) {
        this.id = VAO.idMax++;

        this.draw = VAO.prototype.drawVAO;

        this.setMode(mode);
        this.vbos = new Array();
        this.vboNames = new Object();
    }

    setMode(mode = VAO.TRIANGLES){
        this.mode = Display.ctx[mode];
        return this;
    }

    addVBO(vbo, nom = this.vbos.length){
        const id = this.vbos.length;
        this.vboNames[nom] = id;
        this.vbos.push(vbo);

        this.refreshDataLength();

        return this;
    }

    getVBO(nom){
        return this.vbos[this.vboNames[nom]];
    }

    use(){
        if(this.id != VAO.currentId) {
            this.useVBOs();
            VAO.currentId = this.id;
        }
    }

    refreshDataLength(){
        for(const vbo of this.vbos) {
            this.dataLength = vbo.getDataLength();
            if(this.dataLength < 0) break;
        }
    }

    useVBOs(){
        for(const vbo of this.vbos) vbo.use();
    }

    drawCheck(){
        this.refreshDataLength();
        if(this.dataLength >= 0) {
            this.draw = VAO.prototype.drawVAO;
            this.draw();
        }
    }

    drawVAO(){
        this.use();
        Display.ctx.drawArrays(this.mode, 0, this.dataLength);
    }

    delete(){
        for(const vbo of this.vbos) vbo.delete();
    }
}

VAO.idMax = 0;
VAO.currentId = -1;

export class IndexedVAO extends VAO {
    constructor(mode, ibo) {
        super(mode);
        this.draw = IndexedVAO.prototype.drawCheck;
        if(ibo) this.setIBO(ibo);
    }

    setIBO(ibo){
        this.ibo = ibo;
        this.refreshDataLength();
        return this;
    }

    getIBO(){
        return this.ibo;
    }

    refreshDataLength(){
        if(this.ibo) this.nbIndex = this.ibo.getDataLength();
    }

    useVBOs(){
        this.ibo.use();
        super.useVBOs();
    }

    draw(){}

    drawCheck(){
        this.refreshDataLength();
        if(this.nbIndex >= 0) {
            this.draw = IndexedVAO.prototype.drawVAO;
            this.draw();
        }
    }

    drawVAO(){
        this.use();
        Display.ctx.drawElements(this.mode, this.nbIndex, Display.ctx.UNSIGNED_SHORT, 0);
    }

    delete(){
        if(this.ibo) this.ibo.delete();
        super.delete();
    }
}

IndexedVAO.TRIANGLES = VAO.TRIANGLES = "TRIANGLES";
IndexedVAO.TRIANGLE_STRIP = VAO.TRIANGLE_STRIP = "TRIANGLE_STRIP";
IndexedVAO.TRIANGLE_FAN = VAO.TRIANGLE_FAN = "TRIANGLE_FAN";

IndexedVAO.POINTS = VAO.POINTS = "POINTS";

IndexedVAO.LINES = VAO.LINES = "LINES";
IndexedVAO.LINE_STRIP = VAO.LINE_STRIP = "LINE_STRIP";
IndexedVAO.LINE_LOOP = VAO.LINE_LOOP = "LINE_LOOP";
