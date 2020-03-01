import { BroadField2d } from './BroadField2d';

export class RayRaster2d {
    static addToField(x0, y0, x1, y1, field = new BroadField2d(), data) {
        /*const dy = y1 - y0;
        const dx = x1 - x0;
        
        if(dx == 0 && dy == 0) {
            field.add(x0, y0, data);
            return;
        }*/

        RayRaster2d.currentField = field;

        const xDir = (x1 > x0);
        const yDir = (y1 > y0);
        const diff = (xDir ^ yDir) ? 1 : 0;

        if (xDir) RayRaster2d._lookX(x0, y0, x1, y1, 0, data);
        else RayRaster2d._lookX(x1, y1, x0, y0, diff, data);
        
        if (yDir) RayRaster2d._lookY(x0, y0, x1, y1, 0, data);
        else RayRaster2d._lookY(x1, y1, x0, y0, diff, data);
    }

    static _lookX(x0, y0, x1, y1, dec, data) {
        RayRaster2d.currentField.add(x0, y0, data);

        const dy = y1 - y0;
        const dx = x1 - x0;
        const m = dy / dx;

        for(let x = Math.floor(x0) + 1; x <= x1; ++x) {
            const y = m * (x - x0) + y0;
            RayRaster2d.currentField.add(x - dec, y, data);
        }
    }

    static _lookY(x0, y0, x1, y1, dec, data) {
        RayRaster2d.currentField.add(x0, y0, data);

        const dy = y1 - y0;
        const dx = x1 - x0;
        const m = dx / dy;

        for(let y = Math.floor(y0) + 1; y <= y1; ++y) {
            const x =  m * (y - y0) + x0;
            RayRaster2d.currentField.add(x, y - dec, data);
        }
    }
}

RayRaster2d.currentField = null;
