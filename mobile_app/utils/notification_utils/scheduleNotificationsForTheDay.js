import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {STORAGE_KEYS} from "../../config";
import i18next from "i18next";


export const scheduleNotificationsForTheDay = async () => {
    // Ask permission for scheduling notifications
    await Notifications.requestPermissionsAsync({
        ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true
        }
    })

    const config_json = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_CONFIG) // <-- This is stored as JSON string
    if (!config_json) {
        console.log("[NotificationScheduler] config_json not found")
        return
    }
    const config = JSON.parse(config_json)
    try {
        if (config.enabled === true) {
            console.log("[NotificationScheduler] Scheduling notifications accordingly to configuration")
            const triggers = config.triggers

            for (let i = 0; i < triggers.length; i++) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: i18next.t('notifications:notification_header'),
                        body: i18next.t('notifications:notification_body')
                    },
                    trigger: {
                        hour: parseInt(triggers[i].hour),   //essential parseInt ! ! !
                        minute: parseInt(triggers[i].minute),
                        repeats: true
                    }
                });
            }
        } else {
            console.log("Notifications are disabled")
        }
    } catch (err) {
        console.log(err)
    }
}