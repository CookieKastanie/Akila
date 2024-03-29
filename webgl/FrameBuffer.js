import { Display } from './Display';
import { Texture, DepthTexture } from './Texture';

export class FrameBuffer {
    constructor(width = 256, height = 256, options = {texColor: true, texColorUnit: 0, depthTest: true, texDepth: false, texDepthUnit: 0, antialias: false}) {
        this.width = width;
        this.height = height;
        options = {
            texColor: options.texColor || false, texColorUnit: options.texColorUnit || 0,
            texDepth: options.texDepth || false, texDepthUnit: options.texDepthUnit || 0,
            depthTest: options.depthTest || false,
            antialias: options.antialias || false,
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

    delete(){
        if(this.textures.color) this.textures.color.delete();
        if(this.textures.depth) this.textures.depth.delete();

        if(this.depthBufferPointer) Display.ctx.deleteRenderbuffer(this.depthBufferPointer);

        Display.ctx.deleteFramebuffer(this.frameBufferPointer);
    }

    /* only with Webgl2 */
    blitToScreen(filter = FrameBuffer.NEAREST) {
        Display.ctx.bindFramebuffer(Display.ctx.DRAW_FRAMEBUFFER, null);
        Display.ctx.bindFramebuffer(Display.ctx.READ_FRAMEBUFFER, this.frameBufferPointer);
        Display.ctx.blitFramebuffer(0, 0, this.width, this.height, 0, 0, Display.ctx.canvas.width, Display.ctx.canvas.height, Display.ctx.COLOR_BUFFER_BIT, Display.ctx[filter]);
    }

    /* only with Webgl2 */
    blitTo(frameBuffer, filter = FrameBuffer.NEAREST) {
        Display.ctx.bindFramebuffer(Display.ctx.DRAW_FRAMEBUFFER, frameBuffer.frameBufferPointer);
        Display.ctx.bindFramebuffer(Display.ctx.READ_FRAMEBUFFER, this.frameBufferPointer);
        Display.ctx.blitFramebuffer(0, 0, this.width, this.height, 0, 0, frameBuffer.width, frameBuffer.height, Display.ctx.COLOR_BUFFER_BIT, Display.ctx[filter]);
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

    setSize(width, height) {
        this.width = width;
        this.height = height;

        if(this.textures.color) this.textures.color.setTextureData(null, width, height);
        if(this.textures.depth) this.textures.depth.setTextureData(width, height);
        if(this.depthBufferPointer) {
            Display.ctx.bindRenderbuffer(Display.ctx.RENDERBUFFER, this.depthBufferPointer);
            Display.ctx.renderbufferStorage(Display.ctx.RENDERBUFFER, Display.ctx.DEPTH_COMPONENT16, width, height);
        }
    }

    clear(){
        Display.ctx.clear(Display.ctx.COLOR_BUFFER_BIT | Display.ctx.DEPTH_BUFFER_BIT);
    }

    clearColor(){
        Display.ctx.clear(Display.ctx.COLOR_BUFFER_BIT);
    }

    clearDepth(){
        Display.ctx.clear(Display.ctx.DEPTH_BUFFER_BIT);
    }
}

FrameBuffer.LINEAR = 'LINEAR';
FrameBuffer.NEAREST = 'NEAREST';
