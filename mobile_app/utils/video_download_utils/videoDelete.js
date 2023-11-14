import getVideoSchedule from "./getVideoSchedule";
import * as FileSystem from "expo-file-system";
import {VIDEO_DIRECTORY} from "../../config";

const deleteObsoleteVideos = async () => {
    const schedule = await getVideoSchedule(5, true, true)
    const downloaded_videos = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "video")

    const schedule_filenames = schedule.map((item) => {
        return item.filename
    })

    // Check if video is downloaded but is not in schedule, if so delete it
    for (const video of downloaded_videos) {
        if(schedule_filenames.includes(video)){
            console.log("Video is scheduled for display")
        }
        else{
            console.log("Video is downloaded but not scheduled for display. Deleting...")
            try {
                await FileSystem.deleteAsync(VIDEO_DIRECTORY + "/" + video)
                console.log(`Deleted ${video}`)
            }
            catch (e){
                console.log("Error during deleting video " + video)
            }
        }
    }
}




export default deleteObsoleteVideos