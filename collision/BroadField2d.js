export class BroadField2d {
    constructor() {
        this.field = new Map();
    }

    add(x, y, elem) {
        const index = BroadField2d.coordToIndex(x, y);

        let set = this.field.get(index);

        if(!set) {
            set = new Set();
            this.field.set(index, set);
        }

        set.add(elem);
    }

    query(x, y, buffer = new Set()) {
        const index = BroadField2d.coordToIndex(x, y);

        const set = this.field.get(index);
        if(set) {
            for(let elem of set) buffer.add(elem);
        }

        return buffer;
    }

    static coordToIndex(x, y) {
        return Math.floor(x) * BroadField2d.MAX_FIELD_VALUE + Math.floor(y);
    }

    clearAll() {
        this.field.clear();
    }
}

BroadField2d.MAX_FIELD_VALUE = Math.floor(Math.sqrt(Number.MAX_SAFE_INTEGER / 2));
BroadField2d.MIN_FIELD_VALUE = -BroadField2d.MAX_FIELD_VALUE;
