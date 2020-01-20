export class WebSocketUtils {
    static genPackage(data, opcode = 1) {
        let len = data.length;

        let d;
        let decalage;

        if(len <= 125) {
            decalage = 2;
            d = new Uint8Array(len + decalage);
            d[0] = 0b10000000 | opcode;
            d[1] = len;
        } else if(len <= 65535) {
            decalage = 4;
            d = new Uint8Array(len + decalage);
            d[0] = 0b10000000 | opcode;
            d[1] = 0b01111110;
            d[2] = (0xF0 & len) >> 8;
            d[3] = (0x0F & len);
        } else {
            decalage = 10;
            d = new Uint8Array(len + decalage);
            d[0] = 0b10000000 | opcode;
            d[1] = 0b01111111;
            d[2] = (0xF0000000 & len) >> 56;
            d[3] = (0x0F000000 & len) >> 48;
            d[4] = (0x00F00000 & len) >> 40;
            d[5] = (0x000F0000 & len) >> 32;
            d[6] = (0x0000F000 & len) >> 24;
            d[7] = (0x00000F00 & len) >> 16;
            d[8] = (0x000000F0 & len) >> 8;
            d[9] = (0x0000000F & len);
        }
        
        if(opcode == 1) {
            for(let i = 0; i < len; ++i) {
                d[i + decalage] = data.charCodeAt(i);
            }
        } else {
            for(let i = 0; i < len; ++i) {
                d[i + decalage] = data[i];
            }
        }

        return Buffer.from(d);
    }

    static unmask(mask, len, payloadFirstByte, data, opcode){
        let decoded = null;
        
        if(opcode == 1) {
            decoded = "";
            for (let i = 0; i < len; i++) {
                decoded += String.fromCharCode(data[i + payloadFirstByte] ^ mask[i % 4]);
            }
        } else {
            decoded = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                decoded[i] = data[i + payloadFirstByte] ^ mask[i % 4];
              }
        }
      
        return decoded;
    }
}

TCPServerUtils.crypto = require('crypto');
TCPServerUtils.magicString = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
