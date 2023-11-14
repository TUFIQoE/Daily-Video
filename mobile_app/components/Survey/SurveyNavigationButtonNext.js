import React from "react";
import {Button} from "react-native-elements";
import {COLORS, FONT} from "../../styles/config";
import {fontPixel} from "../../utils/pixelRatioUtils";
import {useTranslation} from "react-i18next";
import {useWindowDimensions} from "react-native";
import {useState} from "react";
import {pixelSizeHorizontal} from "../../utils/pixelRatioUtils";


const SurveyNavigationButtonNext = (props) => {
    const {t} = useTranslation()
    const window = useWindowDimensions()


    return(
        <Button
            title={t('survey:next')}
            onPress={() => {props.setCurrentPage(prevState => prevState+=1)}}
            buttonStyle={{width: window.width*0.9, alignSelf: "center", backgroundColor: COLORS.light}}
            containerStyle={{
                //marginLeft: "auto" // <-- This aligns button to the right side, marginRight: auto would align it to the left
            }}
            titleStyle={{
                fontFamily: FONT,
                fontSize: fontPixel(18),
                color: COLORS.primary
            }}
            disabled={props.currentPage === props.totalPages}
        />
    )
}


export default SurveyNavigationButtonNext
