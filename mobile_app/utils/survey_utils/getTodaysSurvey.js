
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getSurveyForToday = async () => {
    const schedule = JSON.parse(await AsyncStorage.getItem("schedule"))
    const today = new Date().setHours(0,0,0,0)


    for(let i=0; i<schedule.length; i++){
        const day = schedule[i]

        if(new Date(day.start).setHours(0,0,0,0) === today && day.reply_form){
            return day.reply_form
        }
    }
}