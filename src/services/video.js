import { initAxios } from '../utils/request'
export const getHomeVideoList = ({
    rows
} = {}) => {
    return initAxios().post(`/v2/video/video_list`, {
        rows

    })
}

export const getHomeLabelList = ({
    type
} = {}) => {
    return initAxios().post(`/v2/video/label_list`, {
        type
    })
}
export const getLabelTabList = ({
    ...parameter
} = {}) => {
    return initAxios().post(`/v2/videointerface/search_video`, {
        ...parameter
    })
}
export const getTabList = ({
    page,
    rows,
    label
} = {}) => {
    return initAxios().post(`/v2/video/label_video`, {
        page,
        rows,
        label
    })
}
export const search_video = ({
    ...parameter
} = {}) => {
    return initAxios().post(`/v2/VideoInterface/search_video`, {
        ...parameter
    })
}
