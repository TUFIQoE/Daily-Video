import {StyleSheet} from "react-native";
import {COLORS} from "./config";
import {pixelSizeHorizontal} from "../utils/pixelRatioUtils";

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        flexGrow: 1,
        backgroundColor: COLORS.dark,
        paddingLeft: pixelSizeHorizontal(20),
        paddingRight: pixelSizeHorizontal(20)
    },
    img: {
        width: 125,
        height: 158,
        marginBottom: 30
    },
    box: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }
})

export default styles