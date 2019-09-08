import { Display } from './Display';

export class Texture {
  constructor(_img, _height = null, _unit = 0) {
    let img, img_data, unit;

    let isBuffer = false;

    if(_height != null && typeof _img == "number"){
      img = {width: _img, height: _height};
      isBuffer = true;
      unit = _unit;
    } else {
      img = _img
      img_data = _img;
      unit = _height == null ? 0 : _height;
    }

    this.id = Texture.idMax++;

    this.width = img.width;
    this.height = img.height;

    this.texture = Display.ctx.createTexture();
    this.setUnit(unit);
    this.use();

    if(!isBuffer){
      this.setTextureData(img_data);
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

    this.setParameters();
  }

  setParameters(params = {magFilter: Texture.LINEAR, minFilter: Texture.LINEAR, wrapS: Texture.REPEAT, wrapT: Texture.REPEAT}) {
    params = {
      magFilter: params.magFilter || Texture.LINEAR,
      minFilter: params.minFilter || Texture.LINEAR,
      wrapS: params.wrapS || Texture.REPEAT,
      wrapT: params.wrapT || Texture.REPEAT
    };

    if (this.isPowerOf2(this.width) && this.isPowerOf2(this.height)) {
      Display.ctx.generateMipmap(Display.ctx.TEXTURE_2D);
      //Display.ctx.texParameteri(Display.ctx.TEXTURE_2D, Display.ctx.TEXTURE_MIN_FILTER, Display.ctx.NEAREST_MIPMAP_LINEAR);

      Display.ctx.texParameterf(Display.ctx.TEXTURE_2D, Display.ctx.TEXTURE_MAG_FILTER, Display.ctx[params.magFilter]);
      Display.ctx.texParameterf(Display.ctx.TEXTURE_2D, Display.ctx.TEXTURE_MIN_FILTER, Display.ctx[params.minFilter]);


      Display.ctx.texParameteri(Display.ctx.TEXTURE_2D, Display.ctx.TEXTURE_WRAP_S, Display.ctx[params.wrapS]);
      Display.ctx.texParameteri(Display.ctx.TEXTURE_2D, Display.ctx.TEXTURE_WRAP_T, Display.ctx[params.wrapT]);

      /*

      witch (filt) {
        case POINT:// point sampling of nearest neighbor
        glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
        glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
        break;
        case BILINEAR:// bilinear interpolation
        glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
        glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
        break;
        case TRILINEAR:// trilinear interpolation on pyramid
        glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
        glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
        break;
        }

      */

      //  https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
    } else {
      Display.ctx.texParameteri(Display.ctx.TEXTURE_2D, Display.ctx.TEXTURE_WRAP_S, Display.ctx.CLAMP_TO_EDGE);
      Display.ctx.texParameteri(Display.ctx.TEXTURE_2D, Display.ctx.TEXTURE_WRAP_T, Display.ctx.CLAMP_TO_EDGE);
      Display.ctx.texParameteri(Display.ctx.TEXTURE_2D, Display.ctx.TEXTURE_MIN_FILTER, Display.ctx[params.minFilter]);
      Display.ctx.texParameteri(Display.ctx.TEXTURE_2D, Display.ctx.TEXTURE_MAG_FILTER, Display.ctx[params.magFilter]);
    }

    return this;
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

  getLocation(){
    return this.texture;
  }

  isPowerOf2(val){
    return (val & (val - 1)) == 0;
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
