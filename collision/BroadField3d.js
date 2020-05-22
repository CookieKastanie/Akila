export class BroadField3d {
    constructor() {
        this.field = new Map();
    }

    add(x, y, z, elem) {
        const index = BroadField3d.coordToIndex(x, y, z);

        let set = this.field.get(index);

        if(!set) {
            set = new Set();
            this.field.set(index, set);
        }

        set.add(elem);
    }

    query(x, y, z, buffer = new Set()) {
        const index = BroadField3d.coordToIndex(x, y, z);

        const set = this.field.get(index);
        if(set) {
            for(let elem of set) buffer.add(elem);
        }

        return buffer;
    }

    static coordToIndex(x, y, z) {
        return Math.floor(x) + BroadField2d.MAX_FIELD_VALUE * (Math.floor(y) + BroadField2d.MAX_FIELD_VALUE * Math.floor(z));
    }

    clearAll() {
        this.field.clear();
    }
}

BroadField3d.MAX_FIELD_VALUE = Math.floor(Math.cbrt(Number.MAX_SAFE_INTEGER / 3));
BroadField3d.MIN_FIELD_VALUE = -BroadField3d.MAX_FIELD_VALUE;
