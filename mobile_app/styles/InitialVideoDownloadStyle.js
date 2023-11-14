import {StyleSheet} from "react-native";
import {COLORS} from "./config";
import {pixelSizeHorizontal, pixelSizeVertical} from "../utils/pixelRatioUtils";

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
        backgroundColor: COLORS.dark,
        paddingLeft: pixelSizeHorizontal(40),
        paddingRight: pixelSizeHorizontal(40)
    },
    progressBarBox: {
        marginTop: pixelSizeVertical(100),
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
    }
})

export default styles