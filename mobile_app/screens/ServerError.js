import React from "react";
import {useWindowDimensions, View} from "react-native";
import MyText from "../components/MyText";
import {COLORS, FONT} from "../styles/config";

import i18next from "i18next";
import {useTranslation} from "react-i18next";
import {Button} from "react-native-elements";
import * as Updates from "expo-updates";
import {pixelSizeHorizontal, pixelSizeVertical} from "../utils/pixelRatioUtils";



const ServerError = () => {
    const {t, i18n} = useTranslation()
    const window = useWindowDimensions()

    return(
        <View style={{backgroundColor: COLORS.dark, display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", flexGrow: 1, paddingTop: "25%", paddingLeft: pixelSizeHorizontal(20), paddingRight: pixelSizeHorizontal(20)}}>
            <MyText fontSize={24} style={{textAlign: "left"}}>{t('common:server_failure_01')}</MyText>
            <MyText fontSize={24} style={{textAlign: "left" , width: "100%"}}>{t('common:server_failure_02')}</MyText>

            <MyText fontSize={24} style={{textAlign: "left" , width: "100%", marginTop: pixelSizeVertical(20)}}>{t('common:server_failure_03')}</MyText>

            <Button
                title={t('common:restart')}
                onPress={async () => {
                    await Updates.reloadAsync()
                }}
                buttonStyle={{
                    backgroundColor: COLORS.primary
                }}
                titleStyle={{
                    fontFamily: FONT,
                }}
                containerStyle={{
                    marginTop: pixelSizeVertical(10),
                    width: window.width/2
                }}
            />
        </View>
    )
}


export default  ServerError