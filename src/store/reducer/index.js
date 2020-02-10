/**
 * @description reducer 入口文件
 * @time 2020/1/8
 * @author Aiden
 */
import { combineReducers } from 'redux';
import book from './book';
import userCollect from './collect';
import searchVideoData from './search';
import video from './video';
import videoDetailReducer from './videoDetail';
import bannel from './bannel'

export default combineReducers({
    video,
    videoDetailReducer,
    book,
    searchVideoData,
    userCollect,
    bannel
});
