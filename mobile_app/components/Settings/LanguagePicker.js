import React, {useState} from "react";
import MyText from "../MyText";
import {useWindowDimensions, View} from "react-native";
import styles from "../../styles/components/LanguagePickerStyle"
import DropDownPicker from 'react-native-dropdown-picker';
import {COLORS} from "../../styles/config";
import {useTranslation} from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {SUPPORTED_LANGUAGES} from "../../config";

const LanguagePicker = (props) => {

    const {t, i18n} = useTranslation()
    const [disabled, setDisabled] = useState(true)
    const window = useWindowDimensions()
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(i18n.language);
    const [items, setItems] = useState(
        [
            ... SUPPORTED_LANGUAGES.POL ? [{label: "Polish", value: 'pol'}]: [],
            ... SUPPORTED_LANGUAGES.ENG ? [{label: "English", value: 'eng'}] : [],
            ... SUPPORTED_LANGUAGES.NOR ? [{label: "Norwegian", value: 'nor'}] : [],
        ]
    );


    const setLanguage = code => {
        return i18n.changeLanguage(code)
    }

    async function handleLanguageChange(value) {

        const code = value
        await AsyncStorage.setItem("language", code)
        await setLanguage(code)
        setValue(code)
    }

    return (
        <View style={{...styles.container, width: window.width}}>
            <MyText fontSize={30} style={{width: "auto"}}>{t('settings:language')}</MyText>
            <DropDownPicker
                open={open}
                items={items}
                value={value}

                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                containerStyle={{
                    width: 150,
                    height: "50%",
                }}
                style={{}}
                textStyle={{
                    color: COLORS.dark
                }}
                dropDownDirection={"TOP"}
                dropDownContainerStyle={{}}
                labelStyle={{
                    color: COLORS.primary,
                    fontWeight: "bold"
                }}
                onChangeValue={handleLanguageChange}
            />
        </View>
    )
}


export default LanguagePicker