import React from "react";
import {View} from "react-native";
import MyText from "./MyText";
import {COLORS} from "../styles/config";
import {useTranslation} from "react-i18next";


const IntroductionViewHeader = () => {

    const {t, i18n} = useTranslation()

    const container_outer_style = {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
    }
    const title_container_upper_style = {
        display: "flex",
        width: "100%",
        justifyContent: "flex-start"
    }

    const title_container_lower_style = {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "flex-start"
    }


    return (
        <View style={container_outer_style}>
            <View style={title_container_upper_style}>
                <MyText fontSize={30}>{t('initialConfiguration:welcome_header_p1')}</MyText>
            </View>
            <View style={title_container_lower_style}>
                <MyText color={COLORS.primary} fontSize={30}>{t('initialConfiguration:welcome_header_p2')}{<MyText fontSize={30}>!</MyText>}</MyText>
            </View>
        </View>
    )
}

export default IntroductionViewHeader