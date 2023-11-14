import React from "react";
import {Button} from "react-native-elements";
import {COLORS} from "../../styles/config";
import {pixelSizeVertical} from "../../utils/pixelRatioUtils";
import {pixelSizeHorizontal} from "../../utils/pixelRatioUtils";
import {getLocalDatetimeAndTimezone} from "../../utils/timeUtils";

const MOSButton = (props) => {

    function handlePress(){
        const tmp = [...props.survey]
        tmp[props.index].answer ={
            ...tmp[props.index].answer,
            timestamp: getLocalDatetimeAndTimezone(new Date()),
            value:  props.value
        }
        props.setSurvey(tmp)
    }


    return(
        <Button
            title={`${props.title}`}
            style={{
            }}
            containerStyle={{
                width: "60%",
            }}
            buttonStyle={{
                backgroundColor: props.survey[props.index].answer.value === props.value ? COLORS.primary : COLORS.secondary,
                marginTop: pixelSizeVertical(10),
                justifyContent: "flex-start",
                paddingLeft: pixelSizeHorizontal(20)
            }}
            titleStyle={{
                color: props.survey[props.index].answer.value === props.value ? COLORS.light : COLORS.dark
            }}
            onPress={handlePress}
        />
    )
}


export default MOSButton