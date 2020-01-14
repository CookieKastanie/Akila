import { Vector2 } from '../../utils/Vector2';

export class StaticField2d {
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

        this.shapes = new Array();
    }

    addStaticShape(shape, worldPosX = 100, worldPosY = 100) {
        /*for(let f of shape.faces) {
            this.addStaticFace(f);
        }*/

        for(let i = 0; i < shape.faces.length; ++i) {
            this.addStaticFace(shape.faces[i], worldPosX, worldPosY, this.shapes.length, i);
        }

        this.shapes.push(shape);
    }

    addStaticFace(face, worldPosX, worldPosY, shapeId) {
        const x0 = face.vertex1[0] + worldPosX,
              y0 = face.vertex1[1] + worldPosY,
              x1 = face.vertex2[0] + worldPosX,
              y1 = face.vertex2[1] + worldPosY;

        const dy = y1 - y0;
        const dx = x1 - x0;
        if(dx == 0 && dy == 0) {
            this.addToField(x0, y0);
            return;
        }

        const xDir = (x1 > x0);
        const yDir = (y1 > y0);
        const diff = xDir ^ yDir;

        if (xDir) this.lookX(x0, y0, x1, y1, false);
        else this.lookX(x1, y1, x0, y0, diff);
        
        if (yDir) this.lookY(x0, y0, x1, y1, false);
        else this.lookY(x1, y1, x0, y0, diff);
    }

    lookX(x0, y0, x1, y1, dec) {
        this.addToField(x0, y0); // à changer

        const dy = y1 - y0;
        const dx = x1 - x0;
        const m = dy / dx;

        dec = dec ? this.unit : 0;

        for(let x = Math.floor(x0 / this.unit) * this.unit + this.unit; x <= x1; x += this.unit) {
            const y = m * (x - x0) + y0;
            this.addToField(x - dec, y);
        }
    }

    lookY(x0, y0, x1, y1, dec) {
        this.addToField(x0, y0); // à changer

        const dy = y1 - y0;
        const dx = x1 - x0;
        const mInv = dx / dy;

        dec = dec ? this.unit : 0;

        for(let y = Math.floor(y0 / this.unit) * this.unit + this.unit; y <= y1; y += this.unit) {
            const x =  mInv * (y - y0) + x0;
            this.addToField(x, y - dec);
        }
    }

    addToField(x, y) {
        x = Math.floor(x / this.unit);
        y = Math.floor(y / this.unit);

        //console.log('set');
        
        if(x >= 0 && x < this.width && y >= 0 && y < this.height) this.field[y][x] = true;

        /*if(x >= 0 && x < this.width && y >= 0 && y < this.height) {
            const shapeData = this.field[y][x][shapeId];


        }*/
    }

    /**
    * Center mode
    */
    query(x, y, w, h) {
        
    }
}
