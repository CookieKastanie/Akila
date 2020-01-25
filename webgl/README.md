# Sommaire
 - [Display](#Display)
 - [Shader](#Shader)
 - [Les buffers de données (VAO, IndexedVAO, VBO, IBO)](#(Les-buffers-de-données-(VAO,-IndexedVAO,-VBO,-IBO)))
 - [Texture](#Texture)
 - [FrameBuffer](#FrameBuffer)

# Display
```javascript
// Utilisation du singleton Display
const display = new Display(w, h); // Taille optionnel

// Méthodes disponibles :

display.setSize(w, h); // Taille en pixels
display.getWidth();
display.getHeight();
display.getCanvas();

display.clearColor(); // Nettoie le buffer de couleur courant
display.clearDepth(); // Nettoie le buffer de profondeur courant
display.clear(); // Nettoie les deux en même temps
display.setClearColor(r, g, b, a); // Couleur de nettoyage (valeurs entre 0.0 et 1.0)

display.enable(fonc); 
display.disable(fonc); // Voir la liste des paramètres de enable/disble

display.blendFunc(sfactor, dfactor);
display.blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha); // Voir la liste des paramètres de blendFunc et blendFuncSeparate
display.defaultBlendFunc(); // Remet la fonction de mélange par defaut

display.useDefaultFrameBuffer(); // Remet le canevas en tant que frameBuffer cible
```

### Paramètres de enable/disable
```javascript
Display.BLEND
Display.CULL_FACE
Display.DEPTH_TEST
Display.DITHER
Display.POLYGON_OFFSET_FILL
Display.SAMPLE_ALPHA_TO_COVERAGE
Display.SAMPLE_COVERAGE
Display.SCISSOR_TEST
Display.STENCIL_TEST
```
### Paramètres de blendFunc et blendFuncSeparate
```javascript
Display.ZERO
Display.ONE
Display.SRC_COLOR
Display.ONE_MINUS_SRC_COLOR
Display.DST_COLOR
Display.ONE_MINUS_DST_COLOR
Display.SRC_ALPHA
Display.ONE_MINUS_SRC_ALPHA
Display.DST_ALPHA
Display.ONE_MINUS_DST_ALPHA
Display.CONSTANT_COLOR
Display.ONE_MINUS_CONSTANT_COLOR
Display.CONSTANT_ALPHA
Display.ONE_MINUS_CONSTANT_ALPHA
Display.SRC_ALPHA_SATURATE
```
# Shader
```javascript
// Utilisation
const shader = new Shader(vertexShaderTextFile, fragmentShaderTextFile, name); // name optionnel

shader.use(); // ce shader sera utilisé pour le rendu

shader.getAttribLocation('attribName');

shader.sendFloat('unifName', data);
shader.sendInt('unifName', data);
shader.sendIntVec('unifName', data);
shader.sendVec1('unifName', data);
shader.sendVec2('unifName', data);
shader.sendVec3('unifName', data);
shader.sendVec4('unifName', data);
shader.sendMat2('unifName', data);
shader.sendMat3('unifName', data);
shader.sendMat4('unifName', data);

shader.delete();
```

# Les buffers de données (VAO, IndexedVAO, VBO, IBO)
```javascript
// Utilisation
const vao = new VAO(mode) // mode optionnel (voir liste des modes)
.setMode(mode) // optionnel
.addVBO(new VBO([ data ], tupleSize, attribLocation, usage).setUsage(usage)) // usage/setUsage optionnel (voir liste usages)
.addVBO(new VBO([ data ], tupleSize, attribLocation))
.addVBO(...);

vao.draw();
vao.delete();


const indexedVao = new IndexedVAO(mode) // mode optionnel (voir liste des modes)
.setMode(mode) // optionnel
.setIBO(new IBO([ data ], usage).setUsage(usage))  // usage/setUsage optionnel (voir liste usages)
.addVBO(new VBO([ data ], tupleSize, attribLocation))
.addVBO(new VBO([ data ], tupleSize, attribLocation))
.addVBO(...);

indexedVao.draw();
indexedVao.delete();
```

## Modes
```javascript
IndexedVAO.TRIANGLES = VAO.TRIANGLES
IndexedVAO.TRIANGLE_STRIP = VAO.TRIANGLE_STRIP
IndexedVAO.TRIANGLE_FAN = VAO.TRIANGLE_FAN

IndexedVAO.POINTS = VAO.POINTS

IndexedVAO.LINES = VAO.LINES
IndexedVAO.LINE_STRIP = VAO.LINE_STRIP
IndexedVAO.LINE_LOOP = VAO.LINE_LOOP
```
## Usages
```javascript
IBO.STATIC_DRAW = VBO.STATIC_DRAW
IBO.DYNAMIC_DRAW = VBO.DYNAMIC_DRAW
IBO.STREAM_DRAW = VBO.STREAM_DRAW
```

# Texture
```javascript
// Utilisation
const tex = new Texture(data, width, height); // width / height optionnel si data est de type Image

tex.setParameters(params = {
	magFilter,
	minFilter,
	wrapS,
	wrapT
}); // voir liste des paramètres de texture

tex.getWidth();
tex.getHeight();

tex.setUnit(unit);
tex.setTextureData(data);

tex.use();

tex.delete();
```

### Paramètres de texture
```javascript
Texture.LINEAR
Texture.NEAREST
Texture.LINEAR_MIPMAP_LINEAR
Texture.LINEAR_MIPMAP_NEAREST
Texture.NEAREST_MIPMAP_NEAREST
Texture.NEAREST_MIPMAP_LINEAR
Texture.REPEAT
Texture.CLAMP_TO_EDGE
Texture.MIRRORED_REPEAT = "MIRRORED_REPEAT";
```

# FrameBuffer
```javascript
// Utiliation
const frameBuffer = new FrameBuffer(width, height, options = {
	texColor, // boolean
	texColorUnit, // integer
	depthTest, // boolean
	texDepth, // boolean
	texDepthUnit // integer
});

frameBuffer.use();

frameBuffer.getTexture();
frameBuffer.getColorTexture(); // idem à getTexture()
frameBuffer.getDepthTexture();

frameBuffer.delete();
```
