import {StyleSheet} from "react-native";
import {COLORS} from "./config";
import {pixelSizeHorizontal, pixelSizeVertical} from "../utils/pixelRatioUtils";

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        flexGrow: 1,
        backgroundColor: COLORS.dark,
        paddingTop: pixelSizeVertical(20),
        paddingBottom: pixelSizeVertical(50),
        paddingLeft: pixelSizeHorizontal(30),
        paddingRight: pixelSizeHorizontal(30)
    },
    box: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: pixelSizeHorizontal(20),
        paddingRight: pixelSizeHorizontal(20)
    },
    img: {
        width: 150,
        height: 140,
        marginBottom: pixelSizeVertical(30)
    }

})

export default styles