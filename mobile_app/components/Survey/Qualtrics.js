import React from "react";
import {View} from "react-native";
import MyText from "../MyText";
import {pixelSizeVertical} from "../../utils/pixelRatioUtils";
import * as Linking from "expo-linking"
import {Button} from "react-native-elements";
import {COLORS, FONT} from "../../styles/config";
import {Pressable} from "react-native";
import {getLocalDateTime, getLocalDatetimeAndTimezone} from "../../utils/timeUtils";
import {useTranslation} from "react-i18next";
import getTranslatedQuestion from "../../utils/survey_utils/getTranslatedQuestion";

const Qualtrics= (props) => {
    const {t, i18n} = useTranslation()


    return(
        <View style={{marginTop: pixelSizeVertical(20), marginBottom: pixelSizeVertical(20)}}>
            <MyText fontSize={24} style={{textAlign: "left"}} color={COLORS.primary}>{t('survey:external_form')}</MyText>
            <MyText fontSize={18} style={{textAlign: "left", marginTop: pixelSizeVertical(5)}}>{t('survey:external_form_instruction')}</MyText>
            <MyText fontSize={18} style={{textAlign: "left", marginTop: pixelSizeVertical(10)}}>{getTranslatedQuestion(props.survey, props.index)}</MyText>
        </View>
    )
}


export default Qualtrics