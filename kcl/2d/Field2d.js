import { Vector2 } from '../../utils/Vector2';

export class Field2d {
    constructor(width = 10, height = 10, unit = 1) {
        this.width = width;
        this.height = height;
        this.unit = unit;
        this.field = new Array();

        for(let y = 0; y < height; ++y) {
            const ligne = new Array();

            for(let x = 0; x < width; ++x) {
                ligne.push(new Array());
            }

            this.field.push(ligne);
        }

        this.faces = new Array();
    }

    addStaticShape(shape) {
        for(let f of shape.faces) {
            this.addStaticFace(f);
        }
    }

    addStaticFace(face) {
        const interPoint = [0, 0];

        for(let t = 0; t <= 1; t += Field2d.BULDER_STEP) {
            Vector2.lerp(interPoint, face.vertex1, face.vertex2, t);

            const x = Math.floor(interPoint[0] / this.unit);
            const y = Math.floor(interPoint[1] / this.unit);

            if(x >= 0 && x < this.width && y >= 0 && y < this.height) {
                this.field[y][x] = true;
            }
        }
    }
}

Field2d.BULDER_STEP = 1 / 128;
