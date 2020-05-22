import { BroadField3d } from './BroadField3d';

export class RayRaster3d {
    static addToField(x1, y1, z1, x2, y2, z2, field = new BroadField3d(), data) {
        field.add(x1, y1, z1, data);

        let dx = Math.abs(x2 - x1);
        let dy = Math.abs(y2 - y1);
        let dz = Math.abs(z2 - z1);

        if(x2 > x1) xs = 1;
        else xs = -1;

        if(y2 > y1) ys = 1;
        else ys = -1;

        if(z2 > z1) zs = 1;
        else zs = -1;
    
        // Driving axis is X-axis" 
        if (dx >= dy && dx >= dz) {       
            p1 = 2 * dy - dx;
            p2 = 2 * dz - dx;

            while (x1 != x2) {
                x1 += xs;

                if(p1 >= 0) {
                    y1 += ys;
                    p1 -= 2 * dx;
                }

                if(p2 >= 0) {
                    z1 += zs;
                    p2 -= 2 * dx;
                }

                p1 += 2 * dy;
                p2 += 2 * dz;

                field.add(x1, y1, z1, data);
            }
        }

        // Driving axis is Y-axis
        else if(dy >= dx && dy >= dz){     
            p1 = 2 * dx - dy;
            p2 = 2 * dz - dy;

            while (y1 != y2){
                y1 += ys;

                if(p1 >= 0) {
                    x1 += xs;
                    p1 -= 2 * dy;
                }

                if(p2 >= 0){
                    z1 += zs;
                    p2 -= 2 * dy;
                }

                p1 += 2 * dx 
                p2 += 2 * dz 
                
                field.add(x1, y1, z1, data);
            }
        }
    
        // Driving axis is Z-axis" 
        else {       
            p1 = 2 * dy - dz;
            p2 = 2 * dx - dz;

            while (z1 != z2){
                z1 += zs;

                if(p1 >= 0) {
                    y1 += ys;
                    p1 -= 2 * dz;
                }

                if(p2 >= 0){
                    x1 += xs;
                    p2 -= 2 * dz;
                }

                p1 += 2 * dy 
                p2 += 2 * dx 
                
                field.add(x1, y1, z1, data);
            }
        }
    }
}

RayRaster3d.currentField = null;
