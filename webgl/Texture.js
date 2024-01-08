import { Display } from './Display';

class TextureBuffer {
    constructor(width, height) {
        this.id = Texture.idMax++;

        this.width = width;
        this.height = height;

        this.texture = Display.ctx.createTexture();
        this.setUnit(0);

        this.setParameters();
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    setUnit(unit){
        this.unit = unit;
        return this;
    }

    getUnit(){
        return this.unit;
    }

    use(){
        //if(Texture.currentIds[this.unit] == this.id) return;
        //Texture.currentIds[this.unit] = this.id;

        Display.ctx.activeTexture(Display.ctx.TEXTURE0 + this.unit);
        Display.ctx.bindTexture(Display.ctx.TEXTURE_2D, this.texture);
    }

    getLocation(){
        return this.texture;
    }

    isPowerOf2(){
        return ((this.width & (this.width - 1)) == 0) && ((this.height & (this.height - 1)) == 0);
    }

    setParameters(params = {magFilter: Texture.LINEAR, minFilter: Texture.LINEAR, wrapS: Texture.REPEAT, wrapT: Texture.REPEAT, flipY: false}, ) {
        params = {
            magFilter: params.magFilter || Texture.LINEAR,
            minFilter: params.minFilter || Texture.LINEAR,
            wrapS: params.wrapS || Texture.REPEAT,
            wrapT: params.wrapT || Texture.REPEAT,
            flipY: params.flipY || false
        };

        this.use();

        Display.ctx.texParameterf(Display.ctx.TEXTURE_2D, Display.ctx.TEXTURE_MAG_FILTER, Display.ctx[params.magFilter]);
        Display.ctx.texParameterf(Display.ctx.TEXTURE_2D, Display.ctx.TEXTURE_MIN_FILTER, Display.ctx[params.minFilter]);

        Display.ctx.texParameteri(Display.ctx.TEXTURE_2D, Display.ctx.TEXTURE_WRAP_S, Display.ctx[params.wrapS]);
        Display.ctx.texParameteri(Display.ctx.TEXTURE_2D, Display.ctx.TEXTURE_WRAP_T, Display.ctx[params.wrapT]);

        Display.ctx.pixelStorei(Display.ctx.UNPACK_FLIP_Y_WEBGL, params.flipY);

        this.params = params;

        return this;
    }

    getParameters() {
        return {...this.params};
    }

    generateMipmap() {}

    delete(){
        Display.ctx.deleteTexture(this.texture);
    }
}

export class Texture extends TextureBuffer {
    constructor(data, width = data.naturalWidth, height = data.naturalHeight) {
        super(width, height);

        if(data != null) {
            this.setTextureData(data);
        } else {
            Display.ctx.texImage2D(Display.ctx.TEXTURE_2D,
                0,
                Display.ctx.RGBA,
                this.width,
                this.height,
                0,
                Display.ctx.RGBA,
                Display.ctx.UNSIGNED_BYTE,
                null
            );
        }
    }

    setTextureData(data, width = data.naturalWidth, height = data.naturalHeight){
        this.use();

        if(data != null) {
            Display.ctx.texImage2D(Display.ctx.TEXTURE_2D,
                0, // niveau du bitmap
                Display.ctx.RGBA, //internalFormat
                Display.ctx.RGBA, //srcFormat
                Display.ctx.UNSIGNED_BYTE, //srcType
                data
            );
        } else {
            Display.ctx.texImage2D(Display.ctx.TEXTURE_2D,
                0,
                Display.ctx.RGBA,
                width,
                height,
                0,
                Display.ctx.RGBA,
                Display.ctx.UNSIGNED_BYTE,
                null
            );
        }

        this.width = width;
        this.height = height;
    }

    generateMipmap() {
        Display.ctx.generateMipmap(Display.ctx.TEXTURE_2D);
    }
}


export class DepthTexture extends TextureBuffer {
    constructor(width, height) {
        super(width, height);
        
        this.setTextureData(width, height);
    }

    setTextureData(width, height){
        this.use();

        this.width = width;
        this.height = height;

        Display.ctx.texImage2D(Display.ctx.TEXTURE_2D,
            0,
            Display.ctx.DEPTH_COMPONENT,
            this.width,
            this.height,
            0,
            Display.ctx.DEPTH_COMPONENT,
            Display.ctx.UNSIGNED_SHORT,
            null
        );
    }
}

export class CubeMapTexture extends TextureBuffer {
    constructor(datas) {
        super(datas[0].width, datas[0].height);

        for(let i = 0; i < datas.length; ++i) {
            Display.ctx.texImage2D(
                Display.ctx.TEXTURE_CUBE_MAP_POSITIVE_X + i,
                0, // niveau du bitmap
                Display.ctx.RGBA, //internalFormat
                Display.ctx.RGBA, //srcFormat
                Display.ctx.UNSIGNED_BYTE, //srcType
                datas[i]
            );
        }
    }

