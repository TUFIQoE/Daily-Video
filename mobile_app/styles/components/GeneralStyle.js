import {StyleSheet} from "react-native";
import {pixelSizeHorizontal, pixelSizeVertical} from "../../utils/pixelRatioUtils";


const style = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: pixelSizeVertical(30),
        paddingLeft: pixelSizeHorizontal(30),
        paddingRight: pixelSizeHorizontal(30),
    },
    box: {
        width: "100%",
        marginTop: pixelSizeVertical(20),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    box_sex: {
        width: "100%",
        marginTop: pixelSizeVertical(10),
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    label: {
        width: "100%",
        textAlign: "left",
        fontSize: 18,
        fontWeight: "normal"
    },
    input: {
        width: "100%",
        height: 35,
        textAlign: "center"
    }
})

export default style