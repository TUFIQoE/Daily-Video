import {INTERVALS} from "../../config";
import {Store} from "../../redux/store";

import {getLocalDateTime, getLocalDatetimeAndTimezone} from "../timeUtils";
import {setAccelerometerUpdateData, setGyroscopeUpdateData} from "../../redux/actions/videoActions";

import {Gyroscope} from "expo-sensors";
import {roundNumber} from "../numericUtils";

let timer = new Date()

class GyroscopeSensor {
    constructor() {
    }

    async init() {
        const isAvailable = await Gyroscope.isAvailableAsync()
        if (isAvailable === true) {
            await Gyroscope.setUpdateInterval(INTERVALS.GYROSCOPE_SENSOR)
            Gyroscope.addListener(motion_update)
        }
    }

    get_data() {
        const data = Store.getState().videoReducer.gyroscope_update
        //return JSON.stringify(data)
        return data
    }

    kill() {
        console.log("[MotionSensor] Killing myself")
        Gyroscope.removeAllListeners()
    }
}


function motion_update(update) {

    const tmp = Store.getState().videoReducer.gyroscope_update
    tmp.x.push(roundNumber(update.x, 5))
    tmp.y.push(roundNumber(update.y, 5))
    tmp.z.push(roundNumber(update.z, 5))
    tmp.timestamp.push(getLocalDatetimeAndTimezone(new Date()))

    Store.dispatch(setGyroscopeUpdateData(tmp))
}


export default GyroscopeSensor