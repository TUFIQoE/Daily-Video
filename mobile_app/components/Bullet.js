import React from "react";
import {Pressable} from "react-native";
import {COLORS} from "../styles/config";


const Bullet = (props) => {

    const style = {
        width: 15,
        height: 15,
        backgroundColor: props.index === props.currentPage ? COLORS.primary : COLORS.light,
        borderRadius: 100
    }

    return (
        <Pressable style={style}>

        </Pressable>
    )
}

export default Bullet