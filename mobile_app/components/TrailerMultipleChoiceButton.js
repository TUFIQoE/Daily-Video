import React from "react";
import {useDispatch} from "react-redux";
import {Image, Pressable, useWindowDimensions} from "react-native";
import {COLORS} from "../styles/config";
import {CONFIGURATION, VIDEO_DIRECTORY} from "../config";
import {setServiceToDisplay, setVideoToDisplay} from "../redux/actions/videoActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {pixelSizeHorizontal, pixelSizeVertical} from "../utils/pixelRatioUtils";


const TrailerMultipleChoiceButton = (props) => {
    const dispatch = useDispatch()
    const window = useWindowDimensions()

    function handleStyle() {
        const active = props.choice?.index === props.index
        const style = {
            width: 0.3 * window.width,
            height: 0.3 * window.width,
            backgroundColor: "#ffffff",
            marginTop: pixelSizeVertical(30),
            marginLeft: pixelSizeHorizontal(15),
            marginRight: pixelSizeHorizontal(15),
            borderRadius: 20,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",


            borderWidth: active ? 5 : 0,
            borderColor: COLORS.primary
        }
        return style
    }

    async function handleTrailerChoice() {
        const ch = {
            index: props.index,
            filename: props.filename,
            servicename: props.servicename,
            service: props.services[props.servicename]
        }
        props.setChoice(ch)
        dispatch(setVideoToDisplay(VIDEO_DIRECTORY + `/${props.filename}`))
        dispatch(setServiceToDisplay(props.servicename))

    }

    return (
        <Pressable style={handleStyle} onPressIn={handleTrailerChoice}>
            <Image
                source={props.services[props.servicename]}
                style={{
                    width: 0.25 * window.width,
                    height: 0.25 * window.width,
                }}
            />
        </Pressable>
    )
}


export default TrailerMultipleChoiceButton