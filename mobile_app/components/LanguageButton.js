import React from "react"

import AsyncStorage from "@react-native-async-storage/async-storage";
import {useTranslation} from "react-i18next";
import {COLORS, FONT} from "../styles/config";
import {fontPixel, pixelSizeHorizontal, pixelSizeVertical} from "../utils/pixelRatioUtils";
import {Button} from "react-native-elements";
import {LANG_CODES} from "../IMLocalize";

const LanguageButton = (props) => {
    const {i18n} = useTranslation()
    const selectedLanguage = i18n.language

    const setLanguage = code => {
        return i18n.changeLanguage(code)
    }

    async function handleLanguageChange() {
        const code = props.code
        await AsyncStorage.setItem("language", code)
        await setLanguage(code)
    }

    const style = {
        backgroundColor: selectedLanguage === props.code ? COLORS.primary : COLORS.secondary,
        marginTop: pixelSizeVertical(20),
        minWidth: 250,
    }
    const labelStyle = {
        color: selectedLanguage === props.code ? COLORS.light : COLORS.dark,
        fontFamily: FONT,
        fontSize: fontPixel(18)
    }

    return (
       <Button
           title={props.title}
           disabled={props.disabled}
           onPress={handleLanguageChange}

           buttonStyle={{
               backgroundColor: selectedLanguage === props.code ? COLORS.primary : COLORS.light,
               opacity: props.disabled ? 0.5 : 1,
           }}
           titleStyle={{
               color: selectedLanguage === props.code ? COLORS.light : COLORS.dark,
               //fontSize: fontPixel(18)
           }}

           containerStyle={{
               width: pixelSizeHorizontal(200),
               marginTop: pixelSizeVertical(20)
           }}
       />

    )
}


export default LanguageButton

/*
 <Button style={style} mode={"contained"} labelStyle={labelStyle} onPress={handleLanguageChange}
                disabled={selectedLanguage === props.code}> {props.children} </Button>
 */