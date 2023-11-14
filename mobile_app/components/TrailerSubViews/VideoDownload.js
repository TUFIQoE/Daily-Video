import React from "react"
import {Image, useWindowDimensions, View} from "react-native";
import MyText from "../MyText";
import * as Progress from "react-native-progress"

import {COLORS} from "../../styles/config";
import {pixelSizeHorizontal, pixelSizeVertical} from "../../utils/pixelRatioUtils";
import {useTranslation} from "react-i18next";

import logo from "../../assets/icon.png"

const VideoDownload = (props) => {
    const {width, height} = useWindowDimensions()
    const window = useWindowDimensions()
    const {t} = useTranslation()

    const containerStyle = {
        width: width,
        paddingLeft: pixelSizeHorizontal(20),
        paddingRight: pixelSizeHorizontal(20),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: pixelSizeVertical(20),
        flexGrow: 1,
    }


    return (
        <View style={containerStyle}>

            <MyText fontSize={30} style={{textAlign: "left"}}>{t('common:whoops')}</MyText>
            <MyText fontSize={24} style={{marginTop: pixelSizeVertical(20), textAlign: "left"}}>{t('common:download_in_progress')}</MyText>
            <MyText fontSize={24} style={{marginTop: pixelSizeVertical(10), textAlign: "left"}}>{t('common:please_wait')}</MyText>

            <Progress.Bar
                indeterminate={true}
                height={pixelSizeVertical(10)}
                width={window.width - 2*pixelSizeHorizontal(20)}
                color={COLORS.primary}
                unfilledColor={COLORS.secondary}
                style={{
                    marginTop: pixelSizeVertical(20)
             }}/>

            <Image
                source={logo}
                style={{
                    width: pixelSizeHorizontal(256),
                    height: pixelSizeHorizontal(256),
                    marginTop: "auto"
                }}
            />


        </View>
    )
}

export default VideoDownload