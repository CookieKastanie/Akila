export class Collider3d {
    constructor(vertices, normals) {
        this.vertices = new Array();
        this.axes = new Array();

        this.radius = 0;

        for(let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const y = vertices[i + 1];
            const z = vertices[i + 2];

            const r = Math.hypot(x, y, z);
            if(r > this.radius) this.radius = r;

            this.vertices.push(new Float32Array([x, y, z, 1]));
        }


        for(let i = 0; i < normals.length; i += 3) {
            const x = normals[i];
            const y = normals[i + 1];
            const z = normals[i + 2];

            this.axes.push(new Float32Array([x, y, z, 0]));
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
