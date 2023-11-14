import {INTERVALS} from "../../config";
import {Store} from "../../redux/store";
import {getLocalDateTime, getLocalDatetimeAndTimezone} from "../timeUtils";
import {setAccelerometerUpdateData} from "../../redux/actions/videoActions";

import {Accelerometer} from "expo-sensors";
import {roundNumber} from "../numericUtils";


class AccelerometerSensor {
    constructor() {
    }

    async init() {
        const isAvailable = await Accelerometer.isAvailableAsync()
        if (isAvailable === true) {
            await Accelerometer.setUpdateInterval(INTERVALS.ACCELEROMETER_SENSOR)
            Accelerometer.addListener(motion_update)
        }
    }

    get_data() {
        const data = Store.getState().videoReducer.accelerometer_update
        //return JSON.stringify(data)
        return data
    }

    kill() {
        console.log("[MotionSensor] Killing myself")
        Accelerometer.removeAllListeners()
    }
}


function motion_update(update) {

    const tmp = Store.getState().videoReducer.accelerometer_update
    tmp.x.push(roundNumber(update.x, 5))
    tmp.y.push(roundNumber(update.y, 5))
    tmp.z.push(roundNumber(update.z, 5))
    tmp.timestamp.push(getLocalDatetimeAndTimezone(new Date()))

    Store.dispatch(setAccelerometerUpdateData(tmp))
}


export default AccelerometerSensor
