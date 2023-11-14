import {
    SET_NOTIFICATIONS_CONFIG,
    SET_PHONE_NUMBER,
    SET_USER_AGE,
    SET_USER_FIRST_NAME,
    SET_USER_LAST_NAME,
    SET_USER_SEX
} from "./actions";

const initialState = {
    sex: "female",
    age: "",
    phone_number: "",
    user_first_name: "",
    user_last_name: "",
    notifications_config: {
        notificationsPerDay: 1,
        hours: [12]
    }
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PHONE_NUMBER:
            return {...state, phone_number: action.payload}
        case SET_USER_AGE:
            return {...state, age: action.payload}
        case SET_USER_SEX:
            return {...state, sex: action.payload}
        case SET_USER_FIRST_NAME:
            return {...state, user_first_name: action.payload}
        case SET_USER_LAST_NAME:
            return {...state, user_last_name: action.payload}
        case SET_NOTIFICATIONS_CONFIG:
            return {...state, notifications_config: action.payload}
        default:
            return state
    }
}

export default userReducer