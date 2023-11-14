import React from "react"
import {Platform, TextInput} from "react-native";
import {COLORS} from "../../styles/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import handleNotificationsForTheDay from "../../utils/notification_utils/handleNotificationsForTheDay";
import clearAllNotifications from "../../utils/notification_utils/clearAllNotifications";
import handleNotificationsForUpcomingDays from "../../utils/notification_utils/handleNotificationsForUpcomingDays";
import {STORAGE_KEYS} from "../../config";

const NotificationHourInput = (props) => {

    async function handleHourInput(text) {
        // Check for number
        if (isNaN(text) === true) {
            return
        }

        // Check if hour is valid
        if (parseInt(text) >= 24 || parseInt(text) < 0) {
            return
        }

        // Update view state
        const tmp_hours = [...props.hours]
        tmp_hours[props.index] = text
        props.setHours(tmp_hours)

        // Update storage
        const config = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_CONFIG))
        config.hours = tmp_hours
        await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_CONFIG, JSON.stringify(config))

        // Reschedule notifications
        await clearAllNotifications()
        await handleNotificationsForTheDay()
        await handleNotificationsForUpcomingDays()
    }


    async function handleEndEditing(e) {
        const text = e.nativeEvent.text
        if (!text) {
            await handleHourInput(props.DEFAULT_HOURS[props.index])
        }
    }

    return (
        <TextInput
            mode={"outlined"}
            style={{
                width: 60,
                textAlign: "center",
                color: COLORS.dark,
                backgroundColor: COLORS.light,
                borderRadius: 5,
                paddingTop: Platform.OS === "ios" ? 10 : 0,
                paddingBottom: Platform.OS === "ios" ? 10 : 0
            }}
            clearTextOnFocus={true}
            keyboardType={"number-pad"}
            value={props.hours[parseInt(props.index)].toString()}
            onChangeText={handleHourInput}
            onEndEditing={handleEndEditing}
        />
    )
}

export default NotificationHourInput