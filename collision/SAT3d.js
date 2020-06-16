import { vec4, vec3 } from '../math';

const dot = (v1, v2) => {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}


window.dot = dot
window.vec4 = vec4
window.vec3 = vec3

let multMat4;

//////////////////////////////////////////////////////////////////////

const projectionMin = (vertices, mat) => {
    let min = Infinity;
    
    for(const vertex of vertices) {
        multMat4(SAT3d.bufferA, vertex, mat);
        const val = dot(SAT3d.bufferA, SAT3d.bufferN);

        //if(val < min) min = val;

        if(val < min) {
            min = val;

            SAT3d.bufferC[0] = SAT3d.bufferA[0];
            SAT3d.bufferC[1] = SAT3d.bufferA[1];
            SAT3d.bufferC[2] = SAT3d.bufferA[2];
        }
    }

    return min;
}

const projectionMax = (vertices, mat) => {
    let max = -Infinity;

    for(const vertex of vertices) {
        multMat4(SAT3d.bufferA, vertex, mat);
        const val = dot(SAT3d.bufferA, SAT3d.bufferN);

        if(val > max) max = val;
    }

    return max;
}

///////////////////////////////////////////////////////////////////////////


const circleBroadTest = (colliderA, matA, colliderB, matB) => {
    const dx = matA[12] - matB[12];
    const dy = matA[13] - matB[13];
    const dz = matA[14] - matB[14];
    const distanceSQR = dx * dx + dy * dy + dz * dz;
    const radiusDistance = colliderA.radius + colliderB.radius;
    
    return distanceSQR < (radiusDistance * radiusDistance);
}


//////////////////////////////////////////////////////////////////////////

export class SAT3d {

    static setMatMode(mode) {
        /*if(mode == SAT3d.MAT3) multMat4 = vec4.transformMat4;
        else if(mode == SAT3d.MAT4XY) multMat3 = (out, a, m) => {
            let x = a[0], z = a[1], w = a[2];
            out[0] = m[0] * x + m[8] * z + m[12] * w;
            out[1] = m[1] * x + m[9] * z + m[13] * w;
            out[2] = m[2] * x + m[10] * z + m[14] * w;
 
            return out;
        }
        else if(mode == SAT3d.MAT4XZ) multMat3 = (out, a, m) => {
            let x = a[0], z = a[1], w = a[2];
            out[0] = m[0] * x + m[8] * z + m[12] * w;
            out[2] = m[1] * x + m[9] * z + m[13] * w;
            out[1] = m[2] * x + m[10] * z + m[14] * w;
 
            return out;
        }*/

        multMat4 = vec4.transformMat4;
    }

    static createResultBuffer() {
        return {
            axis: new Float32Array([0, 0, 0]),
            length: 0
        };
    }

    /**
     * Retourne l'axe et la distance minimum de séparation par rapport à colliderA
     */
    static getMin(colliderA, matA, colliderB, matB, buffer = {axis: new Float32Array(3)}) {
        buffer.axis[0] = 0;
        buffer.axis[1] = 0;
        buffer.axis[2] = 0;
        buffer.length = 0;

        buffer.minPoint = new Float32Array(3);

        //if(!circleBroadTest(colliderA, matA, colliderB, matB)) return buffer;

        let diff = Infinity;
        let isColliderA = true;
        for(const axis of colliderA.axes) {
            multMat4(SAT3d.bufferN, axis, matA);
            const max = projectionMax(colliderA.vertices, matA);
            const min = projectionMin(colliderB.vertices, matB);

            const o = max - min;

            if(o <= 0) return buffer;
            if(diff > o) {
                diff = o;
                SAT3d.bufferB[0] = SAT3d.bufferN[0];
                SAT3d.bufferB[1] = SAT3d.bufferN[1];
                SAT3d.bufferB[2] = SAT3d.bufferN[2];


                buffer.minPoint[0] = SAT3d.bufferC[0];
                buffer.minPoint[1] = SAT3d.bufferC[1];
                buffer.minPoint[2] = SAT3d.bufferC[2];
            }
        }

        for(const axis of colliderB.axes) {
            multMat4(SAT3d.bufferN, axis, matB);
            const min = projectionMin(colliderA.vertices, matA);
            const max = projectionMax(colliderB.vertices, matB);

            const o = max - min;

            if(o <= 0) return buffer;
            if(diff > o) {
                diff = o;
                isColliderA = false;
                SAT3d.bufferB[0] = SAT3d.bufferN[0];
                SAT3d.bufferB[1] = SAT3d.bufferN[1];
                SAT3d.bufferB[2] = SAT3d.bufferN[2];

                buffer.minPoint[0] = SAT3d.bufferC[0];
                buffer.minPoint[1] = SAT3d.bufferC[1];
                buffer.minPoint[2] = SAT3d.bufferC[2];
            }
        }


        if(isColliderA) {
            buffer.axis[0] = -SAT3d.bufferB[0];
            buffer.axis[1] = -SAT3d.bufferB[1];
            buffer.axis[2] = -SAT3d.bufferB[2];
        } else {
            buffer.axis[0] = SAT3d.bufferB[0];
            buffer.axis[1] = SAT3d.bufferB[1];
            buffer.axis[2] = SAT3d.bufferB[2];
        }
        
        buffer.length = diff;
       
        return buffer;
    }
}

SAT3d.setMatMode();

SAT3d.bufferA = new Float32Array(4);
SAT3d.bufferB = new Float32Array(4);
SAT3d.bufferC = new Float32Array(4);
SAT3d.bufferN = new Float32Array(4);