    setParameters(params = {magFilter: Texture.LINEAR, minFilter: Texture.LINEAR, wrapS: Texture.REPEAT, wrapT: Texture.REPEAT}) {
        params = {
            magFilter: params.magFilter || Texture.LINEAR,
            minFilter: params.minFilter || Texture.LINEAR,
            wrapS: params.wrapS || Texture.REPEAT,
            wrapT: params.wrapT || Texture.REPEAT
        };

        Display.ctx.texParameteri(Display.ctx.TEXTURE_CUBE_MAP, Display.ctx.TEXTURE_WRAP_S, Display.ctx.CLAMP_TO_EDGE);
        Display.ctx.texParameteri(Display.ctx.TEXTURE_CUBE_MAP, Display.ctx.TEXTURE_WRAP_T, Display.ctx.CLAMP_TO_EDGE);
        Display.ctx.texParameteri(Display.ctx.TEXTURE_CUBE_MAP, Display.ctx.TEXTURE_MIN_FILTER, Display.ctx[params.minFilter]);
        Display.ctx.texParameteri(Display.ctx.TEXTURE_CUBE_MAP, Display.ctx.TEXTURE_MAG_FILTER, Display.ctx[params.magFilter]);

        this.params = params;

        return this;
    }

    use(){
        //if(Texture.currentIds[this.unit] == this.id) return;
        //Texture.currentIds[this.unit] = this.id;

        Display.ctx.activeTexture(Display.ctx.TEXTURE0 + this.unit);
        Display.ctx.bindTexture(Display.ctx.TEXTURE_CUBE_MAP, this.texture);
    }

    generateMipmap() {
        Display.ctx.generateMipmap(Display.ctx.TEXTURE_CUBE_MAP);
    }
}

export class TextureArray extends TextureBuffer {
    constructor(width, height, layerCount) {
        super(width, height);

        this.layerCount = layerCount;

        Display.ctx.texImage3D(
            Display.ctx.TEXTURE_2D_ARRAY,
            0,
            Display.ctx.RGBA,
            width,
            height,
            layerCount,
            0,
            Display.ctx.RGBA,
            Display.ctx.UNSIGNED_BYTE,
            null
        );
    }

    setTextureData(data, layer){
        this.use();

        Display.ctx.texSubImage3D(
            Display.ctx.TEXTURE_2D_ARRAY,
            0, // niveau du bitmap
            0, 0, layer, // offets
            this.width, this.height, 1, // size
            Display.ctx.RGBA, //srcFormat
            Display.ctx.UNSIGNED_BYTE, //srcType,
            data
        );
    }

    setParameters(params = {magFilter: Texture.LINEAR, minFilter: Texture.LINEAR, wrapS: Texture.REPEAT, wrapT: Texture.REPEAT, flipY: false}, ) {
        params = {
            magFilter: params.magFilter || Texture.LINEAR,
            minFilter: params.minFilter || Texture.LINEAR,
            wrapS: params.wrapS || Texture.REPEAT,
            wrapT: params.wrapT || Texture.REPEAT,
            flipY: params.flipY || false
        };

        this.use();

        Display.ctx.texParameterf(Display.ctx.TEXTURE_2D_ARRAY, Display.ctx.TEXTURE_MAG_FILTER, Display.ctx[params.magFilter]);
        Display.ctx.texParameterf(Display.ctx.TEXTURE_2D_ARRAY, Display.ctx.TEXTURE_MIN_FILTER, Display.ctx[params.minFilter]);

        Display.ctx.texParameteri(Display.ctx.TEXTURE_2D_ARRAY, Display.ctx.TEXTURE_WRAP_S, Display.ctx[params.wrapS]);
        Display.ctx.texParameteri(Display.ctx.TEXTURE_2D_ARRAY, Display.ctx.TEXTURE_WRAP_T, Display.ctx[params.wrapT]);

        Display.ctx.pixelStorei(Display.ctx.UNPACK_FLIP_Y_WEBGL, params.flipY);

        this.params = params;

        return this;
    }

    use(){
        //if(Texture.currentIds[this.unit] == this.id) return;
        //Texture.currentIds[this.unit] = this.id;

        Display.ctx.activeTexture(Display.ctx.TEXTURE0 + this.unit);
        Display.ctx.bindTexture(Display.ctx.TEXTURE_2D_ARRAY, this.texture);
    }

    generateMipmap() {
        Display.ctx.generateMipmap(Display.ctx.TEXTURE_2D_ARRAY);
    }
}

Texture.idMax = 0;
//Texture.currentIds = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

Texture.LINEAR = "LINEAR";
Texture.NEAREST = "NEAREST";
Texture.LINEAR_MIPMAP_LINEAR = "LINEAR_MIPMAP_LINEAR";
Texture.LINEAR_MIPMAP_NEAREST = "LINEAR_MIPMAP_NEAREST";
Texture.NEAREST_MIPMAP_NEAREST = "NEAREST_MIPMAP_NEAREST";
Texture.NEAREST_MIPMAP_LINEAR = "NEAREST_MIPMAP_LINEAR";
Texture.REPEAT = "REPEAT";
Texture.CLAMP_TO_EDGE = "CLAMP_TO_EDGE";
Texture.MIRRORED_REPEAT = "MIRRORED_REPEAT";
