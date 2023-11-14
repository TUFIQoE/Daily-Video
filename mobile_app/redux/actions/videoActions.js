export const SET_DOWNLOADING_FOR_THE_DAY = "SET_DOWNLOADING_FOR_THE_DAY"
export const SET_VIDEO_TO_DISPLAY = "SET_VIDEO_TO_DISPLAY"
export const SET_SERVICE_TO_DISPLAY = "SET_SERVICE_TO_DISPLAY"
export const SET_PLAYBACK_UPDATE_DATA = "SET_PLAYBACK_UPDATE_DATA"
export const SET_FULLSCREEN_STATUS = "SET_FULLSCREEN_STATUS"
export const SET_GYROSCOPE_UPDATE_DATA = "SET_GYROSCOPE_UPDATE_DATA"
export const SET_ACCELEROMETER_UPDATE_DATA = "SET_ACCELEROMETER_UPDATE_DATA"

export const setDownloadingForTheDay = (download_state) => dispatch => {
    dispatch({
        type: SET_DOWNLOADING_FOR_THE_DAY,
        payload: download_state
    })
}
export const setVideoToDisplay = (file_uri) => dispatch => {
    dispatch({
        type: SET_VIDEO_TO_DISPLAY,
        payload: file_uri
    })
}
export const setServiceToDisplay = (service) => dispatch => {
    dispatch({
        type: SET_SERVICE_TO_DISPLAY,
        payload: service
    })
}

export const setPlaybackUpdateData = (playback_update) => dispatch => {
    dispatch({
        type: SET_PLAYBACK_UPDATE_DATA,
        payload: playback_update
    })
}

export const setAccelerometerUpdateData = (accelerometer_update) => dispatch => {
    dispatch({
        type: SET_ACCELEROMETER_UPDATE_DATA,
        payload: accelerometer_update
    })
}

export const setGyroscopeUpdateData = (gyroscope_update) => dispatch => {
    dispatch({
        type: SET_GYROSCOPE_UPDATE_DATA,
        payload: gyroscope_update
    })
}

export const setFullscreenStatus = (fullscreen_status) => dispatch => {
    dispatch({
        type: SET_FULLSCREEN_STATUS,
        payload: fullscreen_status
    })
}