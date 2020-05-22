import { MainMixer } from './MainMixer';

const DEFAULT_MESSAGE = `Voulez vous activer l'audio sur cette page ?`;

const DEFAULT_FOOTER_MESSAGE = ``;

const HTML = ``;


const CSS = 
`
#bg {
    left: 0; top: 0;
    position: absolute;
    background-color: #2d3436cc;
    width: 100%;
    height: 100%;
}
  
#popup {
    text-align: center;
    -ms-user-select: none;
    user-select: none;
    
    cursor: default;
    font-family: "Courier New";
    font-size: 1.2em;
    color: #ecf0f1;
    font-weight: bold;
      
    background-image: url("data:image/svg+xml;utf8, <svg xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 100 100' preserveAspectRatio='none'><path d='m0,30 l20,-30 l80,0 l0,70 l-20,30 l-80,0z' style='fill: %2334495e;'></path></svg>");
    
    background-size: 100% 100%;
    
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -4em;
    margin-left: -17em;
    width: 30em;
    height: 5em;
    padding: 2em;
}
  
#popup p {
    margin-top: 0.5em;
}
  
.btn {
    font-size: 0.9em;
    color: #011010;
    font-family: "Courier New";
    border: none;
    padding: 0.5em;
    font-weight: bold;
}
  
.btn:hover {
    cursor: pointer;
}
  
#acc {
    background-color: #2ecc71;
    width: 60%;
    margin-right: 0.5em;
}
  
#acc:hover {
    background-color: #3edc81;
}
  
#ref {
    background-color: #e74c3c;
    width: 30%;
}
  
#ref:hover {
    background-color: #f75c4c;
}`;




/*

<svg class="real" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" width="500" height="120" viewBox="0 0 400 120" preserveAspectRatio="none"><path class="real" id="real" d="m0,30 l60,-30 l340,0 l0,90 l-60,30 l-340,0z" style="fill: rgba(23, 111, 165, 0.9);"></path>
    </svg>


*/



export const permissionPopup = (message, footerMessage) => {
    return new Promise(accept => {
        if(message == undefined) message = DEFAULT_MESSAGE;
        if(footerMessage == undefined) footerMessage = DEFAULT_FOOTER_MESSAGE;

        const head = document.getElementsByTagName('head')[0];
        const body = document.getElementsByTagName('body')[0];

        const style = document.createElement('style');
        style.innerHTML = CSS;

        const bg = document.createElement('div');
        bg.id = 'bg';

        const div = document.createElement('div');
        div.id = 'popup';

        const p = document.createElement('p');
        p.innerHTML = message;

        const acceptButton = document.createElement('button');
        acceptButton.className = 'btn';
        acceptButton.id = 'acc';
        acceptButton.innerHTML = 'Accepter';

        


        acceptButton.onclick = () => {
            MainMixer.ctx.resume().then(() => {
                console.log('Contexte audio restauré ✅');
            }).catch(e => {
                console.error(e);
            });

            body.removeChild(bg);
            body.removeChild(div);
            head.removeChild(style);

            accept(true);
        }

        const declineButton = document.createElement('button');
        declineButton.className = 'btn';
        declineButton.id = 'ref';
        declineButton.innerHTML = 'Refuser';





        declineButton.onclick = () => {
            body.removeChild(bg);
            body.removeChild(div);
            head.removeChild(style);

            accept(false);
        }




        div.appendChild(p);
        div.appendChild(acceptButton);
        div.appendChild(declineButton);

        head.appendChild(style);
        body.appendChild(bg);
        body.appendChild(div);
    });
}
