"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jimp_1 = __importDefault(require("jimp"));
const W = 64;
const H = 64;
const R = 242 / 256;
const G = 89 / 256;
const B = 89 / 256;
const gen = () => {
    const data = [];
    for (let x = 0; x < W; ++x) {
        for (let y = 0; y < H; ++y) {
            data.push();
        }
    }
    return Buffer.from(data);
};
const test = async () => {
    try {
        const img = new jimp_1.default(W, H, 'white');
        let data = Buffer.from([]);
        data = gen();
        img.bitmap.data = data;
        await img.writeAsync('./img.png');
    }
    catch (error) {
        console.error(error);
    }
};
(async () => {
    await test();
})();
