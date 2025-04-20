

//% block="Data buffer" color="#7C9BDE" icon="\uf187"
namespace DataBuffer {

    const bytemax: number = Math.round(8 ** 2 * 4)
    
    function bitcalc(nv: number) {
        const bsum = bytemax, isum = Math.ceil(Math.log(nv) / Math.log(bsum))
        return isum
    }

    /**
     * convert string to buffer string
     * @param string input to encode
     * @returns after convert string to buffer string
     */
    //% blockid=databuff_encode_string
    //% block="get string of $txtv convert to buffer"
    //% group="string"
    //% weight=100
    export function encodeText(txtv: string) {
        let numarrv: number[] = []
        for (let i = 0; i < txtv.length; i++) {
            let numv = txtv.charCodeAt(i), bytelen = bitcalc(numv)
            numarrv.push(bytelen)
            for (let j = 0; j < bytelen; j++) { numarrv.push(numv % bytemax)
            numv = Math.floor(numv / bytemax) }
        } numarrv.push(0)
        return pins.createBufferFromArray(numarrv)
    }

    /**
     * convert buffer string to string
     * @param buffer string to decode
     * @returns after convert buffer to text
     */
    //% blockid=databuff_decode_string
    //% block="get buffer of $bufv convert to string"
    //% bufv.shadow=variables_get bufv.defl=buffer
    //% group="string"
    //% weight=75
    export function decodeText(bufv: Buffer) {
        let strtxt: string = "", bytelen = bufv[0], bytesum = 0, byteval = 0
        for (let i = 1; i < bufv.length; i++) {
            if (bytelen > 0) {
                if (bytesum > 0) byteval += bufv[i] * bytesum
                else byteval += bufv[i]
                bytesum = (bytesum > 0) ? bytesum * bytemax : bytemax
            bytelen-- } else {
                bytelen = bufv[i], strtxt += String.fromCharCode(byteval), byteval = 0, bytesum = 0
            }
        }
        return strtxt
    }

    /**
     * convert array of string to buffer string
     * @param array of string to encode
     * @returns after convert array of string to buffer string
     */
    //% blockid=databuff_encode_string_array
    //% block="get string array of $txtarr convert to buffer"
    //% group="string"
    //% weight=50
    export function encodeTextArr(txtarr: string[]) {
        let numarrv: number[] = []
        for (let txtv of txtarr) {
            for (let i = 0; i < txtv.length; i++) {
                let numv = txtv.charCodeAt(i), bytelen = bitcalc(numv)
                numarrv.push(bytelen)
                for (let j = 0; j < bytelen; j++) { numarrv.push(numv % bytemax)
                numv = Math.floor(numv / bytemax) }
            } numarrv.push(0)
        }
        return pins.createBufferFromArray(numarrv)
    }

    /**
     * convert buffer string to array of string
     * @param buffer string to decode
     * @returns after convert buffer to array of string
     */
    //% blockid=databuff_decode_string_array
    //% block="get buffer of $bufv convert to string array"
    //% bufv.shadow=variables_get bufv.defl=buffer
    //% group="string"
    //% weight=25
    export function decodeTextArr(bufv: Buffer) {
        let strarr: string[] = [], strtxt: string = "", bytelen = bufv[0], bytesum = 0, byteval = 0
        for (let i = 1; i < bufv.length; i++) {
            if (bytelen > 0) {
                if (bytesum > 0) byteval += bufv[i] * bytesum
                else byteval += bufv[i] 
                bytesum = (bytesum > 0) ? bytesum * bytemax : bytemax
            bytelen-- } else if (bytelen <= 0 && bytelen == bufv[i]) {
                strtxt += String.fromCharCode(byteval), strarr.push(strtxt), strtxt = ""
            } else {
                bytelen = bufv[i], strtxt += String.fromCharCode(byteval), byteval = 0, bytesum = 0
            }
        }
        return strarr
    }

    /**
     * convert image to buffer string
     * @param image to encode
     * @returns after convert image to buffer string
     */
    //% blockid=databuff_encode_image
    //% block="get image of $img=screen_image_picker convert to buffer"
    //% group="image"
    //% weight=100
    export function encodeImage(img: Image) {
        let numarrv: number[] = [], bytelen: number, numv: number, numc: number
        numv = img.width, bytelen = bitcalc(numv), numarrv.push(bytelen)
        while (numv > 0) { numarrv.push(numv % bytemax)
        numv = Math.floor(numv / bytemax) }
        numv = img.height, bytelen = bitcalc(numv), numarrv.push(bytelen)
        while (numv > 0) { numarrv.push(numv % bytemax)
        numv = Math.floor(numv / bytemax) }
        numv = img.getPixel(0, 0), numc = 1
        for (let i = 1;i < (img.width * img.height);i++) {
            const xi = Math.floor(i / img.height), yi = (i % img.height)
            if (img.getPixel(xi, yi) == numv) {
                numc++
            } else {
                bytelen = Math.max(bitcalc(numc), 1), numarrv.push(bytelen)
                while (numc > 0) { numarrv.push(numc % bytemax)
                numc = Math.floor(numc / bytemax)
                bytelen-- } numarrv.push(numv)
                numv = img.getPixel(xi, yi), numc = 1
            }
        }
        bytelen = Math.max(bitcalc(numc), 1), numarrv.push(bytelen)
        while (numc > 0) { numarrv.push(numc % bytemax)
        numc = Math.floor(numc / bytemax), bytelen-- } numarrv.push(numv)
        return pins.createBufferFromArray(numarrv)
    }

