import { Display } from './Display';

class TextureBuffer {
  constructor(width, height) {
    this.id = Texture.idMax++;

    this.width = width;
    this.height = height;

    this.texture = Display.ctx.createTexture();
    this.setUnit(0);

    this.use();
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
    if(Texture.currentIds[this.unit] == this.id) return;
    Texture.currentIds[this.unit] = this.id;

    Display.ctx.activeTexture(Display.ctx.TEXTURE0 + this.unit);
    Display.ctx.bindTexture(Display.ctx.TEXTURE_2D, this.texture);
  }

  getLocation(){
    return this.texture;
  }

  isPowerOf2(val){
    return (val & (val - 1)) == 0;
  }

  setParameters(params = {magFilter: Texture.LINEAR, minFilter: Texture.LINEAR, wrapS: Texture.REPEAT, wrapT: Texture.REPEAT}) {
    params = {
      magFilter: params.magFilter || Texture.LINEAR,
      minFilter: params.minFilter || Texture.LINEAR,
      wrapS: params.wrapS || Texture.REPEAT,
      wrapT: params.wrapT || Texture.REPEAT
    };

    /*if (this.isPowerOf2(this.width) && this.isPowerOf2(this.height)) {
      Display.ctx.generateMipmap(Display.ctx.TEXTURE_2D);

      Display.ctx.texParameterf(Display.ctx.TEXTURE_2D, Display.ctx.TEXTURE_MAG_FILTER, Display.ctx[params.magFilter]);
      Display.ctx.texParameterf(Display.ctx.TEXTURE_2D, Display.ctx.TEXTURE_MIN_FILTER, Display.ctx[params.minFilter]);

      Display.ctx.texParameteri(Display.ctx.TEXTURE_2D, Display.ctx.TEXTURE_WRAP_S, Display.ctx[params.wrapS]);
      Display.ctx.texParameteri(Display.ctx.TEXTURE_2D, Display.ctx.TEXTURE_WRAP_T, Display.ctx[params.wrapT]);

    } else {*/
      Display.ctx.texParameteri(Display.ctx.TEXTURE_2D, Display.ctx.TEXTURE_WRAP_S, Display.ctx.CLAMP_TO_EDGE);
      Display.ctx.texParameteri(Display.ctx.TEXTURE_2D, Display.ctx.TEXTURE_WRAP_T, Display.ctx.CLAMP_TO_EDGE);
      Display.ctx.texParameteri(Display.ctx.TEXTURE_2D, Display.ctx.TEXTURE_MIN_FILTER, Display.ctx[params.minFilter]);
      Display.ctx.texParameteri(Display.ctx.TEXTURE_2D, Display.ctx.TEXTURE_MAG_FILTER, Display.ctx[params.magFilter]);
    //}

    return this;
  }

  delete(){
    Display.ctx.deleteTexture(this.texture);
  }
}

export class Texture extends TextureBuffer {
  constructor(data, width = data.width, height = data.height) {
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

  setTextureData(data){
    this.use();
    Display.ctx.texImage2D(Display.ctx.TEXTURE_2D,
      0, // niveau du bitmap
      Display.ctx.RGBA, //internalFormat
      Display.ctx.RGBA, //srcFormat
      Display.ctx.UNSIGNED_BYTE, //srcType
      data
    );
  }
}


export class DepthTexture extends TextureBuffer {
  constructor(width, height) {
    super(width, height);
    
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

    return this;
  }

  use(){
    if(Texture.currentIds[this.unit] == this.id) return;
    Texture.currentIds[this.unit] = this.id;

    Display.ctx.activeTexture(Display.ctx.TEXTURE0 + this.unit);
    Display.ctx.bindTexture(Display.ctx.TEXTURE_CUBE_MAP, this.texture);
  }
}

Texture.idMax = 0;
Texture.currentIds = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

Texture.LINEAR = "LINEAR";
Texture.NEAREST = "NEAREST";
Texture.LINEAR_MIPMAP_LINEAR = "LINEAR_MIPMAP_LINEAR";
Texture.LINEAR_MIPMAP_NEAREST = "LINEAR_MIPMAP_NEAREST";
Texture.NEAREST_MIPMAP_NEAREST = "NEAREST_MIPMAP_NEAREST";
Texture.NEAREST_MIPMAP_LINEAR = "NEAREST_MIPMAP_LINEAR";
Texture.REPEAT = "REPEAT";
Texture.CLAMP_TO_EDGE = "CLAMP_TO_EDGE";
Texture.MIRRORED_REPEAT = "MIRRORED_REPEAT";
