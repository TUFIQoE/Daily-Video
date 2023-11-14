import AsyncStorage from "@react-native-async-storage/async-storage";

export const getLocalDateTime = (object) => {
    const year = object.getFullYear()
    const month = (object.getMonth()+1).toString().padStart(2, "0")
    const day = object.getDate().toString().padStart(2, "0")

    const hours = object.getHours().toString().padStart(2, "0")
    const minutes = object.getMinutes().toString().padStart(2, "0")
    const seconds = object.getSeconds().toString().padStart(2, "0")
    const milliseconds = object.getMilliseconds().toString().padStart(3, "0")

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`   // <-- Local datetime in extended ISO format ''YYYY-MM-DDTHH:MM:SS:XXX''
}


export const shouldTrailerBePlayedToday = async () => {
    const next_video_playback_day = new Date(JSON.parse(await AsyncStorage.getItem("next_video_playback_day")))

    const today = new Date().setHours(0, 0,0, 0)
    const toCompare = new Date(next_video_playback_day.setHours(0, 0, 0, 0))

    return today >= toCompare
}


export const getLocalDatetimeAndTimezone = (object) => {
    // Get the datetime
    const year = object.getFullYear()
    const month = (object.getMonth()+1).toString().padStart(2, "0")
    const day = object.getDate().toString().padStart(2, "0")

    const hours = object.getHours().toString().padStart(2, "0")
    const minutes = object.getMinutes().toString().padStart(2, "0")
    const seconds = object.getSeconds().toString().padStart(2, "0")
    const milliseconds = object.getMilliseconds().toString().padStart(3, "0")

    const datetime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`


    // Get timezone offset in +/- HH:MM format
    const timezone_offset_min = object.getTimezoneOffset()
    const offset_hrs = Math.abs(timezone_offset_min/60)
    const offset_min = Math.abs(timezone_offset_min%60)

    if(timezone_offset_min <= 0){
        const timezone_standard = "+" + offset_hrs.toString().padStart(2, "0") + ":" + offset_min.toString().padStart(2, "0")
        return datetime+timezone_standard
    }
    else if(timezone_offset_min > 0){
        const timezone_standard = "-" + offset_hrs.toString().padStart(2, "0") + ":" + offset_min.toString().padStart(2, "0")
        return datetime+timezone_standard
    }
}





