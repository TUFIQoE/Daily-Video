import {StyleSheet} from "react-native";
import {pixelSizeHorizontal, pixelSizeVertical} from "../../utils/pixelRatioUtils";


const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: pixelSizeHorizontal(20),
        paddingRight: pixelSizeHorizontal(20),
        marginTop: pixelSizeVertical(50)
    },
})

export default styles