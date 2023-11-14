import {API_PREFIX, STORAGE_KEYS} from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Crypto from "expo-crypto"
import {CryptoEncoding} from "expo-crypto"
import {setNextVideoPlaybackDay} from "../video_download_utils/setNextVideoPlaybackDay";
import {removeWhitespaces} from "../stringUtils";
import {setNextSurveyDay} from "../video_download_utils/setNextSurveyDay";
import {updateSchedule} from "../schedule_utils/updateSchedule";


export const login = async (navigation) => {
    const url = API_PREFIX + "/users/token/login/"
    const credentials = {
        name: removeWhitespaces(await AsyncStorage.getItem("user_first_name")),
        surname: removeWhitespaces(await AsyncStorage.getItem("user_last_name")),
        phone: removeWhitespaces(await AsyncStorage.getItem("phone_number"))
    }

    // Generate hash instead of sending credentials
    const salt = 'your-salt-here'
    const external_id = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${credentials.name}${credentials.surname}${credentials.phone}${salt}`,
        {
            encoding: CryptoEncoding.HEX
        }
    )
    const data = {
        external_id: external_id
    }

    axios.post(url, data).then(async res => {
        console.log(res.data)
        if (res.data.auth_token) {
            // Save access token in storage
            await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.data.auth_token)

            // Set next_video_playback_day
            await setNextVideoPlaybackDay(true)

            // Set next_survey_day
            await setNextSurveyDay(true)

            // Update schedule
            await updateSchedule()

            await navigation.reset({
                index: 0,
                routes: [{name: "InitialConfigSuccess"}]
            })
        } else {
            await navigation.reset({
                index: 0,
                routes: [{name: "InitialConfigFailure"}]
            })
        }
    }).catch(async err => {
        console.log(err.response)
        await navigation.reset({
            index: 0,
            routes: [{name: "InitialConfigFailure"}]
        })
    })
}

export const isLoggedIn = async () =>{
    const access_token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    if(access_token){
        return true
    }
    else{
        return false
    }
}