export class Color {
    static RGB2HSL(color, buffer = new Float32Array(3)) {
        const r = Math.min(1, Math.max(0, color[0]));
        const g = Math.min(1, Math.max(0, color[1]));
        const b = Math.min(1, Math.max(0, color[2]));

        const cMax = Math.max(r, g, b);
        const cMin = Math.min(r, g, b);
        const delta = cMax - cMin;

        let h;

        if(delta == 0) h = 0;
        else if(cMax == r) h = 60 * ((g - b) / delta % 6);
        else if(cMax == g) h = 60 * ((b - r) / delta + 2);
        else h = 60 * ((r - g) / delta + 4);

        const l = (cMax + cMin) / 2;

        let s;

        if(delta == 0) s = 0;
        else s = delta / (1 - Math.abs(2 * l - 1));

        buffer[0] = h;
        buffer[1] = s;
        buffer[2] = l;

        return buffer;
    }

    static HSL2RGB(color, buffer = new Float32Array(3)) {
        const h = Math.abs(color[0]) % 360;
        const s = Math.min(1, Math.max(0, color[1]));
        const l = Math.min(1, Math.max(0, color[2]));

        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;

        const tmp = new Float32Array(3);

        if(h < 60) {
            tmp[0] = c;
            tmp[1] = x;
            tmp[2] = 0;
        } else if(60 <= h && h < 120) {
            tmp[0] = x;
            tmp[1] = c;
            tmp[2] = 0;
        } else if(120 <= h && h < 180) {
            tmp[0] = 0;
            tmp[1] = c;
            tmp[2] = x;
        } else if(180 <= h && h < 240) {
            tmp[0] = 0;
            tmp[1] = x;
            tmp[2] = c;
        } else if(240 <= h && h < 300) {
            tmp[0] = x;
            tmp[1] = 0;
            tmp[2] = c;
        } else {
            tmp[0] = c;
            tmp[1] = 0;
            tmp[2] = x;
        }

        buffer[0] = tmp[0] + m;
        buffer[1] = tmp[1] + m;
        buffer[2] = tmp[2] + m;

        return buffer;
    }
}
