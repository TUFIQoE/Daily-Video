import AsyncStorage from "@react-native-async-storage/async-storage";


export const setNextVideoPlaybackDay = async (set_to_today=false) => {
    if(set_to_today === true){
        const today = new Date()
        await AsyncStorage.setItem("next_video_playback_day", JSON.stringify(today))
    }
    else{
        const today = new Date()
        const tomorrow = new Date(today.setDate(today.getDate() + 1))
        await AsyncStorage.setItem("next_video_playback_day", JSON.stringify(tomorrow))
    }
}