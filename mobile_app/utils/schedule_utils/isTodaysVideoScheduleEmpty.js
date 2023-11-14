import AsyncStorage from "@react-native-async-storage/async-storage";
import {STORAGE_KEYS} from "../../config";

export const isTodaysVideoScheduleEmpty = async () => {
    if(await AsyncStorage.getItem(STORAGE_KEYS.VIDEO_SCHEDULE) == null){
        return false
    }

    const storage_schedule = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.VIDEO_SCHEDULE))
    const todays_schedule = []
    storage_schedule.forEach(item => {
        if (new Date(item.start).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
            todays_schedule.push(item)
        }
    })

    return todays_schedule.length === 0;
}