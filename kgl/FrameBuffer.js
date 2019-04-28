import { Display } from './Display';

export class FrameBuffer {
  constructor(width = 256, height = 256, options = {texColor: true, depthTest: true}) {
    this.width = width;
    this.height = height;
    options = {
      texColor: options.texColor || false, texColorUnit: options.texColorUnit || 0,
      texDepth: options.texDepth || false, texDepthUnit: options.texDepthUnit || 0,
      texStencil: options.texStencil || false, texStencilUnit: options.texStencilUnit || 0,
      depthTest: (options.depthTest || options.texDepth) || false,
      stencilTest: options.stencilTest || false
    };

    this.textures = {
      color: options.texColor ? new Texture(width, height, options.texColorUnit) : null,
      depth: options.texDepth ? new Texture(width, height, options.texDepthUnit) : null,
      stencil: options.texStencil ? new Texture(width, height, options.texStencilUnit) : null
    };


    this.frameBufferPointer = Display.ctx.createFramebuffer();
    this.renderBufferPointer = (options.depthTest || options.stencilTest) ? Display.ctx.createRenderbuffer() : null;
    this.use();



    if(options.texColor) Display.ctx.framebufferTexture2D(Display.ctx.FRAMEBUFFER, Display.ctx.COLOR_ATTACHMENT0, Display.ctx.TEXTURE_2D, this.textures.color.getLocation(), 0);
    if(options.texDepth) Display.ctx.framebufferTexture2D(Display.ctx.FRAMEBUFFER, Display.ctx.DEPTH_ATTACHMENT, Display.ctx.TEXTURE_2D, this.textures.depth.getLocation(), 0);
    if(options.texStencil) Display.ctx.framebufferTexture2D(Display.ctx.FRAMEBUFFER, Display.ctx.STENCIL_ATTACHMENT, Display.ctx.TEXTURE_2D, this.textures.stencil.getLocation(), 0);



    if(options.depthTest){
      Display.ctx.renderbufferStorage(Display.ctx.RENDERBUFFER, Display.ctx.DEPTH_COMPONENT16, width, height);
      Display.ctx.framebufferRenderbuffer(Display.ctx.FRAMEBUFFER, Display.ctx.DEPTH_ATTACHMENT, Display.ctx.RENDERBUFFER, this.renderBufferPointer);
    }

    if(options.stencilTest){
      /// ?????
    }



    Display.ctx.bindFramebuffer(Display.ctx.FRAMEBUFFER, null);
    Display.ctx.bindRenderbuffer(Display.ctx.RENDERBUFFER, null);
  }

  use(){
    Display.ctx.bindFramebuffer(Display.ctx.FRAMEBUFFER, this.frameBufferPointer);
    if(this.renderBufferPointer != null) Display.ctx.bindRenderbuffer(Display.ctx.RENDERBUFFER, this.renderBufferPointer);
    Display.ctx.viewport(0, 0, this.width, this.height);
  }

  getTexture(){
    return this.textures.color;
  }

  getColorTexture(){
    return this.textures.color;
  }

  getDepthTexture(){
    return this.textures.depth;
  }

  getStencilTexture(){
    return this.textures.stencil;
  }
}
