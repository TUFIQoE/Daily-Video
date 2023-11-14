import React, {useEffect, useState} from "react"
import {View} from "react-native"
import {useDispatch, useSelector} from "react-redux";
import styles from "../../styles/components/GeneralStyle"
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {TextInput} from "react-native-paper";
import {Button} from "react-native-elements";
import {setPhoneNumber, setUserFirstName, setUserLastName} from "../../redux/actions";
import {COLORS, FONT} from "../../styles/config";
import {isBlankString, removeWhitespaces} from "../../utils/stringUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyText from "../MyText";
import {login} from "../../utils/initial_configuration_utils/login";
import {pixelSizeVertical} from "../../utils/pixelRatioUtils";
import {useTranslation} from "react-i18next";


const General = (props) => {
    const dispatch = useDispatch()
    const {phone_number, user_first_name, user_last_name} = useSelector(state => state.userReducer)
    const [ready, setReady] = useState(false)

    const {t, i18n} = useTranslation()


    useEffect(() => {
        if (isBlankString(phone_number) === false && !isBlankString(user_first_name) && !isBlankString(user_last_name)) {
            setReady(true)
        } else {
            setReady(false)
        }
    }, [phone_number, user_first_name, user_last_name])

    const handlePhoneInput = (text) => {
        if (isNaN(text) === false) {
            dispatch(setPhoneNumber(removeWhitespaces(text)))
        }
    }
    const handleFirstNameInput = (text) => {
        dispatch(setUserFirstName(text))
    }
    const handleLastNameInput = (text) => {
        dispatch(setUserLastName(text))
    }


    const handleSubmit = async () => {
        await AsyncStorage.multiSet([
            ["phone_number", phone_number],
            ["user_first_name", user_first_name],
            ["user_last_name", user_last_name]
        ])

        await login(props.navigation)
    }

    return (
        <KeyboardAwareScrollView contentContainerStyle={{...styles.container}}>
            <View style={{width: "100%"}}>
                <View style={styles.box}>
                    <MyText fontSize={24} style={{textAlign: "left"}}>{t('initialConfiguration:first_name')}</MyText>
                    <TextInput
                        onChangeText={handleFirstNameInput}
                        value={user_first_name}
                        mode={"outlined"}
                        outlineColor={"#999999"}
                        dense={true}
                        style={styles.input}
                    />
                </View>
                <View style={styles.box}>
                    <MyText fontSize={24} style={{textAlign: "left"}}>{t('initialConfiguration:last_name')}</MyText>
                    <TextInput
                        onChangeText={handleLastNameInput}
                        value={user_last_name}
                        mode={"outlined"}
                        outlineColor={"#999999"}
                        dense={true}
                        style={styles.input}
                    />
                </View>
                <View style={styles.box}>
                    <MyText fontSize={24} style={{textAlign: "left"}}>{t('initialConfiguration:phone_number')}</MyText>
                    <TextInput
                        onChangeText={handlePhoneInput}
                        value={phone_number}
                        mode={"outlined"}
                        outlineColor={"#999999"}
                        keyboardType={"number-pad"}
                        dense={true}
                        style={styles.input}
                    />
                </View>
            </View>
            <View style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                marginTop: pixelSizeVertical(50)
            }}>
                <Button
                    title={t('common:back')}
                    buttonStyle={{
                        width: 100,
                        backgroundColor: COLORS.light
                    }}
                    titleStyle={{
                        color: COLORS.primary,
                        fontFamily: FONT
                    }}
                    containerStyle={{
                        marginTop: pixelSizeVertical(20)
                    }}
                    onPress={() => {
                        props.navigateToPage(1)
                    }}

                />
                <Button
                    title={t('common:done')}
                    buttonStyle={{
                        width: 100,
                        backgroundColor: COLORS.primary
                    }}
                    disabled={!ready}
                    titleStyle={{
                        color: COLORS.light,
                        fontFamily: FONT
                    }}
                    containerStyle={{
                        marginTop: pixelSizeVertical(20)
                    }}
                    onPress={handleSubmit}
                />
            </View>
        </KeyboardAwareScrollView>
    )

}


export default General


/*  // 03.11.2021
    <Picker
        selectedValue={sex}
        prompt={"Płeć"}
        style={{
            width: "100%",
            height: 100,
            color: "whitesmoke",
        }}

        itemStyle={{
            height: 130
        }}
        onValueChange={handleSexChange}
    >
        <Picker.Item label={"Kobieta"} value={"female"}/>
        <Picker.Item label={"Mężczyzna"} value={"male"}/>
    </Picker>
 */


/*
<View style={styles.box_check}>
                <Text style={styles.label}> Płeć </Text>
                <CheckBox
                    size={25}
                    title={"Kobieta"}
                    containerStyle={styles.checkboxContainerStyle}
                    checked={checked.female}
                    onPress={() => {

                        //const prev = checked.female
                        //setChecked({...checked, female: !prev})
                    }}
                />
                <CheckBox
                    size={25}
                    title={"Mężczyzna"}
                    containerStyle={styles.checkboxContainerStyle}
                    checked={checked.male}
                    onPress={() => {


                        //const prev = checked.male
                        //setChecked({...checked, female: !prev})
                    }}
                />
            </View>
 */