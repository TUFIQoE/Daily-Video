import {StyleSheet} from "react-native";
import {COLORS} from "../config";
import {pixelSizeVertical} from "../../utils/pixelRatioUtils";

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,

    },
    buttonBox: {
        marginTop: pixelSizeVertical(20),
        display: "flex",
        flexDirection: "column",

    }

})

export default styles