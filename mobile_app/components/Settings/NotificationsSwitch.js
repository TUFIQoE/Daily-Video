import {Switch, useWindowDimensions, View} from "react-native";
import MyText from "../MyText";
import React from "react"
import styles from "../../styles/components/NotificationSwitchStyle"
import {COLORS} from "../../styles/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "@react-navigation/native";
import clearAllNotifications from "../../utils/notification_utils/clearAllNotifications";
import handleNotificationsForTheDay from "../../utils/notification_utils/handleNotificationsForTheDay";
import handleNotificationsForUpcomingDays from "../../utils/notification_utils/handleNotificationsForUpcomingDays";
import {useTranslation} from "react-i18next";
import {STORAGE_KEYS} from "../../config";

const NotificationsSwitch = (props) => {
    const window = useWindowDimensions()
    const {i18n, t} = useTranslation()

    useFocusEffect(
        React.useCallback(() => {
            async function init() {
                const config = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_CONFIG))
                props.setNotificationsEnabled(config.enabled)
            }

            init()
        }, [])
    );

    async function handleSwitch() {
        const new_state = !props.notificationsEnabled

        // Update state view
        props.setNotificationsEnabled(new_state)

        // Update storage
        const config = JSON.parse(await AsyncStorage.getItem("notifications_config"))
        const new_config = {
            ...config,
            enabled: new_state
        }
        await AsyncStorage.setItem("notifications_config", JSON.stringify(new_config))

        // Schedule or clear notifications
        if (new_state === true) {
            console.log("[Settings] Scheduling notifications")
            await clearAllNotifications()
            await handleNotificationsForTheDay()
            await handleNotificationsForUpcomingDays()
        } else {
            console.log("[Settings] Clearing notifications")
            await clearAllNotifications()
        }
    }


    return (
        <View style={{...styles.container, width: window.width}}>
            <MyText fontSize={24} style={{textAlign: "left", width: "auto"}}>{t('settings:notifications')}</MyText>
            <Switch
                onValueChange={handleSwitch}
                value={props.notificationsEnabled}
                style={{
                    transform: [{scaleX: 1.1}, {scaleY: 1.1}]
                }}
                thumbColor={COLORS.light}
                trackColor={{true: COLORS.primary, false: COLORS.secondary}}
            />
        </View>
    )
}


export default NotificationsSwitch