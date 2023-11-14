import * as FileSystem from "expo-file-system"
import axios from "axios";
import {VIDEO_DIRECTORY, VIDEO_DOWNLOAD_PREFIX} from "../../config";

export const checkVideosIntegrity = async () => {
    const videos = await FileSystem.readDirectoryAsync(VIDEO_DIRECTORY)
    for(let i=0; i<videos.length; i++){
        const filename = videos[i]
        const local_data = await FileSystem.getInfoAsync(VIDEO_DIRECTORY + `/${filename}`)
        const local_size = local_data.size

        try{
            const response = await axios.head(VIDEO_DOWNLOAD_PREFIX + `/${filename}`)
            const real_size = response.headers["content-length"]
            if(local_size !== parseInt(real_size)){
                console.log(`File ${filename} download state ${local_size/real_size}. Deleting...`)
                await FileSystem.deleteAsync(VIDEO_DIRECTORY + `/${filename}`)
            }
            else{
                console.log(`File ${filename} download state ${local_size/real_size}. OK`)
            }
        }
        catch (err){
            console.log(err)
        }
    }
}