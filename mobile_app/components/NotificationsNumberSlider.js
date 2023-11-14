import React from "react";
import {View} from "react-native";
import {pixelSizeVertical} from "../utils/pixelRatioUtils";
import Slider from "@react-native-community/slider";
import {COLORS} from "../styles/config";
import MyText from "./MyText";
import {useDispatch, useSelector} from "react-redux";
import {setNotificationsConfig} from "../redux/actions";


const NotificationsNumberSlider = (props) => {

    const handleValueChange = (value) => {
        props.setNumberOfNotifications(value)
        props.changeNotificationsNumber(value)
    }

    return(
        <View style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginTop: pixelSizeVertical(30),
            ...props.style
        }}>
            <Slider
                style={{width: "80%", height: 20}}
                minimumValue={1}
                maximumValue={4}
                minimumTrackTintColor={COLORS.primary}
                maximumTrackTintColor={COLORS.light}
                step={1}
                onValueChange={handleValueChange}
                tapToSeek={true}
                value={props.numberOfNotifications}
                thumbTintColor={COLORS.secondary}
            />

        </View>
    )

}



export default NotificationsNumberSlider