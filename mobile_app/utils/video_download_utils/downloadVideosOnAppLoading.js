import getVideoSchedule from "./getVideoSchedule";
import * as FileSystem from "expo-file-system"
import {FileSystemSessionType} from "expo-file-system"
import {API_PREFIX, STORAGE_KEYS, VIDEO_DIRECTORY, VIDEO_DOWNLOAD_PREFIX} from "../../config";
import {setDownloadingForTheDay} from "../../redux/actions/videoActions";
import {Store} from "../../redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {getLocalDateTime} from "../timeUtils";
import {reportVideoUnavailable} from "./reportVideoUnavailable";
import * as Filesystem from "expo-file-system";



const downloadVideosOnAppLoading = async () => {
    const schedule = await getVideoSchedule(5, true, true)
    await AsyncStorage.setItem(STORAGE_KEYS.VIDEO_SCHEDULE, JSON.stringify(schedule)) // <-- Save schedule to async storage
    const downloaded_videos = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "video")
    const videos_for_today = []
    const videos_for_upcoming_days = []

    schedule.map(async item => {
        const {filename, start, service_name} = item
        const today = new Date().setHours(0, 0, 0, 0)

        if (downloaded_videos.includes(filename) === false) {
            // Check if the video is meant to be displayed today
            if (today === new Date(start).setHours(0, 0, 0, 0)) {
                // Changing video download state (Redux)
                Store.dispatch(setDownloadingForTheDay(true))
                videos_for_today.push(item) // Adding entire item (filename, start, service_name)
            } else {
                // If the video is not meant for today simply download it in background
                videos_for_upcoming_days.push(item)
            }
        } else {
            console.log("Video already on the device")
        }
    })

    await downloadSequentially(videos_for_today)
    downloadSequentially(videos_for_upcoming_days) // NO await here, we dont want to wait for promise to resolve
}


const downloadSequentially = async (videos) => {
    console.log(videos)
    Store.dispatch(setDownloadingForTheDay(false)) // Setting it to false for now, separate view --> see Trailers
    for(let i=0; i< videos.length; i++){
        const video = videos[i]
        try{
            const result = await axios.head(video.url)   // <-- HEAD request to check if video is available at remote server
            console.log(result.headers["content-length"])
            if(result.status !== 404){
                // Check if there is enough storage space
                const content_length = result.headers["content-length"]
                const free_space = await Filesystem.getFreeDiskStorageAsync()
                if(free_space < content_length){
                    console.log("Not enough space on the device")
                    return
                }
                // Download video from server
                try{
                    const res = await FileSystem.downloadAsync(video.url, VIDEO_DIRECTORY + `/${video.filename}`, {
                        sessionType: FileSystemSessionType.BACKGROUND
                    })
                    console.log(`Finished downloading to ${res.uri}`)
                }catch (err){
                    console.log(err)
                }
            }
        }
        catch (err){
            if(err.response.status === 404){
                console.log("Resources not available at the remote server")
                await reportVideoUnavailable(video.filename)
            }
            else{
                console.log(err)
            }
        }
    }
}

const archive = [/*

    // 1. Create array of promises for downloading today's videos
    const promises = videos_for_today.map(async video => {
        console.log("Creating promise for todays video")
        try{
            const result = await axios.head(video.url)   // <-- HEAD request to check if video is available at remote server
            console.log(result.headers["content-length"])
            if(result.status !== 404){
                // Check if there is enough storage space
                const content_length = result.headers["content-length"]
                const free_space = await Filesystem.getFreeDiskStorageAsync()
                if(free_space < content_length){
                    console.log("Not enough space on the device")
                    return
                }

                await FileSystem.downloadAsync(video.url, VIDEO_DIRECTORY + `/${video.filename}`, {
                    sessionType: FileSystemSessionType.BACKGROUND
                })
                    .then(res => {
                        console.log(`Finished downloading (video for today) to ${res.uri}`)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        }
        catch (err){
            if(err.response.status === 404){
                console.log("Resources not available at the remote server")
                await reportVideoUnavailable(video.filename)
            }
            else{
                console.log(err)
            }
        }
    })

    // 2. Create array of promises in order to download videos for upcoming days
    const _promises = videos_for_upcoming_days.map(async video => {
        console.log("Creating promise for upcoming day's video")
        try{
            const result = await axios.head(video.url)   // <-- HEAD request to check if video is available at remote server
            if(result.status !== 404){
                // Check if there is enough storage space
                const content_length = result.headers["content-length"]
                const free_space = await Filesystem.getFreeDiskStorageAsync()
                if(free_space < content_length){
                    console.log("Not enough space on the device")
                    return
                }

                await FileSystem.downloadAsync(video.url, VIDEO_DIRECTORY + `/${video.filename}`, {
                    sessionType: FileSystemSessionType.BACKGROUND
                })
                    .then(res => {
                        console.log(`Finished downloading (video for upcoming days) to ${res.uri}`)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        }
        catch (err){
            if(err.response.status === 404){
                console.log("Resources not available at the remote server")
                await reportVideoUnavailable(video.filename)
            }
            else{
                console.log(err)
            }
        }
    })


    // Execute promises
    if (promises.length > 0) {
        Promise.all(promises).then(() => {
            console.log("All videos meant to be displayed today are downloaded")
            Store.dispatch(setDownloadingForTheDay(false))
        }).catch(err => {
            console.log(err)
        })
    }

    if(_promises.length > 0){
        Promise.all(_promises).then(() => {
            console.log("All videos meant to by played in upcoming days are downloaded")
        }).catch(err => {
            console.log(err)
        })
    }

     */]

export default downloadVideosOnAppLoading