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
