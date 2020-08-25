export class Display {
  constructor(width = 300, height = 300, option = {webGLVersion: 1, canvas: null}) {
    if(Display.ctx) throw `Display est un singleton -> qu'un seul canevas à la fois.`;

    if(option.canvas) {
      if(typeof option.canvas === 'string') this.canvas = document.querySelector(option.canvas);
      else this.canvas = option.canvas;
    } else {
      this.canvas = document.createElement('canvas');

      this.canvas.id = "webgl-canvas";
  
      this.conteneur = document.getElementById('webgl-screen');
      if (!this.conteneur) throw `Impossible de créer le canevas, il faut ajouter une balise avec l'id "webgl-screen"`;
  
      this.conteneur.appendChild(this.canvas);
    }

    this.ctx = this.canvas.getContext(option.webGLVersion == 2 ? "webgl2" : "webgl");
    if (!this.ctx) this.ctx = this.canvas.getContext("experimental-webgl");
    if (!this.ctx) throw "Impossible de d'initialiser le contexte WebGL";

    this.loadExtensions();

    this.use();

    this.setSize(width, height);

    this.ctx.enable(this.ctx.DEPTH_TEST);
    this.setClearColor(Math.random(), Math.random(), Math.random(), 1.0);

    this.ctx.enable(this.ctx.BLEND);
    this.ctx.enable(this.ctx.SAMPLE_ALPHA_TO_COVERAGE);
    this.defaultBlendFunc();

    this.ctx.enable(this.ctx.CULL_FACE);
  	this.ctx.frontFace(this.ctx.CCW);
  	this.ctx.cullFace(this.ctx.BACK);

    this.clear();
  }

  loadExtensions() {
    this.exts = {
      WEBGL_depth_texture: this.ctx.getExtension('WEBGL_depth_texture')
    }
  }

  getDiv(){
    return this.conteneur;
  }

  setSize(w, h){
    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx.viewport(0, 0, w, h);
  }

  getWidth(){
    return this.canvas.width;
  }

  getHeight(){
    return this.canvas.height;
  }

  setClearColor(r, g, b, a){
    this.ctx.clearColor(r, g, b, a);
  }

  clear(){
    this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);
  }

  clearColor(){
    this.ctx.clear(this.ctx.COLOR_BUFFER_BIT);
  }

  clearDepth(){
    this.ctx.clear(this.ctx.DEPTH_BUFFER_BIT);
  }

  getCtx(){
    return this.ctx;
  }

  use(){
    Display.ctx = this.getCtx();
  }

  useDefaultFrameBuffer(){
    this.ctx.bindFramebuffer(this.ctx.FRAMEBUFFER, null);
    this.ctx.bindRenderbuffer(this.ctx.RENDERBUFFER, null);
    this.ctx.viewport(0, 0, this.getWidth(), this.getHeight());
  }

  enable(val){
    this.ctx.enable(this.ctx[val]);
  }

  disable(val){
    this.ctx.disable(this.ctx[val]);
  }

  blendFunc(sfactor, dfactor) {
    this.ctx.blendFunc(this.ctx[sfactor], this.ctx[dfactor]);
  }

  depthFunc(func) {
    this.ctx.depthFunc(this.ctx[func]);
  }

  defaultBlendFunc() {
    this.ctx.blendFunc(this.ctx.SRC_ALPHA, this.ctx.ONE_MINUS_SRC_ALPHA);
  }

  blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha) {
    this.ctx.blendFuncSeparate(this.ctx[srcRGB], this.ctx[dstRGB], this.ctx[srcAlpha], this.ctx[dstAlpha]);
  }

  getCanvas(){
    return this.canvas;
  }
}

Display.ctx = null;

Display.BLEND = "BLEND";
Display.CULL_FACE = "CULL_FACE";
Display.DEPTH_TEST = "DEPTH_TEST";
Display.DITHER = "DITHER";
Display.POLYGON_OFFSET_FILL = "POLYGON_OFFSET_FILL";
Display.SAMPLE_ALPHA_TO_COVERAGE = "SAMPLE_ALPHA_TO_COVERAGE";
Display.SAMPLE_COVERAGE = "SAMPLE_COVERAGE";
Display.SCISSOR_TEST = "SCISSOR_TEST";
Display.STENCIL_TEST = "STENCIL_TEST";

Display.LEQUAL = "LEQUAL";
Display.LESS = "LESS";

/**
 * Multiplies all colors by 0.
 */
Display.ZERO = "ZERO";

/**
 * Multiplies all colors by 1.
 */
Display.ONE	= "ONE";

/**
 * Multiplies all colors by the source colors.
 */
Display.SRC_COLOR	= "SRC_COLOR";

/**
 * Multiplies all colors by 1 minus each source color.
 */
Display.ONE_MINUS_SRC_COLOR = "ONE_MINUS_SRC_COLOR";

/**
 * Multiplies all colors by the destination color.
 */
Display.DST_COLOR	=	"DST_COLOR";

/**
 * Multiplies all colors by 1 minus each destination color.
 */
Display.ONE_MINUS_DST_COLOR	= "ONE_MINUS_DST_COLOR";

/**
 * Multiplies all colors by the source alpha value.
 */
Display.SRC_ALPHA	= "SRC_ALPHA";

/**
 * Multiplies all colors by 1 minus the source alpha value.
 */
Display.ONE_MINUS_SRC_ALPHA	= "ONE_MINUS_SRC_ALPHA";

/**
 * Multiplies all colors by the destination alpha value.
 */
Display.DST_ALPHA	= "DST_ALPHA";

/**
 * Multiplies all colors by 1 minus the destination alpha value.
 */
Display.ONE_MINUS_DST_ALPHA	= "ONE_MINUS_DST_ALPHA";

/**
 * Multiplies all colors by a constant color.
 */
Display.CONSTANT_COLOR = "CONSTANT_COLOR";

/**
 * Multiplies all colors by 1 minus a constant color.
 */
Display.ONE_MINUS_CONSTANT_COLOR = "ONE_MINUS_CONSTANT_COLOR";

/**
 * Multiplies all colors by a constant alpha value.
 */
Display.CONSTANT_ALPHA = "CONSTANT_ALPHA";

/**
 * Multiplies all colors by 1 minus a constant alpha value.
 */
Display.ONE_MINUS_CONSTANT_ALPHA = "ONE_MINUS_CONSTANT_ALPHA";

/**
 * Multiplies the RGB colors by the smaller of either the source alpha value or the value of 1 minus the destination alpha value. The alpha value is multiplied by 1.
 */
Display.SRC_ALPHA_SATURATE = "SRC_ALPHA_SATURATE";
