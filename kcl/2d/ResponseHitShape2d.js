import { HitShape2d } from './HitShape2d';

export class ResponseHitShape2d extends HitShape2d {
    constructor(vertices, indices, orientation) {
        super(vertices, indices, orientation);
    }

    getHitMouvement(out, transformMat3) {
        
    }
}
