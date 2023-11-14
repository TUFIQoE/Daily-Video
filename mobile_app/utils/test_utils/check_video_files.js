import * as FileSystem from 'expo-file-system'
import {VIDEO_DIRECTORY} from "../../config";

export const check_video_files = async () => {
    const files = await FileSystem.readDirectoryAsync(VIDEO_DIRECTORY)
    console.log(files)
}