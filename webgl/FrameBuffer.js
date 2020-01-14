import { Display } from './Display';
import { Texture, DepthTexture } from './Texture';

export class FrameBuffer {
  constructor(width = 256, height = 256, options = {texColor: true, texColorUnit: 0, depthTest: true, texDepth: false, texDepthUnit: 0}) {
    this.width = width;
    this.height = height;
    options = {
      texColor: options.texColor || false, texColorUnit: options.texColorUnit || 0,
      texDepth: options.texDepth || false, texDepthUnit: options.texDepthUnit || 0,
      depthTest: options.depthTest || false,
    };

    this.textures = {
      color: options.texColor ? new Texture(null, width, height).setUnit(options.texColorUnit) : null,
      depth: options.texDepth ? new DepthTexture(width, height).setUnit(options.texDepthUnit) : null,
    };


    this.frameBufferPointer = Display.ctx.createFramebuffer();
    this.depthBufferPointer = (options.depthTest && !options.texDepth) ? Display.ctx.createRenderbuffer() : null;
    this.use();

    if(options.texColor) Display.ctx.framebufferTexture2D(Display.ctx.FRAMEBUFFER, Display.ctx.COLOR_ATTACHMENT0, Display.ctx.TEXTURE_2D, this.textures.color.getLocation(), 0);
    if(options.texDepth) Display.ctx.framebufferTexture2D(Display.ctx.FRAMEBUFFER, Display.ctx.DEPTH_ATTACHMENT, Display.ctx.TEXTURE_2D, this.textures.depth.getLocation(), 0);
    
    if(this.depthBufferPointer){
      Display.ctx.renderbufferStorage(Display.ctx.RENDERBUFFER, Display.ctx.DEPTH_COMPONENT16, width, height);
      Display.ctx.framebufferRenderbuffer(Display.ctx.FRAMEBUFFER, Display.ctx.DEPTH_ATTACHMENT, Display.ctx.RENDERBUFFER, this.depthBufferPointer);
      Display.ctx.bindRenderbuffer(Display.ctx.RENDERBUFFER, null);
    }

    Display.ctx.bindFramebuffer(Display.ctx.FRAMEBUFFER, null);
  }

  use(){
    Display.ctx.bindFramebuffer(Display.ctx.FRAMEBUFFER, this.frameBufferPointer);
    if(this.depthBufferPointer != null) Display.ctx.bindRenderbuffer(Display.ctx.RENDERBUFFER, this.depthBufferPointer);
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
}
