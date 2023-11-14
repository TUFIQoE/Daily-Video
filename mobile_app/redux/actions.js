export const SET_USER_SEX = 'SET_USER_SEX'
export const SET_USER_AGE = "SET_USER_AGE"
export const SET_PHONE_NUMBER = "SET_PHONE_NUMBER"

export const SET_USER_FIRST_NAME = "SET_USER_FIRST_NAME"
export const SET_USER_LAST_NAME = "SET_USER_LAST_NAME"

export const SET_NOTIFICATIONS_CONFIG = "SET_NOTIFICATIONS_CONFIG"

export const setSex = (sex) => dispatch => {
    dispatch({
        type: SET_USER_SEX,
        payload: sex
    })
}
export const setAge = (age) => dispatch => {
    dispatch({
        type: SET_USER_AGE,
        payload: age
    })
}
export const setPhoneNumber = (phone_number) => dispatch => {
    dispatch({
        type: SET_PHONE_NUMBER,
        payload: phone_number
    })
}

export const setUserFirstName = (user_first_name) => dispatch => {
    dispatch({
        type: SET_USER_FIRST_NAME,
        payload: user_first_name
    })
}
export const setUserLastName = (user_last_name) => dispatch => {
    dispatch({
        type: SET_USER_LAST_NAME,
        payload: user_last_name
    })
}

export const setNotificationsConfig = (notifications_config) => dispatch => {
    dispatch({
        type: SET_NOTIFICATIONS_CONFIG,
        payload: notifications_config
    })
}