import { Vector2 } from '../../utils/Vector2';

export class Face2d {
    constructor(p1, p2, orientation = Face2d.LEFT) {

        let n = Vector2.create();
        Vector2.subtract(n, p1, p2);

        if(orientation === Face2d.LEFT) {
            let save = n[0];
            n[0] = n[1];
            n[1] = -save;
        } else {
            let save = n[0];
            n[0] = -n[1];
            n[1] = save;
        }

        Vector2.normalize(n, n);

        this.vertex1 = p1;
        this.vertex2 = p2;
        this.normal = n;
    }
}

Face2d.RIGHT = "RIGHT";
Face2d.LEFT = "LEFT";