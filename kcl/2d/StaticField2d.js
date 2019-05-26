import { Vector2 } from '../../utils/Vector2';

class FieldBlockData {
    constructor(shapeId, faceId, worldPosX, worldPosY) {
        this.shapeId = shapeId;
        this.faceId = faceId;
        this.worldPosX = worldPosX;
        this.worldPosY = worldPosY;
    }
}

class FieldBlock {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.datas = new Array();
    }

    addData(data) {
        if(!this.datas.find(d => {
            return data.shapeId == d.shapeId && data.faceId == d.faceId && data.worldPosX == d.worldPosX && data.worldPosY == d.worldPosY;
        })) {
            this.datas.push(data);
        }
    }
}

export class StaticField2d {
    constructor(unit = 1) {
        this.unit = unit;
        this.field = new Map();
        this.shapes = new Map();
    }

    addStaticShape(shape, worldPosX = 0, worldPosY = 0) {
        for(let i = 0; i < shape.faces.length; ++i) {
            this.addStaticFace(shape.faces[i], new FieldBlockData(shape.id, i, worldPosX, worldPosY));
        }

        this.shapes.set(shape.id, shape);
    }

    addStaticFace(face, data) {
        const x0 = face.vertex1[0] + data.worldPosX,
              y0 = face.vertex1[1] + data.worldPosY,
              x1 = face.vertex2[0] + data.worldPosX,
              y1 = face.vertex2[1] + data.worldPosY;

        const dy = y1 - y0;
        const dx = x1 - x0;
        if(dx == 0 && dy == 0) {
            this.addToField(x0, y0, data);
            return;
        }

        const xDir = (x1 > x0);
        const yDir = (y1 > y0);
        const diff = xDir ^ yDir;

        if (xDir) this.lookX(x0, y0, x1, y1, false, data);
        else this.lookX(x1, y1, x0, y0, diff, data);
        
        if (yDir) this.lookY(x0, y0, x1, y1, false, data);
        else this.lookY(x1, y1, x0, y0, diff, data);
    }

    lookX(x0, y0, x1, y1, dec, data) {
        this.addToField(x0, y0, data); // à changer

        const dy = y1 - y0;
        const dx = x1 - x0;
        const m = dy / dx;

        dec = dec ? this.unit : 0;

        for(let x = Math.floor(x0 / this.unit) * this.unit + this.unit; x <= x1; x += this.unit) {
            const y = m * (x - x0) + y0;
            this.addToField(x - dec, y, data);
        }
    }

    lookY(x0, y0, x1, y1, dec, data) {
        this.addToField(x0, y0, data); // à changer

        const dy = y1 - y0;
        const dx = x1 - x0;
        const mInv = dx / dy;

        dec = dec ? this.unit : 0;

        for(let y = Math.floor(y0 / this.unit) * this.unit + this.unit; y <= y1; y += this.unit) {
            const x =  mInv * (y - y0) + x0;
            this.addToField(x, y - dec, data);
        }
    }

    addToField(x, y, data) {
        x = Math.floor(x / this.unit);
        y = Math.floor(y / this.unit);

        //console.log('set');
        
        if(x >= -StaticField2d.MAX_FIELD_VALUE &&
           x < StaticField2d.MAX_FIELD_VALUE &&
           y >= -StaticField2d.MAX_FIELD_VALUE &&
           y < StaticField2d.MAX_FIELD_VALUE) {

            const hash = StaticField2d.hashCoordinate(x, y);
            let block = this.field.get(hash);

            if(!block) {
                block = new FieldBlock(x, y);
                this.field.set(hash, block);
            }

            block.addData(data);
        }
    }

    /**
    * Center mode
    */
    query(x, y, w, h, buffer = new Map()) {
        x -= w / 2;
        y -= h / 2;

        for (let _y = y; _y < (h + y); _y += this.unit) { 
            for (let _x = x; _x < (w + x); _x += this.unit) {
                const block = this.field.get(StaticField2d.hashCoordinate(Math.floor(_x / this.unit), Math.floor(_y / this.unit)));
                if(block) {
                    for (const d of block.datas) {
                        buffer.set(StaticField2d.hashCoordinate(d.shapeId, d.faceId), d);
                    }
                }
            }
        }

        return buffer;
    }

    static hashCoordinate(x, y) {
        return x * StaticField2d.MAX_FIELD_VALUE + y;
    }
}

StaticField2d.MAX_FIELD_VALUE = Math.floor(Math.sqrt(Number.MAX_SAFE_INTEGER / 2));
StaticField2d.MIN_FIELD_VALUE = -StaticField2d.MAX_FIELD_VALUE;
