import { HitShape2d } from './HitShape2d';

export class ResponseHitShape2d extends HitShape2d {
    constructor(vertices, indices, orientation) {
        super(vertices, indices, orientation);

        let maxX = -Infinity;
        let maxY = -Infinity;

        let minX = Infinity;
        let minY = Infinity;

        for (let i = 0; i < vertices.length; i += 2) {
            const x = vertices[i];
            const y = vertices[i + 1];

            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);

            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
        }

        this.width = maxX - minX;
        this.height = maxY - minY;

        this.facesBuffer = new Map();
    }

    getHitMouvement(out, transformMat3, staticField) {
        this.facesBuffer.clear();
        staticField.query(transformMat3[6], transformMat3[7], this.width, this.height, this.facesBuffer);


        const x = transformMat3[6];
        const y = transformMat3[7];


        for(let f of this.facesBuffer.values()){

            const face = staticField.shapes.get(f.shapeId).faces[f.faceId];

            const xNorm = face.normal[0];
            const yNorm = face.normal[1];

            let zero = (face.vertex1[0] + f.worldPosX) * xNorm + (face.vertex1[1] + f.worldPosY) * yNorm;

            let min = Infinity;
            for (let sommet of this.vertices) {
                let val = (sommet[0] + x) * xNorm + (sommet[1] + y) * yNorm;
                if (val < min) min = val;
            }

            console.log(min - zero)
        }
    }
}
