import {StyleSheet} from "react-native";


const style = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        paddingTop: 30,
        flexGrow: 1
    },
    button_container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%"
    }
})

export default style