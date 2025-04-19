

//% block="Data buffer" color="#7C9BDE" icon="\uf187"
namespace DataBuffer {

    function bitcalc(nv: number, bl: number) {
        const bsum = bl ** 2 * 4, isum = Math.ceil(Math.log(nv) / Math.log(bsum))
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
        for (let i = 0; i < txtv.length; i++) { let numv = txtv.charCodeAt(i), bytelen = bitcalc(numv, 8), bytemax = 8 ** 2 * 4; numarrv.push(bytelen); for (let j = 0; j < bytelen; j++) numarrv.push(numv % bytemax), numv = Math.floor(numv / bytemax) } numarrv.push(0)
        return pins.createBufferFromArray(numarrv)
    }

    /**
     * convert buffer string to string
     * @param buffer string to decode
     * @returns after convert buffer to text
     */
    //% blockid=databuff_decode_string
    //% block="get buffer of $bufv=buffer convert to string"
    //% group="string"
    //% weight=75
    export function decodeText(bufv: Buffer) {
        let strtxt: string = "", bytelen = bufv[0], bytesum = 0, byteval = 0, bytemax = 8 ** 2 * 4
        for (let i = 1; i < bufv.length; i++) if (bytelen > 0) { if (bytesum > 0) byteval += bufv[i] * bytesum; else byteval += bufv[i]; bytesum = (bytesum > 0) ? bytesum * bytemax : bytemax, bytelen-- } else { bytelen = bufv[i], strtxt += String.fromCharCode(byteval), byteval = 0, bytesum = 0 }
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
        for (let txtv of txtarr) { for (let i = 0; i < txtv.length; i++) { let numv = txtv.charCodeAt(i), bytelen = bitcalc(numv, 8), bytemax = 8 ** 2 * 4; numarrv.push(bytelen); for (let j = 0; j < bytelen; j++) { numarrv.push(numv % bytemax), numv = Math.floor(numv / bytemax) } } numarrv.push(0) }
        return pins.createBufferFromArray(numarrv)
    }

    /**
     * convert buffer string to array of string
     * @param buffer string to decode
     * @returns after convert buffer to array of string
     */
    //% blockid=databuff_decode_string_array
    //% block="get buffer of $bufv+=buffer convert to string array"
    //% group="string"
    //% weight=25
    export function decodeTextArr(bufv: Buffer) {
        let strarr: string[] = [], strtxt: string = "", bytelen = bufv[0], bytesum = 0, byteval = 0, bytemax = 8 ** 2 * 4
        for (let i = 1; i < bufv.length; i++) if (bytelen > 0) { if (bytesum > 0) { byteval += bufv[i] * bytesum } else { byteval += bufv[i] } bytesum = (bytesum > 0) ? bytesum * bytemax : bytemax, bytelen-- } else if (bytelen <= 0 && bytelen == bufv[i]) { strtxt += String.fromCharCode(byteval), strarr.push(strtxt), strtxt = "" } else { bytelen = bufv[i], strtxt += String.fromCharCode(byteval), byteval = 0, bytesum = 0 }
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
        let numarrv: number[] = [], bytelen: number,bytemax: number, numv: number, numc: number
        numv = img.width, bytelen = bitcalc(numv, 8), bytemax = 8 ** 2 * 4, numarrv.push(bytelen)
        for (let j = 0; j < bytelen; j++) numarrv.push(numv % bytemax), numv = Math.floor(numv / bytemax)
        numv = img.height, bytelen = bitcalc(numv, 8), bytemax = 8 ** 2 * 4, numarrv.push(bytelen)
        for (let j = 0; j < bytelen; j++) numarrv.push(numv % bytemax), numv = Math.floor(numv / bytemax)
        numv = img.getPixel(0, 0), numc = 1
        for (let i = 1;i < (img.width * img.height);i++) { const xi = Math.floor(i / img.height), yi = (i % img.height); if (img.getPixel(xi, yi) == numv) { numc++ } else { numarrv.push(numc), numarrv.push(numv), numv = img.getPixel(xi, yi), numc = 1 } }
        return pins.createBufferFromArray(numarrv)
    }

    /**
     * convert buffer string to image
     * @param buffer string to decode
     * @returns after convert buffer string to image
     */
    //% blockid=databuff_decode_image
    //% block="get buffer of $bufv=buffer convert to image"
    //% group="image"
    //% weight=50
    export function decodeImage(bufv: Buffer) {
        let i = 0, i0 = 0, bytemax = 8 ** 2 * 4, bytelen = bufv[i], byteval = 0, bytesum = 0, w = 0, h = 0, img: Image, imgRowBuffer: Buffer
        while (bytelen > 0) { i++; if (bytesum > 0) byteval += bufv[i] * bytesum; else byteval += bufv[i]; bytesum = (bytesum > 0) ? bytesum * bytemax : bytemax, bytelen-- } i++, w = byteval, bytelen = bufv[i], byteval = 0, bytesum = 0
        while (bytelen > 0) { i++; if (bytesum > 0) byteval += bufv[i] * bytesum; else byteval += bufv[i]; bytesum = (bytesum > 0) ? bytesum * bytemax : bytemax, bytelen-- } i++, h = byteval, img = image.create(w, h), imgRowBuffer = pins.createBuffer(h), bytelen = bufv[i], i++, byteval = bufv[i], i++
        while (i < bufv.length) { for (let i1 = 0;i1 < h;i1++) { if (bytelen > 0) { imgRowBuffer[i1] = bufv[i] } else { bytelen = bufv[i], i++, byteval = bufv[i], i++ } } img.setRows(i0, imgRowBuffer), i0++}
        return img
    }

}

