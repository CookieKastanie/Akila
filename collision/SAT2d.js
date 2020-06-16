import { vec3 } from '../math';

const dot = (v1, v2) => {
    return v1[0] * v2[0] + v1[1] * v2[1];
}

let multMat3;

//////////////////////////////////////////////////////////////////////

const projectionMin = (vertices, mat) => {
    let min = Infinity;
    
    for(const vertex of vertices) {
        multMat3(SAT2d.bufferA, vertex, mat);
        const val = dot(SAT2d.bufferA, SAT2d.bufferN);

        if(val < min) min = val;
    }

    return min;
}

const projectionMax = (vertices, mat) => {
    let max = -Infinity;

    for(const vertex of vertices) {
        multMat3(SAT2d.bufferA, vertex, mat);
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

    static setMatMode(mode) {
        if(mode == SAT2d.MAT3) multMat3 = vec3.transformMat3;
        else if(mode == SAT2d.MAT4XY) multMat3 = (out, a, m) => {
            let x = a[0], z = a[1], w = a[2];
            out[0] = m[0] * x + m[8] * z + m[12] * w;
            out[1] = m[1] * x + m[9] * z + m[13] * w;
            out[2] = m[2] * x + m[10] * z + m[14] * w;
 
            return out;
        }
        else if(mode == SAT2d.MAT4XZ) multMat3 = (out, a, m) => {
            let x = a[0], z = a[1], w = a[2];
            out[0] = m[0] * x + m[8] * z + m[12] * w;
            out[2] = m[1] * x + m[9] * z + m[13] * w;
            out[1] = m[2] * x + m[10] * z + m[14] * w;
 
            return out;
        }
    }

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
            multMat3(SAT2d.bufferN, axis, matA);
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
            multMat3(SAT2d.bufferN, axis, matB);
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

SAT2d.setMatMode(SAT2d.MAT3);

SAT2d.bufferA = new Float32Array(3);
SAT2d.bufferB = new Float32Array(3);
SAT2d.bufferN = new Float32Array(3);

SAT2d.MAT3 = 0;
SAT2d.MAT4XY = 1;
SAT2d.MAT4XZ = 2;
