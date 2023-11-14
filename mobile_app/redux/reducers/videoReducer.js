import {
    SET_DOWNLOADING_FOR_THE_DAY,
    SET_FULLSCREEN_STATUS,
    SET_GYROSCOPE_UPDATE_DATA,
    SET_ACCELEROMETER_UPDATE_DATA,
    SET_PLAYBACK_UPDATE_DATA,
    SET_VIDEO_TO_DISPLAY,
    SET_SERVICE_TO_DISPLAY
} from "../actions/videoActions";
import {ACCELEROMETER_DATA_STRUCTURE, GYROSCOPE_DATA_STRUCTURE, PLAYBACK_DATA_STRUCTURE} from "../../config";

const initialState = {
    file_uri: "",
    service: "",
    download_state: false,
    playback_update: PLAYBACK_DATA_STRUCTURE,
    accelerometer_update: ACCELEROMETER_DATA_STRUCTURE,
    gyroscope_update: GYROSCOPE_DATA_STRUCTURE,
    fullscreen_status: ""
}

const videoReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_DOWNLOADING_FOR_THE_DAY:
            return {...state, download_state: action.payload}
        case SET_VIDEO_TO_DISPLAY:
            return {...state, file_uri: action.payload}
        case SET_SERVICE_TO_DISPLAY:
            return {...state, service: action.payload}
        case SET_PLAYBACK_UPDATE_DATA:
            return {...state, playback_update: action.payload}
        case SET_FULLSCREEN_STATUS:
            return {...state, fullscreen_status: action.payload}
        case SET_ACCELEROMETER_UPDATE_DATA:
            return {...state, accelerometer_update: action.payload}
        case SET_GYROSCOPE_UPDATE_DATA:
            return {...state, gyroscope_update: action.payload}

        default:
            return state
    }
}

export default videoReducer