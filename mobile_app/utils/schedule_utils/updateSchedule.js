import {API_PREFIX, STORAGE_KEYS} from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


export const updateSchedule = async () => {
    const url = API_PREFIX + "/users/me/config/"
    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    const config = {
        headers: {
            Authorization: `Token ${token}`
        }
    }
    const res = await axios(url, config)
    const schedule = await res.data.schedule.schedule   // yes, schedule.schedule

    await AsyncStorage.setItem("schedule", JSON.stringify(schedule))
}