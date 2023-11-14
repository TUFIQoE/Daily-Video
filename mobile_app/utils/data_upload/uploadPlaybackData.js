import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Network from "expo-network"
import {
    ACCELEROMETER_DATA_STRUCTURE,
    API_PREFIX,
    GYROSCOPE_DATA_STRUCTURE,
    PLAYBACK_DATA_STRUCTURE, STORAGE_KEYS
} from "../../config";
import {Store} from "../../redux/store";
import {
    setAccelerometerUpdateData,
    setGyroscopeUpdateData,
    setPlaybackUpdateData
} from "../../redux/actions/videoActions";

export const uploadPlaybackData = async (data) => {

    const network = await Network.getNetworkStateAsync()

    // Check Internet connection
    if(network.isInternetReachable === false){
        console.log("No Internet Connection. Saving data for further retries")
        await savePlaybackDataToAsyncStorage(data)
        return  // Escape function if there is no Internet connection
    }

    // Send data if Internet is reachable
    const url = API_PREFIX+"/watch-results/"
    const access_token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    const config = {
        headers: {
            Authorization: `Token ${access_token}`
        }
    }
    try{
        const response = await axios.post(url, data, config)
        console.log(response.status)
        await AsyncStorage.removeItem(STORAGE_KEYS.DATA_TO_SEND)

        // Clear redux playback states
        clearPlaybackDataReduxStates()
    }
    catch (error){
        await savePlaybackDataToAsyncStorage(data)

        // Clear redux playback states
        clearPlaybackDataReduxStates()
    }
}


export const savePlaybackDataToAsyncStorage = async (data) => {
    console.log("[OverdueDataHandler] Saving data to AsyncStorage")
    await AsyncStorage.setItem(STORAGE_KEYS.DATA_TO_SEND, JSON.stringify(data))
}

export const handleOverdueData = async () => {

    // First check if next_overdue_data_upload is set to today
    if(await AsyncStorage.getItem("next_overdue_data_upload") != null){
        const next_overdue_data_upload = new Date(JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.NEXT_OVERDUE_DATA_UPLOAD))).setHours(0,0,0,0)
        const today = new Date().setHours(0,0,0,0)

        if(today >= next_overdue_data_upload){  // Valid date, proceed...
            const data = await AsyncStorage.getItem(STORAGE_KEYS.DATA_TO_SEND)
            if(data == null){
                console.log("[OverdueDataHandler] There is no overdue data to send")
                return
            }
            const overdue_data = JSON.parse(data)
            console.log("[OverdueDataHandler] Sending overdue data now")
            await uploadPlaybackData(overdue_data)
        }
        else{
            console.log("[OverdueDataHandler] Video has been seen today. Waiting with upload until tomorrow :)")
        }
    }
    else{
        console.log("[OverdueDataHandler] There is no next_overdue_data_upload in AsyncStorage")
    }
}


export const clearPlaybackDataReduxStates = () => {
    Store.dispatch(setPlaybackUpdateData(PLAYBACK_DATA_STRUCTURE))
    Store.dispatch(setAccelerometerUpdateData(ACCELEROMETER_DATA_STRUCTURE))
    Store.dispatch(setGyroscopeUpdateData(GYROSCOPE_DATA_STRUCTURE))
}