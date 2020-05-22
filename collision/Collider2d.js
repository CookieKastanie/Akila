class Axes2d {
    constructor(x1, y1, x2, y2) {
        this.origin = new Float32Array([x1, y1]);
        this.direction = new Float32Array([-(y2 - y1), (x2 - x1)]);
        const len = Math.hypot(this.direction[0], this.direction[1]);
        if(len > 0) {
            this.direction[0] = this.direction[0] / len;
            this.direction[1] = this.direction[1] / len;
        }
    }
}

export class Collider2d {
    constructor(vertices, linked = true, loop = true) {
        this.vertices = new Array();
        this.axes = new Array();

        for(let i = 0; i < vertices.length; i += 2) {
            this.vertices.push(new Float32Array([vertices[i], vertices[i + 1]]));
        }

        const step = linked ? 2 : 4;
        const length = loop && linked ? vertices.length : vertices.length - 2;

        for(let i = 0; i < length; i += step) {
            this.axes.push(new Axes2d(vertices[i], vertices[i + 1], vertices[(i + 2) % vertices.length], vertices[(i + 3) % vertices.length]));
        }
    }
}
