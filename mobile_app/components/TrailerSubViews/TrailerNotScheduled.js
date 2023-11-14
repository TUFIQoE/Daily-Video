import React, {useEffect} from "react";
import {Image, useWindowDimensions, View} from "react-native";
import {pixelSizeHorizontal, pixelSizeVertical} from "../../utils/pixelRatioUtils";
import logo from "../../assets/icon.png";
import styles from "../../styles/TrailersStyle";
import MyText from "../MyText";
import {useTranslation} from "react-i18next";



const TrailerNotScheduled = () => {
    const {t, i18n} = useTranslation()
    const window = useWindowDimensions()

    return(
        <View style={{
            display: "flex",
            flexGrow: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            width: window.width,
            paddingLeft: pixelSizeHorizontal(20),
            paddingRight: pixelSizeHorizontal(20),
        }}>
            <Image source={logo} style={{...styles.logo, marginTop: pixelSizeVertical(20)}}/>
            <MyText fontSize={24} style={{textAlign: "center"}}>{t('home:video_not_scheduled')}</MyText>
            <MyText fontSize={24} style={{textAlign: "center", marginTop: pixelSizeVertical(20)}}>{t('home:come_back_tomorrow')}</MyText>
        </View>
    )
}


export default TrailerNotScheduled