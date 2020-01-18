import {
    initAxios
} from '../utils/request'
export const category = ({
    ...parameter
} = {}) => {
    return initAxios().post(`/v2/novel/category`, {
        ...parameter
    })
}
export const bookList = ({
    ...parameter
} = {}) => {
    return initAxios().post(`/v2/novel/index`, {
        ...parameter
    })
}
export const detail = ({
    ...parameter
} = {}) => {
    return initAxios().post(`/v2/novel/detail`, {
        ...parameter
    })
}
export const collect = ({
    ...parameter
} = {}) => {
    return initAxios().post(`/v2/novel/collect`, {
        ...parameter
    })
}
