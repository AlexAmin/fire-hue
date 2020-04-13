
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
