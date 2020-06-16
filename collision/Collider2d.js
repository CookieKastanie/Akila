const createAxis = (x1, y1, x2, y2) => {
    const axis = new Float32Array([-(y2 - y1), (x2 - x1), 0]);
    const len = Math.hypot(axis[0], axis[1]);
    if(len > 0) {
        axis[0] = axis[0] / len;
        axis[1] = axis[1] / len;
    }

    return axis;
}

export class Collider2d {
    constructor(vertices, linked = true, loop = true) {
        this.vertices = new Array();
        this.axes = new Array();

        this.radius = 0;

        for(let i = 0; i < vertices.length; i += 2) {
            const x = vertices[i];
            const y = vertices[i + 1];

            const r = Math.hypot(x, y);
            if(r > this.radius) this.radius = r;

            this.vertices.push(new Float32Array([x, y, 1]));
        }

        const step = linked ? 2 : 4;
        const length = loop && linked ? vertices.length : vertices.length - 2;

        for(let i = 0; i < length; i += step) {
            this.axes.push(createAxis(vertices[i], vertices[i + 1], vertices[(i + 2) % vertices.length], vertices[(i + 3) % vertices.length]));
        }
    }

    getVertices() {
        return this.vertices;
    }

    getAxes() {
        return this.axes;
    }

    getRadius() {
        return this.radius;
    }
}
