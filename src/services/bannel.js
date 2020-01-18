import {
    initAxios
} from '../utils/request'
export const bannel_list = ({
    ...parameter
} = {}) => {
    return initAxios().post(`/v2/api/bannel_list`, {
        ...parameter
    })
}