import React, {useEffect, useState} from "react";

import {View} from "react-native";
import MyText from "../MyText";
import {pixelSizeVertical} from "../../utils/pixelRatioUtils";
import {pixelSizeHorizontal} from "../../utils/pixelRatioUtils";
import {COLORS} from "../../styles/config";
import Slider from "@react-native-community/slider";
import MOSButton from "./MOSButton";
import {useTranslation} from "react-i18next";
import getTranslatedQuestion from "../../utils/survey_utils/getTranslatedQuestion";
import {getTranslatedRadioButton} from "../../utils/survey_utils/getTranslatedRadioButton";
import {getLocalDatetimeAndTimezone} from "../../utils/timeUtils";
import {useFocusEffect} from "@react-navigation/native";

const MOS = (props) => {


    return (
        <View style={{marginTop: pixelSizeVertical(20), marginBottom: pixelSizeVertical(20)}}>
            <MyText fontSize={24}
                    style={{textAlign: "left"}}>{getTranslatedQuestion(props.survey, props.index)}</MyText>
            <View style={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                paddingTop: pixelSizeVertical(10),
                paddingBottom: pixelSizeVertical(10)
            }}>
                {
                    props?.survey[props?.index].buttons.map((button, index) => {
                        return(
                            <MOSButton key={index} title={getTranslatedRadioButton(button)} value={button.value} survey={props.survey} setSurvey={props.setSurvey} index={props.index}/>
                        )
                    })
                }
            </View>
        </View>
    )
}


export default MOS



{
    /*
    <MOSButton title={t('mos:excellent')} value={5} survey={props.survey} setSurvey={props.setSurvey} index={props.index}/>
<MOSButton title={t('mos:good')} value={4} survey={props.survey} setSurvey={props.setSurvey} index={props.index}/>
<MOSButton title={t('mos:fair')} value={3} survey={props.survey} setSurvey={props.setSurvey} index={props.index}/>
<MOSButton title={t('mos:poor')} value={2} survey={props.survey} setSurvey={props.setSurvey} index={props.index}/>
<MOSButton title={t('mos:bad')} value={1} survey={props.survey} setSurvey={props.setSurvey} index={props.index}/>
*/
}