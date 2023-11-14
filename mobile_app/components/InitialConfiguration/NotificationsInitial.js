import {View} from "react-native"
import React, {useEffect, useState} from "react"
import NotificationNumberButton from "../NotificationNumberButton";
import NotificationHourInput from "../NotificationHourInput";
import styles from "../../styles/components/NotificationInitialStyle"
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {isBlankString} from "../../utils/stringUtils";
import {Button} from "react-native-elements";
import {COLORS} from "../../styles/config";
import {useDispatch, useSelector} from "react-redux";
import {setNotificationsConfig} from "../../redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import clearAllNotifications from "../../utils/notification_utils/clearAllNotifications";
import handleNotificationsForTheDay from "../../utils/notification_utils/handleNotificationsForTheDay";
import MyText from "../MyText";
import Slider from "@react-native-community/slider";
import {pixelSizeHorizontal, pixelSizeVertical} from "../../utils/pixelRatioUtils";
import NotificationsNumberSlider from "../NotificationsNumberSlider";
import NotificationsHoursSlider from "../NotificationsHoursSlider";
import NotificationsMinutesSlider from "../NotificationsMinutesSlider";
import {useTranslation} from "react-i18next";
import {STORAGE_KEYS} from "../../config";

const NotificationsInitial = (props) => {
    const {t, i18n} = useTranslation()
    const [notificationsConfig, setNotificationsConfig] = useState({
        enabled: true,
        triggers: [{
            hour: 9,
            minute: 15
        }]
    })
    const [triggers, setTriggers] = useState([{
        hour: 9,
        minute: 15
    }])
    const [numberOfNotifications, setNumberOfNotifications] = useState(1)
    const [indexToModify, setIndexToModify] = useState(0)


    function changeNotificationsNumber(number){
        let initial = 9
        const arr = new Array(number).fill({
            hour: 0,
            minute: 0
        })
        for(let i=0; i<number; i++){
            arr[i] = {
                hour: initial,
                minute: 0
            }
            initial += 3
        }
        setTriggers(arr)
    }


    useEffect(() => {
        console.log(triggers)
    }, [triggers])


    const saveAndNavigate = async (page_index) => {
        // Save configured hours to AsyncStorage
        await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_CONFIG, JSON.stringify({
            enabled: true,
            triggers: triggers
        }))

        // Schedule notifications after saving configuration
        await clearAllNotifications()
        await handleNotificationsForTheDay()

        props.navigateToPage(page_index)
    }

    return (
        <KeyboardAwareScrollView contentContainerStyle={{...styles.container}} centerContent={true}>
            <View style={{width: "100%"}}>
                <MyText fontSize={24} style={{textAlign: "left"}}>{t('initialConfiguration:notifications_number')} {numberOfNotifications}</MyText>
                <NotificationsNumberSlider
                    numberOfNotifications={numberOfNotifications}
                    setNumberOfNotifications={setNumberOfNotifications}
                    changeNotificationsNumber={changeNotificationsNumber}
                />
            </View>
            <View style={{width: "100%", paddingTop: pixelSizeVertical(30)}}>
                <MyText fontSize={24} style={{textAlign: "left"}}>{t('initialConfiguration:notifications_hours')}</MyText>
                <View style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: pixelSizeVertical(30)
                }}>
                    {
                        triggers.map((trigger, index) => {
                            const active = (indexToModify === index)
                            return (
                                <Button
                                    key={index}
                                    title={`${trigger.hour.toString().padStart(2, "0")}:${trigger.minute.toString().padStart(2, "0")}`}
                                    buttonStyle={{
                                        backgroundColor: active ? COLORS.primary : COLORS.light
                                    }}
                                    titleStyle={{
                                        color: active ? COLORS.light : COLORS.dark,
                                        fontWeight: active ? "bold" : "normal"
                                    }}
                                    containerStyle={{
                                        marginTop: pixelSizeVertical(20),
                                        width: pixelSizeHorizontal(100)
                                    }}
                                    onPress={() => {
                                        setIndexToModify(index)
                                    }}
                                />
                            )
                        })
                    }

                    <MyText fontSize={18} style={{textAlign: "center", marginTop: pixelSizeVertical(40), marginBottom: pixelSizeVertical(10)}}>{t('common:hour')}</MyText>
                    <NotificationsHoursSlider
                        triggers={triggers}
                        indexToModify={indexToModify}
                        setTriggers={setTriggers}
                    />

                    <MyText fontSize={18} style={{textAlign: "center", marginTop: pixelSizeVertical(20), marginBottom: pixelSizeVertical(10)}}>{t('common:minutes')}</MyText>
                   <NotificationsMinutesSlider
                       triggers={triggers}
                       indexToModify={indexToModify}
                       setTriggers={setTriggers}
                   />

                </View>
            </View>
            <View style={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-around"}}>
                <Button
                    title={t('common:back')}
                    buttonStyle={{
                        width: 100,
                        backgroundColor: COLORS.secondary
                    }}
                    titleStyle={{
                        color: COLORS.primary
                    }}
                    containerStyle={{
                        marginTop: pixelSizeVertical(60),
                    }}
                    onPress={() => {saveAndNavigate(0)}}
                />
                <Button
                    title={t('common:next')}
                    buttonStyle={{
                        width: 100,
                        backgroundColor: COLORS.primary
                    }}
                    titleStyle={{
                        color: COLORS.light,
                        fontFamily: "Raleway_600SemiBold",
                    }}
                    containerStyle={{
                        marginTop: pixelSizeVertical(60),
                    }}
                    onPress={() => {saveAndNavigate(2)}}
                />
            </View>

        </KeyboardAwareScrollView>
    )
}
export default NotificationsInitial

