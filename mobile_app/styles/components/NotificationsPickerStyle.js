import {StyleSheet} from "react-native";
import {pixelSizeHorizontal, pixelSizeVertical} from "../../utils/pixelRatioUtils";


const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: pixelSizeHorizontal(20),
        paddingRight: pixelSizeHorizontal(20)
    },
    hour_row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: pixelSizeVertical(20),
        paddingLeft: pixelSizeHorizontal(20),
        paddingRight: pixelSizeHorizontal(20),
    }

})

export default styles