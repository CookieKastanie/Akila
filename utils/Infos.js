export class Infos {
    static getFullScreenWidth() {
        return window.screen.width;
    }

    static getFullScreenHeight() {
        return window.screen.height;
    }

    static getSimpleOrientation() {
        return Infos.getFullScreenWidth() > Infos.getFullScreenHeight() ? Infos.LANDSCAPE : Infos.PORTRAIT;
    }
}

Infos.LANDSCAPE = 'LANDSCAPE';
Infos.PORTRAIT = 'PORTRAIT';
