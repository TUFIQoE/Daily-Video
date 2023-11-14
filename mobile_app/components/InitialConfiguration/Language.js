import {View} from 'react-native';
import React, {useEffect, useState} from "react"
import styles from "../../styles/components/LanguageStyle"

import LanguageButton from "../LanguageButton";

import {useTranslation} from "react-i18next";
import MyText from "../MyText";
import {Button} from "react-native-elements";
import {pixelSizeHorizontal, pixelSizeVertical} from "../../utils/pixelRatioUtils";
import {COLORS} from "../../styles/config";
import {useFocusEffect} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InitialConfigurationHeader from "../InitialConfigurationHeader";
import {SUPPORTED_LANGUAGES} from "../../config";
import {LANG_CODES} from "../../IMLocalize";


const Language = (props) => {
    const {t, i18n} = useTranslation()
    const [selected, setSelected] = useState(false)


    const selectedLanguage = i18n.language

    useEffect(() => {

    }, [selected])


    useFocusEffect(
        React.useCallback(() => {
            // Check if language was selected yet
            async function init(){
                if(["pol", "eng", "nor"].includes(i18n.language)){
                    setSelected(true)
                }
            }

            init()
        }, [])
    );


    return (
        <View style={styles.container}>

            <MyText fontSize={24}>{t('initialConfiguration:chooseLang')}</MyText>
            <View style={styles.buttonBox}>
                <LanguageButton  setSelected={setSelected} code={"eng"} disabled={!SUPPORTED_LANGUAGES.ENG} title={t('initialConfiguration:eng')} />
                <LanguageButton setSelected={setSelected}  code={"pol"} disabled={!SUPPORTED_LANGUAGES.POL}  title= {t('initialConfiguration:pol')}  />
                <LanguageButton setSelected={setSelected}  code={"nor"} disabled={!SUPPORTED_LANGUAGES.NOR}  title={t('initialConfiguration:nor')}  />

                <Button
                    title={t('common:next')}
                    buttonStyle={{
                        backgroundColor: selected ? COLORS.primary : COLORS.light
                    }}
                    titleStyle={{
                        color: COLORS.light
                    }}
                    disabled={!selected}
                    containerStyle={{
                        width: pixelSizeHorizontal(100),
                        alignSelf: "flex-end",
                        marginTop: pixelSizeVertical(50)
                    }}
                    onPress={async () => {
                        await AsyncStorage.setItem("language", i18n.language)
                        props.navigateToPage(1)
                    }}
                />
            </View>




        </View>
    )
}


export default Language