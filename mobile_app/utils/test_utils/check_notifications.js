import * as Notifications from "expo-notifications";
import {Platform} from "react-native";
import {shouldTrailerBePlayedToday} from "../timeUtils";



export const check_notifications = async () => {
    if(Platform.OS === "ios"){
        await check_notifications_ios()
    }
    else if(Platform.OS === "android"){
        await check_notifications_android()
    }
}



// iOS uses UNTimeIntervalNotificationTrigger which returns number of seconds until the notification will be triggered
const check_notifications_ios = async () => {
    const notifications = await Notifications.getAllScheduledNotificationsAsync()
    const valid = await shouldTrailerBePlayedToday()
    notifications.forEach((notification) => {
        valid ? console.log(notification.trigger) :  console.log(new Date(new Date().getTime() + (notification.trigger.seconds * 1000)))
    })
}

// Android trigger takes number of milliseconds (Unix time of the notification trigger)
const check_notifications_android = async () => {
    const notifications = await Notifications.getAllScheduledNotificationsAsync()
    const valid = await shouldTrailerBePlayedToday()
    notifications.forEach((notification) => {
        valid ? console.log(notification.trigger) : console.log(new Date(notification.trigger.value))
    })
}


//console.log(notification) //iOS
//console.log(notification.trigger) //android