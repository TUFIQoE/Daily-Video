import AsyncStorage from "@react-native-async-storage/async-storage";


export const isSurveyAvailable = async () => {
    const schedule_s = await AsyncStorage.getItem("schedule")
    const today = new Date().setHours(0,0,0,0)

    if(!schedule_s){
        return false
    }

    const schedule = JSON.parse(schedule_s)
    for(let i=0; i<schedule.length; i++){
        const day = schedule[i]
        if(new Date(day.start).setHours(0,0,0,0) === today){
            if(day.reply_form && day.reply_form.length > 0){
                return true
            }
            else{
                return false
            }
        }
    }
}