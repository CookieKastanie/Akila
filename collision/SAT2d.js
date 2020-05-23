const dot = (v1, v2) => {
    return v1[0] * v2[0] + v1[1] * v2[1];
}

const multMat3 = (out, a, m, z = 1) => {
    const x = a[0], y = a[1];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];

    return out;
}

//////////////////////////////////////////////////////////////////////

const projectionMin = (vertices, mat) => {
    let min = Infinity;
    
    for(const vertex of vertices) {
        multMat3(SAT2d.bufferA, vertex, mat, 1);
        const val = dot(SAT2d.bufferA, SAT2d.bufferN);

        if(val < min) min = val;
    }

    return min;
}

const projectionMax = (vertices, mat) => {
    let max = -Infinity;

    for(const vertex of vertices) {
        multMat3(SAT2d.bufferA, vertex, mat, 1);
        const val = dot(SAT2d.bufferA, SAT2d.bufferN);

        if(val > max) max = val;
    }

    return max;
}

///////////////////////////////////////////////////////////////////////////

export class SAT2d {

    static createResultBuffer() {
        return {
            axe: new Float32Array([0, 0]),
            min: 0
        };
    }

    /**
     * Retourne l'axe et la distance minimum de séparation par rapport à colliderA
     */
    static getMin(colliderA, matA, colliderB, matB, buffer = {axe: new Float32Array(2)}) {
        buffer.axe[0] = 0;
        buffer.axe[1] = 0;
        buffer.min = 0;

        let diff = Infinity;
        let isColliderA = true;
        for(const axe of colliderA.axes) {
            multMat3(SAT2d.bufferN, axe.direction, matA, 0);
            const max = projectionMax(colliderA.vertices, matA);
            const min = projectionMin(colliderB.vertices, matB);

            const o = max - min;

            if(o <= 0) return buffer;
            if(diff > o) {
                diff = o;
                SAT2d.bufferB[0] = SAT2d.bufferN[0];
                SAT2d.bufferB[1] = SAT2d.bufferN[1];
            }
        }

        for(const axe of colliderB.axes) {
            multMat3(SAT2d.bufferN, axe.direction, matB, 0);
            const min = projectionMin(colliderA.vertices, matA);
            const max = projectionMax(colliderB.vertices, matB);

            const o = max - min;

            if(o <= 0) return buffer;
            if(diff > o) {
                diff = o;
                isColliderA = false;
                SAT2d.bufferB[0] = SAT2d.bufferN[0];
                SAT2d.bufferB[1] = SAT2d.bufferN[1];
            }
        }

        if(isColliderA) buffer.min = -diff;
        else buffer.min = diff;
        
        buffer.axe[0] = SAT2d.bufferB[0];
        buffer.axe[1] = SAT2d.bufferB[1];

        return buffer;
    }
}

SAT2d.bufferA = new Float32Array(2);
SAT2d.bufferB = new Float32Array(2);
SAT2d.bufferN = new Float32Array(2);
