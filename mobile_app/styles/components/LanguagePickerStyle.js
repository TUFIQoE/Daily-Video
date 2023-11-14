import {StyleSheet} from "react-native";
import {pixelSizeHorizontal, pixelSizeVertical} from "../../utils/pixelRatioUtils";

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 100,
        paddingLeft: pixelSizeHorizontal(20),
        paddingRight: pixelSizeHorizontal(20),
        marginTop: pixelSizeVertical(20)
    },


})

export default styles