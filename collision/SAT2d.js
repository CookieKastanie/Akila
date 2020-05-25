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


const circleBroadTest = (colliderA, matA, colliderB, matB) => {
    const dx = matA[6] - matB[6];
    const dy = matA[7] - matB[7];
    const distanceSQR = dx * dx + dy * dy;
    const radiusDistance = colliderA.radius + colliderB.radius;
    
    return distanceSQR < (radiusDistance * radiusDistance);
}


//////////////////////////////////////////////////////////////////////////

export class SAT2d {

    static createResultBuffer() {
        return {
            axis: new Float32Array([0, 0]),
            length: 0
        };
    }

    /**
     * Retourne l'axe et la distance minimum de séparation par rapport à colliderA
     */
    static getMin(colliderA, matA, colliderB, matB, buffer = {axis: new Float32Array(2)}) {
        buffer.axis[0] = 0;
        buffer.axis[1] = 0;
        buffer.length = 0;

        if(!circleBroadTest(colliderA, matA, colliderB, matB)) return buffer;

        let diff = Infinity;
        let isColliderA = true;
        for(const axis of colliderA.axes) {
            multMat3(SAT2d.bufferN, axis, matA, 0);
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

        for(const axis of colliderB.axes) {
            multMat3(SAT2d.bufferN, axis, matB, 0);
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

        if(isColliderA) {
            buffer.axis[0] = -SAT2d.bufferB[0];
            buffer.axis[1] = -SAT2d.bufferB[1];
        } else {
            buffer.axis[0] = SAT2d.bufferB[0];
            buffer.axis[1] = SAT2d.bufferB[1];
        }
        
        buffer.length = diff;
        
        return buffer;
    }
}

SAT2d.bufferA = new Float32Array(2);
SAT2d.bufferB = new Float32Array(2);
SAT2d.bufferN = new Float32Array(2);
