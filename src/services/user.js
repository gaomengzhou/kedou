/**
 * 用户注册登录找回密码 相关
 */

import {
    initAxios
} from '../utils/request'
export const register = ({
    ...parameter
} = {}) => {
    return initAxios().post(`/v2/api/h5_register`, {
        ...parameter
    })
}
export const sendCode = ({
    mobile,
    event,
    type
} = {}) => {
    return initAxios().post(`/v2/common/sendCode`, {
        mobile,
        event,
        type
    })
}
export const login = ({
    mobile,
    password,
    mold
} = {}) => {
    return initAxios().post(`/v2/user/login`, {
        mobile,
        password,
        mold
    })
}
export const auth_mobile = ({
    mobile,
    event,
    code
} = {}) => initAxios().post(`/v2/user/auth_mobile`, {
    mobile,
    event,
    code
})
export const change_pwd = ({
    mobile,
    password
} = {}) => initAxios().post(`/v2/user/change_pwd`, {
    mobile,
    password
})
export const user_info_no = ({
    user_id
} = {}) => initAxios().post(`/v2/user/user_info_no`, {
    user_id
})