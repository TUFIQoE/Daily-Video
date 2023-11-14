import {StyleSheet} from "react-native";
import {pixelSizeVertical} from "../../utils/pixelRatioUtils";


const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: pixelSizeVertical(20),
        paddingBottom: pixelSizeVertical(20),
        marginTop: pixelSizeVertical(20)
    },
    header: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        width: "100%",
        color: "#222222"
    },
    hourSelectContainer: {
        marginTop: pixelSizeVertical(50),
    },
    hourSelectRow: {
        marginTop: pixelSizeVertical(20),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },
    index: {
        fontSize: 16,
        fontWeight: "bold",
        marginRight: 25
    }
})

export default styles