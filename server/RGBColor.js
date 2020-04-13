
module.exports = class RGBColor{
    constructor(red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue =  blue;
    }

    /**
     * Converts a hex color (e.g. #EFEFEF) to RGB
     * @param hexColor {String!} e.g. #EFEFEF
     */
    fromHex(hexColor){
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
        this.red = parseInt(result[1], 16);
        this.green = parseInt(result[2], 16);
        this.blue = parseInt(result[3], 16);
        return this;
    }
    /**
     * From https://developers.meethue.com/develop/application-design-guidance/color-conversion-formulas-rgb-to-xy-and-back/
     * @param x
     * @param y
     * @param brightness
     */
    fromXY(x, y, brightness){
        const z = 1.0 - x - y;
        const Y = brightness; // The given brightness value
        const X = (Y / y) * x;
        const Z = (Y / y) * z;

        let r =  X * 1.656492 - Y * 0.354851 - Z * 0.255038;
        let g = -X * 0.707196 + Y * 1.655397 + Z * 0.036152;
        let b =  X * 0.051713 - Y * 0.121364 + Z * 1.011530;

        this.red = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
        this.green = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
        this.blue = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;
        return this;
    }

    toJSON(){
        return {red: this.red, green: this.green, blue: this.blue};
    }
    /**
     *
     * @returns {Number!} RGB value for red (0-255)
     */
    getRed(){
        return this.red;
    }

    /**
     *
     * @returns {Number!} RGB value for green (0-255)
     */
    getGreen(){
        return this.green;
    }

    /**
     *
     * @returns {Number!} RGB value for blue (0-255)
     */
    getBlue(){
        return this.blue;
    }
};
