import { Face2d } from './Face2d';

export class HitShape2d {
    constructor(vertices = [], indices = [], orientation = HitShape2d.OUT) {
        this.id = HitShape2d.MAX_ID++;
        this.orientation = orientation;
        this.faces = new Array();
        this.vertices = new Array();

        for(let i = 0; i < vertices.length; i += 2) {
            this.vertices.push(new Float32Array([vertices[i], vertices[i + 1]]));
        }

        for (let i = 0; i < indices.length; i += 2) {
            const ip1 = indices[i] * 2;
            const ip2 = indices[i + 1] * 2;

            let p1 = [vertices[ip1], vertices[ip1 + 1]];
            let p2 = [vertices[ip2], vertices[ip2 + 1]];

            this.faces.push(new Face2d(p1, p2, orientation === HitShape2d.IN ? Face2d.RIGHT : Face2d.LEFT));
        }
    }
}

HitShape2d.MAX_ID = 0;
HitShape2d.IN = "IN";
HitShape2d.OUT = "OUT";
