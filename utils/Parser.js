export class Parser {
  static objIndex(textFile){
    const lines = textFile.split('\n').map(l => l.split(/(\s+)/).filter(s => s.trim().length > 0));

    const verts = new Array();
    const vertNorms = new Array();
    const vertTexs = new Array();
    const faces = new Array();
    const indices = new Array();

    for (let line of lines) {
      switch (line[0]) {
        case "v":
          verts.push({
            x: parseFloat(line[1]),
            y: parseFloat(line[2]),
            z: parseFloat(line[3])
          });
        break;

        case "vn":
          vertNorms.push({
            x: parseFloat(line[1]),
            y: parseFloat(line[2]),
            z: parseFloat(line[3])
          });
        break;

        case "vt":
          vertTexs.push({
            u: parseFloat(line[1]),
            v: parseFloat(line[2])
          });
        break;

        case "f":
          const p1 = line[1].split('/');
          const p2 = line[2].split('/');
          const p3 = line[3].split('/');

          faces.push({
            vert1: parseInt(p1[0]) - 1,
            vert2: parseInt(p2[0]) - 1,
            vert3: parseInt(p3[0]) - 1,

            tex1: parseInt(p1[1]) - 1,
            tex2: parseInt(p2[1]) - 1,
            tex3: parseInt(p3[1]) - 1,

            norm1: parseInt(p1[2]) - 1,
            norm2: parseInt(p2[2]) - 1,
            norm3: parseInt(p3[2]) - 1
          });

          indices.push(parseInt(p1[0]) - 1);
      		indices.push(parseInt(p2[0]) - 1);
      		indices.push(parseInt(p3[0]) - 1);
        break;
      }
    }

    const vertsF = new Array();
    const vertNormsF = new Array();
    const vertTexsF = new Array();

    for (const f of faces) {
      const index13 = f.vert1 * 3;
      const index12 = f.vert1 * 2;

      const index23 = f.vert2 * 3;
      const index22 = f.vert2 * 2;

      const index33 = f.vert3 * 3;
      const index32 = f.vert3 * 2;

      vertsF[index13] = verts[f.vert1].x
      vertsF[index13+1] = verts[f.vert1].y
      vertsF[index13+2] = verts[f.vert1].z

      vertsF[index23] = verts[f.vert2].x
      vertsF[index23+1] = verts[f.vert2].y
      vertsF[index23+2] = verts[f.vert2].z

      vertsF[index33] = verts[f.vert3].x
      vertsF[index33+1] = verts[f.vert3].y
      vertsF[index33+2] = verts[f.vert3].z

      if(vertTexs.length > 0){
        vertTexsF[index12] = vertTexs[f.tex1].u;
        vertTexsF[index12+1] = vertTexs[f.tex1].v;

        vertTexsF[index22] = vertTexs[f.tex2].u;
        vertTexsF[index22+1] = vertTexs[f.tex2].v;

        vertTexsF[index32] = vertTexs[f.tex3].u;
        vertTexsF[index32+1] = vertTexs[f.tex3].v;
      }

      if(vertNorms.length > 0){
        vertNormsF[index13] = vertNorms[f.norm1].x
        vertNormsF[index13+1] = vertNorms[f.norm1].y
        vertNormsF[index13+2] = vertNorms[f.norm1].z

        vertNormsF[index23] = vertNorms[f.norm2].x
        vertNormsF[index23+1] = vertNorms[f.norm2].y
        vertNormsF[index23+2] = vertNorms[f.norm2].z

        vertNormsF[index33] = vertNorms[f.norm3].x
        vertNormsF[index33+1] = vertNorms[f.norm3].y
        vertNormsF[index33+2] = vertNorms[f.norm3].z
      }
    }

    return {
      vertex: new Float32Array(vertsF),
      normal: new Float32Array(vertNormsF),
      uv: new Float32Array(vertTexsF),
      index: new Uint16Array(indices)
    };
  }

  static obj(file, params = {scale: 1, vertex: true, normal: true, uv: true, calculateNormal: false}) {
    if(typeof params != "object") params = {};
    params.scale = params.scale == undefined ? 1 : params.scale;
    params.vertex = params.vertex == undefined ? true : params.vertex;
    params.normal = params.normal == undefined ? true : params.normal;
    params.uv = params.uv == undefined ? true : params.uv;
    params.calculateNormal = params.calculateNormal == undefined ? false : params.calculateNormal;

    const lines = file.split('\n').map(l => l.split(/(\s+)/).filter(s => s.trim().length > 0));

    const scale = params.scale;

    let maxX = -Infinity;
    let maxY = -Infinity;
    let maxZ = -Infinity;

    let minX = Infinity;
    let minY = Infinity;
    let minZ = Infinity;


////////////////////////////////////////////////////////////////////////


    const sub = (a, b) => {
        return {
            x: b.x-a.x,
            y: b.y-a.y,
            z: b.z-a.z
        }
    }

    const cross = (u, v) => {
        return {
            x: u.y*v.z - u.z*v.y,
            y: u.z*v.x - u.x*v.z,
            z: u.x*v.y - u.y*v.x
        }
    }

    const norm = (v) => {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }

    const normalize = (v) => {
        let n = norm(v)
        return {
            x: v.x/n,
            y: v.y/n,
            z: v.z/n
        }
    }


////////////////////////////////////////////////////////////////////////



    const verts = new Array();
    const vertNorms = new Array();
    const vertTexs = new Array();
    const faces = new Array();

    for (let line of lines) {
        switch (line[0]) {
            case "v":
                verts.push({
                    x: parseFloat(line[1]),
                    y: parseFloat(line[2]),
                    z: parseFloat(line[3])
                });
            break;

            case "vn":
                vertNorms.push({
                    x: parseFloat(line[1]),
                    y: parseFloat(line[2]),
                    z: parseFloat(line[3])
                });
            break;

            case "vt":
                vertTexs.push({
                    u: parseFloat(line[1]),
                    v: parseFloat(line[2])
                });
            break;

            case "f":
                const p1 = line[1].split('/');
                const p2 = line[2].split('/');
                const p3 = line[3].split('/');

                faces.push({
                    vert1: parseInt(p1[0]) - 1,
                    vert2: parseInt(p2[0]) - 1,
                    vert3: parseInt(p3[0]) - 1,

                    tex1: parseInt(p1[1]) - 1,
                    tex2: parseInt(p2[1]) - 1,
                    tex3: parseInt(p3[1]) - 1,

                    norm1: parseInt(p1[2]) - 1,
                    norm2: parseInt(p2[2]) - 1,
                    norm3: parseInt(p3[2]) - 1
                });
            break;
        }
    }

    let facesListe = new Array();

    for (let f of faces) {
        const face = {
            vert1: verts[f.vert1],
            vert2: verts[f.vert2],
            vert3: verts[f.vert3],

            tex1: vertTexs[f.tex1],
            tex2: vertTexs[f.tex2],
            tex3: vertTexs[f.tex3],

            norm1: vertNorms[f.norm1],
            norm2: vertNorms[f.norm2],
            norm3: vertNorms[f.norm3],
        }

        if(params.calculateNormal) {
            let n = normalize(cross(sub(face.vert1, face.vert2), sub(face.vert1, face.vert3)));

            face.norm1 = n;
            face.norm2 = n;
            face.norm3 = n;
        }

        facesListe.push(face);
    }

    const vertsF = new Array();
    const vertNormsF = new Array();
    const vertTexsF = new Array();

    for(let f of facesListe){
        const x1 = f.vert1.x * scale;
        const y1 = f.vert1.y * scale;
        const z1 = f.vert1.z * scale;

        const x2 = f.vert2.x * scale;
        const y2 = f.vert2.y * scale;
        const z2 = f.vert2.z * scale;

        const x3 = f.vert3.x * scale;
        const y3 = f.vert3.y * scale;
        const z3 = f.vert3.z * scale;

        vertsF.push(x1);
        vertsF.push(y1);
        vertsF.push(z1);

        vertsF.push(x2);
        vertsF.push(y2);
        vertsF.push(z2);

        vertsF.push(x3);
        vertsF.push(y3);
        vertsF.push(z3);

        if(x1 > maxX) maxX = x1;
        if(y1 > maxY) maxY = y1;
        if(z1 > maxZ) maxZ = z1;

        if(x2 > maxX) maxX = x2;
        if(y2 > maxY) maxY = y2;
        if(z2 > maxZ) maxZ = z2;

        if(x3 > maxX) maxX = x3;
        if(y3 > maxY) maxY = y3;
        if(z3 > maxZ) maxZ = z3;
        

        if(x1 < minX) minX = x1;
        if(y1 < minY) minY = y1;
        if(z1 < minZ) minZ = z1;

        if(x2 < minX) minX = x2;
        if(y2 < minY) minY = y2;
        if(z2 < minZ) minZ = z2;

        if(x3 < minX) minX = x3;
        if(y3 < minY) minY = y3;
        if(z3 < minZ) minZ = z3;


        if(vertTexs.length > 0) {
            vertTexsF.push(f.tex1.u);
            vertTexsF.push(f.tex1.v);

            vertTexsF.push(f.tex2.u);
            vertTexsF.push(f.tex2.v);

            vertTexsF.push(f.tex3.u);
            vertTexsF.push(f.tex3.v);
        }

        if(vertNorms.length > 0 || params.calculateNormal) {
            vertNormsF.push(f.norm1.x);
            vertNormsF.push(f.norm1.y);
            vertNormsF.push(f.norm1.z);

            vertNormsF.push(f.norm2.x);
            vertNormsF.push(f.norm2.y);
            vertNormsF.push(f.norm2.z);

            vertNormsF.push(f.norm3.x);
            vertNormsF.push(f.norm3.y);
            vertNormsF.push(f.norm3.z);
        }
    }

    const object = {}

    if(params.vertex) {
        object.vertex = new Float32Array(vertsF);

        object.maxX = maxX;
        object.maxY = maxY;
        object.maxZ = maxZ;

        object.minX = minX;
        object.minY = minY;
        object.minZ = minZ;

        object.lengthX = Math.abs(maxX - minX);
        object.lengthY = Math.abs(maxY - minY);
        object.lengthZ = Math.abs(maxZ - minZ);
    }
    if(params.normal) object.normal = new Float32Array(vertNormsF);
    if(params.uv) object.uv = new Float32Array(vertTexsF);

    return object;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////


  static ply(file, params = {x: true, y: true, z: true, nx: true, ny: true, nz: true, u: true, v: true, red: true, green: true, blue: true, alpha: false}) {
    params.x = params.x == undefined ? true : params.x;
    params.y = params.y == undefined ? true : params.y;
    params.z = params.z == undefined ? true : params.z;
    params.nx = params.nx == undefined ? true : params.nx;
    params.ny = params.ny == undefined ? true : params.ny;
    params.nz = params.nz == undefined ? true : params.nz;
    params.u = params.u == undefined ? true : params.u;
    params.v = params.v == undefined ? true : params.v;
    params.red = params.red == undefined ? true : params.red;
    params.green = params.green == undefined ? true : params.green;
    params.blue = params.blue == undefined ? true : params.blue;
    params.alpha = params.alpha == undefined ? false : params.alpha;
    
    const lines = file.split('\n').map(l => l.split(/(\s+)/).filter(s => s.trim().length > 0));

    const vertex = new Array();
    const normal = new Array();
    const uv = new Array();
    const color = new Array();
    const indices = new Array();

    let index = 0;

    if(lines[index][0] == 'ply') ++index;

    if(lines[index][0] != 'format' && lines[index][1] != 'ascii') {
      console.error('Mauvais format ply');
      return;
    } else {
      ++index;
    }

    let vertexNumber = 0;
    let faceNumber = 0;
    let propertyMaxIndex = 0;
    let x = -1, y = -1, z = -1, nx = -1, ny = -1, nz = -1, s = -1, t = -1, red = -1, green = -1, blue = -1, alpha = -1;

    while(lines[index] != 'end_header') {
      const line = lines[++index];

      if(line.length == 0) continue;
      if(line[0] == 'comment') continue;

      if(line[0] == 'element') {
        if(line[1] == 'vertex') {
          vertexNumber = parseInt(line[2]);
        } else if(line[1] == 'face') {
          faceNumber = parseInt(line[2]);
        }

        continue;
      }

      if(line[0] == 'property') {
        if(line[1] == 'float') {
          if(line[2] == 'x') x = propertyMaxIndex++;
          if(line[2] == 'y') y = propertyMaxIndex++;
          if(line[2] == 'z') z = propertyMaxIndex++;

          if(line[2] == 'nx') nx = propertyMaxIndex++;
          if(line[2] == 'ny') ny = propertyMaxIndex++;
          if(line[2] == 'nz') nz = propertyMaxIndex++;

          if(line[2] == 's') s = propertyMaxIndex++;
          if(line[2] == 't') t = propertyMaxIndex++;
        } else if(line[1] == 'uchar') {
          if(line[2] == 'red') red = propertyMaxIndex++;
          if(line[2] == 'green') green = propertyMaxIndex++;
          if(line[2] == 'blue') blue = propertyMaxIndex++;
          if(line[2] == 'alpha') alpha = propertyMaxIndex++;
        }
      }
    }
    ++index;

    
    for(const finVertex = index + vertexNumber; index < finVertex; ++index) {
      const line = lines[index];

      if(x != -1 && params.x) vertex.push(parseFloat(line[x]));
      if(y != -1 && params.y) vertex.push(parseFloat(line[y]));
      if(z != -1 && params.z) vertex.push(parseFloat(line[z]));

      if(nx != -1 && params.nx) normal.push(parseFloat(line[nx]));
      if(ny != -1 && params.ny) normal.push(parseFloat(line[ny]));
      if(nz != -1 && params.nz) normal.push(parseFloat(line[nz]));

      if(s != -1 && params.s) uv.push(parseFloat(line[s]));
      if(t != -1 && params.s) uv.push(parseFloat(line[t]));

      if(red != -1 && params.red) color.push(parseInt(line[red]) / 255);
      if(green != -1 && params.green) color.push(parseInt(line[green]) / 255);
      if(blue != -1 && params.blue) color.push(parseInt(line[blue]) / 255);
      if(alpha != -1 && params.alpha) color.push(parseInt(line[alpha]) / 255);
    }

    for(const finFace = index + faceNumber; index < finFace; ++index) {
      const line = lines[index];

      if(line[0] == '3') {
        indices.push(parseInt(line[1]));
        indices.push(parseInt(line[2]));
        indices.push(parseInt(line[3]));
      }
    }

    return {
      vertex: new Float32Array(vertex),
      normal: new Float32Array(normal),
      uv: new Float32Array(uv),
      color: new Float32Array(color),
      index: new Int16Array(indices)
    };
  }
}
