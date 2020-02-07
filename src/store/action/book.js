/**
 * book 相关
 */
import * as book from '../../services/book'
import * as actionType from '../actionType'

export const category=({
    ...parameter
})=>(dispatch)=>{
    return book.category({
        ...parameter
    }).then(res=>{
        res = [{
            title: '全部小说',
            key:'全部小说',
            ...res
        },{
            title: '最新小说',
            key:'最新小说',
            ...res
        },{
            title: '最热小说',
            key:'最热小说',
            ...res
        }].concat(res.map(e => {
            return {
                title: e.name,
                key:e.name,
                ...e
            }
        }))
        dispatch({
            type:actionType.BOOK_TAB_LIST,
            tabList:res
        })
        
    })
}
export const bookList=({
    ...parameter
})=>(dispatch)=>{
    return book.bookList({
        ...parameter
    }).then(res=>{
        
    })
}

export const setOnRefresh=(parameter)=>(dispatch)=>{
    
    dispatch({
        type:actionType.REFRESH,
        refresh:parameter
    })
}