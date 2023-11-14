import AsyncStorage from "@react-native-async-storage/async-storage";
import * as RootNavigation from "../RootNavigation"
import clearAllNotifications from "./notification_utils/clearAllNotifications";
import handleNotificationsForTheDay from "./notification_utils/handleNotificationsForTheDay";
import handleNotificationsForUpcomingDays from "./notification_utils/handleNotificationsForUpcomingDays";
import downloadVideosOnAppLoading from "./video_download_utils/downloadVideosOnAppLoading";
import deleteObsoleteVideos from "./video_download_utils/videoDelete";
import {handleOverdueData} from "./data_upload/uploadPlaybackData";
import * as Network from "expo-network";
import {APP_STATE_UPDATE_TIME, CONFIGURATION, STORAGE_KEYS, TIME_ELAPSED_SINCE_LAST_APP_VISIT} from "../config";
import {isLoggedIn} from "./initial_configuration_utils/login";
import * as ScreenOrientation from "expo-screen-orientation";
import * as Updates from "expo-updates";
import {updateSchedule} from "./schedule_utils/updateSchedule";
import {checkVideosIntegrity} from "./video_download_utils/checkVideosIntegrity";


export const setLastVisited = async () => {
    const date = new Date()
    console.log(`Setting ${JSON.stringify(date)}`)
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_VISITED, JSON.stringify(date))
}

export const updateAppState = async () => {
    await updateSchedule()

    await checkVideosIntegrity()    // This has to be before downloadVideosOnAppLoading() // ESSENTIAL
    await downloadVideosOnAppLoading()
    await deleteObsoleteVideos()

    await handleOverdueData()
    await clearAllNotifications()
    await handleNotificationsForTheDay()
    await handleNotificationsForUpcomingDays()
}

export const isInternetAvailable = async () => {
    const network = await Network.getNetworkStateAsync()
    if (network.isConnected === true && network.isInternetReachable === true) {
        return true
    }
    else{
        RootNavigation.reset("NoConnection", null)
        return false
    }
}

export const checkOnBackgroundToForeground = async () => {
    // Check if user is logged in
    if(await isLoggedIn() === false){
        return
    }
    // Check if Internet is reachable
    if(await isInternetAvailable() === false){
        return
    }

    const last_visited = new Date(JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.LAST_VISITED)))
    const now = new Date()
    console.log(`Calculating ${JSON.stringify(now)}  -  ${JSON.stringify(last_visited)}`)

    const elapsed = now - last_visited

    if(elapsed > CONFIGURATION.TIME_ELAPSED_SINCE_LAST_APP_VISIT){

        // THIS WORKS FOR SURE ON iOS AND ANDROID AS WELL (MAYBE)
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP) // <-- Lock screen in portrait up orientation (part of the iOS production workaround)
        await Updates.reloadAsync() // APP REBOOT IS ESSENTIAL ! ! ! IT RESETS THE REDUX STATES RELATED TO DATA GATHERED DURING VIDEO PLAYBACK



        // Code for loading circle before app reset
        /*
        RootNavigation.reset("Blackness", null)
        setTimeout(async () => {
            //RootNavigation.reset("Home", {screen: "Trailers"})
            //RootNavigation.reset("Home", null)
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP) // <-- Lock screen in portrait up orientation (part of the iOS production workaround)
            await Updates.reloadAsync()
        }, 1000)
         */






        //await Updates.reloadAsync()   // <-- Reloads the app
    }
}