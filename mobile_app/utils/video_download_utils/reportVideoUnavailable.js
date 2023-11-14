import axios from "axios";
import {API_PREFIX, STORAGE_KEYS} from "../../config";
import {getLocalDateTime, getLocalDatetimeAndTimezone} from "../timeUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const reportVideoUnavailable = async (filename) => {
    const url = API_PREFIX + "/missing-videos/"
    const data = {
        date: getLocalDatetimeAndTimezone(new Date()),
        video: filename
    }
    const config = {
        headers: {
            Authorization: `Token ${await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)}`
        }
    }

    // Send request
    try{
        const response = await axios.post(url, data, config)
        console.log(response.status)
    }
    catch (err){
        console.log(err.response.status)
    }

}