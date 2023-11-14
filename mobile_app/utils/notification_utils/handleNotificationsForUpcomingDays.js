import {shouldTrailerBePlayedToday} from "../timeUtils";
import {scheduleNotificationsForUpcomingDays} from "./scheduleNotificationsForUpcomingDays";

const handleNotificationsForUpcomingDays = async () => {

    // In case trailer can be displayed today the notifications for upcoming days are not scheduled.
    if(await shouldTrailerBePlayedToday() === true){
        console.log("[NotificationScheduler] Daily trailer available. Notifications for upcoming days are not scheduled")
        return
    }

    await scheduleNotificationsForUpcomingDays()
}

export default handleNotificationsForUpcomingDays
