import {PixelRatio} from "react-native";
import {Dimensions} from "react-native";


const {width, height} = Dimensions.get('window')
const widthBaseScale = width / 414
const heightBaseScale = height / 896


const normalize = (size, based='width') =>{
    const newSize = (based === 'height') ? size * heightBaseScale : size * widthBaseScale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
}

//for width  pixel
const widthPixel = (size) => {
    return normalize(size, 'width');
};
//for height  pixel
const heightPixel = (size) => {
    return normalize(size, 'height');
};


//for font  pixel
export const fontPixel = (size) => {
    return heightPixel(size);
};
//for Margin and Padding vertical pixel
export const pixelSizeVertical = (size) => {
    return heightPixel(size);
};
//for Margin and Padding horizontal pixel
export const pixelSizeHorizontal = (size) => {
    return widthPixel(size);
};