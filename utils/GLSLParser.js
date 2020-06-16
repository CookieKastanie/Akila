export class GLSLParser {
    constructor(params = {version: '', precision: 'precision mediump float;'}) {
        this.params = params;
    }

    getPrograms(file) {
        const progs = [
            `${this.params.version}\n${this.params.precision}\n`,
            `${this.params.version}\n${this.params.precision}\n`,
        ];
        const lines = file.split('\n');

        let mode = -1;

        for(const line of lines) {
            if(mode != 0 && line.trim().toUpperCase() == '#VERT_START') {
                mode = 0;
            } else if(mode != 1 && line.trim().toUpperCase() == '#FRAG_START') {
                mode = 1;
            } else {
                progs[mode] += `${line}\n`;
            }
        }

        return {
            vertex: progs[0],
            fragment: progs[1]
        };
    }
}