    /**
     * convert buffer string to image
     * @param buffer string to decode
     * @returns after convert buffer string to image
     */
    //% blockid=databuff_decode_image
    //% block="get buffer of $bufv convert to image"
    //% bufv.shadow=variables_get bufv.defl=buffer
    //% group="image"
    //% weight=50
    export function decodeImage(bufv: Buffer) {
        let i = 0, bytelen = bufv[i], byteval = 0, bytesum = 0, w = 0, h = 0, img: Image, imgRowBuffer: Buffer
        while (bytelen > 0) { i++
            if (bytesum > 0) byteval += bufv[i] * bytesum
            else byteval += bufv[i]
            bytesum = (bytesum > 0) ? bytesum * bytemax : bytemax
            bytelen--
        } i++, w = byteval, bytelen = bufv[i], byteval = 0, bytesum = 0
        while (bytelen > 0) { i++
            if (bytesum > 0) byteval += bufv[i] * bytesum
            else byteval += bufv[i]
            bytesum = (bytesum > 0) ? bytesum * bytemax : bytemax
            bytelen-- }
        i++, h = byteval, img = image.create(w, h), imgRowBuffer = pins.createBuffer(h), bytelen = bufv[i], byteval = 0, bytesum = 0
        while (bytelen > 0) { i++
            if (bytesum > 0) byteval += bufv[i] * bytesum
            else byteval += bufv[i]
            bytesum = (bytesum > 0) ? bytesum * bytemax : bytemax
            bytelen-- } i++, bytelen = byteval, byteval = bufv[i], i++
        for (let ii = 0;ii < (w * h);ii++) {
            const xi = Math.floor(ii / h), yi = (ii % h)
            if (bytelen > 0) {
                imgRowBuffer[yi] = byteval
                bytelen--
            }
            if (bytelen <= 0 && i < bufv.length) {
                bytelen = Math.max(bufv[i], 1), byteval = 0, bytesum = 0, i++
                while (bytelen > 0) { bytelen-- 
                    if (bytesum > 0) byteval += bufv[i] * bytesum
                    else byteval += bufv[i]
                    bytesum = (bytesum > 0) ? bytesum * bytemax : bytemax, i++
                }
                bytelen = byteval, byteval = bufv[i], i++
            }
            if ((yi % h)+1 == h) img.setRows(xi, imgRowBuffer)
        }
        return img
    }

}

let mySprite = sprites.create(img`
    ...............bbbbbbbbbbbbbbbbbbb...............
    ...........bbbbdd111111111111111ddbbbb...........
    ........bbbd1111111111111111111111111dbbb........
    ......bbd11111111dddddddddddddd111111111dbb......
    ....bbd1111111ddd11111111111111dddd1111111dbb....
    ...bd111111ddd111111111111111111111ddd111111db...
    ..bd11111ddd111ddddddddddddddddddd111ddd11111db..
    .bd11111dd111dddd111111111111111dddd111dd11111db.
    .b11111d111ddd111111111111111111111ddd111d11111b.
    bd11111d1ddd1111111111111111111111111ddd1111111db
    b11111d1ddd111111111111111111111111111ddd1d11111b
    b11111ddddd111111111111111111111111111ddddd11111b
    b11111ddddd111111111111111111111111111dddbd11111b
    b111111dddd111111111111111111111111111dddb111111b
    bd111111dddd1111111111111111111111111dddbd11111db
    .b1111111dddd11111111111111111111111dddbd111111b.
    .bd1111111dbbdd1111111111111111111dddbbd111111db.
    ..bd11111111dbbdd111111111111111dddbbd1111111db..
    ...bd111111111dbbbbbbdddddddddddddd111111111db...
    ....bbd11111111111dbbbbbbbbbddd11111111111dbb....
    ......bbdd11111111111111111111111111111ddbb......
    ........bbbdd11111111111111111111111ddbbb........
    ...........bbbbbddd11111111111dddbbbbb...........
    ................bbbbbbbbbbbbbbbbb................
`, SpriteKind.Player)
let Buffer2 = DataBuffer.encodeImage(mySprite.image)
mySprite.setImage(DataBuffer.decodeImage(Buffer2))
scene.setBackgroundColor(1)

