import {StyleSheet} from "react-native";
import {COLORS} from "./config";
import {pixelSizeHorizontal, pixelSizeVertical} from "../utils/pixelRatioUtils";

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        flexGrow: 1,
        backgroundColor: COLORS.dark,
        paddingLeft: pixelSizeHorizontal(20),
        paddingRight: pixelSizeHorizontal(20),
        marginTop: pixelSizeVertical(20)
    },
    separator: {
        width: "40%",
        height: pixelSizeVertical(1),
        backgroundColor: COLORS.primary,
        marginTop: pixelSizeVertical(20),
        marginBottom: pixelSizeVertical(20)
    },
    box: {
        display: "flex", flexDirection: "column",
        alignItems: "flex-start",
        paddingRight: pixelSizeHorizontal(20),
        paddingLeft: pixelSizeHorizontal(20)
    }
})

export default styles