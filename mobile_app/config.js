import * as FileSystem from "expo-file-system"
import * as app_json from "./app.json"

export const VERSION = `dev beta ${app_json.expo.version}`

// API_PREFIX NEEDS TO BE SET PROPERLY, CHECK TWICE ! ! !
const PROD_SERVER_PREFIX = "https://longterm.yourdomain.io/api"
const DEV_SERVER_PREFIX = "https://longterm-dev.yourdomain.io/api"
export const API_PREFIX = PROD_SERVER_PREFIX

// VIDEO_DOWNLOAD_PREFIX NEEDS TO BE SET PROPERLY, CHECK TWICE ! ! !
const PROD_VIDEO_DOWNLOAD_PREFIX = "https://longterm.yourdomain.io/media/videos"
const DEV_VIDEO_DOWNLOAD_PREFIX = "https://longterm-dev.yourdomain.io/media/videos"
export const VIDEO_DOWNLOAD_PREFIX = PROD_VIDEO_DOWNLOAD_PREFIX


export const VIDEO_DIRECTORY = FileSystem.documentDirectory + "video"
export const INTERVALS = {
    PLAYBACK_SENSOR: 250,
    ACCELEROMETER_SENSOR: 250,
    GYROSCOPE_SENSOR: 250
}
export const STORAGE_KEYS = {
    ACCESS_TOKEN: "access_token",
    SCHEDULE: "schedule",
    PHONE_NUMBER: "phone_number",
    USER_FIRST_NAME: "user_first_name",
    USER_LAST_NAME: "user_last_name",
    LAST_VIDEO_SEEN: "last_video_seen",
    NEXT_VIDEO_PLAYBACK_DAY: "next_video_playback_day",
    LAST_VISITED: "last_visited",
    VIDEO_SCHEDULE: "video_schedule",
    NOTIFICATIONS_CONFIG: "notifications_config",
    NEXT_OVERDUE_DATA_UPLOAD: "next_overdue_data_upload",
    LANGUAGE: "language",
    DATA_TO_SEND: "data_to_send",
    NEXT_SURVEY_DAY: "next_survey_day"
}

export const GYROSCOPE_DATA_STRUCTURE = {
    x: [],
    y: [],
    z: [],
    timestamp: []
}
export const ACCELEROMETER_DATA_STRUCTURE = {
    x: [],
    y: [],
    z: [],
    timestamp: []
}

export const PLAYBACK_DATA_STRUCTURE = {
    timestamp: [],
    duration_ms: [],
    position_ms: [],
    playing: [],
    fullscreen_status: [],
    phone_orientation: [],
    brightness: []
}

export const SUPPORTED_LANGUAGES = {
    POL: true,
    ENG: true,
    NOR: false
}

const PRODUCTION_CONFIG = {
    DELETE_ALL_VIDEOS: false,                                                            // Deletes "video" directory on app load      PRODUCTION - FALSE
    LOGOUT: false,                                                                               // Deletes access token from AsyncStorage --> results in logout    PRODUCTION - FALSE
    UPDATE_NEXT_VIDEO_PLAYBACK_DAY: true,                                 // After watching the video make it impossible to watch again that day --> user has to visit the app next day    PRODUCTION - TRUE
    NOTIFICATIONS_DAYS: 5,                                                              // Describes how many days in advance the notifications will be scheduled       PRODUCTION - WHATEVER
    SAVE_SERVICE_CHOICE: true,                                                          // Saves picked service in case in was not finished, app reloaded PRODUCTION - TRUE
    TIME_ELAPSED_SINCE_LAST_APP_VISIT: 900*1000 // 15 minutes       // [ms], Value used to check whether app state should be updated
}

const DEVELOPMENT_CONFIG = {
    DELETE_ALL_VIDEOS : false,
    LOGOUT: false,
    UPDATE_NEXT_VIDEO_PLAYBACK_DAY: true,
    NOTIFICATIONS_DAYS: 5,
    SAVE_SERVICE_CHOICE: false,
    TIME_ELAPSED_SINCE_LAST_APP_VISIT: 5000 // value in milliseconds
}


export const CONFIGURATION = PRODUCTION_CONFIG