export class Bank {
  constructor(repertoire, listeNomFichiers, options){
    this.setDirectory(repertoire);
    this.setFileListe(listeNomFichiers);
    this.setOptions(options);
  }

  setDirectory(rep = "./"){
    this.rep = rep;
    return this;
  }

  setFileListe(listeNomFichiers = []){
    this.noms = listeNomFichiers.map(str => str.trim());
    return this;
  }

  setOptions(options = {}){
    this.extension = options.extension ? `.${options.extension}` : "";
    this.mediaType = options.mediaType || "text";
    this.treatment = options.treatment || null;
    this.default = options.default || undefined;
    return this;
  }

  initForLoad(){
    if(this.mediaType === "image") this.mediaType = "img";

    if(this.mediaType === "img" ||
       this.mediaType === "video" ||
       this.mediaType === "audio")
       this.requeteMode = "media";
    else this.requeteMode = "file";

    if(this.mediaType !== "arrayBuffer" &&
       this.mediaType !== "blob" &&
       this.mediaType !== "formData" &&
       this.mediaType !== "json" && this.mediaType === "text"
     ) this.mediaType = "text";

    this.fichiers = new Object();
  }

  async loadMedia(nom){
    return new Promise((resolve, reject) => {
      const elem = document.createElement(this.mediaType);
      if(this.mediaType == "img") elem.onload = () => {resolve(elem);};
      else elem.onloadedmetadata = () => {resolve(elem);};
      elem.onerror = () => { reject(); }
      elem.src = `${this.rep}/${nom}${this.extension}`;
    });
  }

  async loadFile(nom){
    return fetch(`${this.rep}/${nom}${this.extension}`)
    .then(data => {
      if(data.ok) return data[this.mediaType]();
      else return Promise.reject();
    })
  }

  async load(stateEvent){
    this.initForLoad();
    if(typeof stateEvent !== "function") stateEvent = (p) => {};

    return new Promise(async (resolve, reject) => {
      if(this.noms.length == 0) {
        stateEvent(100);
        resolve();
      } else {
        let nbTotalFichier = this.noms.length;

        stateEvent(0);

        let requete;
        if(this.requeteMode === "media") requete = this.loadMedia.bind(this);
        else requete = this.loadFile.bind(this);;

        for (const nom of this.noms) {
          await requete(nom)
          .then(async file => {
            if(typeof this.treatment === "function") this.fichiers[nom] = await this.treatment(file);
            else this.fichiers[nom] = file;
            --nbTotalFichier;

            stateEvent(Math.floor((this.noms.length - nbTotalFichier) / this.noms.length * 100));
          })
          .catch(e => {
            console.warn(`Impossible de charger le fichier '${this.rep}/${nom}${this.extension}'\n${e}`);
          });
        }

        resolve();
      }
    })
  }

  get(nom){
    const f = this.fichiers[nom];
    if (!f) return this.fichiers[this.default];
    return f;
  }

  getAll(){
    return this.fichiers;
  }
}
