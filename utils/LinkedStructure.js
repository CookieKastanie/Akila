export class LinkedList {
    constructor(){
        this.head = null;
        this.tail = null;
        this.count = 0;
    }

    isEmpty() {
        return this.count === 0;
    }

    get lenght() {
        return this.count;
    }

    addFirst(data){
        const node = {
            data: data,
            next: null
        }

        const tmpNode = this.head;
        this.head = node;
        this.head.next = tmpNode;
        ++this.count;

        if(this.count === 1) this.tail = this.head;
    }

    addLast(data){
        const node = {
            data: data,
            next: null
        }

        if(this.count === 0) this.head = node;
        else this.tail.next = node;

        this.tail = node;
        ++this.count;
    }

    deleteFisrt(){
        if(this.count === 0) return;

        this.head = this.head.next;
        --this.count;

        if(this.count === 0) this.tail = null;
    }

    deleteLast(){
        if(this.count === 0) {
            return;
        } else if(this.count === 1) {
            this.tail = null;
            this.head = null;
        } else {
            let p = this.head;
            while(p.next !== this.tail) {
                p = p.next;
            }
            
            p.next = null;
            this.tail = p;
        }

        --this.count;
    }

    deleteFromIndex(position) {
        if(position <= 0) this.deleteFisrt();
        else if(position >= this.count - 1) this.deleteLast();
        else {
            let p = this.head, k = 0, q;
            while(p !== null && k < position) {
                ++k;
                q = p;
                p = p.next;
            }

            q.next = p.next;
            --this.count;
        }
    }

    delete(obj) {
        let p = this.head, q;
        if(p.data == obj) {
            this.deleteFisrt();
        } else {
            while(p !== null && obj != p.data) {
                q = p;
                p = p.next;
            }
    
            q.next = p.next;
            --this.count;
        }
    }

    [Symbol.iterator]() {
        const buffer = {
            value: null,
            done: false
        }

        let currentNode = this.head;

        return {
            next() {
                if(currentNode) {
                    buffer.value = currentNode.data;
                    currentNode = currentNode.next;
                } else {
                    buffer.done = true;
                }

                return buffer;
            }
        }
    }
}

export class LinkedStructure {
    constructor() {
        this.linkedLists = new Object();
        this.removeBuffers = new Object();

        this.names = new Array();
    }

    getNames() {
        return this.names;
    }

    createList(name) {
        const list = new LinkedList();
        this.addList(name, list);
        return list;
    }

    addList(name, list) {
        if(!(list instanceof LinkedList)) return;
        this.linkedLists[name] = list;
        this.removeBuffers[name] = new LinkedList();
        this.names.push(name);
    }

    getList(name) {
        return this.linkedLists[name];
    }

    add(name, obj) {
        this.linkedLists[name].addLast(obj);
    }

    delete(name, obj) {
        this.removeBuffers[name].addLast(obj);
    }

    clear() {
        for (const name of this.names) {
            const list = this.linkedLists[name];
            const buffer = this.removeBuffers[name];

            for (const obj of buffer) {
                list.delete(obj);
                buffer.deleteFisrt();
            }
        }
    }

    [Symbol.iterator]() {
        const buffer = {
            value: null,
            done: false
        }

        const names = this.names;
        let nameIndex = 0;
        const linkedLists = this.linkedLists;

        let currentList = this.linkedLists[names[nameIndex]];

        if(!currentList || !currentList.head) return {
            next() {
                return {done: true};
            }
        }

        let currentNode = currentList.head;

        return {
            next() {
                if(currentNode) {
                    buffer.value = currentNode.data;
                    currentNode = currentNode.next;
                } else {
                    currentList = linkedLists[names[++nameIndex]];

                    if(!currentList || !currentList.head) buffer.done = true;
                    else {
                        currentNode = currentList.head.next;
                        buffer.value = currentList.head.data;
                    }
                }

                return buffer;
            }
        }
    }
}
