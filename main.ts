

//% block="Data buffer" color="#7C9BDE" icon="\uf187"
namespace DataBuffer {

    const bytemax: number = Math.round(8 ** 2 * 4)
    
    function bitcalc(nv: number) {
        const bsum = bytemax, isum = Math.ceil(Math.log(nv) / Math.log(bsum))
        return isum
    }
    
    /**
     * convert int number to buffer string
     * @param int number to encode
     * @returns after convert int number to buffer string
     */
    //% blockid=databuff_encode_intenger
    //% block="get int number of $num convert to buffer string"
    //% group="intenger number"
    //% weight=100
    export function encodeInt(num: number): Buffer {
        let arrnv: number[] = []
        num = Math.round(num)
        let bytelen = Math.max(bitcalc(Math.abs(num)), 1)
        bytelen += (num < 0)? Math.floor(bytemax / 2) : 0
        arrnv.push(bytelen)
        while (bytelen > 0) { arrnv.push(num % bytemax)
        num = Math.floor(num / bytemax)
        bytelen-- }
        return pins.createBufferFromArray(arrnv)
    }

    /**
     * convert buffer string to int number
     * @param buffer string to decode
     * @returns after convert buffer string to int number
     */
    //% blockid=databuff_decode_intenger
    //% block="get buffer of $bufv convert to int number"
    //% bufv.shadow=variables_get bufv.defl=bufval
    //% group="intenger number"
    //% weight=75
    export function decodeInt(bufv: Buffer): number {
        let byteval = 0, bytelen = bufv[0], bytesum = 0
        let negative = (Math.floor(bytelen / Math.floor(bytemax / 2)) > 0)
        bytelen -= (negative)? Math.floor(bytemax / 2) : 0
        for (let i = 1;i < bufv.length;i++) {
            if (bytelen > 0) {
            if (bytesum > 0) byteval += bufv[0] * bytesum
            else byteval += bufv[i]
            bytesum = (bytesum > 0)? bytesum * bytemax : bytemax
            bytelen-- }
        }
        if (negative) byteval = (0 - byteval)
        return byteval
    }

    /**
     * convert int number array to buffer string
     * @param int number array to encode
     * @returns after convert int number array to buffer string
     */
    //% blockid=databuff_encode_intenger_array
    //% block="get int number array of $numav convert to buffer string"
    //% group="intenger number"
    //% weight=50
    export function encodeIntArray(numav: number[]): Buffer {
        let arrnv: number[] = []
        for (let num of numav) {
            num = Math.round(num)
            let bytelen = Math.max(bitcalc(Math.abs(num)), 1)
            bytelen += (num < 0) ? Math.floor(bytemax / 2) : 0
            arrnv.push(bytelen)
            while (bytelen > 0) { arrnv.push(num % bytemax)
            num = Math.floor(num / bytemax)
            bytelen-- }
            arrnv.push(0)
        }
        return pins.createBufferFromArray(arrnv)
    }

    /**
     * convert buffer string to int number array
     * @param buffer string to decode
     * @returns after convert buffer string to int number array
     */
    //% blockid=databuff_decode_intenger_array
    //% block="get buffer of $bufv convert to int number array"
    //% bufv.shadow=variables_get bufv.defl=bufval
    //% group="intenger number"
    //% weight=25
    export function decodeIntArray(bufv: Buffer): number[] {
        let byteval = 0, bytelen = bufv[0], bytesum = 0, numav: number[] = []
        let negative = (Math.floor(bytelen / Math.floor(bytemax / 2)) > 0)
        bytelen -= (negative) ? Math.floor(bytemax / 2) : 0
        for (let i = 1; i < bufv.length; i++) {
            if (bytelen > 0) {
                if (bytesum > 0) byteval += bufv[0] * bytesum
                else byteval += bufv[i]
                bytesum = (bytesum > 0) ? bytesum * bytemax : bytemax
            bytelen-- } else if (bytelen <= 0 && bufv[0] <= 0) {
                if (negative) byteval = (0 - byteval)
            numav.push(byteval) } else {
                byteval = 0, bytelen = bufv[i], bytesum = 0
                negative = (Math.floor(bytelen / Math.floor(bytemax / 2)) > 0)
                bytelen -= (negative) ? Math.floor(bytemax / 2) : 0
            }
        }
        return numav
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
    export function encodeString(txtv: string): Buffer {
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
    //% bufv.shadow=variables_get bufv.defl=bufval
    //% group="string"
    //% weight=75
    export function decodeString(bufv: Buffer): string {
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
    //% block="get array string of $txtarr convert to buffer"
    //% group="string"
    //% weight=50
    export function encodeStringArray(txtarr: string[]): Buffer {
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
    //% block="get buffer of $bufv convert to array string"
    //% bufv.shadow=variables_get bufv.defl=bufval
    //% group="string"
    //% weight=25
    export function decodeStringArray(bufv: Buffer): string[] {
        let strarr: string[] = [], strtxt: string = "", bytelen = bufv[0], bytesum = 0, byteval = 0
        for (let i = 1; i < bufv.length; i++) {
            if (bytelen > 0) {
                if (bytesum > 0) byteval += bufv[i] * bytesum
                else byteval += bufv[i] 
                bytesum = (bytesum > 0) ? bytesum * bytemax : bytemax
            bytelen-- } else if (bytelen <= 0 && bufv[i] <= 0) {
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
    export function encodeImage(img: Image): Buffer {
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
    //% bufv.shadow=variables_get bufv.defl=bufval
    //% group="image"
    //% weight=75
    export function decodeImage(bufv: Buffer): Image {
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

    /**
     * convert array of image to buffer string
     * @param array image to encode
     * @returns after convert array image to buffer string
     */
    //% blockid=databuff_encode_image_array
    //% block="get array image of $imgarr convert to buffer"
    //% imgarr.shadow=lists_create_with imgarr.defl=screen_image_picker
    //% group="image"
    //% weight=50
    export function encodeImageArray(imgarr: Image[]): Buffer {
        let numarrv: number[] = [], bytelen: number, numv: number, numc: number
        for (let img of imgarr) {
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
            numarrv.push(0)
        }
        return pins.createBufferFromArray(numarrv)
    }

    /**
     * convert buffer string to array image
     * @param buffer string to decode
     * @returns after convert buffer string to array image
     */
    //% blockid=databuff_decode_image_array
    //% block="get buffer of $bufv convert to array image"
    //% bufv.shadow=variables_get bufv.defl=bufval
    //% group="image"
    //% weight=25
    export function decodeImageArray(bufv: Buffer): Image[] {
        let i = 0, imgarr: Image[] = [], bytelen = bufv[i], byteval = 0, bytesum = 0, w = 0, h = 0, img: Image, imgRowBuffer: Buffer
        while (i < bufv.length) {
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
            if ((yi % h)+1 == h) { img.setRows(xi, imgRowBuffer) }
        } i--, i--
        imgarr.push(img.clone())
        bytelen = bufv[i], byteval = 0, bytesum = 0, w = 0, h = 0
        }
        return imgarr
    }
    
}

