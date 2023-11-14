import {StyleSheet} from "react-native";
import {COLORS} from "./config";
import {pixelSizeHorizontal, pixelSizeVertical} from "../utils/pixelRatioUtils";


const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: COLORS.dark,
        paddingLeft: pixelSizeHorizontal(20),
        paddingRight: pixelSizeHorizontal(20),
        paddingBottom: pixelSizeVertical(20),
        paddingTop: pixelSizeVertical(20),
        flexGrow: 1
    },
    logo: {
        width: pixelSizeHorizontal(256),
        height: pixelSizeHorizontal(256),
    },

})

export default styles