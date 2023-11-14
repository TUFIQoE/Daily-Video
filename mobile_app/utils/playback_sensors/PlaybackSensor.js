import {getLocalDateTime, getLocalDatetimeAndTimezone} from "../timeUtils";
import {Store} from "../../redux/store";
import {setPlaybackUpdateData} from "../../redux/actions/videoActions";
import {INTERVALS} from "../../config";
import {Platform} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import * as Brightness from "expo-brightness"
import {roundNumber} from "../numericUtils";
import {BrightnessMode} from "expo-brightness";



class PlaybackSensor {
    constructor(video_ref, timer_ref) {
        this.status_code = {
            0: "FULLSCREEN_UPDATE_PLAYER_WILL_PRESENT",     // describing that the fullscreen player is about to present
            1: "FULLSCREEN_UPDATE_PLAYER_DID_PRESENT",       // describing that the fullscreen player just finished presenting
            2: "FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS",     // describing that the fullscreen player is about to dismiss
            3: "FULLSCREEN_UPDATE_PLAYER_DID_DISMISS"        // describing that the fullscreen player just finished dismissing
        }
        this.timer_ref = timer_ref
        this.video_ref = video_ref
    }

    async init() {
        this.timer_ref.current = setInterval(async () => {
            this.playback_update()
        }, INTERVALS.PLAYBACK_SENSOR)
        //await Brightness.setSystemBrightnessModeAsync(BrightnessMode.AUTOMATIC)
    }

    kill() {
        console.log("[PlaybackSensor] Killing myself")
        clearInterval(this.timer_ref.current)
    }

    get_data() {
        const state = Store.getState()
        const data = state.videoReducer.playback_update

        return data
    }

    async playback_update() {
        const status = await this.video_ref?.current?.getStatusAsync()
        const orientation = await ScreenOrientation.getOrientationAsync()


        if (status) {
            /*
                 const data = {
                    dur_ms: status.durationMillis ?? null,
                    pos_ms: status.positionMillis ?? null,
                    playing: status.isPlaying,
                    ful_sta: Platform.OS === "ios" ? "FULLSCREEN" : Store.getState().videoReducer.fullscreen_status,   // on iOS player is ALWAYS in "FAKE FULLSCREEN" mode
                    p_orien: ORIENTATION_CODE[orientation],
                    tstp: getLocalDatetimeAndTimezone(new Date()),
                    brt: roundNumber(await Brightness.getBrightnessAsync(), 3)
                }
            */
            //const tmp_data = [...Store.getState().videoReducer.playback_update]
            //tmp_data.push(data)
            //Store.dispatch(setPlaybackUpdateData(tmp_data))

            const tmp = Store.getState().videoReducer.playback_update
            tmp.duration_ms.push(status.durationMillis ?? null)
            tmp.position_ms.push(status.positionMillis ?? null)
            tmp.playing.push(status.isPlaying)
            tmp.fullscreen_status.push(Platform.OS === "ios" ? "FULLSCREEN" : Store.getState().videoReducer.fullscreen_status)
            tmp.phone_orientation.push(ORIENTATION_CODE[orientation])
            tmp.timestamp.push(getLocalDatetimeAndTimezone(new Date()))
            tmp.brightness.push(roundNumber(await Brightness.getBrightnessAsync(), 3))

            Store.dispatch(setPlaybackUpdateData(tmp))
        }
    }

    async fullscreen_update(status, fullscreenUpdate) {
        const orientation = await ScreenOrientation.getOrientationAsync()
        /*
        const data = {
            dur_ms: status.durationMillis ?? null,
            pos_ms: status.positionMillis ?? null,
            playing: status.isPlaying,
            ful_sta: this.status_code[parseInt(fullscreenUpdate)],
            p_orien: ORIENTATION_CODE[orientation],
            tstp: getLocalDatetimeAndTimezone(new Date()),
            brt: roundNumber(await Brightness.getBrightnessAsync(), 3)
        }
        // Update Redux Storage
        const tmp_data = [...Store.getState().videoReducer.playback_update]
        tmp_data.push(data)
        Store.dispatch(setPlaybackUpdateData(tmp_data))
        */
        const tmp = Store.getState().videoReducer.playback_update
        tmp.duration_ms.push(status.durationMillis ?? null)
        tmp.position_ms.push(status.positionMillis ?? null)
        tmp.playing.push(status.isPlaying)
        tmp.fullscreen_status.push(Platform.OS === "ios" ? "FULLSCREEN" : Store.getState().videoReducer.fullscreen_status)
        tmp.phone_orientation.push(ORIENTATION_CODE[orientation])
        tmp.timestamp.push(getLocalDatetimeAndTimezone(new Date()))
        tmp.brightness.push(roundNumber(await Brightness.getBrightnessAsync(), 3))

        Store.dispatch(setPlaybackUpdateData(tmp))

    }

}

const ORIENTATION_CODE = {
    0: "UNKNOWN",
    1: "PORTRAIT_UP",
    2: "PORTRAIT_DOWN",
    3: "LANDSCAPE_LEFT",
    4: "LANDSCAPE_RIGHT"
}


export default PlaybackSensor