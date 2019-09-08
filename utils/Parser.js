export class Parser {
  static obj(textFile){
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
      positions : new Float32Array(vertsF),
      normals: new Float32Array(vertNormsF),
      texcoords: new Float32Array(vertTexsF),
      indices: new Uint16Array(indices)
    };
  }

  static objNoIndices(textFile){
    const lines = textFile.split('\n').map(l => l.split(/(\s+)/).filter(s => s.trim().length > 0));

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
      facesListe.push({
        vert1: verts[f.vert1],
        vert2: verts[f.vert2],
        vert3: verts[f.vert3],

        tex1: vertTexs[f.tex1],
        tex2: vertTexs[f.tex2],
        tex3: vertTexs[f.tex3],

        norm1: vertNorms[f.norm1],
        norm2: vertNorms[f.norm2],
        norm3: vertNorms[f.norm3],
      });
    }

    const vertsF = new Array();
    const vertNormsF = new Array();
    const vertTexsF = new Array();

    for(let f of facesListe){
      vertsF.push(f.vert1.x);
      vertsF.push(f.vert1.y);
      vertsF.push(f.vert1.z);

      vertsF.push(f.vert2.x);
      vertsF.push(f.vert2.y);
      vertsF.push(f.vert2.z);

      vertsF.push(f.vert3.x);
      vertsF.push(f.vert3.y);
      vertsF.push(f.vert3.z);

      vertTexsF.push(f.tex1.u);
      vertTexsF.push(f.tex1.v);

      vertTexsF.push(f.tex2.u);
      vertTexsF.push(f.tex2.v);

      vertTexsF.push(f.tex3.u);
      vertTexsF.push(f.tex3.v);

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

    return {
      positions : new Float32Array(vertsF),
      normals: new Float32Array(vertNormsF),
      texcoords: new Float32Array(vertTexsF),
    };
  }
}
