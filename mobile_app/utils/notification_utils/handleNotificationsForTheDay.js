import * as Notifications from "expo-notifications"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {shouldTrailerBePlayedToday} from "../timeUtils";
import clearAllNotifications from "./clearAllNotifications";
import {STORAGE_KEYS} from "../../config";
import i18next from "i18next";
import {isTodaysVideoScheduleEmpty} from "../schedule_utils/isTodaysVideoScheduleEmpty";
import {scheduleNotificationsForUpcomingDays} from "./scheduleNotificationsForUpcomingDays";
import {check_notifications} from "../test_utils/check_notifications";
import {scheduleNotificationsForTheDay} from "./scheduleNotificationsForTheDay";

const handleNotificationsForTheDay = async () => {


    if(await shouldTrailerBePlayedToday() === false){
        console.log("[NotificationScheduler] Video has already been seen. Today's notifications not scheduled")
        return true
    }

    if(await isTodaysVideoScheduleEmpty() === true){
        console.log("[NotificationScheduler] No Video scheduled for today. Today's notifications not scheduled.")
        await clearAllNotifications()
        await scheduleNotificationsForUpcomingDays()
        return true
    }

    await scheduleNotificationsForTheDay()
}

export default handleNotificationsForTheDay

