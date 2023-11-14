import React, {useEffect, useState} from "react"
import {useWindowDimensions, View} from "react-native";
import MyText from "../MyText";
import styles from "../../styles/components/NotificationsPickerStyle"
import {useFocusEffect} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationHourInput from "./NotificationHourInput";
import NotificationsNumberPicker from "./NotificationsNumberPicker";
import Slider from "@react-native-community/slider";
import NotificationsNumberSlider from "../NotificationsNumberSlider";
import {pixelSizeHorizontal, pixelSizeVertical} from "../../utils/pixelRatioUtils";
import {Button} from "react-native-elements";
import {COLORS} from "../../styles/config";
import NotificationsHoursSlider from "../NotificationsHoursSlider";
import NotificationsMinutesSlider from "../NotificationsMinutesSlider";
import handleNotificationsForUpcomingDays from "../../utils/notification_utils/handleNotificationsForUpcomingDays";
import handleNotificationsForTheDay from "../../utils/notification_utils/handleNotificationsForTheDay";
import clearAllNotifications from "../../utils/notification_utils/clearAllNotifications";
import {useTranslation} from "react-i18next";
import {STORAGE_KEYS} from "../../config";

const NotificationsPicker = (props) => {
    const {i18n ,t} = useTranslation()
    const window = useWindowDimensions()
    const [numberOfNotifications, setNumberOfNotifications] = useState(null)
    const [triggers, setTriggers] = useState([{
        hour: 9,
        minute: 15
    }])
    const [indexToModify, setIndexToModify] = useState(0)

    useFocusEffect(
        React.useCallback(() => {
            async function init() {
                const config = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_CONFIG))
                setTriggers(config.triggers)
            }

            init()

            return async () => {
                console.log("Scheduling new config")
                await clearAllNotifications()
                await handleNotificationsForUpcomingDays()
                await handleNotificationsForTheDay()
            }
        }, [])
    );


        async function changeNotificationsNumber(number){

            const HOURS = [9,10,12,14,16,18]
            if(number > triggers.length){
                const triggers_to_add = number - triggers.length
                const tmp = [...triggers]
                for(let i=0; i<triggers_to_add; i++){
                    tmp.push({
                        hour: HOURS[triggers.length],
                        minute: 30
                    })
                }
                setTriggers(tmp)
                await updateAsyncStorage(tmp)
            }

            else if(number < triggers.length){
                const triggers_to_delete = triggers.length - number
                const tmp = [...triggers]
                tmp.splice(tmp.length-triggers_to_delete, triggers_to_delete)

                // Make sure indexToModify stays in range of triggers array
                if(indexToModify > tmp.length-1){
                    setIndexToModify(tmp.length-1)
                }
                //  //  //  //

                setTriggers(tmp)
                await updateAsyncStorage(tmp)
            }
        }


    async function updateAsyncStorage(triggers_update){
        const config = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_CONFIG))
        config.triggers = triggers_update
        await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_CONFIG, JSON.stringify(config))
    }

    return (
        <View style={{...styles.container, width: window.width, opacity: props.notificationsEnabled ? 1 : 0.3}}
              pointerEvents={props.notificationsEnabled ? "auto" : "none"}>
            <View style={{
                width: window.width,
                height: 100,
                paddingLeft: pixelSizeHorizontal(20),
                paddingRight: pixelSizeHorizontal(20),
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start"
            }}>
                <MyText fontSize={18} style={{textAlign: "left"}}>{t('settings:notifications_number')} {triggers.length}</MyText>
                <NotificationsNumberSlider
                    style={{
                        marginTop: pixelSizeVertical(20), padding: 0,
                        justifyContent: "flex-start", alignItems: "flex-start"
                    }}

                    changeNotificationsNumber={changeNotificationsNumber}
                    numberOfNotifications={triggers.length}
                    setNumberOfNotifications={setNumberOfNotifications}/>
                {
                /*
                <NotificationsNumberPicker hours={hours} setHours={setHours} DEFAULT_HOURS={DEFAULT_HOURS}/>
                 */
                }
            </View>

            <View style={{marginTop: pixelSizeVertical(10), display: "flex", flexDirection: "column", alignItems: "center", alignSelf: "flex-start"}}>
                <MyText fontSize={18} style={{textAlign: "left"}}>{t('settings:notifications_hours')}</MyText>
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
            </View>
            <View style={{width: window.width, display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "flex-start", paddingLeft: pixelSizeHorizontal(20), paddingRight: pixelSizeHorizontal(20)}}>
                <MyText fontSize={18} style={{textAlign: "left", marginTop: pixelSizeVertical(40), marginBottom: pixelSizeVertical(10)}}>{t('settings:hours')}</MyText>
                <NotificationsHoursSlider
                    triggers={triggers}
                    indexToModify={indexToModify}
                    setTriggers={setTriggers}
                    updateAsyncStorage={updateAsyncStorage}
                />

                <MyText fontSize={18} style={{textAlign: "left", marginTop: pixelSizeVertical(20), marginBottom: pixelSizeVertical(10)}}>{t('settings:minutes')}</MyText>
                <NotificationsMinutesSlider
                    triggers={triggers}
                    indexToModify={indexToModify}
                    setTriggers={setTriggers}
                    updateAsyncStorage={updateAsyncStorage}
                />
            </View>
        </View>
    )
}

export default NotificationsPicker