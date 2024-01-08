import { Display } from './Display';

export class BufferObject {
    constructor(usage){
        this.pointer = Display.ctx.createBuffer();
        this.dataLength = -1;
        this.setUsage(usage);
    }

    setUsage(usage = BufferObject.STATIC_DRAW){
        this.usage = Display.ctx[usage];
        return this;
    }

    delete(){
        Display.ctx.deleteBuffer(this.pointer);
    }
}

export class VBO extends BufferObject {
    constructor(data, nbOfElement, attribLocation, usage) {
        super(usage);
        this.attribLocation = attribLocation;
        this.nbOfElement = nbOfElement;

        this.setData = VBO.prototype.setNewData;

        if(data) {
            if(data.BYTES_PER_ELEMENT !== undefined) this.setData(data);
            else this.setData(new Float32Array(data));
        }
    }

    setData(data, offset = 0){}

    setNewData(data){
        Display.ctx.bindBuffer(Display.ctx.ARRAY_BUFFER, this.pointer);
        Display.ctx.bufferData(Display.ctx.ARRAY_BUFFER, data, this.usage);
        this.dataLength = data.length;
        this.setData = VBO.prototype.setSubData;
    }

    setSubData(data, offset = 0){
        Display.ctx.bindBuffer(Display.ctx.ARRAY_BUFFER, this.pointer);
        Display.ctx.bufferSubData(Display.ctx.ARRAY_BUFFER, offset * Float32Array.BYTES_PER_ELEMENT, data);
    }

    getDataLength(){
        return this.dataLength / this.nbOfElement;
    }

    use(){
        Display.ctx.bindBuffer(Display.ctx.ARRAY_BUFFER, this.pointer);
        Display.ctx.vertexAttribPointer(this.attribLocation, this.nbOfElement, Display.ctx.FLOAT, Display.ctx.FALSE, 0, 0);
    }
}

export class AVBO extends BufferObject {
    constructor(data, usage) {
        super(usage);

        this.vertexAttribs = new Array();

        this.nbOfElement = 0;
      
        this.setData = AVBO.prototype.setNewData;
        if(data !== null) {
            this.setData(data);
        }
    }

    addVertexAttribute(nbOfElement, attribLocation, offset = 0, step = 0, type = AVBO.FLOAT) {
        this.nbOfElement += nbOfElement;

        this.vertexAttribs.push({
            nbOfElement,
            attribLocation,
            offset,
            step,
            type: Display.ctx[type]
        });
        return this;
    }

    setData(data, offset = 0){}

    setNewData(data){
        Display.ctx.bindBuffer(Display.ctx.ARRAY_BUFFER, this.pointer);
        Display.ctx.bufferData(Display.ctx.ARRAY_BUFFER, data, this.usage);
        this.dataLength = data.length;
        this.setData = AVBO.prototype.setSubData;
    }

    setSubData(data, offset = 0){
        Display.ctx.bindBuffer(Display.ctx.ARRAY_BUFFER, this.pointer);
        Display.ctx.bufferSubData(Display.ctx.ARRAY_BUFFER, offset * Float32Array.BYTES_PER_ELEMENT, data);
    }

    getDataLength(){
        return this.dataLength / this.nbOfElement;
    }

    use(){
        Display.ctx.bindBuffer(Display.ctx.ARRAY_BUFFER, this.pointer);
        for(const va of this.vertexAttribs) {
            if(va.type === Display.ctx.FLOAT) {
                Display.ctx.vertexAttribPointer(va.attribLocation, va.nbOfElement, va.type, Display.ctx.FALSE, va.step, va.offset);
            } else {
                Display.ctx.vertexAttribIPointer(va.attribLocation, va.nbOfElement, va.type, va.step, va.offset);
            }
        }
    }
}

export class IBO extends BufferObject {
    constructor(data, usage) {
        super(usage);

        this.setData = IBO.prototype.setNewData;

        if(data) {
            if(data.BYTES_PER_ELEMENT !== undefined) this.setData(data);
            else this.setData(new Uint16Array(data));
        }
    }

    setData(){}

    setNewData(data){
        Display.ctx.bindBuffer(Display.ctx.ELEMENT_ARRAY_BUFFER, this.pointer);
        Display.ctx.bufferData(Display.ctx.ELEMENT_ARRAY_BUFFER, data, this.usage);
        this.dataLength = data.length;
        this.setData = IBO.prototype.setSubData;
    }

    setSubData(data, offset = 0){
        Display.ctx.bindBuffer(Display.ctx.ELEMENT_ARRAY_BUFFER, this.pointer);
        Display.ctx.bufferSubData(Display.ctx.ELEMENT_ARRAY_BUFFER, offset, data);
    }

    getDataLength(){
        return this.dataLength;
    }

    use(){
        Display.ctx.bindBuffer(Display.ctx.ELEMENT_ARRAY_BUFFER, this.pointer);
    }
}

IBO.STATIC_DRAW = VBO.STATIC_DRAW = BufferObject.STATIC_DRAW = "STATIC_DRAW";
IBO.DYNAMIC_DRAW = VBO.DYNAMIC_DRAW = BufferObject.DYNAMIC_DRAW = "DYNAMIC_DRAW";
IBO.STREAM_DRAW = VBO.STREAM_DRAW = BufferObject.STREAM_DRAW = "STREAM_DRAW";

AVBO.BYTE = BufferObject.BYTE = "BYTE";
AVBO.SHORT = BufferObject.SHORT = "SHORT";
AVBO.INT = BufferObject.INT = "INT";
AVBO.UNSIGNED_BYTE = BufferObject.UNSIGNED_BYTE = "UNSIGNED_BYTE";
AVBO.UNSIGNED_SHORT = BufferObject.UNSIGNED_SHORT = "UNSIGNED_SHORT";
AVBO.UNSIGNED_INT = BufferObject.UNSIGNED_INT = "UNSIGNED_INT";
AVBO.FLOAT = BufferObject.FLOAT = "FLOAT";
