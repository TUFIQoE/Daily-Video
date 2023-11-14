import React from "react";
import Slider from "@react-native-community/slider";
import {COLORS} from "../styles/config";





const NotificationsMinutesSlider = (props) => {
    console.log(props.triggers)
    return(
        <Slider   style={{width: "80%", height: 20}}
                  minimumValue={0}
                  maximumValue={59}
                  minimumTrackTintColor={COLORS.primary}
                  maximumTrackTintColor={COLORS.light}
                  step={1}
                  value={props.triggers[props.indexToModify] ? props.triggers[props.indexToModify].minute : null}   // Check if value exists, causes significant error if index is out of array
                  thumbTintColor={COLORS.secondary}
                  onValueChange={async (value) => {
                      const triggers_update = [...props.triggers]
                      triggers_update[props.indexToModify].minute = value

                      props.setTriggers(triggers_update)
                      if(props.updateAsyncStorage){
                          await props.updateAsyncStorage(triggers_update)
                      }
                  }}
        />
    )
}


export default NotificationsMinutesSlider