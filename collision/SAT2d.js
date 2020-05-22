const dot = (v1, v2) => {
    return v1[0] * v2[0] + v1[1] * v2[1];
}

const multMat3 = (out, a, m, z = 1) => {
    const x = a[0], y = a[1];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];

    return out;
}

export class SAT2d {
    static getMin(colliderA, matA, colliderB, matB, buffer = {axe: new Float32Array(2)}) {
        buffer.min = 1000;

        //////////////////////////////////////////////////////////
        /*for(const axe of colliderA.axes) {
            multMat3(SAT2d.bufferN, axe.direction, matA, 0);
            multMat3(SAT2d.bufferA, axe.origin, matA, 1);

            const ref = dot(SAT2d.bufferA, SAT2d.bufferN);

            let localMin = 0;
            for(const vertex of colliderB.vertices) {
                multMat3(SAT2d.bufferB, vertex, matB, 1);
                const val = dot(SAT2d.bufferB, SAT2d.bufferN);
                const pos = val - ref;

                if(pos >= 0) continue;

                if(pos > buffer.min) {
                    localMin = pos;
                    buffer.min = pos;
                    buffer.axe[0] = SAT2d.bufferN[0];
                    buffer.axe[1] = SAT2d.bufferN[1];
                }
            }

            if(localMin >= 0) return null;
        }*/
        //////////////////////////////////////////////////////////

        for(const axe of colliderB.axes) {
            multMat3(SAT2d.bufferN, axe.direction, matB, 0);
            multMat3(SAT2d.bufferA, axe.origin, matB, 1);

            const ref = dot(SAT2d.bufferA, SAT2d.bufferN);

            let localMin = 0;
            for(const vertex of colliderA.vertices) {
                multMat3(SAT2d.bufferB, vertex, matA, 1);
                const val = dot(SAT2d.bufferB, SAT2d.bufferN);
                const pos = val - ref;

                //if(pos >= 0) continue;

                if(Math.abs(pos) < buffer.min) {
                //    localMin = pos;
                    buffer.min = pos;
                    buffer.axe[0] = SAT2d.bufferN[0];
                    buffer.axe[1] = SAT2d.bufferN[1];
                }

                break;
            }

            //if(localMin >= 0) return null;
        }

        return buffer;
    }
}

SAT2d.bufferA = new Float32Array(2);
SAT2d.bufferB = new Float32Array(2);
SAT2d.bufferN = new Float32Array(2);
