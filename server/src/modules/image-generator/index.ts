import Jimp from 'jimp'

const W = 64
const H = 64

const R = 242 / 256
const G = 89 / 256
const B = 89 / 256

// const hex2pix = (hex: number): number[] => [hex >> 16, hex >> 8, hex >> 0]

// const combine = (hex1: number, hex2: number): number[] => hex2pix(hex1).map((n, i) => (n + (hex2 << (i * 2 * 8))))

// const f = (x: number, y: number, [r, g, b, a]: Buffer): Buffer => {
//
//
//     return Buffer.from([r * 256, g * 256, b * 256, a])
// }

const gen = (): Buffer => {
    const data: number[] = []

    for (let x = 0; x < W; ++x) {
        for (let y = 0; y < H; ++y) {
            data.push()
        }
    }

    return Buffer.from(data)
}

const test = async (): Promise<void> => {
    try {
        const img = new Jimp(W, H, 'white')

        let data: Buffer = Buffer.from([])
        // for (const {x, y, idx} of img.scanIterator(0, 0, img.bitmap.width, img.bitmap.height)) {
        //     data = Buffer.concat([data, f(x, y, img.bitmap.data.slice(idx, idx + 4))])
        // }

        data = gen()

        img.bitmap.data = data

        await img.writeAsync('./img.png')
    } catch (error) {
        console.error(error)
    }
}

(async () => {
    await test()
})()
