import AsyncStorage from "@react-native-async-storage/async-storage";

const setNextOverdueDataUploadDay = async (set_to_today=false) => {
    if(set_to_today === true){
        const today = new Date()
        await AsyncStorage.setItem("next_overdue_data_upload", JSON.stringify(today))
    }
    else{
        const today = new Date()
        const tomorrow = new Date(today.setDate(today.getDate() + 1))
        await AsyncStorage.setItem("next_overdue_data_upload", JSON.stringify(tomorrow))
    }
}


export default setNextOverdueDataUploadDay