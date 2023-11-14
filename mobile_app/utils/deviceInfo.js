import * as Device from "expo-device"
import * as Filesystem from "expo-file-system"
import {Platform} from "react-native";

export const getDeviceInformation = () => {
    const data = {
        os: Platform.OS,
        brand: Device.brand,
        manufacturer: Device.manufacturer,
        model: Device.modelName,
        model_id: Device.modelId, // <-- only iOS, on Android null is returned
        device_year_class: Device.deviceYearClass,
        os_name: Device.osName,
        os_version: Device.osVersion,
        platform_api_level: Device.platformApiLevel, // only Android, on iOS null is returned
    }

    return data
}

export const getDeviceMemory = async () => {
    const free = await Filesystem.getFreeDiskStorageAsync()  // <-- Returns disk capacity in bytes
    const total = await Filesystem.getTotalDiskCapacityAsync()
    const ratio = `${free} / ${total}`

    return {
        free_memory: free,
        total_memory: total,
        ratio: ratio
    }
}


