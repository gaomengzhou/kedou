import * as video from '../../services/video'
import * as actionType from '../actionType'
export const getHomeVideoList = ({
    rows,
}) => (dispatch) => {
    return video.getHomeVideoList({
        rows
    }).then(res => {
        const newVideoList=res.new
        const hotVideoList=res.most
        dispatch({
            type: actionType.HOME_LIST,
            newVideoList,
            hotVideoList,
        })
    })
}
export const getHomeLabelList = ({
    type,
}) => (dispatch) => {
    return video.getHomeLabelList({
        type
    }).then(res => {
        const recommend=[]
        const hotLabel=[]
        res = [{
            title: '全部影片',
            key:'全部影片',
            ...res
        },{
            title: '最新片源',
            key:'最新片源',
            ...res
        },{
            title: '重磅热播',
            key:'重磅热播',
            ...res
        }].concat(res.map(e => {
            return {
                title: e.class_name,
                key:e.class_name,
                ...e
            }
        }))
        res.forEach(e => {
            if(e.category===3){
                recommend.push(e)
            }else if(e.category===1&&e.type!==1){
                if(hotLabel.length<6){
                    hotLabel.push(e)
                }
            }
        });
        dispatch({
            type: actionType.LABEL_LIST,
            labelList: res,
            recommend,
            hotLabel
        })

    })
}
export const getLabelTabList=({
    ...parameter
})=>(dispatch)=>{
    return video.getLabelTabList({
        ...parameter
    }).then(res=>{
        //console.log(res);
        dispatch({
            type:actionType.LABEL_TAB_LIST,
            labelTabList:res
        })
    })
}
export const search_video=({
    ...parameter
})=>(dispatch)=>{
    return video.search_video({
        ...parameter
    }).then(res=>{
        dispatch({
            type:actionType.TAB_LIST,
            tabList:res
        })

    })
}
