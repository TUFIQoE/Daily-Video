import {createNavigationContainerRef, StackActions} from "@react-navigation/native"


export const navigationRef = createNavigationContainerRef()


export const navigate = (name, params) => {
    if(navigationRef.isReady()){
        navigationRef.navigate(name, params)
    }
}

export const push = (name, params) => {
    if(navigationRef.isReady()){
        navigationRef.dispatch(StackActions.push(name, params))
    }
}

export const reset = (name, params) => {
    if(navigationRef.isReady()){
        if(params){
            navigationRef.reset({
                index: 0,
                routes: [
                    {
                        name: name, // name of the route, example: Home
                        state: {
                            routes: [
                                {
                                    name: params.screen}    // name of the route in tab navigator, example: Trailer
                            ]
                        }}
                ]
            })
        }
        else{
            navigationRef.reset({
                index: 0,
                routes: [{name: name}]
            })
        }

    }
}