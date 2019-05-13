export class Field2d {
    constructor(width = 10, heigth = 10, unit = 1) {
        this.unit = unit;
        this.field = new Array();

        for(let y = 0; y < heigth; ++y) {
            const ligne = new Array();

            for(let x = 0; x < width; ++x) {
                ligne.push(new Array());
            }

            this.field.push(ligne);
        }
    }

    addStaticShape(shape) {
        for(let f of shape.faces) {

        }
    }
}
