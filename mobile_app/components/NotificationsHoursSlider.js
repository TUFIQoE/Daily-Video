import React from "react";
import {COLORS} from "../styles/config";
import Slider from "@react-native-community/slider";



const NotificationsHoursSlider = (props) => {
    return(
        <Slider   style={{width: "80%", height: 20}}
                  minimumValue={0}
                  maximumValue={23}
                  minimumTrackTintColor={COLORS.primary}
                  maximumTrackTintColor={COLORS.light}
                  step={1}
                  value={props.triggers[props.indexToModify] ? props.triggers[props.indexToModify].hour : null} // Value needs to be checked, causes significant error if index is out of array
                  thumbTintColor={COLORS.secondary}
                  onValueChange={async (value) => {
                      const triggers_update = [...props.triggers]
                      triggers_update[props.indexToModify].hour = value

                      props.setTriggers(triggers_update)
                      if(props.updateAsyncStorage){
                          await props.updateAsyncStorage(triggers_update)
                      }
                  }}
        />
    )
}

export default NotificationsHoursSlider