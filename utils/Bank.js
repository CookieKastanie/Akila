const loadMedia =  async (bank, name) => {
    return new Promise((resolve, reject) => {
        const elem = document.createElement(bank.mediaType);
        if(bank.mediaType == Bank.IMAGE) elem.onload = () => {resolve(elem);};
        else elem.onloadedmetadata = () => {resolve(elem);};
        elem.onerror = () => { reject(); }
        elem.src = `${bank.dir}/${name}${bank.extension}`;
    });
}

const loadFile = async (bank, name) => {
    return fetch(`${bank.dir}/${name}${bank.extension}`)
    .then(data => {
        if(data.ok) return data[bank.mediaType]();
        else return Promise.reject();
    });
}

export class Bank {
    constructor(directory, fileNames, options = {extension: null, mediaType: null, treatment: null, default: null}){
        this.setDirectory(directory);
        this.setFileList(fileNames);
        this.setOptions(options);
    }

    setDirectory(dir = './'){
        this.dir = dir;
        return this;
    }

    setFileList(fileNames = []){
        this.names = fileNames.map(str => str.trim());
        return this;
    }

    setOptions(options = {extension: null, mediaType: null, treatment: null, default: null}){
        this.extension = options.extension ? `.${options.extension}` : "";
        this.mediaType = options.mediaType || Bank.TEXT;
        this.treatment = options.treatment || null;
        this.default = options.default || undefined;
        return this;
    }

    initForLoad(){
        if(this.mediaType === 'image') this.mediaType = Bank.IMAGE;

        if(this.mediaType === Bank.IMAGE || this.mediaType === Bank.VIDEO || this.mediaType === Bank.AUDIO) this.requeteMode = 'media';
        else this.requeteMode = 'file';

        this.files = new Map();
        if(typeof this.treatment !== 'function') this.treatment = null;
    }

    async load(stateEvent, startMessage = '') {
      this.initForLoad();
      if(typeof stateEvent !== 'function') stateEvent = () => {};

      return new Promise((resolve, reject) => {
        if(this.names.length == 0) {
            resolve();
            return;
        }

        const loadFunc = this.requeteMode === 'media' ? loadMedia : loadFile;

        this.count = 0;

        stateEvent(0, startMessage);
        
        for(const name of this.names) {
            loadFunc(this, name).then(async file => {
                if(this.treatment) this.files.set(name, await this.treatment(file, name));
                else this.files.set(name, file);

                ++this.count;

                stateEvent(Math.floor((this.count / this.names.length) * 100), name);
                
                if(this.count == this.names.length) resolve();
            }).catch(e => {
                console.warn(`Impossible de charger le fichier '${this.dir}/${name}${this.extension}'\n${e}`);
                reject();
            });
        }
      });
    }

    get(name){
        const f = this.files.get(name);
        if(!f) return this.files.get(this.default);
        return f;
    }

    getAll(){
        return this.files;
    }
}

Bank.IMAGE = 'img';
Bank.VIDEO = 'video';
Bank.AUDIO = 'audio';
Bank.ARRAY_BUFFER = 'arrayBuffer';
Bank.BLOB = 'blob';
Bank.FORM_DATA = 'formData';
Bank.JSON = 'json';
Bank.TEXT = 'text';
