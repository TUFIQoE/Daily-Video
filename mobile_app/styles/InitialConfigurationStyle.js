import {StyleSheet} from "react-native";
import {COLORS} from "./config";
import {pixelSizeHorizontal, pixelSizeVertical} from "../utils/pixelRatioUtils";

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flexGrow: 1,
        backgroundColor: COLORS.dark,
        paddingLeft: pixelSizeHorizontal(20),
        paddingRight: pixelSizeHorizontal(20),
        paddingTop: pixelSizeVertical(30),
        paddingBottom: pixelSizeVertical(50)
    },
    pagerView: {
        width: "100%",
        display: "flex",
        flexGrow: 1,
    },
    separator: {
        height: 4,
        width: "60%",
        backgroundColor: COLORS.primary,
        marginTop: pixelSizeVertical(20)
    }
})

export default styles