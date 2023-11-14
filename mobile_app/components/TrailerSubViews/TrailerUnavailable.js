import React from "react"
import {Image, useWindowDimensions, View} from "react-native";
import MyText from "../MyText";
import {COLORS} from "../../styles/config";
import logo from "../../assets/icon.png"
import {pixelSizeHorizontal, pixelSizeVertical} from "../../utils/pixelRatioUtils";
import {useTranslation} from "react-i18next";

const TrailerUnavailable = (props) => {
    const {i18n ,t} = useTranslation()
    const {width, height} = useWindowDimensions()
    const containerStyle = {
        width: width,
        paddingLeft: pixelSizeHorizontal(40),
        paddingRight: pixelSizeHorizontal(40),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        flexGrow: 1,
    }
    const boxStyle = {
        width: width,
        paddingLeft: pixelSizeHorizontal(20),
        paddingRight: pixelSizeHorizontal(20),
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
    }
    const separatorStyle = {
        width: "50%",
        height: 3,
        backgroundColor: COLORS.primary,
        marginTop: pixelSizeVertical(20),
        marginBottom: pixelSizeVertical(20)
    }
    return (
        <View style={containerStyle}>
            <View style={{
                width: width,

                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                paddingLeft: pixelSizeHorizontal(20),
                paddingRight: pixelSizeHorizontal(20),
                marginBottom: pixelSizeVertical(20)
            }}>
                <Image source={logo} style={{width: 196, height: 196}}/>
            </View>
            <View style={boxStyle}>
                <MyText fontSize={25} style={{textAlign: "left"}}>{t('home:task_completed_header')}</MyText>
                <View style={separatorStyle}></View>
                <MyText fontSize={20} style={{textAlign: "left"}}>{t('home:task_completed_p1')}</MyText>
                <MyText fontSize={20} style={{textAlign: "left", marginTop: pixelSizeVertical(10)}}>{t('home:task_completed_p2')}</MyText>
            </View>
        </View>
    )
}


export default TrailerUnavailable