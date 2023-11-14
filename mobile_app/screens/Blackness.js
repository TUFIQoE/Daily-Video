import {Image, useWindowDimensions, View} from "react-native"
import React from "react"
import {Button} from "react-native-elements"
import styles from "../styles/NoConnectionStyle"
import * as Updates from "expo-updates"
import MyText from "../components/MyText";
import {COLORS} from "../styles/config";
import * as Progress from "react-native-progress"
import {pixelSizeHorizontal, pixelSizeVertical} from "../utils/pixelRatioUtils";


const Blackness = () => {
    const window = useWindowDimensions()

    const style = {
        padding: 30,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
        backgroundColor: "#222222",
        paddingBottom: pixelSizeVertical(50),
        paddingTop: pixelSizeVertical(50)
    }

    return (
        <View style={style}>
            <Progress.Circle
                indeterminate={true}
                size={pixelSizeHorizontal(75)}
                color={COLORS.primary}
            />
        </View>
    )
}


export default Blackness