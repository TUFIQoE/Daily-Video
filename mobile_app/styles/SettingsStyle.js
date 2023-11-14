import {StyleSheet} from "react-native";
import {COLORS} from "./config";
import {pixelSizeHorizontal, pixelSizeVertical} from "../utils/pixelRatioUtils";


const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.dark,
        paddingBottom: pixelSizeVertical(20),
        paddingTop: pixelSizeVertical(20),
    },
    contentContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexGrow: 1,
        paddingBottom: pixelSizeVertical(50)
    },
    header_box: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        paddingLeft: pixelSizeHorizontal(20),
        paddingRight: pixelSizeHorizontal(20),
    },
    separator: {
        width: "90%",
        height: pixelSizeVertical(1),
        backgroundColor: COLORS.secondary,
        marginTop: pixelSizeVertical(20)
    },
    logo: {
        width: 256,
        height: 256,
    },

})

export default styles