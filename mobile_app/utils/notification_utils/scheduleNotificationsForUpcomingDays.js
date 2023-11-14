import AsyncStorage from "@react-native-async-storage/async-storage";
import {CONFIGURATION, STORAGE_KEYS} from "../../config";
import * as Notifications from "expo-notifications";
import i18next from "i18next";


export const scheduleNotificationsForUpcomingDays = async () => {
    const config_json = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_CONFIG) // <-- This is stored as JSON string
    if (!config_json) {
        console.log("[NotificationScheduler] config_json not found")
        return
    }
    const config = JSON.parse(config_json)
    if(config.enabled === false){
        console.log("[NotificationScheduler] Notifications are disabled")
        return
    }

    try{
        const today = new Date(new Date().setHours(0,0,0,0))
        console.log("[NotificationScheduler] Scheduling notifications for upcoming days")
        for(let i=1; i<=CONFIGURATION.NOTIFICATIONS_DAYS; i++){
            const upcoming_day = new Date(new Date(today).setDate(new Date(today).getDate()+i))

            for(let k=0; k<config.triggers.length; k++){
                const trigger = new Date(new Date(upcoming_day).setHours(config.triggers[k].hour, config.triggers[k].minute, 0, 0))
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: i18next.t('notifications:notification_header'),
                        body: i18next.t('notifications:notification_body')
                    },
                    trigger: trigger,
                    repeat: false
                })
            }
        }
    }
    catch (err){
        console.log(err)
    }
}