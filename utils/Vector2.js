export class Vector2 {

    static create() {
        const out = new Float32Array(2);
        out[0] = 0;
        out[1] = 0;
        return out;
    }

    static clear(out) {
        out[0]  = 0;
        out[1]  = 0;
        return out;
    }

    static add(out, a, b) {
        out[0] = a[0] + b[0];
        out[1] = a[1] + b[1];
        return out;
    }

    static subtract(out, a, b) {
        out[0] = a[0] - b[0];
        out[1] = a[1] - b[1];
        return out;
    }

    static multiply(out, a, b) {
        out[0] = a[0] * b[0];
        out[1] = a[1] * b[1];
        return out;
    }

    static divide(out, a, b) {
        out[0] = a[0] / b[0];
        out[1] = a[1] / b[1];
        return out;
    }

    static min(out, a, b) {
        out[0] = Math.min(a[0], b[0]);
        out[1] = Math.min(a[1], b[1]);
        return out;
    }

    static max(out, a, b) {
        out[0] = Math.max(a[0], b[0]);
        out[1] = Math.max(a[1], b[1]);
        return out;
    }

    static length(a) {
        return Math.hypot(a[0], a[1]);
    }

    static distance(a, b) {
        return Math.hypot(b[0] - a[0], b[1] - a[1]);
    }

    static normalize(out, a) {
        let x = a[0], y = a[1];
        let len = x*x + y*y;
        if (len > 0) len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        return out;
    }

    /**
     * produit scalaire
     */
    static dot(a, b) {
        return a[0] * b[0] + a[1] * b[1];
    }

    /**
     * produit vectoriel
     */
    static cross(out, a, b) {
        let z = a[0] * b[1] - a[1] * b[0];
        out[0] = out[1] = 0;
        out[2] = z;
        return out;
    }

    /**
     * interpolation lineaire
     */
    static lerp(out, a, b, t) {
        let ax = a[0], ay = a[1];
        out[0] = ax + t * (b[0] - ax);
        out[1] = ay + t * (b[1] - ay);
        return out;
    }

    static rotate(out, a, b, angle) {
        let p0 = a[0] - b[0],
        p1 = a[1] - b[1],
        sinC = Math.sin(angle),
        cosC = Math.cos(angle);
        
        out[0] = p0 * cosC - p1 * sinC + b[0];
        out[1] = p0 * sinC + p1 * cosC + b[1];
      
        return out;
    }

    static angle(a, b) {
        let x1 = a[0],
        y1 = a[1],
        x2 = b[0],
        y2 = b[1];
        
        let len1 = x1 * x1 + y1 * y1;
        if (len1 > 0) len1 = 1 / Math.sqrt(len1);
        
        let len2 = x2 * x2 + y2 * y2;
        if (len2 > 0) len2 = 1 / Math.sqrt(len2);
        
        let cosine = (x1 * x2 + y1 * y2) * len1 * len2;
        
        if(cosine > 1.0) return 0;
        else if(cosine < -1.0) return Math.PI;
        else return Math.acos(cosine);
    }
}