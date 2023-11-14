import * as FileSystem from "expo-file-system";


const createVideoDirectory = async () => {
    const dir_info = await FileSystem.getInfoAsync(FileSystem.documentDirectory + "video")
    if (dir_info.exists === false) {
        const uri = FileSystem.documentDirectory + "video"
        console.log("Creating video directory at " + uri)
        await FileSystem.makeDirectoryAsync(uri)
    } else {
        console.log("Video directory already exists")
    }
}

export default createVideoDirectory