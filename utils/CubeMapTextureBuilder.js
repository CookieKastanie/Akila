import { CubeMapTexture } from '../webgl/Texture';

const getClippedRegion = (image, x, y, width, height) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(image, x, y, width, height,  0, 0, width, height);

    return canvas;
}

export class CubeMapTextureBuilder {
    static fromSingleImage(img) {
        const datas = new Array();

        const width = img.width / 4;
        const height = img.height / 3;
        
        datas.push(getClippedRegion(img, 2 * width, 1 * height, width, height)); // right
        datas.push(getClippedRegion(img, 0 * width, 1 * height, width, height)); // left
        datas.push(getClippedRegion(img, 1 * width, 0 * height, width, height)); // top
        datas.push(getClippedRegion(img, 1 * width, 2 * height, width, height)); // base
        datas.push(getClippedRegion(img, 1 * width, 1 * height, width, height)); // front
        datas.push(getClippedRegion(img, 3 * width, 1 * height, width, height)); // back

        return new CubeMapTexture(datas);
    }
}
