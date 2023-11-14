import React from "react";
import {Text, useWindowDimensions} from "react-native";
import {COLORS, FONT} from "../styles/config";
import {PixelRatio} from "react-native";
import {fontPixel} from "../utils/pixelRatioUtils";

const MyText = (props) => {

    const style = {
        fontFamily: FONT,
        fontSize: fontPixel(props.fontSize) ? props.fontSize : fontPixel(18),
        color: props.color ? props.color : COLORS.light,
        padding: 0,
        margin: 0,
        width: "100%",
        textAlign: "center",
        flexWrap: "wrap",
        ...props.style
    }

    return (
        <Text style={style}>{props.children}</Text>
    )
}


export default MyText