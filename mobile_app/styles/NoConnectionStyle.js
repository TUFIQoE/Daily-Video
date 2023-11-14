import {StyleSheet} from "react-native";
import {COLORS} from "./config";
import {fontPixel, pixelSizeHorizontal, pixelSizeVertical} from "../utils/pixelRatioUtils";

const styles = StyleSheet.create({
    container: {
        padding: 30,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        flexGrow: 1,
        backgroundColor: "#222222",
        paddingBottom: pixelSizeVertical(50),
        paddingTop: pixelSizeVertical(50)
    },
    header: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: pixelSizeHorizontal(30),
        paddingRight: pixelSizeHorizontal(30),
        marginTop: pixelSizeVertical(30),
        marginBottom: pixelSizeVertical(30)
    },
    image: {
        width: 195 / 1.3,
        height: 247 / 1.3,
        marginBottom: 50
    },
    info: {
        fontSize: fontPixel(18),
        color: "whitesmoke",
        textAlign: "center",
        marginTop: pixelSizeVertical(20)
    },
    button: {
        backgroundColor: COLORS.danger,

    }
})


export default styles