import AsyncStorage from "@react-native-async-storage/async-storage";



export const check_async_storage = async () => {
    const storage = await AsyncStorage.getAllKeys()

    storage.map(async key => {
        console.log({
            name: key,
            payload: await AsyncStorage.getItem(key)
        })
    })
}