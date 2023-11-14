import React, {useState} from "react"
import {SafeAreaView, Text, View} from "react-native";
import {useTranslation} from "react-i18next";
import styles from "../styles/components/LanguageStyle";
import LanguageButton from "../components/LanguageButton";
import {COLORS} from "../styles/config";
import {pixelSizeVertical} from "../utils/pixelRatioUtils";
import {fontPixel} from "../utils/pixelRatioUtils";

const LanguageSettings = (props) => {
    const {t, i18n} = useTranslation()
    const [disabled, setDisabled] = useState(true)

    const style = {
        backgroundColor: COLORS.info,
        width: "50%",
        marginTop: pixelSizeVertical(40)
    }

    return (
        <SafeAreaView>
            <View style={styles.lang_box}>
                <Text style={{
                    color: "#222222",
                    fontSize: fontPixel(20),
                    marginBottom: pixelSizeVertical(50)
                }}>{t('initialConfiguration:chooseLang')}</Text>
                <LanguageButton mode={"contained"} style={style}
                                code={"eng"}> {t('initialConfiguration:eng')} </LanguageButton>
                <LanguageButton mode={"contained"} style={style}
                                code={"pol"}> {t('initialConfiguration:pol')} </LanguageButton>
                <LanguageButton mode={"contained"} style={style}
                                code={"nor"}> {t('initialConfiguration:nor')} </LanguageButton>
            </View>
        </SafeAreaView>
    )
}

export default LanguageSettings