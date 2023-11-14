import React from "react";
import {Button} from "react-native-elements";
import {COLORS, FONT} from "../../styles/config";
import {fontPixel} from "../../utils/pixelRatioUtils";
import {useTranslation} from "react-i18next";
import {useWindowDimensions} from "react-native";
import {useState} from "react";



const SurveyNavigationButtonPrevious = (props) => {
    const {t} = useTranslation()
    const window = useWindowDimensions()

    return(
        <Button
            title={t('survey:previous')}
            onPress={() => {props.setCurrentPage(prevState => prevState-=1)}}
            buttonStyle={{width: window.width*0.4, alignSelf: "flex-start", backgroundColor: COLORS.light}}
            disabledStyle={{
                backgroundColor: COLORS.secondary
            }}
            containerStyle={{

            }}
            titleStyle={{
                fontFamily: FONT,
                fontSize: fontPixel(18),
                color: COLORS.primary
            }}
            disabled={props.currentPage === 1}
        />
    )
}


export default SurveyNavigationButtonPrevious