export class Vector3 {

    static create() {
        const out = new Float32Array(3);
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        return out;
    }

    static clear(out) {
        out[0]  = 0;
        out[1]  = 0;
        out[2]  = 0;
        return out;
    }

    static add(out, a, b) {
        out[0] = a[0] + b[0];
        out[1] = a[1] + b[1];
        out[2] = a[2] + b[2];
        return out;
    }

    static subtract(out, a, b) {
        out[0] = a[0] - b[0];
        out[1] = a[1] - b[1];
        out[2] = a[2] - b[2];
        return out;
    }

    static multiply(out, a, b) {
        out[0] = a[0] * b[0];
        out[1] = a[1] * b[1];
        out[2] = a[2] * b[2];
        return out;
    }

    static divide(out, a, b) {
        out[0] = a[0] / b[0];
        out[1] = a[1] / b[1];
        out[2] = a[2] / b[2];
        return out;
    }

    static min(out, a, b) {
        out[0] = Math.min(a[0], b[0]);
        out[1] = Math.min(a[1], b[1]);
        out[2] = Math.min(a[2], b[2]);
        return out;
    }

    static max(out, a, b) {
        out[0] = Math.max(a[0], b[0]);
        out[1] = Math.max(a[1], b[1]);
        out[2] = Math.max(a[2], b[2]);
        return out;
    }

    static length(a) {
        return Math.hypot(a[0], a[1], a[2]);
    }

    static distance(a, b) {
        return Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    }

    static normalize(out, a) {
        let x = a[0], y = a[1], z = a[2];
        let len = x*x + y*y + z*z;
        if (len > 0) len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
        return out;
    }

    /**
     * interpolation lineaire
     */
    static lerp(out, a, b, t) {
        let ax = a[0], ay = a[1], az = a[2];
        out[0] = ax + t * (b[0] - ax);
        out[1] = ay + t * (b[1] - ay);
        out[2] = az + t * (b[2] - az);
        return out;
    }
}
