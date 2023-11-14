import React from "react";

import {TextInput, View} from "react-native";
import MyText from "../MyText";
import {pixelSizeVertical} from "../../utils/pixelRatioUtils";
import {COLORS} from "../../styles/config";
import {getLocalDateTime, getLocalDatetimeAndTimezone} from "../../utils/timeUtils";
import {useTranslation} from "react-i18next";
import getTranslatedQuestion from "../../utils/survey_utils/getTranslatedQuestion";
import {pixelSizeHorizontal} from "../../utils/pixelRatioUtils";

const Question = (props) => {
    const {t, i18n} = useTranslation()

    function handleChange(text){
        const tmp = [...props.survey]
        tmp[props.index].answer = {
            ...tmp[props.index].answer,
            timestamp: getLocalDatetimeAndTimezone(new Date()),
            value: text
        }
        props.setSurvey(tmp)
    }

    return(
        <View style={{marginTop: pixelSizeVertical(20), marginBottom: pixelSizeVertical(20)}}>
            <MyText fontSize={24} style={{textAlign: "left"}}>{getTranslatedQuestion(props.survey, props.index)}</MyText>
            <TextInput
                multiline={true}
                numberOfLines={1}
                style={{
                    width: "100%",
                    backgroundColor: COLORS.light,
                    minHeight: 100,
                    maxHeight: 200,
                    borderRadius: 5,
                    paddingTop: pixelSizeVertical(10),
                    paddingBottom: pixelSizeVertical(10),
                    paddingLeft: pixelSizeHorizontal(10),
                    paddingRight: pixelSizeHorizontal(10),
                    marginTop: pixelSizeVertical(10),
                    textAlignVertical: "top"
                }}
                value={props.survey[props.index].answer.value}
                keyboardType={"default"}
                onChangeText={handleChange}
            />
        </View>
    )
}


export default Question