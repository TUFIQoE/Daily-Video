import axios from "axios";
import {API_PREFIX, STORAGE_KEYS, VIDEO_DOWNLOAD_PREFIX} from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* TAKE NOTE
    getVideoSchedule method not only returns desired scheduled but it
    uptades the Async Storage by default.
    This behaviour can be changed by passing false as third argument.
 */

/* TAKE NOTE AGAIN
    getVideoSchedule method returns scheduled videos
    it extracts videos from the general schedule
    It returns an array:
    [
        {
            filename: "name.mp4",
            service_name: "A",
            start: "2022-02-11T00:00:00",   HERE WE ONLY CARE ABOUT START DATE, IT IS ALREADY SET TO 0,0,0,0 HOURS
            url: "url_to_the_resource"
        }
    ]
 */

// IMPORTANT Use getVideoSchedule(5, true, 0) in order to obtain videos scheduled for today

const getVideoSchedule = async (days = 5, include_today = true, update_storage = true) => {

    const url = API_PREFIX + "/users/me/config/"
    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    const config = {
        headers: {
            Authorization: `Token ${token}`
        }
    }
    const res = await axios(url, config)
    const schedule = await res.data.schedule.schedule   // yes, schedule.schedule
    const today = new Date()
    const schedule_short = []

    schedule.forEach(entry => {
        const day_diff = get_day_diff(today, entry.start)
        if (include_today === true) {
            if (day_diff <= days && day_diff >= 0) { // <-- Reject days in the past
                entry.service.forEach(service => {
                    schedule_short.push({
                        start: entry.start,
                        url: VIDEO_DOWNLOAD_PREFIX + "/" + service.video,
                        filename: get_filename(service.video),
                        service_name: service.service_name
                    })
                })
            }
        } else {
            if (day_diff <= days && day_diff >= 1) { // <-- Reject days in the past and current day ! ! !
                entry.service.forEach(service => {
                    schedule_short.push({
                        start: entry.start,
                        url: VIDEO_DOWNLOAD_PREFIX + "/" + service.video,
                        filename: get_filename(service.video),
                        service_name: service.service_name
                    })
                })
            }
        }
    })

    // Updating Async Storage
    if (update_storage === true) {
        await AsyncStorage.setItem(STORAGE_KEYS.VIDEO_SCHEDULE, JSON.stringify(schedule_short))
    }

    return schedule_short
}


const get_day_diff = (today = new Date(), another) => {
    const d1 = today.setHours(0, 0, 0, 0)
    const d2 = new Date(another).setHours(0, 0, 0, 0)

    const diffTime = d2 - d1
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
}

const get_filename = (url) => {
    return url.substr(url.lastIndexOf("/")+1)
}

export default getVideoSchedule